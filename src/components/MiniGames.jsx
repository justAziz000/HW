import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Trophy,
  Coins,
  Clock,
  Target,
  Zap,
  Star,
  Lock,
  Play,
  RotateCcw,
  ChevronRight,
  Keyboard,
  Brain,
  Calculator,
  HelpCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  GAMES_INFO,
  GAME_TYPES,
  TYPING_WORDS,
  generateMathProblem,
  QUIZ_QUESTIONS,
  MEMORY_CARDS,
  getDailyPlays,
  recordGamePlay,
  canPlayGame,
  getRemainingPlays,
  saveGameResult,
  getNextResetDate,
  formatResetDate,
} from './gameStore';
import { toast } from 'react-toastify';

// Typing Game Component
function TypingGame({ userId, onComplete, onBack }) {
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const inputRef = useRef(null);

  const getRandomWord = useCallback(() => {
    return TYPING_WORDS[Math.floor(Math.random() * TYPING_WORDS.length)];
  }, []);

  const startGame = () => {
    setGameState('playing');
    setCurrentWord(getRandomWord());
    setUserInput('');
    setScore(0);
    setTimeLeft(60);
    setWordsTyped(0);
    setCorrectWords(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('finished');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setUserInput(value);

    if (value === currentWord) {
      const newStreak = streak + 1;
      const bonusPoints = Math.min(newStreak * 2, 20);
      setScore((prev) => prev + 10 + bonusPoints);
      setCorrectWords((prev) => prev + 1);
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setWordsTyped((prev) => prev + 1);
      setUserInput('');
      setCurrentWord(getRandomWord());
    } else if (value.length > 0 && !currentWord.startsWith(value)) {
      // Wrong character typed
      setStreak(0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (userInput.trim() !== currentWord) {
        setStreak(0);
        setWordsTyped((prev) => prev + 1);
      }
      setUserInput('');
      setCurrentWord(getRandomWord());
    }
  };

  const calculateCoins = () => {
    const baseCoins = Math.floor(score / 10);
    const streakBonus = Math.floor(maxStreak / 3);
    return Math.min(baseCoins + streakBonus, 50);
  };

  const handleFinish = () => {
    const coins = calculateCoins();
    recordGamePlay(GAME_TYPES.TYPING);
    const result = saveGameResult(userId, GAME_TYPES.TYPING, score, coins);
    if (result.success) {
      toast.success(`🎉 ${coins} coin qo'shildi!`);
    }
    onComplete({ score, coins, wordsTyped, correctWords, maxStreak });
  };

  // Ready state
  if (gameState === 'ready') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
          <Keyboard className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Typing Race</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          60 soniya ichida imkon qadar ko'p so'z yozing. To'g'ri yozilgan har bir so'z uchun ball olasiz!
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">60s</p>
            <p className="text-xs text-slate-400">Vaqt</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">10+</p>
            <p className="text-xs text-slate-400">Ball/so'z</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">50</p>
            <p className="text-xs text-slate-400">Max coin</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold"
          >
            Orqaga
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30"
          >
            <Play className="w-5 h-5" />
            Boshlash
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Playing state
  if (gameState === 'playing') {
    const progress = (userInput.length / currentWord.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{score}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Streak</p>
              <p className="text-xl font-bold text-orange-400">{streak}🔥</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">To'g'ri</p>
              <p className="text-xl font-bold text-green-400">{correctWords}</p>
            </div>
          </div>
        </div>

        {/* Current word display */}
        <div className="relative mb-8">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-purple-500/20">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-400 mb-2">Yozing:</p>
              <div className="text-5xl font-mono font-bold tracking-wider">
                {currentWord.split('').map((char, i) => (
                  <span
                    key={i}
                    className={
                      i < userInput.length
                        ? userInput[i] === char
                          ? 'text-green-400'
                          : 'text-red-400'
                        : 'text-slate-500'
                    }
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full px-6 py-4 text-2xl font-mono text-center bg-slate-900/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Yozishni boshlang..."
              autoComplete="off"
              autoFocus
            />
          </div>

          {/* Streak indicator */}
          <AnimatePresence>
            {streak >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg"
              >
                🔥 {streak}x Streak!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips */}
        <div className="text-center text-sm text-slate-400">
          <p>Enter yoki Space tugmasini bosib so'zni o'tkazib yuboring</p>
        </div>
      </motion.div>
    );
  }

  // Finished state
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30"
      >
        <Trophy className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-2">O'yin tugadi!</h2>
      <p className="text-slate-400 mb-8">Juda yaxshi natija!</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30"
        >
          <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-white">{score}</p>
          <p className="text-xs text-slate-400">Ball</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-green-500/20 border border-green-500/30"
        >
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-white">{correctWords}</p>
          <p className="text-xs text-slate-400">To'g'ri</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-orange-500/20 border border-orange-500/30"
        >
          <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-white">{maxStreak}</p>
          <p className="text-xs text-slate-400">Max streak</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30"
        >
          <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-yellow-400">+{calculateCoins()}</p>
          <p className="text-xs text-slate-400">Coin</p>
        </motion.div>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold flex items-center gap-2"
        >
          O'yinlar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            handleFinish();
            startGame();
          }}
          disabled={!canPlayGame(GAME_TYPES.TYPING)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-5 h-5" />
          Yana o'ynash
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinish}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-green-500/30"
        >
          <Coins className="w-5 h-5" />
          Coinlarni olish
        </motion.button>
      </div>
    </motion.div>
  );
}

// Math Game Component
function MathGame({ userId, onComplete, onBack }) {
  const [gameState, setGameState] = useState('ready');
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const inputRef = useRef(null);

  const startGame = () => {
    setGameState('playing');
    setProblem(generateMathProblem());
    setUserAnswer('');
    setScore(0);
    setTimeLeft(60);
    setCorrect(0);
    setWrong(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('finished');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const answer = parseInt(userAnswer, 10);

    if (answer === problem.answer) {
      setScore((prev) => prev + 15);
      setCorrect((prev) => prev + 1);
    } else {
      setWrong((prev) => prev + 1);
    }

    setProblem(generateMathProblem());
    setUserAnswer('');
    inputRef.current?.focus();
  };

  const calculateCoins = () => {
    return Math.min(Math.floor((score / 10) + (correct * 2)), 40);
  };

  const handleFinish = () => {
    const coins = calculateCoins();
    recordGamePlay(GAME_TYPES.MATH);
    const result = saveGameResult(userId, GAME_TYPES.MATH, score, coins);
    if (result.success) {
      toast.success(`🎉 ${coins} coin qo'shildi!`);
    }
    onComplete({ score, coins, correct, wrong });
  };

  if (gameState === 'ready') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <Calculator className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Math Challenge</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          60 soniya ichida imkon qadar ko'p matematik masalalarni yeching!
        </p>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold"
          >
            Orqaga
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Play className="w-5 h-5" />
            Boshlash
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameState === 'playing') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{score}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-green-400 font-bold">{correct} ✓</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 font-bold">{wrong} ✗</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-blue-500/20 mb-6">
            <p className="text-6xl font-bold text-center text-white mb-6">
              {problem?.question} = ?
            </p>
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-6 py-4 text-3xl font-bold text-center bg-slate-900/50 border-2 border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-500"
              placeholder="Javob"
              autoComplete="off"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xl"
          >
            Tekshirish
          </motion.button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
        <Trophy className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-8">Natijalar</h2>

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
        <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30">
          <p className="text-3xl font-bold text-white">{score}</p>
          <p className="text-xs text-slate-400">Ball</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30">
          <p className="text-3xl font-bold text-green-400">{correct}</p>
          <p className="text-xs text-slate-400">To'g'ri</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
          <p className="text-3xl font-bold text-yellow-400">+{calculateCoins()}</p>
          <p className="text-xs text-slate-400">Coin</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold"
        >
          O'yinlar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinish}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold flex items-center gap-2"
        >
          <Coins className="w-5 h-5" />
          Coinlarni olish
        </motion.button>
      </div>
    </motion.div>
  );
}

// Memory Card Game Component
function MemoryGame({ userId, onComplete, onBack }) {
  const [gameState, setGameState] = useState('ready');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const startGame = () => {
    // Create pairs of cards
    const cardPairs = [...MEMORY_CARDS, ...MEMORY_CARDS];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5).map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(60);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('finished');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setMoves(moves + 1);

      if (cards[first].emoji === cards[second].emoji) {
        // Match found!
        setMatchedCards([...matchedCards, first, second]);
        setScore(score + 20);
        setFlippedCards([]);

        // Check if all matched
        if (matchedCards.length + 2 === cards.length) {
          setTimeout(() => setGameState('finished'), 500);
        }
      } else {
        // No match
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  }, [flippedCards]);

  const handleCardClick = (index) => {
    if (
      flippedCards.length >= 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }
    setFlippedCards([...flippedCards, index]);
  };

  const calculateCoins = () => {
    const baseCoins = Math.floor(score / 10);
    const timeBonus = Math.floor(timeLeft / 10);
    const movesPenalty = Math.max(0, Math.floor((moves - 20) / 2));
    return Math.min(Math.max(baseCoins + timeBonus - movesPenalty, 5), 35);
  };

  const handleFinish = () => {
    const coins = calculateCoins();
    recordGamePlay(GAME_TYPES.MEMORY);
    saveGameResult(userId, GAME_TYPES.MEMORY, score, coins);
    onComplete({ score, coins, moves, timeLeft });
  };

  if (gameState === 'ready') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Memory Cards</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Bir xil kartalarni toping va xotirangizni sinab ko'ring!
        </p>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold"
          >
            Orqaga
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-green-500/30"
          >
            <Play className="w-5 h-5" />
            Boshlash
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameState === 'playing') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        {/* Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{score}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Harakatlar</p>
            <p className="text-xl font-bold text-white">{moves}</p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            const isMatched = matchedCards.includes(index);

            return (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(index)}
                whileHover={{ scale: isMatched ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl text-4xl flex items-center justify-center font-bold transition-all ${isMatched
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
                  : isFlipped
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                  }`}
              >
                {isFlipped ? card.emoji : '?'}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Finished
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
        <Trophy className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-8">Natijalar</h2>

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
        <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30">
          <p className="text-3xl font-bold text-white">{score}</p>
          <p className="text-xs text-slate-400">Ball</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
          <p className="text-3xl font-bold text-blue-400">{moves}</p>
          <p className="text-xs text-slate-400">Harakatlar</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
          <p className="text-3xl font-bold text-yellow-400">+{calculateCoins()}</p>
          <p className="text-xs text-slate-400">Coin</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold"
        >
          O'yinlar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinish}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold flex items-center gap-2"
        >
          <Coins className="w-5 h-5" />
          Coinlarni olish
        </motion.button>
      </div>
    </motion.div>
  );
}

// Quiz Game Component
function QuizGame({ userId, onComplete, onBack }) {
  const [gameState, setGameState] = useState('ready');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setCorrect(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (index) => {
    if (showResult) return;

    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === QUIZ_QUESTIONS[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 15);
      setCorrect(correct + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  const calculateCoins = () => {
    return Math.min(Math.floor((score / 10) + (correct * 3)), 45);
  };

  const handleFinish = () => {
    const coins = calculateCoins();
    recordGamePlay(GAME_TYPES.QUIZ);
    const result = saveGameResult(userId, GAME_TYPES.QUIZ, score, coins);
    if (result.success) {
      toast.success(`🎉 ${coins} coin qo'shildi!`);
    }
    onComplete({ score, coins, correct, total: QUIZ_QUESTIONS.length });
  };

  if (gameState === 'ready') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <HelpCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">IT Quiz</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Dasturlash bo'yicha bilimingizni sinab ko'ring!
        </p>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold"
          >
            Orqaga
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/30"
          >
            <Play className="w-5 h-5" />
            Boshlash
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameState === 'playing') {
    const question = QUIZ_QUESTIONS[currentQuestion];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
              <p className="text-sm text-orange-300">
                Savol {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{score}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">To'g'ri</p>
            <p className="text-xl font-bold text-green-400">{correct}</p>
          </div>
        </div>

        {/* Question */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-orange-500/20 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  whileHover={{ scale: showResult ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${showCorrect
                    ? 'bg-green-500/30 border-2 border-green-500'
                    : showWrong
                      ? 'bg-red-500/30 border-2 border-red-500'
                      : 'bg-slate-700 border-2 border-slate-600 hover:border-orange-500'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="w-6 h-6 text-green-400" />}
                    {showWrong && <XCircle className="w-6 h-6 text-red-400" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // Finished
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
        <Trophy className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-8">Natijalar</h2>

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
        <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30">
          <p className="text-3xl font-bold text-white">{score}</p>
          <p className="text-xs text-slate-400">Ball</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30">
          <p className="text-3xl font-bold text-green-400">
            {correct}/{QUIZ_QUESTIONS.length}
          </p>
          <p className="text-xs text-slate-400">To'g'ri</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
          <p className="text-3xl font-bold text-yellow-400">+{calculateCoins()}</p>
          <p className="text-xs text-slate-400">Coin</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold"
        >
          O'yinlar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinish}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold flex items-center gap-2"
        >
          <Coins className="w-5 h-5" />
          Coinlarni olish
        </motion.button>
      </div>
    </motion.div>
  );
}

// Main Mini Games Component
export function MiniGames({ userId }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showResult, setShowResult] = useState(null);

  const handleGameComplete = (result) => {
    setShowResult(result);
  };

  const handleBack = () => {
    setSelectedGame(null);
    setShowResult(null);
  };

  // Game Selection Screen
  if (!selectedGame) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Mini O'yinlar</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Ball yig'ish va o'ynash</h1>
          <p className="text-slate-400">Har bir o'yinni kuniga 5 marta o'ynash mumkin</p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(GAMES_INFO).map((game, index) => {
            const remaining = getRemainingPlays(game.id);
            const canPlay = remaining > 0;

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: canPlay ? 1.02 : 1, y: canPlay ? -5 : 0 }}
                className={`relative overflow-hidden rounded-2xl border transition-all ${canPlay
                  ? 'border-purple-500/30 cursor-pointer'
                  : 'border-slate-700/50 opacity-60'
                  }`}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(20, 20, 35, 0.9) 100%)',
                }}
                onClick={() => canPlay && setSelectedGame(game.id)}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10`} />

                {/* Lock overlay */}
                {!canPlay && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">Ertaga qaytadan!</p>
                    </div>
                  </div>
                )}

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg`}>
                      {game.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400 mb-1">
                        <Coins className="w-4 h-4" />
                        <span className="font-bold">{game.maxCoins}</span>
                      </div>
                      <p className="text-xs text-slate-400">{game.difficulty}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{game.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full mx-0.5 ${i < remaining
                              ? `bg-gradient-to-r ${game.color}`
                              : 'bg-slate-700'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-400">{remaining}/5 qoldi</span>
                    </div>

                    {canPlay && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-1 text-purple-400"
                      >
                        <span className="text-sm font-medium">O'ynash</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Qanday ishlaydi?</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>• Har bir o'yinni kuniga 5 marta o'ynash mumkin</li>
                <li>• Yutgan coinlar avtomatik hisobingizga qo'shiladi</li>
                <li>• Coinlar bilan Shop dan sovg'alar sotib olasiz</li>
                <li>• Reyting jadvalida yuqoriga ko'tariling!</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render selected game
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedGame}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        {selectedGame === GAME_TYPES.TYPING && (
          <TypingGame userId={userId} onComplete={handleGameComplete} onBack={handleBack} />
        )}
        {selectedGame === GAME_TYPES.MATH && (
          <MathGame userId={userId} onComplete={handleGameComplete} onBack={handleBack} />
        )}
        {/* Add more games here */}
        {selectedGame === GAME_TYPES.MEMORY && (
          <MemoryGame userId={userId} onComplete={handleGameComplete} onBack={handleBack} />
        )}
        {selectedGame === GAME_TYPES.QUIZ && (
          <QuizGame userId={userId} onComplete={handleGameComplete} onBack={handleBack} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
