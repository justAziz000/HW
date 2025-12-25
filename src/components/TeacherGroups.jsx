'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, User, Download, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { awardCoins, getStudents, getGroups } from './store1';

const months = [
  'July.25', 'August.25', 'September.25', 'October.25',
  'November.25', 'December.25', 'January.26', 'February.26',
  'March.26', 'April.26', 'May.26', 'June.26'
];

const days = ['01.12', '03.12', '05.12', '08.12', '10.12', '12.12', '15.12', '17.12', '19.12', '22.12', '24.12', '26.12', '29.12', '31.12'];

export default function AttendanceTable() {
  // Store.js dan groups va students olish
  const allGroups = getGroups() || [];
  const [selectedGroup, setSelectedGroup] = useState(allGroups[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState('December.25');
  const [students, setStudents] = useState([]);

  // Store.js dan o'quvchilarni yuklash va selectedGroup bo'yicha filter qilish
  useEffect(() => {
    const loadStudents = () => {
      const savedStudents = getStudents();
      
      // Faqat student role ga ega va tanlangan guruhga tegishli o'quvchilarni olish
      const filteredStudents = savedStudents
        .filter(s => {
          // role mavjud bo'lsa 'student' bo'lishi kerak, aks holda hamma o'quvchilar
          const isStudent = !s.role || s.role === 'student';
          return isStudent && s.groupId === selectedGroup;
        })
        .map(s => {
          // Attendance ni localStorage dan yuklash
          const saved = localStorage.getItem(`attendance_${selectedGroup}_${selectedMonth}`);
          let attendance = Array(days.length + 1).fill('');
          let late = 0;
          let coins = s.coins || s.totalScore || 0;
          
          if (saved) {
            try {
              const savedAttendance = JSON.parse(saved);
              const savedStudent = savedAttendance.find(
                sa => sa.id === s.id || sa.name === s.name
              );
              if (savedStudent) {
                attendance = savedStudent.attendance || Array(days.length + 1).fill('');
                late = savedStudent.late || 0;
                coins = savedStudent.coins || coins;
              }
            } catch (e) {
              console.error('Error loading attendance:', e);
            }
          }
          
          return {
            ...s,
            id: s.id || Date.now().toString(),
            name: s.name,
            late: late,
            coins: coins,
            photo: 'default',
            attendance: attendance
          };
        });
      
      setStudents(filteredStudents);
    };
    
    if (selectedGroup) {
      loadStudents();
    }
    
    // Store yangilanganda qayta yuklash
    const handleUpdate = () => {
      if (selectedGroup) {
        loadStudents();
      }
    };
    window.addEventListener('students-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('students-updated', handleUpdate);
    };
  }, [selectedGroup, selectedMonth]);

  // Сохраняем при любом изменении
  useEffect(() => {
    if (students.some(s => s.attendance)) {
      localStorage.setItem(`attendance_${selectedGroup}_${selectedMonth}`, JSON.stringify(students));
    }
  }, [students, selectedGroup, selectedMonth]);

  const toggleAttendance = (studentId, dayIndex) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const current = student.attendance[dayIndex];
        
        // Agar allaqachon "present" belgilangan bo'lsa, keyingi kuni belgilash mumkin emas
        // Lekin hozirgi kuni o'zgartirish mumkin (present -> absent -> '')
        if (current === 'present') {
          // Faqat absent yoki bo'sh qilish mumkin, lekin keyingi kunga ta'sir qilmaydi
          const next = 'absent';
          const newAttendance = [...student.attendance];
          newAttendance[dayIndex] = next;
          return { ...student, attendance: newAttendance };
        }
        
        // Agar "present" belgilamoqchi bo'lsak, oldingi kun "present" bo'lsa, belgilash mumkin emas
        if (dayIndex > 0 && student.attendance[dayIndex - 1] === 'present') {
          alert("Oldingi kun allaqachon belgilangan. Keyingi kuni belgilash mumkin emas.");
          return student;
        }
        
          // Oddiy toggle: '' -> 'present' -> 'absent' -> ''
        const next = current === '' ? 'present' : current === 'absent' ? '' : 'absent';
        const newAttendance = [...student.attendance];
        newAttendance[dayIndex] = next;
        return { ...student, attendance: newAttendance };
      }
      return student;
    }));
  };

  const getCellContent = (status) => {
    if (status === 'present') return <Check className="w-5 h-5 text-green-700" />;
    if (status === 'absent')  return <X className="w-5 h-5 text-red-700" />;
    return <span className="text-gray-400">−</span>;
  };

  const handleAwardCoins = (studentId, name) => {
    const input = prompt(`${name} uchun nechta coin beramiz?`, '50');
    const amount = Number(input);
    if (!input || Number.isNaN(amount) || amount <= 0) return;
    awardCoins(studentId, amount, 'Teacher award');
    alert(`${name} ga ${amount} coin berildi!`);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Groups */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 shadow-sm sticky top-0 z-30 transition-colors">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Guruhlar</h2>
            <div className="flex flex-wrap gap-3 overflow-x-auto">
              {allGroups.map((g, index) => (
                <motion.button
                  key={g.id}
                  onClick={() => setSelectedGroup(g.id)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                    selectedGroup === g.id
                      ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 dark:shadow-purple-500/50'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                  }`}
                >
                  {g.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Months */}
          <div className="flex gap-3 flex-wrap mb-6">
            {months.map((m, index) => (
              <motion.button
                key={m}
                onClick={() => setSelectedMonth(m)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedMonth === m
                    ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50'
                    : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-orange-300 dark:hover:border-orange-600'
                }`}
              >
                {m}
              </motion.button>
            ))}
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800 transition-colors"
          >
            <table className="w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 sticky top-0 z-10 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="text-left p-4 font-bold text-gray-900 dark:text-slate-100 w-80">O'quvchilar ro'yxati</th>
                  {days.map(d => <th key={d} className="p-3 text-sm text-gray-700 dark:text-slate-300">{d}</th>)}
                  <th className="p-3 text-sm text-gray-700 dark:text-slate-300">Bugun</th>
                  <th className="p-3 text-sm text-gray-700 dark:text-slate-300">Umumiy</th>
                  <th className="p-3 w-48 text-gray-700 dark:text-slate-300">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/50 dark:bg-slate-800/50'} hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-slate-800`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-md"
                        >
                          <User className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-slate-100">{student.name}</div>
                        </div>
                      </div>
                    </td>

                    {student.attendance?.slice(0, days.length).map((status, i) => (
                      <td key={i} className="text-center">
                        <motion.button
                          onClick={() => toggleAttendance(student.id, i)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 mx-auto
                            ${status === 'present' ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-300 dark:border-green-700' : ''}
                            ${status === 'absent' ? 'bg-red-100 dark:bg-red-900/50 border-2 border-red-300 dark:border-red-700' : ''}
                            ${status === '' ? 'hover:bg-gray-100 dark:hover:bg-slate-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-slate-600' : ''}
                          `}
                        >
                          {getCellContent(status)}
                        </motion.button>
                      </td>
                    ))}

                    {/* Today column */}
                    <td className="text-center">
                      <motion.button
                        onClick={() => toggleAttendance(student.id, days.length)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 mx-auto
                          ${student.attendance?.[days.length] === 'present' ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-300 dark:border-green-700' : ''}
                          ${student.attendance?.[days.length] === 'absent' ? 'bg-red-100 dark:bg-red-900/50 border-2 border-red-300 dark:border-red-700' : ''}
                          ${!student.attendance?.[days.length] ? 'hover:bg-gray-100 dark:hover:bg-slate-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-slate-600' : ''}
                        `}
                      >
                        {getCellContent(student.attendance?.[days.length] || '')}
                      </motion.button>
                    </td>

                    {/* General stats */}
                    <td className="text-center text-sm font-medium">
                      {student.late > 0 && (
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 rounded-full font-semibold">
                          Late: {student.late}
                        </span>
                      )}
                    </td>

                    {/* Coins + buttons */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg border border-yellow-300 dark:border-yellow-700"
                        >
                          <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          <span className="font-bold text-lg text-yellow-700 dark:text-yellow-400">{student.coins}</span>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAwardCoins(student.id, student.name)}
                          className="bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition"
                        >
                          Coin berish
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </>
  );
}