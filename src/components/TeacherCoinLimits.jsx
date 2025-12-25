import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Plus, Minus, Save } from 'lucide-react';

const TEACHER_COINS_KEY = 'teacher-coin-limits';

export function TeacherCoinLimits() {
  const [showPanel, setShowPanel] = useState(false);
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem(TEACHER_COINS_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 'teacher1', name: 'Alisher Yozov', email: 'alisher@example.com', dailyLimit: 500, usedToday: 120 },
      { id: 'teacher2', name: 'Mariam Shodiyeva', email: 'mariam@example.com', dailyLimit: 500, usedToday: 280 },
      { id: 'teacher3', name: 'Dilshod Rajab', email: 'dilshod@example.com', dailyLimit: 500, usedToday: 0 },
    ];
  });
  
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [tempLimit, setTempLimit] = useState(0);

  const handleSaveLimit = (teacherId, newLimit) => {
    const updated = teachers.map(t =>
      t.id === teacherId ? { ...t, dailyLimit: newLimit } : t
    );
    setTeachers(updated);
    localStorage.setItem(TEACHER_COINS_KEY, JSON.stringify(updated));
    setEditingTeacher(null);
  };

  const handleAddCoins = (teacherId, amount) => {
    const updated = teachers.map(t =>
      t.id === teacherId
        ? { ...t, dailyLimit: Math.min(t.dailyLimit + amount, 1000) }
        : t
    );
    setTeachers(updated);
    localStorage.setItem(TEACHER_COINS_KEY, JSON.stringify(updated));
  };

  const handleRemoveCoins = (teacherId, amount) => {
    const updated = teachers.map(t =>
      t.id === teacherId
        ? { ...t, dailyLimit: Math.max(t.dailyLimit - amount, 0) }
        : t
    );
    setTeachers(updated);
    localStorage.setItem(TEACHER_COINS_KEY, JSON.stringify(updated));
  };

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition mb-6 shadow-lg"
      >
        <Coins className="w-5 h-5" />
        O'qituvchi Coin Limitlari
      </motion.button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-xl space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Kunlik Coin Limitlari</h3>

            <div className="space-y-4">
              {teachers.map((teacher) => {
                const percentageUsed = (teacher.usedToday / teacher.dailyLimit) * 100;
                const isEditing = editingTeacher === teacher.id;

                return (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-white">{teacher.name}</p>
                        <p className="text-sm text-slate-400">{teacher.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-400">{teacher.usedToday}/{teacher.dailyLimit}</p>
                        <p className="text-xs text-slate-400">ishlatildi/limit</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full ${
                            percentageUsed > 80 ? 'bg-red-500' :
                            percentageUsed > 50 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    {isEditing ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={tempLimit}
                          onChange={(e) => setTempLimit(Math.max(0, parseInt(e.target.value) || 0))}
                          min="0"
                          max="1000"
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleSaveLimit(teacher.id, tempLimit)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTeacher(null)}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
                        >
                          Bekor
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTeacher(teacher.id);
                            setTempLimit(teacher.dailyLimit);
                          }}
                          className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition"
                        >
                          O'zgartirish
                        </button>
                        <button
                          onClick={() => handleAddCoins(teacher.id, 100)}
                          className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded transition"
                          title="100 coin qoʻshish"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveCoins(teacher.id, 50)}
                          disabled={teacher.dailyLimit === 0}
                          className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition disabled:opacity-50"
                          title="50 coin olib tashish"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm">
              💡 O'qituvchilar kuniga berilgan limitdan ortiqcha coin bera olmaydi. Limit kunning boshida qayta yangilanadi.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
