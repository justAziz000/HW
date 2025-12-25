// Хранилище домашних заданий (как мини-бэкенд)

let submissions = [
  // пример начальных данных
  {
    id: 1,
    student: "Ali",
    text: "My homework text",
    score: null,
    status: "pending",
    comment: null,
  }
];

// Подписчики — TeacherDashboard и др.
let listeners = [];

// 🔔 Уведомляет учителя о новых изменениях
function notify() {
  listeners.forEach((listener) => listener());
}

// 📌 Добавить новое ДЗ (Студент отправляет)
export function addSubmission(submission) {
  submissions.push({
    id: Date.now(),
    ...submission,
    score: null,
    status: "pending",
    comment: null
  });

  notify();
}

// 📌 Обновить ДЗ (Учитель ставит оценку)
export function updateSubmission(id, update) {
  submissions = submissions.map((s) =>
    s.id === id ? { ...s, ...update } : s
  );

  notify();
}

// 📌 Подписать компонент на обновления
export function subscribe(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

// 📌 ВОТ ЭТОГО У ТЕБЯ НЕ ХВАТАЛО
export { submissions };
