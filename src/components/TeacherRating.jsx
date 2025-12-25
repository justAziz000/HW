import { useState } from 'react';
import { Trophy, Medal, Award, Search, Crown, Star, Flame, Zap, Target, Coins, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { students, groups } from '../data/mockData';

export function TeacherRating() {
  const [viewMode, setViewMode] = useState('group');
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredStudents = () => {
    let filtered = viewMode === 'group' 
      ? students.filter(s => s.groupId === selectedGroup)
      : students;

    if (searchQuery.trim()) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const sortedStudents = [...getFilteredStudents()].sort((a, b) => b.totalScore - a.totalScore);

  const getMedalInfo = (index) => {
    if (index === 0) return { 
      icon: <Crown className="w-6 h-6" />, 
      bg: "from-yellow-400 via-amber-500 to-yellow-600",
      shadow: "shadow-yellow-500/50",
      text: "text-yellow-400"
    };
    if (index === 1) return { 
      icon: <Medal className="w-5 h-5" />, 
      bg: "from-gray-300 via-slate-400 to-gray-500",
      shadow: "shadow-gray-400/50",
      text: "text-gray-300"
    };
    if (index === 2) return { 
      icon: <Award className="w-5 h-5" />, 
      bg: "from-orange-400 via-amber-600 to-orange-700",
      shadow: "shadow-orange-500/50",
      text: "text-orange-400"
    };
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 flex items-center justify-center gap-4">
            <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            Reyting Jadvali
            <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Eng yaxshi o'quvchilar bu yerda!</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10"
        >
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('group')}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                viewMode === 'group'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Guruh bo'yicha
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('global')}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                viewMode === 'global'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Umumiy reyting
            </motion.button>
          </div>

          {/* Group Selector */}
          <AnimatePresence>
            {viewMode === 'group' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="px-5 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all cursor-pointer font-medium"
                >
                  {groups.map(group => (
                    <option key={group.id} value={group.id} className="bg-slate-900">{group.name}</option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all w-64"
            />
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        {sortedStudents.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Top 3 O'quvchi
              <Zap className="w-6 h-6 text-yellow-400" />
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Second Place */}
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className="md:mt-8 order-1 md:order-none"
              >
                <div className="relative bg-gradient-to-br from-gray-800/80 to-slate-900/80 rounded-3xl p-6 border border-gray-500/30 backdrop-blur-xl overflow-hidden group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-400/20 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-500/30">
                        <span className="text-2xl font-black text-gray-800">2</span>
                      </div>
                      <Medal className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{sortedStudents[1]?.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{sortedStudents[1]?.email}</p>
                    <span className="inline-block px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-sm mb-4">
                      {sortedStudents[1]?.groupId}
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-gray-400 to-gray-300 rounded-full"
                        />
                      </div>
                      <span className="text-2xl font-black text-gray-300">{sortedStudents[1]?.totalScore}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* First Place */}
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className="order-0 md:order-none"
              >
                <div className="relative bg-gradient-to-br from-yellow-900/50 to-amber-900/50 rounded-3xl p-8 border border-yellow-500/40 backdrop-blur-xl overflow-hidden group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse">
                        <Crown className="w-10 h-10 text-yellow-900" />
                      </div>
                      <div className="text-5xl font-black text-yellow-400">#1</div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{sortedStudents[0]?.name}</h3>
                    <p className="text-yellow-400/70 text-sm mb-2">{sortedStudents[0]?.email}</p>
                    <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm mb-4">
                      {sortedStudents[0]?.groupId}
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex-1 h-3 bg-yellow-900/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 rounded-full"
                        />
                      </div>
                      <span className="text-3xl font-black text-yellow-400">{sortedStudents[0]?.totalScore}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-yellow-400">
                      <Zap className="w-5 h-5 animate-pulse" />
                      <span className="text-sm font-bold">Lider!</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Third Place */}
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className="md:mt-12 order-2 md:order-none"
              >
                <div className="relative bg-gradient-to-br from-orange-900/50 to-amber-900/50 rounded-3xl p-6 border border-orange-500/30 backdrop-blur-xl overflow-hidden group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <span className="text-xl font-black text-orange-900">3</span>
                      </div>
                      <Award className="w-7 h-7 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{sortedStudents[2]?.name}</h3>
                    <p className="text-orange-400/70 text-sm mb-2">{sortedStudents[2]?.email}</p>
                    <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm mb-4">
                      {sortedStudents[2]?.groupId}
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex-1 h-2 bg-orange-900/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                        />
                      </div>
                      <span className="text-xl font-black text-orange-400">{sortedStudents[2]?.totalScore}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Full Ranking Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50">
                  <th className="px-6 py-5 text-left text-sm font-bold text-purple-300">O'rin</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-purple-300">O'quvchi</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-purple-300">Guruh</th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-purple-300">
                    <div className="flex items-center justify-end gap-2">
                      <Target className="w-4 h-4" /> Jami ball
                    </div>
                  </th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sortedStudents.map((student, index) => {
                  const medal = getMedalInfo(index);
                  return (
                    <motion.tr
                      key={student.id}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                      className="border-b border-white/5 transition-all duration-300 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {medal ? (
                            <motion.div
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${medal.bg} flex items-center justify-center shadow-lg ${medal.shadow} text-white`}
                            >
                              {medal.icon}
                            </motion.div>
                          ) : (
                            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 font-bold group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                              {index + 1}
                            </span>
                          )}
                          <span className={`text-lg font-bold ${medal ? medal.text : 'text-gray-400'}`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl text-sm font-medium border border-purple-500/20">
                          {student.groupId}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`text-2xl font-black ${medal ? medal.text : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'}`}
                        >
                          {student.totalScore}
                        </motion.span>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
          
          {sortedStudents.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Hech qanday o'quvchi topilmadi</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
