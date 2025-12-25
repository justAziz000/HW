// src/components/gameStore.js
// Mini o'yinlar va ball tizimi uchun global store (KUNLIK LIMIT TIZIMI)

import { addCoinsWithNotification } from './store1';

const STORAGE_KEYS = {
  GAME_DATA: 'mars-game-data',
  DAILY_PLAYS: 'mars-daily-plays',
};

// Kunlik o'yin limiti (har bir o'yin uchun 1 marta)
const DAILY_LIMIT = 1;

// O'yin turlari
export const GAME_TYPES = {
  TYPING: 'typing',
  MATH: 'math',
  MEMORY: 'memory',
  QUIZ: 'quiz',
};

// O'yin ma'lumotlari
export const GAMES_INFO = {
  [GAME_TYPES.TYPING]: {
    id: GAME_TYPES.TYPING,
    name: 'Typing Race',
    description: 'Tez yozish o\'yini - 60 soniyada qancha so\'z yozasiz?',
    icon: '⌨️',
    maxCoins: 50,
    difficulty: 'O\'rta',
    color: 'from-purple-500 to-pink-500',
  },
  [GAME_TYPES.MATH]: {
    id: GAME_TYPES.MATH,
    name: 'Math Challenge',
    description: 'Matematik masalalarni tez yeching',
    icon: '🧮',
    maxCoins: 40,
    difficulty: 'O\'rta',
    color: 'from-blue-500 to-cyan-500',
  },
  [GAME_TYPES.MEMORY]: {
    id: GAME_TYPES.MEMORY,
    name: 'Memory Cards',
    description: 'Xotira kartalarini toping',
    icon: '🧠',
    maxCoins: 35,
    difficulty: 'Oson',
    color: 'from-green-500 to-emerald-500',
  },
  [GAME_TYPES.QUIZ]: {
    id: GAME_TYPES.QUIZ,
    name: 'IT Quiz',
    description: 'Dasturlash bo\'yicha savollar',
    icon: '💡',
    maxCoins: 45,
    difficulty: 'Qiyin',
    color: 'from-orange-500 to-amber-500',
  },
};

// Typing o'yini uchun so'zlar
export const TYPING_WORDS = [
  'javascript', 'react', 'component', 'function', 'variable',
  'array', 'object', 'string', 'number', 'boolean',
  'import', 'export', 'default', 'const', 'let',
  'async', 'await', 'promise', 'callback', 'event',
  'state', 'props', 'hook', 'effect', 'context',
  'router', 'redux', 'store', 'action', 'reducer',
  'style', 'class', 'element', 'node', 'render',
  'fetch', 'axios', 'api', 'json', 'data',
  'error', 'catch', 'try', 'throw', 'finally',
  'map', 'filter', 'reduce', 'find', 'some',
  'push', 'pop', 'shift', 'slice', 'splice',
  'length', 'index', 'key', 'value', 'type',
  'interface', 'typescript', 'module', 'package', 'npm',
  'webpack', 'babel', 'eslint', 'prettier', 'vite',
  'tailwind', 'bootstrap', 'material', 'antdesign', 'chakra',
];

// Math o'yini uchun masalalar generatori
export const generateMathProblem = () => {
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let a, b, answer;

  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 50) + 30;
      b = Math.floor(Math.random() * 30) + 1;
      answer = a - b;
      break;
    case '*':
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      answer = a * b;
      break;
    default:
      a = 10;
      b = 5;
      answer = 15;
  }

  return { question: `${a} ${operation} ${b}`, answer, a, b, operation };
};

// Quiz savollari
export const QUIZ_QUESTIONS = [
  {
    question: 'JavaScript qaysi yilda yaratilgan?',
    options: ['1990', '1995', '2000', '2005'],
    correct: 1,
  },
  {
    question: 'React kim tomonidan yaratilgan?',
    options: ['Google', 'Facebook', 'Microsoft', 'Apple'],
    correct: 1,
  },
  {
    question: 'HTML nimaning qisqartmasi?',
    options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Modern Language'],
    correct: 0,
  },
  {
    question: 'CSS flexbox da justify-content qaysi o\'qda ishlaydi?',
    options: ['Vertikal', 'Gorizontal (asosiy)', 'Ikkalasida', 'Hech qaysi'],
    correct: 1,
  },
  {
    question: 'useState hook nima qaytaradi?',
    options: ['Faqat qiymat', 'Faqat funksiya', 'Massiv [qiymat, funksiya]', 'Object'],
    correct: 2,
  },
  {
    question: 'Git da yangi branch yaratish uchun qaysi buyruq ishlatiladi?',
    options: ['git new branch', 'git branch', 'git create', 'git add branch'],
    correct: 1,
  },
  {
    question: 'NPM nimaning qisqartmasi?',
    options: ['Node Package Manager', 'New Programming Module', 'Node Program Manager', 'Network Package Module'],
    correct: 0,
  },
  {
    question: 'TypeScript qaysi kompaniya tomonidan yaratilgan?',
    options: ['Google', 'Facebook', 'Microsoft', 'Amazon'],
    correct: 2,
  },
  {
    question: 'React da componentlar orasida ma\'lumot uzatish uchun nima ishlatiladi?',
    options: ['Variables', 'Props', 'Functions', 'Classes'],
    correct: 1,
  },
  {
    question: 'API nimaning qisqartmasi?',
    options: ['Application Programming Interface', 'Advanced Program Integration', 'Application Process Interface', 'Automated Programming Interface'],
    correct: 0,
  },
];

