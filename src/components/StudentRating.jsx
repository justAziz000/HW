import { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Flame, Zap, Target, Coins, Sparkles, Users, Search, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudents, getGroups } from './store1';
import { getLeaderboard, calculateStudentRank, getRankTrend } from './rankingStore';

export function StudentRating({ userId, groupId }) {
  const [viewMode, setViewMode] = useState('group');
  const [searchQuery, setSearchQuery] = useState('');

  const groups = getGroups();
  const currentGroup = groups.find(g => g.id === groupId);

  // Use enhanced ranking system
  const groupLeaderboard = getLeaderboard(groupId);
  const globalLeaderboard = getLeaderboard();

  const currentStudent = globalLeaderboard.find(s => s.id === userId);
  const groupRank = groupLeaderboard.findIndex(s => s.id === userId) + 1;
  const globalRank = globalLeaderboard.findIndex(s => s.id === userId) + 1;

  // Get rank trend
  const rankTrend = getRankTrend(userId);

  const totalScore = currentStudent?.totalScore || 0;
  const totalCoins = currentStudent?.coins || 0;

  const displayStudents = viewMode === 'group' ? groupLeaderboard : globalLeaderboard;
  const filteredStudents = displayStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get trend icon
  const getTrendIcon = () => {
    if (rankTrend === 'improving') return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (rankTrend === 'declining') return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 flex items-center justify-center gap-4">
          <Trophy className="w-10 md:w-12 h-10 md:h-12 text-amber-400 animate-bounce" />
          Reyting
          <Flame className="w-10 md:w-12 h-10 md:h-12 text-orange-500 animate-pulse" />
        </h1>
        <p className="text-gray-400 mt-2">O'z o'rningizni bilib oling!</p>
      </motion.div>

      {/* My Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <Target className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl md:text-4xl font-black">{totalScore}</p>
          <p className="text-sm opacity-80">Jami ball</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <Coins className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl md:text-4xl font-black">{totalCoins}</p>
          <p className="text-sm opacity-80">Coinlar</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            {getTrendIcon()}
          </div>
          <p className="text-3xl md:text-4xl font-black">#{groupRank}</p>
          <p className="text-sm opacity-80">Guruhda</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl md:text-4xl font-black">#{globalRank}</p>
          <p className="text-sm opacity-80">Umumiy</p>
        </div>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
      >
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('group')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${viewMode === 'group'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            <Users className="w-5 h-5" />
            Guruh: {currentGroup?.name || groupId}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('global')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${viewMode === 'global'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            <TrendingUp className="w-5 h-5" />
            Umumiy reyting
          </motion.button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      {filteredStudents.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Top 3 {viewMode === 'group' ? 'Guruhda' : 'Umumiy'}
            <Zap className="w-6 h-6 text-yellow-400" />
          </h2>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Second Place */}
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="md:mt-8 order-1 md:order-none"
            >
              <div className={`relative bg-gradient-to-br from-gray-800/80 to-slate-900/80 rounded-3xl p-5 md:p-6 border ${filteredStudents[1]?.id === userId ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-500/30'
                } backdrop-blur-xl overflow-hidden group h-full`}>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-400/20 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-500/30">
                      <span className="text-xl md:text-2xl font-black text-gray-800">2</span>
                    </div>
                    <Medal className="w-7 h-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {filteredStudents[1]?.name}
                    {filteredStudents[1]?.id === userId && <span className="text-blue-400 text-sm ml-2">(Siz)</span>}
                  </h3>
                  {viewMode === 'global' && (
                    <p className="text-gray-400 text-sm mb-4">{filteredStudents[1]?.groupId}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{filteredStudents[1]?.coins || 0}</span>
                    </div>
                    <span className="text-xl md:text-2xl font-black text-gray-300">{filteredStudents[1]?.totalScore || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* First Place */}
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="order-0 md:order-none"
            >
              <div className={`relative bg-gradient-to-br from-yellow-900/50 to-amber-900/50 rounded-3xl p-6 md:p-8 border ${filteredStudents[0]?.id === userId ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-yellow-500/40'
                } backdrop-blur-xl overflow-hidden group h-full`}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse">
                      <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-900" />
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-yellow-400">#1</div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {filteredStudents[0]?.name}
                    {filteredStudents[0]?.id === userId && <span className="text-blue-400 text-sm ml-2">(Siz)</span>}
                  </h3>
                  {viewMode === 'global' && (
                    <p className="text-yellow-400/70 text-sm mb-4">{filteredStudents[0]?.groupId}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-6 h-6 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-lg">{filteredStudents[0]?.coins || 0}</span>
                    </div>
                    <span className="text-2xl md:text-3xl font-black text-yellow-400">{filteredStudents[0]?.totalScore || 0}</span>
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
              <div className={`relative bg-gradient-to-br from-orange-900/50 to-amber-900/50 rounded-3xl p-5 md:p-6 border ${filteredStudents[2]?.id === userId ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-orange-500/30'
                } backdrop-blur-xl overflow-hidden group h-full`}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <span className="text-lg md:text-xl font-black text-orange-900">3</span>
                    </div>
                    <Award className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-1">
                    {filteredStudents[2]?.name}
                    {filteredStudents[2]?.id === userId && <span className="text-blue-400 text-sm ml-2">(Siz)</span>}
                  </h3>
                  {viewMode === 'global' && (
                    <p className="text-orange-400/70 text-sm mb-4">{filteredStudents[2]?.groupId}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{filteredStudents[2]?.coins || 0}</span>
                    </div>
                    <span className="text-lg md:text-xl font-black text-orange-400">{filteredStudents[2]?.totalScore || 0}</span>
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
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
      >
        <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-white/10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            To'liq reyting
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="divide-y divide-white/5"
        >
          {filteredStudents.map((student, index) => {
            const medal = getMedalInfo(index);
            const isMe = student.id === userId;

            return (
              <motion.div
                key={student.id}
                variants={itemVariants}
                className={`flex items-center justify-between p-4 transition-all ${isMe
                  ? 'bg-blue-500/20 border-l-4 border-blue-500'
                  : 'hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  {medal ? (
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${medal.bg} flex items-center justify-center shadow-lg ${medal.shadow} text-white`}
                    >
                      {medal.icon}
                    </motion.div>
                  ) : (
                    <span className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold ${isMe ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                      {index + 1}
                    </span>
                  )}

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${isMe ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-pink-600'
                      }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold ${isMe ? 'text-blue-300' : 'text-white'}`}>
                        {student.name}
                        {isMe && <span className="text-blue-400 text-sm ml-2">(Siz)</span>}
                      </p>
                      {viewMode === 'global' && (
                        <p className="text-xs text-gray-500">{student.groupId}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Coins */}
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{student.coins || 0}</span>
                  </div>

                  {/* Score */}
                  <span className={`text-xl font-black ${medal ? medal.text : isMe ? 'text-blue-400' : 'text-gray-300'}`}>
                    {student.totalScore || 0}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Hech qanday o'quvchi topilmadi</p>
          </div>
        )}
      </motion.div>

      {/* Motivation Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-600 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Top 5 ga kirish uchun</h3>
            <p className="text-gray-400 mb-4">
              Top 5 ga kirsangiz, Shop dan sovg'alar olish imkoniyatiga ega bo'lasiz!
            </p>
            {groupRank <= 5 ? (
              <div className="flex items-center gap-2 text-green-400">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold">🎉 Tabriklaymiz! Siz hozir guruhingizda Top 5 dasiz!</span>
              </div>
            ) : groupLeaderboard[4] ? (
              <div className="flex items-center gap-2 text-purple-400">
                <Target className="w-5 h-5" />
                <span>Yana <span className="font-bold text-white">{(groupLeaderboard[4]?.totalScore || 0) - totalScore + 1}</span> ball to'plang!</span>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
