// src/components/rankingStore.js
// Enhanced ranking system for students based on coins and points

import { getStudents } from './store';

// Calculate student rank based on coins and total score
export const calculateStudentRank = (studentId) => {
    const students = getStudents();

    // Sort students by: 1) totalScore (descending), 2) coins (descending), 3) id (ascending for tie-breaking)
    const sortedStudents = [...students].sort((a, b) => {
        // First compare by totalScore
        if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
        }
        // If totalScore is equal, compare by coins
        if (b.coins !== a.coins) {
            return b.coins - a.coins;
        }
        // If both are equal, use id for consistent ordering
        return a.id.localeCompare(b.id);
    });

    const rank = sortedStudents.findIndex(s => s.id === studentId) + 1;
    return {
        rank,
        totalStudents: students.length,
        percentile: Math.round((1 - (rank - 1) / students.length) * 100)
    };
};

// Get leaderboard with rankings
export const getLeaderboard = (groupId = null) => {
    let students = getStudents();

    // Filter by group if specified
    if (groupId) {
        students = students.filter(s => s.groupId === groupId);
    }

    // Sort by totalScore (primary) and coins (secondary)
    const sortedStudents = [...students].sort((a, b) => {
        if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
        }
        if (b.coins !== a.coins) {
            return b.coins - a.coins;
        }
        return a.id.localeCompare(b.id);
    });

    // Add rank to each student
    return sortedStudents.map((student, index) => ({
        ...student,
        rank: index + 1,
        percentile: Math.round((1 - index / sortedStudents.length) * 100)
    }));
};

// Get top N students
export const getTopStudents = (n = 10, groupId = null) => {
    const leaderboard = getLeaderboard(groupId);
    return leaderboard.slice(0, n);
};

// Get student's position and nearby competitors
export const getStudentRankingContext = (studentId, context = 2) => {
    const leaderboard = getLeaderboard();
    const studentIndex = leaderboard.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return { student: null, above: [], below: [] };
    }

    const start = Math.max(0, studentIndex - context);
    const end = Math.min(leaderboard.length, studentIndex + context + 1);

    return {
        student: leaderboard[studentIndex],
        above: leaderboard.slice(start, studentIndex),
        below: leaderboard.slice(studentIndex + 1, end),
        totalStudents: leaderboard.length
    };
};

// Calculate level based on total score
export const calculateLevel = (totalScore) => {
    const levels = [
        { min: 0, max: 499, level: 1, title: 'Boshlang\'ich' },
        { min: 500, max: 999, level: 2, title: 'O\'rganuvchi' },
        { min: 1000, max: 1499, level: 3, title: 'Izlanuvchi' },
        { min: 1500, max: 1999, level: 4, title: 'Tajovuzkor' },
        { min: 2000, max: 2499, level: 5, title: 'Usta' },
        { min: 2500, max: 2999, level: 6, title: 'Professional' },
        { min: 3000, max: 3499, level: 7, title: 'Mutaxassis' },
        { min: 3500, max: 3999, level: 8, title: 'Ekspert' },
        { min: 4000, max: 4999, level: 9, title: 'Ustoz' },
        { min: 5000, max: Infinity, level: 10, title: 'Legenda' }
    ];

    const currentLevel = levels.find(l => totalScore >= l.min && totalScore <= l.max);
    const nextLevel = levels.find(l => l.min > totalScore);

    return {
        level: currentLevel?.level || 1,
        title: currentLevel?.title || 'Boshlang\'ich',
        currentScore: totalScore,
        nextLevelScore: nextLevel?.min || currentLevel?.max,
        progress: nextLevel
            ? ((totalScore - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
            : 100
    };
};

// Get rank change history (to track improvements)
const RANK_HISTORY_KEY = 'mars-rank-history';

export const saveRankSnapshot = (studentId) => {
    try {
        const history = JSON.parse(localStorage.getItem(RANK_HISTORY_KEY) || '{}');
        const rankInfo = calculateStudentRank(studentId);
        const student = getStudents().find(s => s.id === studentId);

        if (!history[studentId]) {
            history[studentId] = [];
        }

        history[studentId].push({
            date: new Date().toISOString(),
            rank: rankInfo.rank,
            coins: student?.coins || 0,
            totalScore: student?.totalScore || 0
        });

        // Keep only last 30 snapshots
        if (history[studentId].length > 30) {
            history[studentId] = history[studentId].slice(-30);
        }

        localStorage.setItem(RANK_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('Error saving rank snapshot:', e);
    }
};

export const getRankHistory = (studentId) => {
    try {
        const history = JSON.parse(localStorage.getItem(RANK_HISTORY_KEY) || '{}');
        return history[studentId] || [];
    } catch (e) {
        console.error('Error reading rank history:', e);
        return [];
    }
};

// Get rank trend (improving, declining, stable)
export const getRankTrend = (studentId) => {
    const history = getRankHistory(studentId);

    if (history.length < 2) {
        return 'stable';
    }

    const recent = history.slice(-5); // Last 5 snapshots
    const avgRecent = recent.reduce((sum, h) => sum + h.rank, 0) / recent.length;
    const older = history.slice(-10, -5);

    if (older.length === 0) {
        return 'stable';
    }

    const avgOlder = older.reduce((sum, h) => sum + h.rank, 0) / older.length;

    if (avgRecent < avgOlder - 1) {
        return 'improving'; // Rank number decreasing = improving position
    } else if (avgRecent > avgOlder + 1) {
        return 'declining';
    }

    return 'stable';
};
