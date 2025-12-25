import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';

export function ProgressTracker({ userId, role = 'student' }) {
  const [progressData, setProgressData] = useState({
    tasksCompleted: 5,
    totalTasks: 12,
    lessonsAttended: 8,
    totalLessons: 10,
    coins: 450,
    targetCoins: 1000,
    level: 8,
  });

  const calculateProgress = () => {
    return {
      tasks: Math.round((progressData.tasksCompleted / progressData.totalTasks) * 100),
      lessons: Math.round((progressData.lessonsAttended / progressData.totalLessons) * 100),
      coins: Math.round((progressData.coins / progressData.targetCoins) * 100),
    };
  };

  const progress = calculateProgress();

  const ProgressBar = ({ label, current, total, percentage, color = 'blue', icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-5 h-5 text-${color}-500`} />}
          <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{current}/{total}</span>
      </div>

      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full shadow-lg shadow-${color}-500/50`}
        />
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 dark:text-slate-400">Progress</span>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
          className={`font-bold text-${color}-600 dark:text-${color}-400`}
        >
          {percentage}%
        </motion.span>
      </div>
    </motion.div>
  );

  const overallProgress = Math.round((progress.tasks + progress.lessons + progress.coins) / 3);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 mb-1">Umumiy Taraqqiyot</p>
            <h3 className="text-3xl font-bold">{overallProgress}%</h3>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-blue-300 flex items-center justify-center">
            <span className="text-2xl font-bold">{overallProgress}%</span>
          </div>
        </div>
        <div className="w-full h-2 bg-blue-400/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </motion.div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-200 dark:border-slate-700">
          <ProgressBar
            label="Vazifalar"
            current={progressData.tasksCompleted}
            total={progressData.totalTasks}
            percentage={progress.tasks}
            color="emerald"
          />
        </div>

        {/* Lessons Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-200 dark:border-slate-700">
          <ProgressBar
            label="Darslar"
            current={progressData.lessonsAttended}
            total={progressData.totalLessons}
            percentage={progress.lessons}
            color="blue"
          />
        </div>

        {/* Coins Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-200 dark:border-slate-700">
          <ProgressBar
            label="Coinlar"
            current={progressData.coins}
            total={progressData.targetCoins}
            percentage={progress.coins}
            color="yellow"
            icon={Zap}
          />
        </div>

        {/* Level Info */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-1">Hozirgi Daraja</p>
              <h3 className="text-3xl font-bold">Level {progressData.level}</h3>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              ⭐
            </motion.div>
          </div>
          <p className="text-purple-100 text-sm mt-3">
            Keyingi daraja uchun {Math.round(progressData.targetCoins * 0.2)} coin kerak
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 dark:text-white">Yutuqlar</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: '🎯', label: 'Vazifa Master', unlocked: true },
            { emoji: '🚀', label: 'Qo\'l Tekkani', unlocked: true },
            { emoji: '🏆', label: 'TOP 10', unlocked: false },
            { emoji: '💎', label: 'Coin Yig\'uychi', unlocked: true },
            { emoji: '⭐', label: 'Yulduz', unlocked: false },
            { emoji: '👑', label: 'Champion', unlocked: false },
          ].map((achievement, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-xl text-center transition ${
                achievement.unlocked
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-700/50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-1">{achievement.emoji}</div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {achievement.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
