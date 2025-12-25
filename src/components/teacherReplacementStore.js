// src/components/teacherReplacementStore.js
// Manages teacher replacement notifications for students

const TEACHER_REPLACEMENT_KEY = 'mars-teacher-replacements';

// Record teacher replacement and notify all students in group
export const recordTeacherReplacement = (groupId, originalTeacher, replacementTeacher, date, reason = '') => {
    try {
        const replacements = getTeacherReplacements();
        const { getStudents } = require('./store');
        const { addNotification } = require('./store1');

        const replacement = {
            id: Date.now().toString(),
            groupId,
            originalTeacher,
            replacementTeacher,
            date: new Date(date).toISOString(),
            reason,
            createdAt: new Date().toISOString(),
            notifiedStudents: []
        };

        // Get all students in the group
        const students = getStudents();
        const groupStudents = students.filter(s => s.groupId === groupId);

        // Send notification to each student
        groupStudents.forEach(student => {
            addNotification(
                student.id,
                `📢 O'qituvchi o'zgarishi: ${replacementTeacher} ${originalTeacher} o'rniga ${new Date(date).toLocaleDateString('uz-UZ')} kuni dars o'tadi${reason ? `. Sabab: ${reason}` : ''}`,
                'teacher_replacement'
            );

            replacement.notifiedStudents.push({
                studentId: student.id,
                studentName: student.name,
                notifiedAt: new Date().toISOString()
            });
        });

        replacements.unshift(replacement);

        // Keep only last 100 replacements
        if (replacements.length > 100) {
            replacements.splice(100);
        }

        localStorage.setItem(TEACHER_REPLACEMENT_KEY, JSON.stringify(replacements));
        window.dispatchEvent(new CustomEvent('teacher-replacement-updated'));

        return {
            ...replacement,
            studentsNotified: groupStudents.length
        };
    } catch (e) {
        console.error('Error recording teacher replacement:', e);
        return null;
    }
};

// Get all teacher replacements
export const getTeacherReplacements = () => {
    try {
        const saved = localStorage.getItem(TEACHER_REPLACEMENT_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error reading teacher replacements:', e);
        return [];
    }
};

// Get replacements for specific group
export const getGroupReplacements = (groupId) => {
    const replacements = getTeacherReplacements();
    return replacements.filter(r => r.groupId === groupId);
};

// Get upcoming replacements
export const getUpcomingReplacements = (groupId = null) => {
    const replacements = getTeacherReplacements();
    const now = new Date();

    let upcoming = replacements.filter(r => new Date(r.date) >= now);

    if (groupId) {
        upcoming = upcoming.filter(r => r.groupId === groupId);
    }

    return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Get past replacements
export const getPastReplacements = (groupId = null, limit = 10) => {
    const replacements = getTeacherReplacements();
    const now = new Date();

    let past = replacements.filter(r => new Date(r.date) < now);

    if (groupId) {
        past = past.filter(r => r.groupId === groupId);
    }

    return past
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
};

// Delete replacement record
export const deleteTeacherReplacement = (replacementId) => {
    try {
        const replacements = getTeacherReplacements();
        const filtered = replacements.filter(r => r.id !== replacementId);

        localStorage.setItem(TEACHER_REPLACEMENT_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent('teacher-replacement-updated'));

        return true;
    } catch (e) {
        console.error('Error deleting teacher replacement:', e);
        return false;
    }
};

// Get replacement statistics
export const getReplacementStats = (groupId = null) => {
    const replacements = getTeacherReplacements();
    let filtered = replacements;

    if (groupId) {
        filtered = replacements.filter(r => r.groupId === groupId);
    }

    const now = new Date();
    const thisMonth = filtered.filter(r => {
        const date = new Date(r.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const totalStudentsNotified = filtered.reduce(
        (sum, r) => sum + (r.notifiedStudents?.length || 0),
        0
    );

    return {
        totalReplacements: filtered.length,
        thisMonth: thisMonth.length,
        totalStudentsNotified,
        averageStudentsPerReplacement: filtered.length > 0
            ? Math.round(totalStudentsNotified / filtered.length)
            : 0
    };
};
