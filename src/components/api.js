// src/lib/api.js

const BASE_URL = 'https://6939863fc8d59937aa082cb5.mockapi.io';

export const fetchGroups = () => 
  fetch(`${BASE_URL}/groups`).then(r => r.json());

export const fetchStudents = () => 
  fetch(`${BASE_URL}/students`).then(r => r.json());

export const addStudent = async (student) => {
  const res = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  const data = await res.json();

  // Важно! Сообщаем всем компонентам, что данные изменились
  window.dispatchEvent(new Event('students-updated'));
  window.dispatchEvent(new Event('data-updated')); // на всякий случай универсальное

  return data;
};

export const deleteStudent = async (id) => {
  await fetch(`${BASE_URL}/students/${id}`, { method: 'DELETE' });
  window.dispatchEvent(new Event('students-updated'));
};

export const updateStudent = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  window.dispatchEvent(new Event('students-updated'));
  return res.json();
};