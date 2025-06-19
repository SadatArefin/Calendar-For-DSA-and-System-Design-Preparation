const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getGoals: () => ipcRenderer.invoke('get-goals'),
    getGoalsForMonth: (year, month) => ipcRenderer.invoke('get-goals-for-month', year, month),
    updateGoalReminder: (date, reminder_set, reminder_time, title, details, type) => ipcRenderer.invoke('update-goal-reminder', date, reminder_set, reminder_time, title, details, type),
    deleteGoalReminder: (date) => ipcRenderer.invoke('delete-goal-reminder', date),
    googleAuth: () => ipcRenderer.invoke('google-auth'),
    onReminderTriggered: (callback) => ipcRenderer.on('reminder-triggered', (_, data) => callback(data))
});