// Memory kartalar
export const MEMORY_CARDS = ['🎮', '💻', '🎨', '🚀', '⚡', '🔥', '💎', '🌟'];

// Get today's date string (YYYY-MM-DD)
const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Kunlik o'yinlar sonini olish
export const getDailyPlays = (gameType) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_PLAYS);
    if (!data) return 0;

    const parsed = JSON.parse(data);
    const today = getTodayString();
    const gameData = parsed[gameType];

    if (!gameData || gameData.date !== today) {
      return 0;
    }

    return gameData.plays || 0;
  } catch {
    return 0;
  }
};

// O'yin o'ynaganini yozish
export const recordGamePlay = (gameType) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_PLAYS);
    let allData = data ? JSON.parse(data) : {};
    const today = getTodayString();

    // Agar yangi kun bo'lsa, reset qil
    if (!allData[gameType] || allData[gameType].date !== today) {
      allData[gameType] = { date: today, plays: 0 };
    }

    allData[gameType].plays += 1;
    localStorage.setItem(STORAGE_KEYS.DAILY_PLAYS, JSON.stringify(allData));

    return allData[gameType].plays;
  } catch {
    return 1;
  }
};

// O'yinni o'ynash mumkinmi?
export const canPlayGame = (gameType) => {
  const plays = getDailyPlays(gameType);
  return plays < DAILY_LIMIT;
};

// Qolgan o'yinlar soni
export const getRemainingPlays = (gameType) => {
  const plays = getDailyPlays(gameType);
  return Math.max(0, DAILY_LIMIT - plays);
};

// Keyingi reset sanasini olish (ertangi kun)
export const getNextResetDate = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

// Reset sanasini formatlash
export const formatResetDate = (date) => {
  if (!date) return '';

  const now = new Date();
  const diffTime = date - now;
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffHours < 0) return 'Hozir';
  if (diffHours < 1) return 'Tez orada';
  if (diffHours < 24) return `${diffHours} soat ichida`;

  return 'Ertaga';
};

// Monthly plays for backward compatibility
export const getMonthlyPlays = (gameType) => {
  return { plays: Array(getDailyPlays(gameType)).fill({}), resetDate: getNextResetDate() };
};

// O'yin natijasini saqlash va coinlarni qo'shish
export const saveGameResult = async (userId, gameType, score, coins) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
    let gameData = data ? JSON.parse(data) : { results: [], totalCoins: {} };

    gameData.results.push({
      id: Date.now(),
      userId, // corrected from oderId
      gameType,
      score,
      coins,
      playedAt: new Date().toISOString(),
    });

    // Foydalanuvchi uchun umumiy coinlar
    gameData.totalCoins[userId] = (gameData.totalCoins[userId] || 0) + coins;

    localStorage.setItem(STORAGE_KEYS.GAME_DATA, JSON.stringify(gameData));

    // Student coins ni yangilash VA persistence (MockAPI)
    if (coins > 0) {
      // 1. Local notification
      addCoinsWithNotification(userId, coins, `${GAMES_INFO[gameType]?.name || gameType} o'yinidan`);

      // 2. Push to MockAPI for persistence across sessions/devices
      const SUBMISSIONS_API = "https://69393fa6c8d59937aa0706bf.mockapi.io/submissions";
      try {
        await fetch(SUBMISSIONS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: userId,
            studentName: 'Student', // Ideally we'd have the name here
            homeworkId: `game-${gameType}-${Date.now()}`,
            homeworkTitle: GAMES_INFO[gameType]?.name || gameType,
            link: 'Mini Game Result',
            submittedAt: new Date().toISOString(),
            status: 'game_win',
            score: score,
            coins: coins
          }),
        });
      } catch (apiErr) {
        console.error('Failed to sync game result to API:', apiErr);
      }
    }

    return { success: true, totalCoins: gameData.totalCoins[userId] };
  } catch (error) {
    console.error('Error saving game result:', error);
    return { success: false };
  }
};

// Top o'yinchilar (leaderboard)
export const getGameLeaderboard = (gameType, limit = 10) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
    if (!data) return [];

    const gameData = JSON.parse(data);
    const results = gameData.results
      .filter(r => r.gameType === gameType)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  } catch {
    return [];
  }
};

// Foydalanuvchining o'yin tarixi
export const getUserGameHistory = (userId, limit = 20) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
    if (!data) return [];

    const gameData = JSON.parse(data);
    return gameData.results
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
      .slice(0, limit);
  } catch {
    return [];
  }
};

// Umumiy statistika
export const getGameStats = (userId) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
    if (!data) return { totalGames: 0, totalCoins: 0, bestScore: {} };

    const gameData = JSON.parse(data);
    const userResults = gameData.results.filter(r => r.userId === userId);

    const bestScore = {};
    Object.values(GAME_TYPES).forEach(type => {
      const typeResults = userResults.filter(r => r.gameType === type);
      if (typeResults.length > 0) {
        bestScore[type] = Math.max(...typeResults.map(r => r.score));
      }
    });

    return {
      totalGames: userResults.length,
      totalCoins: gameData.totalCoins[userId] || 0,
      bestScore,
    };
  } catch {
    return { totalGames: 0, totalCoins: 0, bestScore: {} };
  }
};
