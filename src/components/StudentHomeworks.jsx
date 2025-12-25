import { useState, useEffect } from 'react';
import {
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Send,
  Coins,
  Trophy,
  Star,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { homeworks } from '../data/mockData';
import { isValidHomeworkLink, getValidationError } from '../utils/linkValidation';

const API_URL = 'https://69393fa6c8d59937aa0706bf.mockapi.io/submissions';

export function StudentHomeworks({ userId = 1, studentName = "Ali Valiev" }) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  // load with polling
  useEffect(() => {
    const fetchSubs = () => {
      fetch(API_URL)
        .then(res => {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(data => {
          const mySubs = data.filter(s => String(s.studentId) === String(userId));
          setSubmissions(mySubs);
          localStorage.setItem('submissions', JSON.stringify(mySubs));
        })
        .catch(() => {
          const saved = localStorage.getItem('submissions');
          if (saved) setSubmissions(JSON.parse(saved));
        });
    };

    fetchSubs();
    const interval = setInterval(fetchSubs, 3000); // More aggressive polling (3s)

    return () => clearInterval(interval);
  }, [userId]);

  const getSubmissionForHomework = (homeworkId) => {
    return submissions.find(s => String(s.homeworkId) === String(homeworkId));
  };

  // total coins from submissions
  const totalCoins = submissions
    .filter(s => s.status === 'checked' && s.coins > 0)
    .reduce((sum, s) => sum + (Number(s.coins) || 0), 0);

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topicName.trim() || !submissionLink.trim()) return;

    const error = getValidationError(submissionLink);
    if (error) {
      setLinkError(error);
      toast.error(error);
      return;
    }

    if (!isValidHomeworkLink(submissionLink)) {
      setLinkError('Faqat GitHub, Vercel yoki Netlify dan linkni qoʻyish mumkin');
      toast.error('Faqat GitHub, Vercel yoki Netlify dan linkni qoʻyish mumkin');
      return;
    }

    setLoading(true);
    setLinkError('');

    const matchingHomework = homeworks.find(
      h => h.title.toLowerCase() === topicName.trim().toLowerCase()
    );

    const derivedId = matchingHomework ? matchingHomework.id : `custom-${Date.now()}`;

    const newSubmission = {
      studentId: userId,
      studentName,
      homeworkId: derivedId,
      homeworkTitle: topicName.trim(),
      link: submissionLink.trim(),
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      score: null,
      comment: null,
      coins: 0,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission),
      });

      if (response.ok) {
        const saved = await response.json();
        const updated = [
          ...submissions.filter(s => String(s.homeworkId) !== String(derivedId)),
          saved
        ];
        setSubmissions(updated);
        localStorage.setItem('submissions', JSON.stringify(updated));

        toast.success("Vazifa muvaffaqiyatli yuborildi!");
        setShowSubmitModal(false);
        setSubmissionLink('');
        setTopicName('');
      }
    } catch (err) {
      toast.info("Internet yo'q, lekin vazifa saqlandi.");
      const offline = { ...newSubmission, id: Date.now().toString(), offline: true };
      const updated = [
        ...submissions.filter(s => String(s.homeworkId) !== String(derivedId)),
        offline
      ];
      setSubmissions(updated);
      localStorage.setItem('submissions', JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChange = (value) => {
    setSubmissionLink(value);
    if (linkError) setLinkError('');
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { icon: Clock, text: 'Topshirilgan', iconBg: 'bg-blue-500' },
      checking: { icon: Clock, text: 'Tekshirilmoqda', iconBg: 'bg-yellow-500' },
      redo: { icon: AlertCircle, text: 'Qayta ishlash', iconBg: 'bg-orange-500' },
      checked: { icon: CheckCircle, text: 'Tekshirildi', iconBg: 'bg-green-500' },
      not_submitted: { icon: Clock, text: 'Topshirilmagan', iconBg: 'bg-pink-600' }
    };
    return configs[status] || configs.not_submitted;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* TOTAL COINS DISPLAY */}
        <div className="flex justify-end items-center gap-3 p-4 mb-8 rounded-xl bg-slate-800 border border-slate-600 shadow-xl">
          <div className="bg-yellow-500/10 p-2 rounded-lg">
            <Coins className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-yellow-300 text-xl font-bold">{totalCoins} coins</span>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Earned from works</span>
          </div>
        </div>

        {/* Homework Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeworks.map((homework, index) => {
            const submission = getSubmissionForHomework(homework.id);
            const config = getStatusConfig(submission?.status || 'not_submitted');
            const Icon = config.icon;

            return (
              <motion.div
                key={homework.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 dark:from-slate-900/90 dark:to-black/90 border border-slate-700/50 dark:border-slate-800/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`px-4 py-2 rounded-xl ${config.iconBg} text-white font-bold text-sm shadow-lg`}>
                      {homework.lesson}-dars
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700/50 dark:bg-slate-800/50 border border-slate-600/30">
                      <Icon className="w-4 h-4 text-slate-300" />
                      <span className="text-xs font-semibold text-slate-300">{config.text}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{homework.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{homework.description}</p>

                  {submission ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
                        <p className="text-white text-xs font-bold mb-2">Sizning havolangiz:</p>
                        <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 break-all transition-all">
                          <span className="truncate">{submission.link}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>

                      {submission.status === 'checked' && (
                        <div className="space-y-2">
                          {submission.coins > 0 && (
                            <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/40 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Coins className="w-5 h-5 text-yellow-400" />
                                <p className="text-2xl font-black text-yellow-400">+{submission.coins}</p>
                              </div>
                            </div>
                          )}
                          {submission.score !== null && (
                            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/40">
                              <div className="flex items-center justify-center gap-2">
                                <Trophy className="w-5 h-5 text-green-400" />
                                <p className="text-lg font-bold text-green-400">{submission.score}/100</p>
                              </div>
                              {submission.comment && <p className="text-green-300 italic text-xs mt-2 text-center">"{submission.comment}"</p>}
                            </div>
                          )}
                        </div>
                      )}

                      {submission.status === 'redo' && (
                        <div className="text-center">
                          <p className="text-orange-400 font-bold mb-2 text-sm">Qayta ishlang!</p>
                          {submission.comment && <p className="text-orange-300 italic text-xs mb-3">"{submission.comment}"</p>}
                          <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => { setTopicName(homework.title); setSubmissionLink(submission.link); setShowSubmitModal(true); }}
                            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-orange-500/30 transition-all"
                          >
                            Qayta yuborish
                          </motion.button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => { setTopicName(homework.title); setShowSubmitModal(true); }}
                      className="w-full py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all"
                    >
                      Topshirish
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showSubmitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSubmitModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-3xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-8 text-center">Vazifa topshirish</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-300">Mavzu (Vazifa nomi)</label>
                  <input type="text" value={topicName} onChange={(e) => setTopicName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-300">GitHub/Vercel/Netlify havola</label>
                  <input type="url" value={submissionLink} onChange={(e) => handleLinkChange(e.target.value)} placeholder="https://github.com/..." className={`w-full px-4 py-3 rounded-xl bg-slate-700 border transition-all text-white focus:outline-none ${linkError ? 'border-red-500' : 'border-slate-600'}`} required />
                  {linkError && <div className="mt-2 text-red-400 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{linkError}</div>}
                </div>
                <div className="flex gap-4 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                    {loading ? 'Yuborilmoqda...' : <>Yuborish <Send className="w-5 h-5" /></>}
                  </motion.button>
                  <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 py-4 bg-slate-700 text-white rounded-xl font-bold">Bekor qilish</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
