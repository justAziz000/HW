import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, User, Eye, EyeOff, Calendar } from 'lucide-react';

const PARENT_ACTIVITY_KEY = 'parent-activity-tracking';

export function ParentActivityTracker({ groupId }) {
  const [parents, setParents] = useState(() => {
    const saved = localStorage.getItem(PARENT_ACTIVITY_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'parent1',
        name: 'Aziz Karimov (Ota)',
        email: 'aziz.father@example.com',
        childName: 'Aziz Karimov',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isActive: true,
        checkFrequency: 'Kuniga 2-3 marta',
      },
      {
        id: 'parent2',
        name: 'Malika Alieva (Ona)',
        email: 'malika.mother@example.com',
        childName: 'Malika Alieva',
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isActive: false,
        checkFrequency: 'Hafta ko\'pi bilan bir marta',
      },
      {
        id: 'parent3',
        name: 'Bobur Tursunov (Ota)',
        email: 'bobur.father@example.com',
        childName: 'Bobur Tursunov',
        lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        isActive: true,
        checkFrequency: 'Kuniga bir marta',
      },
    ];
  });

  const [viewMode, setViewMode] = useState('all'); // all, active, inactive

  const isActiveStatus = (lastLogin) => {
    const lastLoginTime = new Date(lastLogin).getTime();
    const now = Date.now();
    const diffHours = (now - lastLoginTime) / (1000 * 60 * 60);
    return diffHours < 24; // Active if logged in within 24 hours
  };

  const getTimeSinceLogin = (lastLogin) => {
    const lastLoginTime = new Date(lastLogin).getTime();
    const now = Date.now();
    const diffMs = now - lastLoginTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} daqiqalar oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    return `${diffDays} kun oldin`;
  };

  const filteredParents = parents.filter(p => {
    if (viewMode === 'active') return isActiveStatus(p.lastLogin);
    if (viewMode === 'inactive') return !isActiveStatus(p.lastLogin);
    return true;
  });

  const activeCount = parents.filter(p => isActiveStatus(p.lastLogin)).length;
  const inactiveCount = parents.filter(p => !isActiveStatus(p.lastLogin)).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700"
        >
          <p className="text-slate-400 text-sm mb-1">Jami Ota-Onalar</p>
          <p className="text-3xl font-bold text-white">{parents.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/30"
        >
          <p className="text-green-300 text-sm mb-1">Faol</p>
          <p className="text-3xl font-bold text-green-400">{activeCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl p-4 border border-slate-600/30"
        >
          <p className="text-slate-300 text-sm mb-1">Faol emas</p>
          <p className="text-3xl font-bold text-slate-400">{inactiveCount}</p>
        </motion.div>
      </div>

      {/* View Mode Buttons */}
      <div className="flex gap-2">
        {[
          { mode: 'all', label: 'Barcha', count: parents.length },
          { mode: 'active', label: 'Faol', count: activeCount },
          { mode: 'inactive', label: 'Faol emas', count: inactiveCount },
        ].map(btn => (
          <button
            key={btn.mode}
            onClick={() => setViewMode(btn.mode)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === btn.mode
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {/* Parents List */}
      <div className="space-y-3">
        {filteredParents.length > 0 ? (
          filteredParents.map((parent, i) => {
            const active = isActiveStatus(parent.lastLogin);
            const timeSince = getTimeSinceLogin(parent.lastLogin);

            return (
              <motion.div
                key={parent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl p-4 border transition ${
                  active
                    ? 'bg-slate-800/50 border-green-500/30 hover:bg-slate-800/70'
                    : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      active ? 'bg-green-500/20' : 'bg-slate-700/50'
                    }`}>
                      👤
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{parent.name}</h3>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          active
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {active ? (
                            <>
                              <Activity className="w-3 h-3" />
                              Faol
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Faol emas
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 mb-2">{parent.email}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-500">Bolasi:</p>
                          <p className="text-slate-300">{parent.childName}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Tekshirish tezligi:</p>
                          <p className="text-slate-300">{parent.checkFrequency}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-slate-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{timeSince}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-400">
            Ota-onalar topilmadi
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm">
        <p className="font-semibold mb-1">ℹ️ Faollik Holati</p>
        <p>Ota-onalar 24 soat ichida platformaga kira olmasa, ular faol bo'lmagan deb hisoblanadi.</p>
      </div>
    </div>
  );
}
