const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

let mainWindow;
let goalsData = [];
const goalsFilePath = path.join(__dirname, 'goals.json'); // Or 'data/goals.json'
let scheduledReminders = {}; // To keep track of scheduled jobs

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: path.join(__dirname, 'assets/icon.png') // Optional
    });

    mainWindow.loadFile('index.html');
    // mainWindow.webContents.openDevTools(); // For debugging
}

function loadGoals() {
    try {
        const rawData = fs.readFileSync(goalsFilePath);
        goalsData = JSON.parse(rawData);
        // Sort by date just in case
        goalsData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
        console.error('Failed to load goals.json:', error);
        goalsData = []; // Load empty if error
    }
}

function scheduleDailyReminders() {
    console.log('Scheduling reminders for today and upcoming...');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    goalsData.forEach(goal => {
        if (goal.reminder_set) {
            const goalDate = new Date(goal.date);
            goalDate.setHours(0, 0, 0, 0); // Normalize goal date to start of day

            // Only schedule for today or future dates
            if (goalDate >= today) {
                const [hours, minutes] = goal.reminder_time.split(':').map(Number);
                const reminderDateTime = new Date(goal.date);
                reminderDateTime.setHours(hours, minutes, 0, 0);

                // If reminder time has already passed for today, don't schedule (unless you want immediate notification for past)
                if (reminderDateTime < new Date() && goalDate.getTime() === today.getTime()) {
                    console.log(`Reminder time for ${goal.title} on ${goal.date} has already passed today.`);
                    return;
                }

                // Clear existing job if any for this goal (e.g., if time was changed)
                if (scheduledReminders[goal.date]) {
                    scheduledReminders[goal.date].cancel();
                }

                console.log(`Scheduling reminder for: ${goal.title} on ${goal.date} at ${goal.reminder_time}`);
                scheduledReminders[goal.date] = schedule.scheduleJob(reminderDateTime, () => {
                    console.log(`Executing reminder for ${goal.title}`);
                    new Notification({
                        title: `Reminder: ${goal.title}`,
                        body: goal.details.substring(0, 100) + '...' // Show a snippet
                    }).show();
                });
            }
        } else {
            // If reminder was turned off, cancel any existing job
            if (scheduledReminders[goal.date]) {
                scheduledReminders[goal.date].cancel();
                delete scheduledReminders[goal.date];
                console.log(`Cancelled reminder for ${goal.title} on ${goal.date}`);
            }
        }
    });
}

function saveGoals() {
    try {
        fs.writeFileSync(goalsFilePath, JSON.stringify(goalsData, null, 2));
        console.log('Goals saved to file.');
    } catch (error) {
        console.error('Failed to save goals.json:', error);
    }
}


app.whenReady().then(() => {
    loadGoals();
    createWindow();
    scheduleDailyReminders(); // Schedule reminders on startup

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers
ipcMain.handle('get-goals', () => {
    return goalsData;
});

ipcMain.handle('get-goals-for-month', (event, year, month) => {
    // Month is 0-indexed in JS Date, but we might pass 1-12
    return goalsData.filter(goal => {
        const goalDate = new Date(goal.date);
        return goalDate.getFullYear() === year && goalDate.getMonth() === month;
    });
});

ipcMain.handle('update-goal-reminder', (event, date, reminder_set, reminder_time, title, details, type) => {
    const goalIndex = goalsData.findIndex(g => g.date === date);
    if (goalIndex !== -1) {
        goalsData[goalIndex].reminder_set = reminder_set;
        if (reminder_time) {
            goalsData[goalIndex].reminder_time = reminder_time;
        }
        if (title) {
            goalsData[goalIndex].title = title;
        }
        if (details) {
            goalsData[goalIndex].details = details;
        }
        if (type) {
            goalsData[goalIndex].type = type;
        }
        saveGoals(); // Persist changes
        scheduleDailyReminders(); // Reschedule all reminders with new settings
        return { success: true, message: `Reminder for ${date} updated.` };
    } else if (date && (title || details)) {
        // Add new custom goal if not found and title/details are not blank
        goalsData.push({
            date,
            dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
            type: type || "weekday_dsa",
            title: title || "Custom Reminder",
            details: details || "User-set reminder.",
            weekInfo: {},
            reminder_set,
            reminder_time
        });
        saveGoals();
        scheduleDailyReminders();
        return { success: true, message: `Custom reminder for ${date} added.` };
    }
    return { success: false, message: 'Goal not found.' };
});

ipcMain.handle('delete-goal-reminder', (event, date) => {
    const goalIndex = goalsData.findIndex(g => g.date === date);
    if (goalIndex !== -1) {
        goalsData.splice(goalIndex, 1);
        saveGoals();
        scheduleDailyReminders();
        return { success: true, message: `Reminder for ${date} deleted.` };
    }
    return { success: false, message: 'Goal not found.' };
});

// Reschedule all reminders daily at midnight (e.g. if app runs for long periods)
// This also helps catch any newly added future goals or date changes.
schedule.scheduleJob('0 0 * * *', () => {
    console.log('Midnight. Re-evaluating and scheduling reminders.');
    loadGoals(); // Reload in case goals.json was externally modified
    scheduleDailyReminders();
});