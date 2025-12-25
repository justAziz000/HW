// store.js
import {
  groups as initialGroups,
  students as initialStudents,
  homeworks,
  submissions,
  shopItems,
} from '../data/mockData.js';

const KEYS = {
  STUDENTS: 'mars-students',
  GROUPS: 'mars-groups',
  COIN_AWARDS: 'mars-coin-awards',
  PASSWORDS: 'mars-passwords',
  PENDING_REWARDS: 'mars-pending-rewards',
};

// Helpers
const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch (e) {
    console.error('JSON parse error', e);
    return fallback;
  }
};

// Normalize ID to string for consistent comparison
const normalizeId = (id) => String(id);

// Generate random password
export const generatePassword = (length = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Passwords management
const getPasswords = () => safeParse(localStorage.getItem(KEYS.PASSWORDS), {});

const savePasswords = (passwords) => {
  localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwords));
};

export const setUserPassword = (email, password) => {
  const passwords = getPasswords();
  passwords[email.toLowerCase()] = password;
  savePasswords(passwords);
  window.dispatchEvent(new CustomEvent('passwords-updated'));
};

export const getUserPassword = (email) => {
  const passwords = getPasswords();
  return passwords[email.toLowerCase()] || null;
};

export const deleteUserPassword = (email) => {
  const passwords = getPasswords();
  delete passwords[email.toLowerCase()];
  savePasswords(passwords);
};

export const getAllPasswords = () => getPasswords();

// Students
const getSavedStudents = () => {
  const saved = localStorage.getItem(KEYS.STUDENTS);
  const parsed = safeParse(saved, initialStudents);
  return Array.isArray(parsed) ? parsed : initialStudents;
};

export const getStudents = () => getSavedStudents();

export const saveStudents = (students) => {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  window.dispatchEvent(new CustomEvent('students-updated'));
};

export const addStudent = (student) => {
  const students = getStudents();
  const newStudent = {
    ...student,
    id: student.id || Date.now().toString(),
    coins: student.coins || 0,
    totalScore: student.totalScore || 0,
  };
  saveStudents([...students, newStudent]);
  return newStudent;
};

export const deleteStudent = (id) => {
  const students = getStudents();
  const student = students.find(s => normalizeId(s.id) === normalizeId(id));
  if (student?.email) {
    deleteUserPassword(student.email);
  }
  saveStudents(students.filter(s => normalizeId(s.id) !== normalizeId(id)));
};

export const updateStudent = (id, updates) => {
  const students = getStudents();
  saveStudents(students.map(s => (normalizeId(s.id) === normalizeId(id) ? { ...s, ...updates } : s)));
};

// Add coins to student
export const addCoinsToStudent = (id, amount) => {
  const students = getStudents();
  const student = students.find(s => normalizeId(s.id) === normalizeId(id));
  if (!student) return null;

  const newCoins = (student.coins || 0) + Number(amount);
  updateStudent(id, { coins: newCoins });
  window.dispatchEvent(new CustomEvent('coins-updated', { detail: { id: normalizeId(id), amount, newCoins } }));
  return newCoins;
};

// Set coins for student
export const setStudentCoins = (id, amount) => {
  updateStudent(id, { coins: Number(amount) });
  window.dispatchEvent(new CustomEvent('coins-updated', { detail: { id: normalizeId(id), amount } }));
};

// Change student group
export const changeStudentGroup = (id, newGroupId) => {
  updateStudent(id, { groupId: newGroupId });
  window.dispatchEvent(new CustomEvent('group-changed', { detail: { id, newGroupId } }));
};

// Change student name
export const changeStudentName = (id, newName) => {
  updateStudent(id, { name: newName });
};

// Change student email
export const changeStudentEmail = (id, newEmail, newPassword = null) => {
  const students = getStudents();
  const student = students.find(s => normalizeId(s.id) === normalizeId(id));

  if (student?.email) {
    const oldPassword = getUserPassword(student.email);
    deleteUserPassword(student.email);
    if (newPassword) {
      setUserPassword(newEmail, newPassword);
    } else if (oldPassword) {
      setUserPassword(newEmail, oldPassword);
    }
  }

  updateStudent(id, { email: newEmail.toLowerCase() });
};

// Initialize localStorage for students
if (!localStorage.getItem(KEYS.STUDENTS)) {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(initialStudents));
}

// Groups
const getSavedGroups = () => {
  const saved = localStorage.getItem(KEYS.GROUPS);
  const parsed = safeParse(saved, initialGroups);
  return Array.isArray(parsed) ? parsed : initialGroups;
};

export const getGroups = () => getSavedGroups();

export const saveGroups = (groups) => {
  localStorage.setItem(KEYS.GROUPS, JSON.stringify(groups));
  window.dispatchEvent(new CustomEvent('groups-updated'));
};

export const addGroup = (group) => {
  const groups = getGroups();
  const newGroup = {
    id: group.id || Date.now().toString(),
    name: group.name || `Guruh ${groups.length + 1}`,
    schedule: group.schedule || '',
    days: group.days || '',
  };
  saveGroups([...groups, newGroup]);
  return newGroup;
};

export const deleteGroup = (id) => {
  const groups = getGroups();
  saveGroups(groups.filter(g => g.id !== id));
  window.dispatchEvent(new CustomEvent('groups-updated'));
};

