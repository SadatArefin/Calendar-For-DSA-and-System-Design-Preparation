document.addEventListener('DOMContentLoaded', async () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYearEl = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    // Modal elements
    const modal = document.getElementById('dayDetailModal');
    const closeModalBtn = document.querySelector('.close-button');
    const modalDateEl = document.getElementById('modalDate');
    const modalTitleInput = document.getElementById('modalTitleInput');
    const modalDetailsInput = document.getElementById('modalDetailsInput');
    const modalWeekInfoEl = document.getElementById('modalWeekInfo');
    const reminderToggle = document.getElementById('reminderToggle');
    const reminderTimeInput = document.getElementById('reminderTime');
    const saveReminderBtn = document.getElementById('saveReminder');
    const goalTypeInput = document.getElementById('goalTypeInput');
    const syncWithGoogleBtn = document.getElementById('syncWithGoogle');

    let currentDate = new Date(2025, 5, 1); // Start in June 2025
    let allGoals = [];
    let currentGoalForModal = null; // To store the goal currently in modal

    async function loadAndRenderCalendar() {
        if (allGoals.length === 0) { // Load all goals once
            allGoals = await window.electronAPI.getGoals();
        }
        currentMonthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    }

    function renderCalendar(year, month) {
        calendarGrid.innerHTML = ''; // Clear previous grid

        // Add headers for days of the week
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-header');
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'other-month');
            calendarGrid.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            const dayNumber = document.createElement('div');
            dayNumber.classList.add('day-number');
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);

            const cellDate = new Date(year, month, day);
            const cellDateString = cellDate.toISOString().split('T')[0];

            const goalForDay = allGoals.find(g => g.date === cellDateString);

            if (goalForDay) {
                const goalTitlePreview = document.createElement('div');
                goalTitlePreview.classList.add('goal-title-preview', goalForDay.type);
                goalTitlePreview.textContent = goalForDay.title;
                dayCell.appendChild(goalTitlePreview);

                if (goalForDay.reminder_set) {
                    const reminderIndicator = document.createElement('span');
                    reminderIndicator.classList.add('reminder-indicator');
                    reminderIndicator.textContent = '⏰'; // Or some icon/text
                    dayCell.appendChild(reminderIndicator);
                }

                dayCell.addEventListener('click', () => openModal(goalForDay));
            } else {
                dayCell.addEventListener('click', () => {
                    // Optionally open modal for empty days too, or do nothing
                    // For now, let's allow opening modal to set reminders even if no pre-defined goal
                    currentGoalForModal = {
                        date: cellDateString,
                        title: "No pre-defined goal",
                        details: "You can set a custom reminder for this day.",
                        weekInfo: {},
                        reminder_set: false,
                        reminder_time: "09:00"
                    };
                    openModal(currentGoalForModal, true); // true for 'isCustom'
                });
            }
            // Highlight today
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.style.backgroundColor = '#d1ecf1'; // Light blue for today
                dayNumber.style.fontWeight = 'bold';
            }


            calendarGrid.appendChild(dayCell);
        }
    }

    function openModal(goal, isCustom = false) {
        currentGoalForModal = goal;
        modalDateEl.textContent = `Date: ${new Date(goal.date).toLocaleDateString('en-CA')} (${goal.dayOfWeek || new Date(goal.date).toLocaleDateString('en-US', { weekday: 'long' })})`;
        goalTypeInput.value = goal.type || 'weekday_dsa';
        modalTitleInput.value = goal.title || '';
        modalDetailsInput.value = goal.details || (isCustom ? "No specific plan details. Add custom notes if needed." : "No details provided.");
        if (goal.weekInfo && goal.weekInfo.theme) {
            modalWeekInfoEl.textContent = `Week ${goal.weekInfo.number}: ${goal.weekInfo.theme} (${goal.weekInfo.dateRange})`;
            modalWeekInfoEl.style.display = 'block';
        } else {
            modalWeekInfoEl.style.display = 'none';
        }
        reminderToggle.checked = goal.reminder_set || false;
        reminderTimeInput.value = goal.reminder_time || "09:00";

        // Show or hide delete button based on reminder set
        const deleteReminderBtn = document.getElementById('deleteReminder');
        if (deleteReminderBtn) {
            // Always show the delete button for any loaded goal (not for blank new modal)
            if (goal && goal.date && allGoals.find(g => g.date === goal.date)) {
                deleteReminderBtn.style.display = 'inline-block';
            } else {
                deleteReminderBtn.style.display = 'none';
            }
        }

        modal.style.display = 'block';
    }

    closeModalBtn.onclick = () => {
        modal.style.display = 'none';
        currentGoalForModal = null;
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            currentGoalForModal = null;
        }
    };

    saveReminderBtn.onclick = async () => {
        if (!currentGoalForModal) return;
        const reminderSet = reminderToggle.checked;
        const reminderTime = reminderTimeInput.value;
        const newTitle = modalTitleInput.value.trim();
        const newDetails = modalDetailsInput.value.trim();
        const newType = goalTypeInput.value;
        // Only save if title or details are not blank/whitespace
        if (!newTitle && !newDetails) {
            alert('Title or details must not be blank.');
            return;
        }
        // Update local allGoals array
        const goalInArray = allGoals.find(g => g.date === currentGoalForModal.date);
        if (goalInArray) {
            goalInArray.reminder_set = reminderSet;
            goalInArray.reminder_time = reminderTime;
            goalInArray.title = newTitle;
            goalInArray.details = newDetails;
            goalInArray.type = newType;
        } else {
            allGoals.push({
                date: currentGoalForModal.date,
                dayOfWeek: new Date(currentGoalForModal.date).toLocaleDateString('en-US', { weekday: 'long' }),
                type: newType,
                title: newTitle,
                details: newDetails,
                weekInfo: {},
                reminder_set: reminderSet,
                reminder_time: reminderTime
            });
        }
        const result = await window.electronAPI.updateGoalReminder(currentGoalForModal.date, reminderSet, reminderTime, newTitle, newDetails, newType);
        console.log(result.message);
        if (result.success) {
            modal.style.display = 'none';
            loadAndRenderCalendar(); // Re-render to show indicator
        } else {
            alert('Failed to save reminder settings.');
        }
    };

    // Delete reminder button
    const deleteReminderBtn = document.getElementById('deleteReminder');
    deleteReminderBtn.onclick = async () => {
        if (!currentGoalForModal) return;
        if (!confirm('Are you sure you want to delete this reminder?')) return;
        const result = await window.electronAPI.deleteGoalReminder(currentGoalForModal.date);
        if (result.success) {
            modal.style.display = 'none';
            allGoals = allGoals.filter(g => g.date !== currentGoalForModal.date);
            loadAndRenderCalendar();
        } else {
            alert('Failed to delete reminder.');
        }
    };

    prevMonthBtn.addEventListener('click', () => {
        if (
            currentDate.getFullYear() > 2025 ||
            (currentDate.getFullYear() === 2025 && currentDate.getMonth() > 0)
        ) {
            currentDate.setMonth(currentDate.getMonth() - 1);
            loadAndRenderCalendar();
        }
    });

    nextMonthBtn.addEventListener('click', () => {
        if (
            currentDate.getFullYear() < 2030 ||
            (currentDate.getFullYear() === 2030 && currentDate.getMonth() < 11)
        ) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            loadAndRenderCalendar();
        }
    });

    syncWithGoogleBtn.addEventListener('click', async () => {
        await window.electronAPI.googleAuth();
    });

    // Initial load
    loadAndRenderCalendar();
});