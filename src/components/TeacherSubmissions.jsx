import { useState, useEffect } from "react";
import {
  ExternalLink,
  Edit3,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  X,
  FileText,
  Coins,
  Sparkles,
  Trophy,
  Zap,
  Send,
  Star,
  Gift,
  Award,
  Target,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addCoinsWithNotification } from "./store1";

const API_URL = "https://69393fa6c8d59937aa0706bf.mockapi.io/submissions";

export default function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    score: "",
    comment: "",
    status: "checking",
    coins: "",
  });

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setSubmissions(data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    } catch (err) {
      console.error(err);
      alert("Internetda muammo bor.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (sub) => {
    setEditingId(sub.id);
    setForm({
      score: sub.score ?? "",
      comment: sub.comment ?? "",
      status: sub.status || "checking",
      coins: sub.coins ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ score: "", comment: "", status: "checking", coins: "" });
  };

  const saveGrade = async (id) => {
    if (form.score && (form.score < 0 || form.score > 100)) {
      alert("Ball 0 dan 100 gacha bo'lishi kerak");
      return;
    }

    const updatedData = {
      score: form.score ? Number(form.score) : null,
      comment: form.comment.trim() || null,
      status: form.status,
      coins: form.coins ? Number(form.coins) : 0,
    };

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updated = await res.json();
        setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));

        // Add coins and notification if coins > 0
        if (form.coins && Number(form.coins) > 0) {
          const coinAmount = Number(form.coins);

          // 1. Local update
          addCoinsWithNotification(
            updated.studentId,
            coinAmount,
            `Vazifa uchun: ${updated.homeworkTitle || 'Dars'}`
          );

          // 2. Remote API update
          import('./api').then(async ({ fetchStudents, updateStudent }) => {
            try {
              const students = await fetchStudents();
              // Try to find student by ID (handling string/number mismatch)
              const student = students.find(s => String(s.id) === String(updated.studentId));

              if (student) {
                const newCoins = (student.coins || 0) + coinAmount;

                // Add pending notification to the remote object too
                const pending = student.pendingReward || { amount: 0, reasons: [] };
                const newPending = {
                  amount: (pending.amount || 0) + coinAmount,
                  reasons: [...(pending.reasons || []), `Vazifa uchun: ${updated.homeworkTitle || 'Dars'}`],
                  timestamp: Date.now()
                };

                await updateStudent(updated.studentId, {
                  ...student,
                  coins: newCoins,
                  pendingReward: newPending
                });
                console.log('Coins synced to API:', newCoins);
              } else {
                console.warn('Student not found in API for coin sync:', updated.studentId);
              }
            } catch (err) {
              console.error('Failed to sync coins to API:', err);
            }
          });
        }

        // Notify parent if score is low
        if (updated.score !== null && updated.score < 60) {
          import('./store1').then(({ addParentNotification }) => {
            addParentNotification(
              updated.studentId,
              `Farzandingiz "${updated.homeworkTitle || 'Dars'}" mavzusini o'zlashtira olmadi (Ball: ${updated.score}). Iltimos nazorat qiling.`
            );
          });
        }

        alert("Baholash va koinslar saqlandi!");
        cancelEdit();
      }
    } catch (err) {
      alert("Internet yo'q. Keyinroq qayta urining.");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "checking":
      case "submitted":
        return {
          icon: Clock,
          color: "text-amber-400",
          bg: "from-amber-500/20 to-yellow-500/20",
          border: "border-amber-500/30",
          label: "Tekshirilmoqda",
          glow: "shadow-amber-500/20"
        };
      case "checked":
        return {
          icon: CheckCircle,
          color: "text-emerald-400",
          bg: "from-emerald-500/20 to-green-500/20",
          border: "border-emerald-500/30",
          label: "Tekshirildi",
          glow: "shadow-emerald-500/20"
        };
      case "redo":
        return {
          icon: AlertCircle,
          color: "text-orange-400",
          bg: "from-orange-500/20 to-red-500/20",
          border: "border-orange-500/30",
          label: "Qayta ishlash",
          glow: "shadow-orange-500/20"
        };
      default:
        return {
          icon: Send,
          color: "text-blue-400",
          bg: "from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/30",
          label: "Yuborilgan",
          glow: "shadow-blue-500/20"
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        />
        <p className="mt-6 text-xl text-purple-300 font-semibold">Yuklanmoqda...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-32"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
          <div className="relative w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-white/10">
            <FileText className="w-16 h-16 text-purple-400" />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-white">Hozircha hech kim vazifa topshirmagan</h2>
        <p className="mt-2 text-gray-400">O'quvchilar vazifa topshirganidan so'ng shu yerda ko'rinadi</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center gap-3">
          <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
          O'quvchilar Vazifalari
          <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
        </h1>
        <p className="text-gray-400 mt-2">Barcha topshirilgan vazifalarni bu yerda baholang</p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30"
          >
            <span className="text-2xl font-bold text-purple-400">{submissions.length}</span>
            <span className="text-gray-400 ml-2">jami vazifa</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30"
          >
            <span className="text-2xl font-bold text-amber-400">
              {submissions.filter(s => s.status === 'checking' || s.status === 'submitted').length}
            </span>
            <span className="text-gray-400 ml-2">kutilmoqda</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Submissions List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {submissions.map((sub, index) => {
          const { icon: StatusIcon, color: statusColor, bg: statusBg, border: statusBorder, label: statusLabel, glow } = getStatusInfo(sub.status);

          return (
            <motion.div
              key={sub.id}
              variants={cardVariants}
              whileHover={{ scale: 1.01, y: -3 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${statusBg} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity`} />

              {/* Card */}
              <div className={`relative bg-black/50 backdrop-blur-2xl rounded-3xl border ${statusBorder} overflow-hidden`}>
                {/* Top Gradient Bar */}
                <div className={`h-1 bg-gradient-to-r ${statusBg.replace('/20', '')}`} />

                <div className="p-8">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/30"
                      >
                        {sub.studentName?.charAt(0) || "?"}
                      </motion.div>

                      <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          {sub.studentName}
                          {sub.score >= 90 && <Star className="w-5 h-5 text-yellow-400" />}
                        </h3>
                        <p className="text-lg text-purple-400 font-semibold flex items-center gap-2 mt-1">
                          <Target className="w-4 h-4" />
                          {sub.homeworkTitle || `${sub.homeworkId}-dars`}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${statusBg} border ${statusBorder} ${statusColor} font-bold`}
                    >
                      <StatusIcon className="w-5 h-5" />
                      {statusLabel}
                    </motion.div>
                  </div>

                  {/* Link Section */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10"
                  >
                    <p className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" /> Havola:
                    </p>
                    <a
                      href={sub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all font-medium flex items-center gap-2 transition-colors"
                    >
                      {sub.link}
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                  </motion.div>

                  {/* Time */}
                  <p className="text-gray-500 mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Topshirilgan: {new Date(sub.submittedAt).toLocaleString("uz-UZ")}
                  </p>

                  {/* Coins Earned */}
                  {sub.coins > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-6 p-6 bg-gradient-to-r from-amber-900/30 via-yellow-900/30 to-orange-900/30 rounded-2xl border border-yellow-500/30"
                    >
                      <div className="flex items-center justify-center gap-4">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Gift className="w-12 h-12 text-yellow-400" />
                        </motion.div>
                        <div className="text-center">
                          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                            +{sub.coins} koins
                          </p>
                          <p className="text-yellow-400/70 text-sm mt-1">Sovrin oldi!</p>
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Coins className="w-12 h-12 text-yellow-400" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Score Display */}
                  {sub.status === "checked" && sub.score !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl border border-emerald-500/30 mb-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-3xl font-black text-emerald-400">{sub.score}/100 ball</p>
                          {sub.comment && (
                            <p className="text-emerald-300/80 italic mt-2 flex items-center gap-2">
                              <span className="text-emerald-400">"</span>
                              {sub.comment}
                              <span className="text-emerald-400">"</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Redo Status */}
                  {sub.status === "redo" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-2xl border border-orange-500/30 mb-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                          <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-400">Qayta ishlash kerak!</p>
                          {sub.comment && (
                            <p className="text-orange-300/80 italic mt-2">"{sub.comment}"</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Edit Form */}
                  <AnimatePresence>
                    {editingId === sub.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10 pt-8 mt-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          {/* Score Input */}
                          <div>
                            <label className="block text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                              <Target className="w-4 h-4" /> Ball (0-100)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={form.score}
                              onChange={(e) => setForm({ ...form, score: e.target.value })}
                              className="w-full px-4 py-4 bg-white/5 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-lg font-semibold"
                              placeholder="95"
                            />
                          </div>

                          {/* Status Select */}
                          <div>
                            <label className="block text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" /> Status
                            </label>
                            <select
                              value={form.status}
                              onChange={(e) => setForm({ ...form, status: e.target.value })}
                              className="w-full px-4 py-4 bg-white/5 border-2 border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-lg font-semibold cursor-pointer"
                            >
                              <option value="checking" className="bg-slate-900">Tekshirilmoqda</option>
                              <option value="checked" className="bg-slate-900">Tekshirildi</option>
                              <option value="redo" className="bg-slate-900">Qayta ishlash</option>
                            </select>
                          </div>

                          {/* Coins Input */}
                          <div>
                            <label className="block text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
                              <Coins className="w-4 h-4" /> Koins berish
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="200"
                              value={form.coins}
                              onChange={(e) => setForm({ ...form, coins: e.target.value })}
                              className="w-full px-4 py-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl text-yellow-400 placeholder-yellow-600/50 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 outline-none transition-all text-lg font-semibold"
                              placeholder="50"
                            />
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-6">
                          <label className="block text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                            <Edit3 className="w-4 h-4" /> Izoh (ixtiyoriy)
                          </label>
                          <textarea
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-4 bg-white/5 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all resize-none"
                            placeholder="Zo'r ish! Davom eting..."
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => saveGrade(sub.id)}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                          >
                            <Save className="w-6 h-6" />
                            Saqlash
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={cancelEdit}
                            className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
                          >
                            <X className="w-6 h-6" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Edit Button */}
                  {editingId !== sub.id && (
                    <div className="flex justify-end mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEdit(sub)}
                        className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                        <Edit3 className="w-6 h-6 relative z-10" />
                        <span className="relative z-10">Baholash va koins berish</span>
                        <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
