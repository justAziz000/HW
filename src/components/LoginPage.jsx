import { useState } from 'react';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser, savePassword, getPassword } from './auth';
import { addStudent } from './store';
import { ThemeToggleButton, useTheme } from './ThemeProvider';

export function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const { isDark } = useTheme();

  const mockUsers = [
    { id: '1', email: 'teacher@mars.uz', password: 'teacher', name: 'Sardor Rashidov', role: 'teacher' },
    { id: '2', email: 'student@mars.uz', password: 'student', name: 'Aziz Karimov', role: 'student', groupId: 'nF-2941' },
    { id: '3', email: 'parent@mars.uz', password: 'parent', name: 'Nodira Karimova', role: 'parent' },
    { id: '4', email: 'admin@mars.uz', password: 'admin', name: 'Admin User', role: 'admin' },
  ];

  const groups = ['nF-2941', 'nF-2506', 'nF-2996'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // Ro'yxatdan o'tish
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'student',
        groupId: selectedGroup,
        totalScore: 0
      };
      
      // Parolni localStorage ga saqlash
      savePassword(email, password);
      
      // O'quvchini store.js ga qo'shish (teacher panelida ko'rinishi uchun)
      addStudent(newUser);
      
      // Foydalanuvchini login qilish
      loginUser(newUser);
      onLogin?.(newUser);
    } else {
      // Kirish
      // Avval mockUsers dan tekshirish
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      if (mockUser) {
        loginUser(mockUser);
        onLogin?.(mockUser);
      } else {
        // Agar mockUsers da topilmasa, localStorage dan tekshirish
        const savedPassword = getPassword(email);
        if (savedPassword && savedPassword === password) {
          // localStorage dan foydalanuvchi ma'lumotlarini olish
          try {
            const studentsData = localStorage.getItem('mars-students');
            const students = studentsData ? JSON.parse(studentsData) : [];
            const user = students.find(u => u.email === email && u.role === 'student');
            if (user) {
              loginUser(user);
              onLogin?.(user);
            } else {
              alert('Email yoki parol noto\'g\'ri!');
            }
          } catch (error) {
            console.error('Error reading students from localStorage:', error);
            alert('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
          }
        } else {
          alert('Email yoki parol noto\'g\'ri!');
        }
      }
    }
  };

  const handleFillDemo = (role) => {
    const acc = mockUsers.find(u => u.role === role);
    if (acc) {
      setIsSignup(false);
      setEmail(acc.email);
      setPassword(acc.password);
    }
  };

  return (
    <div className={`${isDark ? 'bg-slate-950 text-slate-50' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-900'} min-h-screen flex items-center justify-center relative overflow-hidden p-6`}>
      {/* floating gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -top-32 -left-20 w-96 h-96 ${isDark ? 'bg-blue-500/20' : 'bg-blue-400/30'} blur-3xl`} />
        <div className={`absolute -bottom-24 -right-10 w-80 h-80 ${isDark ? 'bg-purple-500/25' : 'bg-purple-400/30'} blur-3xl`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={`w-full max-w-lg relative ${isDark ? 'bg-slate-900/70 border border-slate-800 text-slate-50' : 'bg-white/95 border border-slate-200/80 text-slate-900 shadow-2xl'} backdrop-blur-2xl rounded-3xl p-10`}
      >
        {/* theme toggle */}
        <ThemeToggleButton className="absolute top-5 right-5" />

        <div className="text-center mb-8 space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>Homework Control</h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Uyga vazifalarni boshqarish va monitoring</p>
        </div>

        

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Ism Familya"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-400' : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition`}
              />
              <div className="relative">
                <select
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900/60 text-slate-50' : 'border-slate-300 bg-white text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none transition`}
                >
                  <option value="">Guruhni tanlang</option>
                  {groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <span className={`pointer-events-none absolute inset-y-0 right-4 flex items-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>▼</span>
              </div>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-400' : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition`}
          />
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-400' : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition`}
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition"
          >
            {isSignup ? "Ro'yxatdan o'tish" : "Kirish"}
          </motion.button>
        </form>

        <div className={`mt-7 p-4 rounded-2xl border ${isDark ? 'border-slate-700/60 bg-slate-900/50' : 'border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/50'} text-sm`}>
          <p className={`font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Demo akkauntlar:</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleFillDemo('teacher')} className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-400 text-slate-200' : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md text-slate-800'} border transition-all duration-200 text-left`}>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>O'qituvchi</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>teacher@mars.uz / teacher</p>
            </button>
            <button type="button" onClick={() => handleFillDemo('student')} className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-400 text-slate-200' : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md text-slate-800'} border transition-all duration-200 text-left`}>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>O'quvchi</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>student@mars.uz / student</p>
            </button>
            <button type="button" onClick={() => handleFillDemo('parent')} className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-400 text-slate-200' : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md text-slate-800'} border transition-all duration-200 text-left`}>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Ota-ona</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>parent@mars.uz / parent</p>
            </button>
            <button type="button" onClick={() => handleFillDemo('admin')} className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-400 text-slate-200' : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md text-slate-800'} border transition-all duration-200 text-left`}>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Admin</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>admin@mars.uz / admin</p>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}