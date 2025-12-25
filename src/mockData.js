// src/data/mockData.js
// ОДИН ЕДИНСТВЕННЫЙ РАБОЧИЙ ФАЙЛ — БОЛЬШЕ НИЧЕГО НЕ ТРОГАЙ!

const store = {
  submissions: [
    { id: 1, studentId: 's1', homeworkId: 1, link: 'https://github.com/aziz/hw1', status: 'checked', score: 95, comment: 'Juda yaxshi!' },
    { id: 2, studentId: 's1', homeworkId: 2, link: 'https://github.com/aziz/hw2', status: 'checked', score: 88 },
    { id: 3, studentId: 's1', homeworkId: 3, link: 'https://github.com/aziz/hw3', status: 'submitted', score: 0 },
    { id: 4, studentId: 's2', homeworkId: 1, link: 'https://github.com/madina/hw1', status: 'checked', score: 100, comment: 'Ajoyib!' },
  ],
  listeners: []
};

// Подписка — обновляет всех (учитель и ученик)
export const subscribe = (callback) => {
  store.listeners.push(callback);
  return () => {
    store.listeners = store.listeners.filter(l => l !== callback);
  };
};

const notify = () => store.listeners.forEach(cb => cb());

// Получить ДЗ
export const getSubmissions = () => store.submissions;

// Добавить новое ДЗ (ученик)
export const addSubmission = (submission) => {
  const newSub = {
    id: Date.now(),
    studentId: submission.studentId,
    homeworkId: submission.homeworkId,
    link: submission.link,
    status: 'submitted',
    score: 0,
    comment: '',
    submittedAt: new Date().toISOString(),
  };
  store.submissions.push(newSub);
  notify();
  return newSub;
};

// Обновить оценку (учитель ставит баллы) — УЧЕНИК СРАЗУ ВИДИТ!
export const updateSubmission = (submissionId, updates) => {
  const submission = store.submissions.find(s => s.id === submissionId);
  if (submission) {
    Object.assign(submission, updates);
    notify(); // Ученик видит мгновенно!
  }
};

// Группы, ученики, уроки
export const groups = [
  { id: 'g1', name: 'Frontend Masters 34 (Dush-Ch)', schedule: 'Dushanba / Chorshanba, 19:00', days: 'Haftasiga 2 marta' },
  { id: 'g2', name: 'React Pro 2025', schedule: 'Sesh-Pay-Shan, 18:30', days: '3 kun/hafta' },
  { id: 'g3', name: 'Fullstack Intensive', schedule: 'Dush-Chor-Juma, 20:00', days: '3 kun/hafta' },
  { id: 'g4', name: 'JavaScript Advanced', schedule: 'Sesh-Pay-Shan, 19:30', days: '3 kun/hafta' },
  { id: 'g5', name: 'Node.js & Backend', schedule: 'Dush-Chor-Juma, 18:00', days: '3 kun/hafta' },
  { id: 'g6', name: 'UI/UX + React', schedule: 'Sesh-Pay-Shan, 20:00', days: '3 kun/hafta' },
  { id: 'g7', name: 'TypeScript Elite', schedule: 'Dush-Chor-Juma, 19:30', days: '3 kun/hafta' },
  { id: 'g8', name: 'Next.js Masters', schedule: 'Sesh-Pay-Shan, 18:00', days: '3 kun/hafta' },
];

export const students = [
  // Твои 52 ученика — вставь полностью из прошлого сообщения
  { id: 's1', groupId: 'g1', name: 'Azizbek Xolmatov', email: 'azizbek@example.com', totalScore: 845 },
  { id: 's2', groupId: 'g1', name: 'Madina Karimova', email: 'madina@example.com', totalScore: 920 },
  // ... все 52
  { id: 's52', groupId: 'g8', name: 'Nargiza Yusupova', email: 'nargiza@example.com', totalScore: 940 },
];

export const homeworks = [
  { lessonNumber: 1, title: 'HTML asoslari' },
  { lessonNumber: 2, title: 'CSS Flexbox va Grid' },
  { lessonNumber: 3, title: 'JavaScript kirish' },
  { lessonNumber: 4, title: 'React komponentlar' },
  { lessonNumber: 5, title: 'useState va useEffect' },
  { lessonNumber: 6, title: 'API bilan ishlash' },
];