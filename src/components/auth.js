// src/components/auth.js   ← УБЕДИСЬ, ЧТО ФАЙЛ НАЗЫВАЕТСЯ .js, а не .ts!

const PASSWORDS_KEY = 'mars-user-passwords';
const SESSION_KEY = 'mars-user-session';
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

// Parollarni localStorage ga saqlash
export const savePassword = (email, password) => {
  try {
    const passwords = getPasswords();
    passwords[email] = password;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  } catch (error) {
    console.error('Error saving password:', error);
  }
};

// Parolni localStorage dan olish
export const getPassword = (email) => {
  try {
    const passwords = getPasswords();
    return passwords[email] || null;
  } catch (error) {
    console.error('Error getting password:', error);
    return null;
  }
};

// Barcha parollarni olish
const getPasswords = () => {
  try {
    const data = localStorage.getItem(PASSWORDS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading passwords:', error);
    return {};
  }
};

// Session time management
export const updateSessionTime = () => {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
};

export const getSessionTime = () => {
  const time = localStorage.getItem(SESSION_KEY);
  return time ? parseInt(time) : null;
};

export const isSessionValid = () => {
  const lastActivity = getSessionTime();
  if (!lastActivity) return false;
  const now = Date.now();
  return (now - lastActivity) < SESSION_TIMEOUT;
};

export const loginUser = (user) => {
  localStorage.setItem('app_user', JSON.stringify(user));
  updateSessionTime();
};

export const getUser = () => {
  try {
    const data = localStorage.getItem('app_user');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading user:', error);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('app_user');
  localStorage.removeItem(SESSION_KEY);
  window.location.reload();
};

export const forceLogout = (reason = 'Session expired') => {
  localStorage.removeItem('app_user');
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.setItem('logout_reason', reason);
  window.location.reload();
};