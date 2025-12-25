import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { savePassword } from './auth';

export function AdminPasswordManagement({ students = [], teachers = [], parents = [] }) {
  const [showPanel, setShowPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState('student');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const users = userType === 'student' ? students : userType === 'teacher' ? teachers : parents;
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    const password = Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    return password;
  };

  const handleSetPassword = (user) => {
    const password = newPassword || generatePassword();
    savePassword(user.email, password);
    setNewPassword(password);
    setSelectedUser(user);
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    setCopiedId(selectedUser?.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition mb-6 shadow-lg"
      >
        <Lock className="w-5 h-5" />
        Parol Boshqarish
      </motion.button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-xl"
          >
            <div className="space-y-4">
              {/* User Type Selector */}
              <div className="flex gap-2 flex-wrap">
                {['student', 'teacher', 'parent'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setUserType(type);
                      setSelectedUser(null);
                      setNewPassword('');
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      userType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {type === 'student' ? "O'quvchilar" : type === 'teacher' ? "O'qituvchilar" : 'Ota-Onalar'}
                  </button>
                ))}
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Ism yoki email bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Users List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/80 transition">
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setNewPassword('');
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                      >
                        Parol O'zgart
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4">Foydalanuvchi topilmadi</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Setting Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Password Display */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-sm text-slate-300 mb-2">Yangi Parol:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white font-mono text-sm break-all">
                      {showPassword ? newPassword : '•'.repeat(newPassword.length)}
                    </div>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-slate-700 rounded transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const pwd = generatePassword();
                      setNewPassword(pwd);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Yaratish
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCopyPassword(newPassword)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedId === selectedUser.id ? 'Nusxalandi!' : 'Nusxa'}
                  </motion.button>
                </div>

                {/* Save and Close */}
                <div className="flex gap-2 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      handleSetPassword(selectedUser);
                      setTimeout(() => setSelectedUser(null), 1000);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    Saqlash
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
