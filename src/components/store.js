// src/data/store.js

import {
  groups,
  students as initialStudents,
  homeworks,
  submissions,
  shopItems,
} from '../data/mockData.js';

const KEYS = {
  STUDENTS: 'mars-students',
};

// Всегда читаем актуальные данные из localStorage
const getSavedStudents = () => {
  try {
    const saved = localStorage.getItem(KEYS.STUDENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialStudents;
    }
  } catch (e) {
    console.error('Ошибка чтения студентов из localStorage', e);
  }
  return initialStudents;
};

// Основные функции — теперь они ВСЕГДА работают с localStorage
export const getStudents = () => {
  return getSavedStudents();
};

export const saveStudents = (students) => {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  // Важно: CustomEvent или с bubbles — иначе не сработает в React 18 StrictMode
  window.dispatchEvent(new CustomEvent('students-updated'));
};

export const addStudent = (student) => {
  const students = getStudents();
  const newStudent = { ...student, id: Date.now().toString() };
  saveStudents([...students, newStudent]);
};

export const deleteStudent = (id) => {
  const students = getStudents();
  saveStudents(students.filter(s => s.id !== id));
};

export const updateStudent = (id, updates) => {
  const students = getStudents();
  saveStudents(
    students.map(s => (s.id === id ? { ...s, ...updates } : s))
  );
};

// Первый запуск: если в localStorage ничего нет — сохраняем initialStudents
if (!localStorage.getItem(KEYS.STUDENTS)) {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(initialStudents));
  console.log('Initial students загружены в localStorage');
}

// Переэкспорт моков — удобно
export { groups, homeworks, submissions, shopItems };

const ANNO_KEY = 'mars-announcements';

export const getAnnouncements = () => {
  try {
    const saved = localStorage.getItem(ANNO_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const saveAnnouncements = (announcements) => {
  localStorage.setItem(ANNO_KEY, JSON.stringify(announcements));
  window.dispatchEvent(new CustomEvent('announcements-updated'));
};

export const addAnnouncement = (text) => {
  const list = getAnnouncements();
  const newAnno = { id: Date.now(), text, date: new Date().toISOString() };
  saveAnnouncements([newAnno, ...list]);
};

export const deleteAnnouncement = (id) => {
  const list = getAnnouncements();
  saveAnnouncements(list.filter(a => a.id !== id));
};