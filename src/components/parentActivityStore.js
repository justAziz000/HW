// src/components/parentActivityStore.js
// Tracks parent activity and last login times

const PARENT_ACTIVITY_KEY = 'mars-parent-activity';
const PARENT_STUDENT_MAPPING_KEY = 'mars-parent-student-mapping';

// Track parent login activity
export const recordParentLogin = (parentEmail, studentId) => {
    try {
        const activity = getParentActivity();

        const existingIndex = activity.findIndex(a => a.parentEmail === parentEmail);

        const activityRecord = {
            parentEmail,
            studentId,
            lastLogin: new Date().toISOString(),
            lastLoginDate: new Date().toLocaleDateString('uz-UZ'),
            lastLoginTime: new Date().toLocaleTimeString('uz-UZ'),
            loginCount: existingIndex >= 0 ? activity[existingIndex].loginCount + 1 : 1,
            isActive: true
        };

        if (existingIndex >= 0) {
            activity[existingIndex] = activityRecord;
        } else {
            activity.push(activityRecord);
        }

        localStorage.setItem(PARENT_ACTIVITY_KEY, JSON.stringify(activity));
        window.dispatchEvent(new CustomEvent('parent-activity-updated'));

        return activityRecord;
    } catch (e) {
        console.error('Error recording parent login:', e);
        return null;
    }
};

// Get all parent activity records
export const getParentActivity = () => {
    try {
        const saved = localStorage.getItem(PARENT_ACTIVITY_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error reading parent activity:', e);
        return [];
    }
};

// Get parent activity for a specific student
export const getParentActivityForStudent = (studentId) => {
    const activity = getParentActivity();
    return activity.filter(a => a.studentId === studentId);
};

// Check if parent is active (logged in within last 30 days)
export const isParentActive = (parentEmail) => {
    const activity = getParentActivity();
    const parentRecord = activity.find(a => a.parentEmail === parentEmail);

    if (!parentRecord) return false;

    const lastLogin = new Date(parentRecord.lastLogin);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return lastLogin > thirtyDaysAgo;
};

// Get parent activity statistics
export const getParentActivityStats = () => {
    const activity = getParentActivity();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeLastWeek = activity.filter(a => new Date(a.lastLogin) > sevenDaysAgo).length;
    const activeLastMonth = activity.filter(a => new Date(a.lastLogin) > thirtyDaysAgo).length;

    return {
        totalParents: activity.length,
        activeLastWeek,
        activeLastMonth,
        inactiveParents: activity.length - activeLastMonth
    };
};

// Get formatted last login info
export const getLastLoginInfo = (parentEmail) => {
    const activity = getParentActivity();
    const parentRecord = activity.find(a => a.parentEmail === parentEmail);

    if (!parentRecord) {
        return {
            exists: false,
            message: 'Hech qachon kirmagan',
            isActive: false
        };
    }

    const lastLogin = new Date(parentRecord.lastLogin);
    const now = new Date();
    const diffMs = now - lastLogin;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let message;
    if (diffMins < 1) {
        message = 'Hozirgina';
    } else if (diffMins < 60) {
        message = `${diffMins} daqiqa oldin`;
    } else if (diffHours < 24) {
        message = `${diffHours} soat oldin`;
    } else if (diffDays === 1) {
        message = 'Kecha';
    } else if (diffDays < 7) {
        message = `${diffDays} kun oldin`;
    } else {
        message = `${parentRecord.lastLoginDate} da`;
    }

    return {
        exists: true,
        lastLogin: parentRecord.lastLogin,
        message,
        fullDate: `${parentRecord.lastLoginDate} ${parentRecord.lastLoginTime}`,
        isActive: isParentActive(parentEmail),
        loginCount: parentRecord.loginCount
    };
};

// Map parent to student (for multi-child support)
export const mapParentToStudent = (parentEmail, studentId) => {
    try {
        const mappings = JSON.parse(localStorage.getItem(PARENT_STUDENT_MAPPING_KEY) || '{}');

        if (!mappings[parentEmail]) {
            mappings[parentEmail] = [];
        }

        if (!mappings[parentEmail].includes(studentId)) {
            mappings[parentEmail].push(studentId);
        }

        localStorage.setItem(PARENT_STUDENT_MAPPING_KEY, JSON.stringify(mappings));
        return true;
    } catch (e) {
        console.error('Error mapping parent to student:', e);
        return false;
    }
};

// Get all students for a parent
export const getStudentsForParent = (parentEmail) => {
    try {
        const mappings = JSON.parse(localStorage.getItem(PARENT_STUDENT_MAPPING_KEY) || '{}');
        return mappings[parentEmail] || [];
    } catch (e) {
        console.error('Error getting students for parent:', e);
        return [];
    }
};

// Get all parent records with student info
export const getAllParentRecords = () => {
    const activity = getParentActivity();
    const { getStudents } = require('./store');
    const students = getStudents();

    return activity.map(record => {
        const student = students.find(s => s.id === record.studentId);
        const loginInfo = getLastLoginInfo(record.parentEmail);

        return {
            ...record,
            studentName: student?.name || 'Noma\'lum',
            groupId: student?.groupId,
            ...loginInfo
        };
    });
};

// Clear inactive parent records (older than 1 year)
export const clearInactiveParents = () => {
    const activity = getParentActivity();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const activeParents = activity.filter(a => new Date(a.lastLogin) > oneYearAgo);
    localStorage.setItem(PARENT_ACTIVITY_KEY, JSON.stringify(activeParents));

    return activity.length - activeParents.length; // Return count of cleared records
};
