// src/components/homeworkDeadlineStore.js
// Manages homework deadlines and prevents late submissions

const HOMEWORK_DEADLINES_KEY = 'mars-homework-deadlines';
const CHECKED_SUBMISSIONS_KEY = 'mars-checked-submissions';

// Set deadline for homework
export const setHomeworkDeadline = (homeworkId, groupId, deadline) => {
    try {
        const deadlines = getHomeworkDeadlines();

        const deadlineRecord = {
            homeworkId,
            groupId,
            deadline: new Date(deadline).toISOString(),
            createdAt: new Date().toISOString(),
            createdBy: 'teacher' // Can be extended to track which teacher
        };

        const existingIndex = deadlines.findIndex(
            d => d.homeworkId === homeworkId && d.groupId === groupId
        );

        if (existingIndex >= 0) {
            deadlines[existingIndex] = deadlineRecord;
        } else {
            deadlines.push(deadlineRecord);
        }

        localStorage.setItem(HOMEWORK_DEADLINES_KEY, JSON.stringify(deadlines));
        window.dispatchEvent(new CustomEvent('homework-deadlines-updated'));

        return deadlineRecord;
    } catch (e) {
        console.error('Error setting homework deadline:', e);
        return null;
    }
};

// Get all homework deadlines
export const getHomeworkDeadlines = () => {
    try {
        const saved = localStorage.getItem(HOMEWORK_DEADLINES_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error reading homework deadlines:', e);
        return [];
    }
};

// Get deadline for specific homework and group
export const getHomeworkDeadline = (homeworkId, groupId) => {
    const deadlines = getHomeworkDeadlines();
    return deadlines.find(d => d.homeworkId === homeworkId && d.groupId === groupId);
};

// Check if homework is past deadline
export const isHomeworkPastDeadline = (homeworkId, groupId) => {
    const deadline = getHomeworkDeadline(homeworkId, groupId);

    if (!deadline) {
        return false; // No deadline set = always open
    }

    const deadlineDate = new Date(deadline.deadline);
    const now = new Date();

    return now > deadlineDate;
};

// Get remaining time for homework
export const getHomeworkRemainingTime = (homeworkId, groupId) => {
    const deadline = getHomeworkDeadline(homeworkId, groupId);

    if (!deadline) {
        return {
            hasDeadline: false,
            message: 'Muddat belgilanmagan'
        };
    }

    const deadlineDate = new Date(deadline.deadline);
    const now = new Date();
    const diffMs = deadlineDate - now;

    if (diffMs < 0) {
        return {
            hasDeadline: true,
            isPastDeadline: true,
            message: 'Muddat o\'tgan',
            canSubmit: false
        };
    }

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let message;
    let urgency = 'normal';

    if (diffMins < 60) {
        message = `${diffMins} daqiqa qoldi`;
        urgency = 'critical';
    } else if (diffHours < 24) {
        message = `${diffHours} soat qoldi`;
        urgency = 'urgent';
    } else if (diffDays === 1) {
        message = '1 kun qoldi';
        urgency = 'soon';
    } else {
        message = `${diffDays} kun qoldi`;
        urgency = 'normal';
    }

    return {
        hasDeadline: true,
        isPastDeadline: false,
        canSubmit: true,
        remainingMs: diffMs,
        message,
        urgency,
        deadline: deadline.deadline,
        deadlineFormatted: deadlineDate.toLocaleDateString('uz-UZ')
    };
};

// Checked Submissions Management
export const moveToCheckedSubmissions = (submission) => {
    try {
        const checked = getCheckedSubmissions();

        const checkedSubmission = {
            ...submission,
            checkedAt: new Date().toISOString(),
            canRecheck: true // Allow re-checking
        };

        checked.unshift(checkedSubmission);
        localStorage.setItem(CHECKED_SUBMISSIONS_KEY, JSON.stringify(checked));
        window.dispatchEvent(new CustomEvent('checked-submissions-updated'));

        return checkedSubmission;
    } catch (e) {
        console.error('Error moving to checked submissions:', e);
        return null;
    }
};

// Get all checked submissions
export const getCheckedSubmissions = () => {
    try {
        const saved = localStorage.getItem(CHECKED_SUBMISSIONS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error reading checked submissions:', e);
        return [];
    }
};

// Get checked submissions for student
export const getStudentCheckedSubmissions = (studentId) => {
    const checked = getCheckedSubmissions();
    return checked.filter(s => s.studentId === studentId);
};

// Get checked submissions for teacher/group
export const getGroupCheckedSubmissions = (groupId) => {
    const checked = getCheckedSubmissions();
    return checked.filter(s => s.groupId === groupId);
};

// Re-check submission (move back to pending)
export const recheckSubmission = (submissionId) => {
    try {
        const checked = getCheckedSubmissions();
        const submission = checked.find(s => s.id === submissionId);

        if (!submission) {
            return null;
        }

        // Remove from checked
        const remaining = checked.filter(s => s.id !== submissionId);
        localStorage.setItem(CHECKED_SUBMISSIONS_KEY, JSON.stringify(remaining));

        // Return submission data to be re-added to pending
        return {
            ...submission,
            status: 'checking',
            recheckedAt: new Date().toISOString()
        };
    } catch (e) {
        console.error('Error rechecking submission:', e);
        return null;
    }
};

// Clear old checked submissions (older than 6 months)
export const clearOldCheckedSubmissions = () => {
    const checked = getCheckedSubmissions();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recent = checked.filter(s => new Date(s.checkedAt) > sixMonthsAgo);
    localStorage.setItem(CHECKED_SUBMISSIONS_KEY, JSON.stringify(recent));

    return checked.length - recent.length;
};

// Get deadline status for multiple homeworks
export const getBulkDeadlineStatus = (homeworks, groupId) => {
    return homeworks.map(hw => ({
        ...hw,
        deadlineInfo: getHomeworkRemainingTime(hw.id, groupId)
    }));
};

// Notify students about upcoming deadlines
export const checkUpcomingDeadlines = (groupId) => {
    const deadlines = getHomeworkDeadlines();
    const groupDeadlines = deadlines.filter(d => d.groupId === groupId);
    const upcomingDeadlines = [];

    groupDeadlines.forEach(deadline => {
        const timeInfo = getHomeworkRemainingTime(deadline.homeworkId, groupId);

        if (timeInfo.urgency === 'urgent' || timeInfo.urgency === 'critical') {
            upcomingDeadlines.push({
                ...deadline,
                ...timeInfo
            });
        }
    });

    return upcomingDeadlines;
};