export const updateGroup = (id, updates) => {
  const groups = getGroups();
  saveGroups(groups.map(g => (g.id === id ? { ...g, ...updates } : g)));
};

// Initialize localStorage for groups
if (!localStorage.getItem(KEYS.GROUPS)) {
  localStorage.setItem(KEYS.GROUPS, JSON.stringify(initialGroups));
}

// Coins awarding
const getCoinAwards = () => safeParse(localStorage.getItem(KEYS.COIN_AWARDS), {});
const setCoinAwards = (map) => localStorage.setItem(KEYS.COIN_AWARDS, JSON.stringify(map));

export const awardCoins = (studentId, amount = 0, reason = '') => {
  const value = Number(amount);
  if (!studentId || Number.isNaN(value) || value <= 0) return null;

  const students = getStudents();
  const target = students.find(s => normalizeId(s.id) === normalizeId(studentId));
  if (!target) return null;

  const updated = students.map(s => normalizeId(s.id) === normalizeId(studentId) ? { ...s, coins: (s.coins || 0) + value } : s);
  saveStudents(updated);

  const awardsMap = getCoinAwards();
  awardsMap[normalizeId(studentId)] = (awardsMap[normalizeId(studentId)] || 0) + value;
  setCoinAwards(awardsMap);

  window.dispatchEvent(new CustomEvent('coins-awarded', { detail: { studentId: normalizeId(studentId), amount: value, reason } }));
  return { ...target, coins: (target.coins || 0) + value };
};

export const consumeAwardForStudent = (studentId) => {
  const awardsMap = getCoinAwards();
  const amount = awardsMap[normalizeId(studentId)] || 0;
  if (amount > 0) {
    delete awardsMap[normalizeId(studentId)];
    setCoinAwards(awardsMap);
  }
  return amount;
};

// Pending coin rewards for students (shown on login)
export const getPendingReward = (studentId) => {
  try {
    const rewards = JSON.parse(localStorage.getItem(KEYS.PENDING_REWARDS) || '{}');
    // Check both normalized and original ID
    return rewards[normalizeId(studentId)] || rewards[studentId] || null;
  } catch {
    return null;
  }
};

export const setPendingReward = (studentId, amount, reason = '') => {
  try {
    const rewards = JSON.parse(localStorage.getItem(KEYS.PENDING_REWARDS) || '{}');
    const normalizedId = normalizeId(studentId);
    const existing = rewards[normalizedId] || { amount: 0, reasons: [] };
    rewards[normalizedId] = {
      amount: existing.amount + Number(amount),
      reasons: [...existing.reasons, reason].filter(Boolean),
      timestamp: Date.now()
    };
    localStorage.setItem(KEYS.PENDING_REWARDS, JSON.stringify(rewards));
    window.dispatchEvent(new CustomEvent('pending-reward-updated', { detail: { studentId: normalizedId, amount } }));
  } catch (e) {
    console.error('Error setting pending reward', e);
  }
};

export const clearPendingReward = (studentId) => {
  try {
    const rewards = JSON.parse(localStorage.getItem(KEYS.PENDING_REWARDS) || '{}');
    const normalizedId = normalizeId(studentId);
    delete rewards[normalizedId];
    delete rewards[studentId]; // Also delete original just in case
    localStorage.setItem(KEYS.PENDING_REWARDS, JSON.stringify(rewards));
  } catch (e) {
    console.error('Error clearing pending reward', e);
  }
};

// Enhanced addCoinsToStudent that also sets pending reward
export const addCoinsWithNotification = (id, amount, reason = '') => {
  const result = addCoinsToStudent(id, amount);
  if (result !== null && Number(amount) > 0) {
    setPendingReward(id, amount, reason);
  }
  return result;
};

// Parent Notifications
const PARENT_NOTIFICATIONS_KEY = 'mars-parent-notifications';

export const getParentNotifications = (studentId) => {
  try {
    const all = JSON.parse(localStorage.getItem(PARENT_NOTIFICATIONS_KEY) || '{}');
    return all[normalizeId(studentId)] || [];
  } catch {
    return [];
  }
};

export const addParentNotification = (studentId, message) => {
  try {
    const all = JSON.parse(localStorage.getItem(PARENT_NOTIFICATIONS_KEY) || '{}');
    const id = normalizeId(studentId);
    const studentNotifs = all[id] || [];

    studentNotifs.unshift({
      id: Date.now().toString(),
      message,
      date: new Date().toISOString(),
      read: false
    });

    all[id] = studentNotifs;
    localStorage.setItem(PARENT_NOTIFICATIONS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('parent-notification-added', { detail: { studentId: id } }));
  } catch (e) {
    console.error('Error adding parent notification', e);
  }
};

export const markParentNotificationRead = (studentId, notificationId) => {
  try {
    const all = JSON.parse(localStorage.getItem(PARENT_NOTIFICATIONS_KEY) || '{}');
    const id = normalizeId(studentId);
    if (all[id]) {
      all[id] = all[id].map(n => n.id === notificationId ? { ...n, read: true } : n);
      localStorage.setItem(PARENT_NOTIFICATIONS_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('parent-notification-updated'));
    }
  } catch (e) {
    console.error('Error marking notification read', e);
  }
};

// Re-export mocks
export { homeworks, submissions, shopItems };
