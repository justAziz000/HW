import { useState, useEffect } from 'react';
import { Send, AlertCircle, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentHomeworks } from './StudentHomeworks';
import { StudentRating } from './StudentRating';
import { StudentShop } from './StudentShop';
import { MiniGames } from './MiniGames';
import { ITSidebar } from './ITSidebar';
import { StudentProfile } from './StudentProfile';
import { StudentLessons } from './StudentLessons';
import { addSubmission, subscribe } from '../mockData';
import { toast } from 'react-toastify';
import { CoinRewardNotification } from './CoinRewardNotification';
import { getStudents, saveStudents } from './store1';
import { fetchStudents } from './api';

export function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('lessons');
  const [link, setLink] = useState('');
  const [topicName, setTopicName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('student-theme') || 'dark';
  });
  const [showCoinReward, setShowCoinReward] = useState(true);

  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = subscribe(() => forceUpdate({}));
    return unsubscribe;
  }, []);

  // REAL-TIME SYNC ENGINE (Polling every 3 seconds)
  useEffect(() => {
    let interval;
    const syncWithApi = async () => {
      try {
        // 1. Fetch Students (Profile data / Groups)
        const remoteStudents = await fetchStudents();
        const { setPendingReward } = await import('./store1');

        // 2. Fetch Submissions (Source of truth for coins)
        const SUBMISSIONS_API = "https://69393fa6c8d59937aa0706bf.mockapi.io/submissions";
        const submissionsRes = await fetch(SUBMISSIONS_API);
        const allSubmissions = await submissionsRes.json();

        if (remoteStudents && Array.isArray(remoteStudents)) {
          const localStudents = getStudents();

          const updatedStudents = localStudents.map(local => {
            const remote = remoteStudents.find(r => String(r.id) === String(local.id));

            // Calculate coins from all transaction types
            const studentSubmissions = allSubmissions.filter(s => String(s.studentId) === String(local.id));
            const calculatedCoins = studentSubmissions
              .filter(s => ['checked', 'game_win', 'purchase'].includes(s.status))
              .reduce((sum, s) => sum + (Number(s.coins) || 0), 0);

            if (remote) {
              // Notification Sync
              if (remote.pendingReward && remote.pendingReward.amount > 0) {
                const reasons = remote.pendingReward.reasons || [remote.pendingReward.reason].filter(Boolean);
                const reason = reasons.join(', ');
                setPendingReward(local.id, remote.pendingReward.amount, reason);
                import('./api').then(({ updateStudent }) => {
                  updateStudent(local.id, { ...remote, pendingReward: null }).catch(console.error);
                });
              }

              // Use calculated sum from submissions as the definitive coin balance
              return { ...local, ...remote, coins: Math.max(0, calculatedCoins) };
            }
            return local;
          });

          saveStudents(updatedStudents);
        }
      } catch (err) {
        console.error('Failed to sync data:', err);
      }
    };

    syncWithApi();
    interval = setInterval(syncWithApi, 3000); // 3-second heartbeat

    return () => clearInterval(interval);
  }, []);

  // React to store updates
  useEffect(() => {
    const updateLocalUser = () => {
      const students = getStudents();
      const updatedUser = students.find(s => String(s.id) === String(user.id));
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    };

    updateLocalUser();
    window.addEventListener('students-updated', updateLocalUser);
    return () => window.removeEventListener('students-updated', updateLocalUser);
  }, [user.id]);

  useEffect(() => {
    localStorage.setItem('student-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const homeworks = [
    { id: 1, title: 'React useState va useEffect' },
    { id: 2, title: 'API bilan ishlash (fetch)' },
    { id: 3, title: 'Router va Context API' },
    { id: 4, title: 'Formik va Form Validation' },
  ];

  const handleSubmitHomework = async () => {
    if (!topicName.trim()) {
      toast.warning('Iltimos, mavzu nomini yozing');
      return;
    }
    const validUrlRegex = /^(https?:\/\/)?(www\.)?(github\.com|vercel\.app|netlify\.app)\/.*$/i;
    if (!validUrlRegex.test(link.trim())) {
      toast.error('Faqat GitHub, Vercel yoki Netlify havolalarini qabul qilamiz!');
      return;
    }

    setIsSubmitting(true);

    const matchingHomework = homeworks.find(
      h => h.title.toLowerCase() === topicName.trim().toLowerCase()
    );
    const derivedId = matchingHomework ? matchingHomework.id : `custom-${Date.now()}`;

    const newSubmission = {
      studentId: currentUser.id,
      studentName: currentUser.name,
      homeworkId: derivedId,
      homeworkTitle: topicName.trim(),
      link: link.trim(),
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      score: null,
      comment: null,
      coins: 0,
    };

    try {
      const SUBMISSIONS_API = "https://69393fa6c8d59937aa0706bf.mockapi.io/submissions";
      const response = await fetch(SUBMISSIONS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission),
      });

      if (response.ok) {
        setLink('');
        setTopicName('');
        setShowSuccess(true);
        toast.success('Vazifa muvaffaqiyatli yuborildi!');
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      toast.error("Vazifani yuborishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('app_user', JSON.stringify(updatedUser));
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const themeClasses = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white'
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';

  const cardClasses = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50'
    : 'bg-white/90 border-gray-200 shadow-lg';

  const inputClasses = theme === 'dark'
    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400';

  return (
    <div className={`min-h-screen ${themeClasses} relative transition-colors duration-300`}>
      {showCoinReward && (
        <CoinRewardNotification
          userId={currentUser.id}
          onClose={() => setShowCoinReward(false)}
        />
      )}

      <ITSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout || (() => window.location.reload())}
        user={currentUser}
        theme={theme}
      />

      <div className="md:ml-80 min-h-screen">
        <div className="fixed top-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-4 rounded-2xl shadow-lg transition-all ${theme === 'dark' ? 'bg-slate-800 text-yellow-400 border border-slate-700' : 'bg-white text-gray-700 border border-gray-200 shadow-xl'}`}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {activeTab === 'homeworks' && (
          <div className="p-6 pt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`max-w-4xl mx-auto rounded-3xl shadow-2xl p-8 mb-8 border ${cardClasses}`}>
              <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Yangi uy vazifasini yuborish</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="Mavzu nomini yozing (masalan: Flexbox)"
                  className={`px-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${inputClasses}`}
                />
                <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://github.com/..." className={`px-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${inputClasses}`} />
              </div>
              <motion.button onClick={handleSubmitHomework} disabled={isSubmitting || !link || !topicName.trim()} className="px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg disabled:opacity-50">
                {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                <Send className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        )}

        <main className={`p-6 ${activeTab !== 'homeworks' ? 'pt-20' : ''}`}>
          <AnimatePresence mode="wait">
            {activeTab === 'lessons' && <motion.div key="lessons" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><StudentLessons user={currentUser} theme={theme} /></motion.div>}
            {activeTab === 'profile' && <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><StudentProfile user={currentUser} onUpdateUser={handleUpdateUser} theme={theme} /></motion.div>}
            {activeTab === 'homeworks' && <motion.div key="hw" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><StudentHomeworks userId={currentUser.id} studentName={currentUser.name} theme={theme} /></motion.div>}
            {activeTab === 'rating' && <motion.div key="rating" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><StudentRating userId={currentUser.id} groupId={currentUser.groupId} theme={theme} /></motion.div>}
            {activeTab === 'shop' && <motion.div key="shop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><StudentShop user={currentUser} theme={theme} /></motion.div>}
            {activeTab === 'games' && <motion.div key="games" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><MiniGames userId={currentUser.id} theme={theme} /></motion.div>}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
