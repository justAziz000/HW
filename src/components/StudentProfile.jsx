import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Key, Save, Camera, Award, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { savePassword } from './auth';

export function StudentProfile({ user, onUpdateUser }) {
  const [name, setName] = useState(user.name?.split(' ')[0] || '');
  const [surname, setSurname] = useState(user.name?.split(' ')[1] || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(user.avatar || '👨‍💻');

  const avatars = ['👨‍💻', '👩‍💻', '🚀', '🐱', '🦄', '🦁', '🤖', '⚡️'];

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Parollar mos kelmadi');
      return;
    }

    // Update name
    const fullName = `${name} ${surname}`.trim();

    // In a real app, this would be an API call
    // Here we simulate updating the local user
    const updatedUser = { ...user, name: fullName, avatar };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    // Save password if changed
    if (newPassword) {
      savePassword(user.email || user.username, newPassword);
      toast.success('Parol o\'zgartirildi');
    }

    toast.success('Profil yangilandi');
  };

  return (
    <div className="max-w-4xl mx-auto text-slate-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <User className="w-8 h-8 text-blue-500" />
        Mening Profilim
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Stats */}
        <div className="col-span-1 space-y-6">
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl text-center"
            whileHover={{ y: -5 }}
          >
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 text-6xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 rounded-full border-4 border-white dark:border-slate-600 shadow-lg">
                {avatar}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold mb-1">{name} {surname}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">O'quvchi</p>

            <div className="flex justify-center gap-2 mb-4">
              {avatars.map(a => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ${avatar === a ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6" />
              <span className="font-semibold opacity-90">Coinlar</span>
            </div>
            <p className="text-3xl font-bold">{user.coins || 0}</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold opacity-90">Topshirilgan vazifalar</span>
            </div>
            <p className="text-3xl font-bold">{user.completedTasks || 0}</p>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              Shaxsiy ma'lumotlar
            </h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Ism</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition outline-none"
                    placeholder="Ismingiz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Familiya</label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition outline-none"
                    placeholder="Familiyangiz"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-slate-400" />
                  Xavfsizlik
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Yangi parol</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Parolni tasdiqlash</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition"
                >
                  <Save className="w-5 h-5" />
                  Saqlash
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
