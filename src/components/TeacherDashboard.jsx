import { useState, useEffect } from "react";
import { Users, FileText, TrendingUp, UserCheck, Search, AlertTriangle, Crown, Star, Sparkles, Trophy, Coins, Flame, Target, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGroups from "./TeacherGroups";
import TeacherSubmissions from "./TeacherSubmissions";
import { submissions as mockSubmissions, subscribe, updateSubmission } from "./submissionsStore";
import { getStudents } from "./store";

const COIN_LIMIT_PER_LESSON = 50;

export function TeacherDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("groups");
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("checked");
  const [comment, setComment] = useState("");

  const [, forceUpdate] = useState({});
  useEffect(() => {
    const unsubscribe = subscribe(() => forceUpdate({}));
    setStudentsList(getStudents());
    return unsubscribe;
  }, []);

  const handleSaveGrade = (submissionId) => {
    if (score > COIN_LIMIT_PER_LESSON) {
      alert(`Diqqat! Har bir dars uchun maksimal coin limiti: ${COIN_LIMIT_PER_LESSON} ta.`);
      return;
    }
    updateSubmission(submissionId, { score, status, comment: comment.trim() || null });
    alert(`Ball saqlandi: ${score}\nStatus: ${status}\nIzoh: ${comment || "yo'q"}`);
    setEditingSubmission(null);
    setScore(0);
    setStatus("checked");
    setComment("");
  };

  const tabs = [
    { key: "groups", name: "Guruhlar", icon: <Users className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500" },
    { key: "submissions", name: "Vazifalar", icon: <FileText className="w-5 h-5" />, gradient: "from-purple-500 to-pink-500" },
    { key: "rating", name: "Reyting", icon: <TrendingUp className="w-5 h-5" />, gradient: "from-amber-500 to-orange-500" },
    { key: "parents", name: "Ota-onalar", icon: <UserCheck className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-500" },
  ];

  const filteredStudents = studentsList
    .filter(s => s.role === 'student')
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.totalScore - a.totalScore);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const getRankBadge = (index) => {
    if (index === 0) return { icon: <Crown className="w-6 h-6" />, bg: "from-yellow-400 via-amber-500 to-yellow-600", shadow: "shadow-yellow-500/50", label: "1-o'rin" };
    if (index === 1) return { icon: <Star className="w-5 h-5" />, bg: "from-gray-300 via-slate-400 to-gray-500", shadow: "shadow-gray-400/50", label: "2-o'rin" };
    if (index === 2) return { icon: <Trophy className="w-5 h-5" />, bg: "from-orange-400 via-amber-600 to-orange-700", shadow: "shadow-orange-500/50", label: "3-o'rin" };
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans overflow-hidden relative">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin-slow" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header Navigation */}
      <nav className="relative z-40 bg-black/30 backdrop-blur-2xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 min-w-max ${
                  activeTab === tab.key
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-purple-500/30`
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <span className={activeTab === tab.key ? "animate-pulse" : ""}>{tab.icon}</span>
                <span>{tab.name}</span>
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"
                    initial={false}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">

          {activeTab === "groups" && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <TeacherGroups />
            </motion.div>
          )}

          {activeTab === "submissions" && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Premium Warning Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl" />
                <div className="relative flex items-center gap-4 p-5 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/30">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-amber-200 font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Har bir vazifa uchun maksimal <span className="text-amber-400 font-bold">{COIN_LIMIT_PER_LESSON} coin</span> berishingiz mumkin
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <TeacherSubmissions
                submissions={mockSubmissions}
                editingSubmission={editingSubmission}
                setEditingSubmission={setEditingSubmission}
                score={score}
                setScore={setScore}
                status={status}
                setStatus={setStatus}
                comment={comment}
                setComment={setComment}
                handleSaveGrade={handleSaveGrade}
              />
            </motion.div>
          )}

          {activeTab === "rating" && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Rating Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 flex items-center justify-center gap-3">
                  <Trophy className="w-10 h-10 text-amber-400" />
                  O'quvchilar Reytingi
                  <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
                </h1>
                <p className="text-gray-400 mt-2">Eng zo'r o'quvchilar bu yerda!</p>
              </motion.div>

              {/* Top 3 Podium */}
              {filteredStudents.length >= 3 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-3 gap-6 mb-10"
                >
                  {/* Second Place */}
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="md:mt-8 order-1 md:order-none"
                  >
                    <div className="relative bg-gradient-to-br from-gray-800/80 to-slate-900/80 rounded-3xl p-6 border border-gray-500/30 backdrop-blur-xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-400/20 rounded-full blur-2xl" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-500/30 text-2xl font-black text-gray-800">
                            2
                          </div>
                          <Star className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{filteredStudents[1]?.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{filteredStudents[1]?.groupId}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-gray-400 to-gray-300 rounded-full"
                            />
                          </div>
                          <span className="text-2xl font-black text-gray-300">{filteredStudents[1]?.totalScore}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* First Place */}
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="order-0 md:order-none"
                  >
                    <div className="relative bg-gradient-to-br from-yellow-900/50 to-amber-900/50 rounded-3xl p-6 border border-yellow-500/40 backdrop-blur-xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute top-4 right-4">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 text-3xl font-black text-yellow-900 animate-pulse">
                            <Crown className="w-10 h-10" />
                          </div>
                          <div className="text-4xl font-black text-yellow-400">#1</div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{filteredStudents[0]?.name}</h3>
                        <p className="text-yellow-400/70 text-sm mb-4">{filteredStudents[0]?.groupId}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-3 bg-yellow-900/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 rounded-full"
                            />
                          </div>
                          <span className="text-3xl font-black text-yellow-400">{filteredStudents[0]?.totalScore}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-yellow-400">
                          <Zap className="w-5 h-5" />
                          <span className="text-sm font-semibold">Lider!</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Third Place */}
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="md:mt-12 order-2 md:order-none"
                  >
                    <div className="relative bg-gradient-to-br from-orange-900/50 to-amber-900/50 rounded-3xl p-6 border border-orange-500/30 backdrop-blur-xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 text-xl font-black text-orange-900">
                            3
                          </div>
                          <Trophy className="w-7 h-7 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{filteredStudents[2]?.name}</h3>
                        <p className="text-orange-400/70 text-sm mb-4">{filteredStudents[2]?.groupId}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-orange-900/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "70%" }}
                              transition={{ duration: 1, delay: 0.7 }}
                              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                            />
                          </div>
                          <span className="text-xl font-black text-orange-400">{filteredStudents[2]?.totalScore}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Rating Table */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden"
              >
                {/* Search Bar */}
                <div className="p-6 border-b border-white/10">
                  <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="O'quvchini qidirish..."
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">O'rin</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">O'quvchi</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Guruh</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-yellow-400" /> Coinlar
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-400" /> Jami Ball
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => {
                        const badge = getRankBadge(index);
                        return (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                            className="border-b border-white/5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              {badge ? (
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.bg} flex items-center justify-center shadow-lg ${badge.shadow} text-white`}>
                                  {badge.icon}
                                </div>
                              ) : (
                                <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-white">{student.name}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium">
                                {student.groupId}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                  <Coins className="w-4 h-4 text-yellow-900" />
                                </div>
                                <span className="text-yellow-400 font-bold">{student.coins || 0}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                {student.totalScore}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "parents" && (
            <motion.div
              key="parents"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center gap-3">
                  <UserCheck className="w-8 h-8 text-emerald-400" />
                  Ota-onalar Paneli
                </h1>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/30">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{student.name}</h3>
                            <p className="text-sm text-gray-400">{student.groupId}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg font-medium">
                          O'quvchi
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                          <span className="text-gray-400 text-sm">Ota-onasi:</span>
                          <span className="text-gray-300 font-medium">Mavjud emas</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                          <span className="text-gray-400 text-sm">Holati:</span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            Math.random() > 0.3 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {Math.random() > 0.3 ? '● Aktiv' : '○ Passiv'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                          <span className="text-gray-400 text-sm">Oxirgi kirish:</span>
                          <span className="text-emerald-400 font-medium">Bugun, 09:41</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">{student.coins || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400 font-bold">{student.totalScore} ball</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
