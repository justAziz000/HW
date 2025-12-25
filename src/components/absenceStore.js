// src/components/absenceStore.js
// Manages student absence reports and notifications

const ABSENCE_KEY = 'mars-absence-reports';
const TEACHER_NOTIFICATIONS_KEY = 'mars-teacher-notifications';

// Get all absence reports
export const getAbsenceReports = () => {
    try {
        const saved = localStorage.getItem(ABSENCE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error reading absence reports:', e);
        return [];
    }
};

// Save absence reports
const saveAbsenceReports = (reports) => {
    localStorage.setItem(ABSENCE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new CustomEvent('absence-reports-updated'));
};

// Submit absence report from student
export const submitAbsenceReport = (studentId, studentName, groupId, reason, date) => {
    const reports = getAbsenceReports();

    const newReport = {
        id: Date.now().toString(),
        studentId,
        studentName,
        groupId,
        reason,
        date,
        submittedAt: new Date().toISOString(),
        status: 'pending', // pending, approved, rejected
        teacherResponse: ''
    };

    saveAbsenceReports([newReport, ...reports]);

    // Add notification for teacher
    addTeacherNotification({
        type: 'absence_report',
        studentId,
        studentName,
        groupId,
        message: `${studentName} darsga kela olmasligi haqida xabar yubordi`,
        reportId: newReport.id,
        read: false
    });

    return newReport;
};

// Update absence report status
export const updateAbsenceStatus = (reportId, status, teacherResponse = '') => {
    const reports = getAbsenceReports();
    const updated = reports.map(r =>
        r.id === reportId
            ? { ...r, status, teacherResponse, respondedAt: new Date().toISOString() }
            : r
    );
    saveAbsenceReports(updated);

    // Notify student about response
    const report = reports.find(r => r.id === reportId);
    if (report) {
        // This will be handled by store1.js notification system
        const { addNotification } = require('./store1');
        addNotification(
            report.studentId,
            status === 'approved'
                ? '✅ Darsga kela olmasligingiz tasdiqlandi'
                : '❌ Darsga kela olmaslik xabaringiz rad etildi',
            'absence_response'
        );
    }
};

// Get absence reports for specific student
export const getStudentAbsenceReports = (studentId) => {
    const reports = getAbsenceReports();
    return reports.filter(r => r.studentId === studentId);
};

// Get absence reports for specific group
export const getGroupAbsenceReports = (groupId) => {
    const reports = getAbsenceReports();
    return reports.filter(r => r.groupId === groupId);
};

// Teacher Notifications System
export const getTeacherNotifications = () => {
    try {
        const saved = localStorage.getItem(TEACHER_NOTIFICATIONS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error reading teacher notifications:', e);
        return [];
    }
};

const saveTeacherNotifications = (notifications) => {
    localStorage.setItem(TEACHER_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent('teacher-notifications-updated'));
};

export const addTeacherNotification = (notification) => {
    const notifications = getTeacherNotifications();
    const newNotification = {
        id: Date.now().toString(),
        ...notification,
        createdAt: new Date().toISOString(),
        read: false
    };
    saveTeacherNotifications([newNotification, ...notifications]);
};

export const markTeacherNotificationRead = (notificationId) => {
    const notifications = getTeacherNotifications();
    const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
    );
    saveTeacherNotifications(updated);
};

export const clearAllTeacherNotifications = () => {
    saveTeacherNotifications([]);
};

// Get unread count for teacher
export const getUnreadTeacherNotificationsCount = () => {
    const notifications = getTeacherNotifications();
    return notifications.filter(n => !n.read).length;
};
