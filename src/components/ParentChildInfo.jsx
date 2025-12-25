import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, MessageSquare, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';

export function ParentChildInfo({ childId, childName = "Aziz Karimov" }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, fetch from API
  const childData = {
    id: childId,
    name: childName,
    email: 'aziz@example.com',
    group: 'nF-2941',
    level: 8,
    coins: 450,
    tasksCompleted: 5,
    tasksFailed: 2,
    lessonsAttended: 8,
    lessonsMissed: 2,
    shopPurchases: [
      { id: 1, name: 'Mars IT koʻylagi', price: 250, date: '2025-12-10' },
      { id: 2, name: 'Qalam + brend daftar', price: 80, date: '2025-12-05' },
    ],
    homeworkFeedback: [
      {
        id: 1,
        homework: 'Flexbox va Grid',
        status: 'checked',
        score: 95,
        comment: 'Ajoyib ish! Faqat mobileda kichik muammo bor',
        teacher: 'Alisher Yozov',
      },
      {
        id: 2,
        homework: 'Responsive Navbar',
        status: 'checking',
        score: null,
        comment: null,
        teacher: 'Alisher Yozov',
      },
    ],
  };

  const stats = [
    {
      icon: CheckCircle,
      label: "Bajarilgan Vazifalar",
      value: childData.tasksCompleted,
      color: 'green',
    },
    {
      icon: XCircle,
      label: "Bajarmagan Vazifalar",
      value: childData.tasksFailed,
      color: 'red',
    },
    {
      icon: BookOpen,
      label: "Derslarga Kelgan",
      value: childData.lessonsAttended,
      color: 'blue',
    },
    {
      icon: TrendingUp,
      label: "Daraja",
      value: `Lv. ${childData.level}`,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {childName}ning Taraqqiyoti
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {childData.group} • Email: {childData.email}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const colorMap = {
              green: 'from-green-500 to-emerald-600',
              red: 'from-red-500 to-rose-600',
              blue: 'from-blue-500 to-indigo-600',
              purple: 'from-purple-500 to-pink-600',
            };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${colorMap[stat.color]} rounded-2xl p-4 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-6 h-6 opacity-80" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm opacity-90">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Umumiy' },
            { id: 'feedback', label: 'Otzivlar' },
            { id: 'purchases', label: 'Xaridlar' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:shadow'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Coins Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Coin Balans
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Jami Coinlar</p>
                    <p className="text-4xl font-bold text-yellow-500">{childData.coins}</p>
                  </div>
                  <div className="text-6xl">🪙</div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Shop'da ishlatib, turingi yoki yangi vazifalar orqali oshiriib boshing
                </p>
              </div>

              {/* Progress Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Vazifa Statistikasi
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Bajarilgan</span>
                        <span className="font-semibold text-green-600">{childData.tasksCompleted}/7</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(childData.tasksCompleted / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Bajarmagan</span>
                        <span className="font-semibold text-red-600">{childData.tasksFailed}/7</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(childData.tasksFailed / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Dars Statistikasi
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Kelganlar</span>
                        <span className="font-semibold text-blue-600">{childData.lessonsAttended}/10</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(childData.lessonsAttended / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Kelmagan</span>
                        <span className="font-semibold text-orange-600">{childData.lessonsMissed}/10</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(childData.lessonsMissed / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {childData.homeworkFeedback.length > 0 ? (
                childData.homeworkFeedback.map((fb, i) => (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{fb.homework}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          O'qituvchi: {fb.teacher}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          fb.status === 'checked'
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {fb.status === 'checked' ? 'Tekshirildi' : 'Tekshirilmoqda'}
                      </div>
                    </div>

                    {fb.status === 'checked' && (
                      <>
                        <div className="mb-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {fb.score} / 100
                          </p>
                        </div>
                        {fb.comment && (
                          <div className="flex gap-2">
                            <MessageSquare className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                            <p className="text-slate-700 dark:text-slate-300 italic">"{fb.comment}"</p>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  Hali otziv yo'q
                </div>
              )}
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              {childData.shopPurchases.length > 0 ? (
                childData.shopPurchases.map((purchase, i) => (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-purple-500 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <ShoppingBag className="w-6 h-6 text-purple-600" />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{purchase.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{purchase.date}</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-yellow-500">{purchase.price}🪙</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  Hali xaridlar yo'q
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
