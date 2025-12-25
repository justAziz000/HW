import { useState, useEffect } from 'react';
import { LogOut, User, MessageSquare, ShoppingBag, Bell, X } from 'lucide-react';
import { students, submissions, homeworks, groups } from '../data/mockData';
import { ThemeToggleButton } from './ThemeProvider';
import { getParentNotifications, markParentNotificationRead } from './store1';

function NotificationsSection({ studentId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const update = () => {
      setNotifications(getParentNotifications(studentId).filter(n => !n.read));
    };
    update();
    window.addEventListener('parent-notification-added', update);
    window.addEventListener('parent-notification-updated', update);
    return () => {
      window.removeEventListener('parent-notification-added', update);
      window.removeEventListener('parent-notification-updated', update);
    };
  }, [studentId]);

  if (notifications.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      {notifications.map(notif => (
        <div key={notif.id} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-4 rounded-xl flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-200">Diqqat!</p>
              <p className="text-red-700 dark:text-red-300">{notif.message}</p>
              <p className="text-xs text-red-500 mt-1">{new Date(notif.date).toLocaleString('uz-UZ')}</p>
            </div>
          </div>
          <button
            onClick={() => markParentNotificationRead(studentId, notif.id)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-lg text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ParentDashboard({ user, onLogout }) {
  const studentId = '2';
  const student = students.find(s => s.id === studentId);
  const studentSubmissions = submissions.filter(s => s.studentId === studentId);
  const studentGroup = groups.find(g => g.id === student?.groupId);

  const weeklyTopics = [
    'Flexbox + Grid mini loyihasi',
    'Responsive navbar amaliyoti',
    'Landing sahifa uchun copywriting',
    'React komponentlar takrorlash',
  ];

  if (!student) {
    return <div>Student not found</div>;
  }

  const groupStudents = students.filter(s => s.groupId === student.groupId);
  const sortedGroupStudents = [...groupStudents].sort((a, b) => b.totalScore - a.totalScore);
  const groupRank = sortedGroupStudents.findIndex(s => s.id === studentId) + 1;

  const allStudents = [...students].sort((a, b) => b.totalScore - a.totalScore);
  const globalRank = allStudents.findIndex(s => s.id === studentId) + 1;

  const completedCount = studentSubmissions.filter(s => s.status === 'checked').length;
  const pendingCount = studentSubmissions.filter(s => s.status === 'submitted' || s.status === 'checking').length;
  const redoCount = studentSubmissions.filter(s => s.status === 'redo').length;
  const notSubmittedCount = homeworks.length - studentSubmissions.length;

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-blue-100 text-blue-800',
      checking: 'bg-yellow-100 text-yellow-800',
      redo: 'bg-orange-100 text-orange-800',
      checked: 'bg-green-100 text-green-800',
    };

    const labels = {
      submitted: 'Yuborilgan',
      checking: 'Tekshirilmoqda',
      redo: 'Qayta ishlash',
      checked: 'Tekshirildi',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/70 shadow-sm border-b border-slate-200/70 dark:border-slate-800/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-blue-600 dark:text-blue-300 font-semibold">Homework Control</h1>
            <p className="text-gray-600 dark:text-slate-300">Ota-ona paneli</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <div className="text-right">
              <p className="text-gray-900 dark:text-slate-50">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-slate-300">Ota-ona</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Notifications Section */}
        <NotificationsSection studentId={studentId} />

        {/* Student Info */}
        <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="mb-1">{student.name}</h2>
              <p className="opacity-90">Guruh: {student.groupId}</p>
            </div>
          </div>
        </div>

        {/* Schedule + Behavior */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-blue-100 dark:border-slate-800">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Dars jadvali</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-300 mb-1">{studentGroup?.name || student.groupId}</p>
            <p className="text-gray-700 dark:text-slate-200">{studentGroup?.schedule}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{studentGroup?.days}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-green-100 dark:border-emerald-500/30">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Haftalik mavzular</p>
            <ul className="text-gray-700 dark:text-slate-200 space-y-1">
              {weeklyTopics.map(topic => (
                <li key={topic}>• {topic}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-orange-500/30">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Kuzatuv</p>
            <p className="text-gray-800 dark:text-slate-100">Darslarda faolligi: <span className="font-semibold text-orange-600">yaxshi</span></p>
            <p className="text-gray-800 dark:text-slate-100">Uy vazifalari: <span className="font-semibold text-orange-600">{completedCount}/{homeworks.length}</span></p>
            <p className="text-gray-800 dark:text-slate-100">Ertapisharlik: <span className="font-semibold text-orange-600">98%</span></p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <p className="text-gray-600 dark:text-slate-400 mb-2">Jami ball</p>
            <p className="text-3xl text-blue-600 mb-1">{student.totalScore}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">ball</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <p className="text-gray-600 dark:text-slate-400 mb-2">Guruhda o&apos;rin</p>
            <p className="text-3xl text-green-600 mb-1">#{groupRank}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{groupStudents.length} ta ichida</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <p className="text-gray-600 dark:text-slate-400 mb-2">Umumiy o&apos;rin</p>
            <p className="text-3xl text-purple-600 mb-1">#{globalRank}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{students.length} ta ichida</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <p className="text-gray-600 dark:text-slate-400 mb-2">Bajarilgan</p>
            <p className="text-3xl text-orange-600 mb-1">{completedCount}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{homeworks.length} ta dan</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-emerald-500/10 border border-green-200 dark:border-emerald-500/40 rounded-xl p-4">
            <p className="text-green-800 dark:text-emerald-200 mb-1">Tekshirildi</p>
            <p className="text-2xl text-green-600 dark:text-emerald-200">{completedCount}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-amber-500/10 border border-yellow-200 dark:border-amber-500/40 rounded-xl p-4">
            <p className="text-yellow-800 dark:text-amber-200 mb-1">Kutilmoqda</p>
            <p className="text-2xl text-yellow-600 dark:text-amber-200">{pendingCount}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/40 rounded-xl p-4">
            <p className="text-orange-800 dark:text-orange-200 mb-1">Qayta ishlash</p>
            <p className="text-2xl text-orange-600 dark:text-orange-200">{redoCount}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/40 rounded-xl p-4">
            <p className="text-red-800 dark:text-red-200 mb-1">Topshirmagan</p>
            <p className="text-2xl text-red-600 dark:text-red-200">{notSubmittedCount}</p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="text-gray-900 dark:text-slate-100 mb-6">Vazifalar tarixi</h3>

          {studentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {studentSubmissions.map(submission => {
                const homework = homeworks.find(
                  h => h.id === submission.homeworkId || h.lessonNumber === submission.homeworkId || h.lesson === submission.homeworkId
                );

                return (
                  <div key={submission.id} className="border border-gray-200 dark:border-slate-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {submission.homeworkId}-dars
                          </span>
                          {getStatusBadge(submission.status)}
                        </div>
                        <h4 className="text-gray-900 dark:text-slate-100 mb-1">
                          {homework ? homework.title : 'Vazifa'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Yuborilgan: {new Date(submission.submittedAt).toLocaleString('uz-UZ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Ball</p>
                        <p className={`text-2xl ${submission.status === 'checked' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                          {submission.score}
                        </p>
                      </div>
                    </div>

                    {submission.comment && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-600 dark:text-slate-300 mt-1" />
                          <div>
                            <p className="text-sm text-gray-700 dark:text-slate-200 mb-1">O&apos;qituvchi izohi:</p>
                            <p className="text-sm text-gray-600 dark:text-slate-300 italic">&quot;{submission.comment}&quot;</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-300 text-center py-8">Hali vazifa topshirilmagan</p>
          )}
        </div>

        {/* Shop History */}
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            Xaridlar tarixi
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                <tr>
                  <th className="p-3 rounded-l-lg">Mahsulot</th>
                  <th className="p-3">Narxi</th>
                  <th className="p-3 rounded-r-lg">Sana</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-200">
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-medium">Sticker Pack "Mars"</td>
                  <td className="p-3 text-yellow-600 font-bold">50 coins</td>
                  <td className="p-3 text-slate-500 text-sm">12.12.2024</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-medium">1 soatlik CyberArena</td>
                  <td className="p-3 text-yellow-600 font-bold">150 coins</td>
                  <td className="p-3 text-slate-500 text-sm">10.12.2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/40 rounded-xl p-6">
          <h3 className="text-blue-900 dark:text-blue-100 mb-4">Tavsiyalar</h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-100">
            {notSubmittedCount > 0 && (
              <li>• {notSubmittedCount} ta vazifa topshirilmagan - farzandingiz bilan suhbatlashing</li>
            )}
            {redoCount > 0 && (
              <li>• {redoCount} ta vazifani qayta ishlash kerak</li>
            )}
            {groupRank <= 5 && (
              <li>• 🎉 Farzandingiz Top 5 da! Davom eting!</li>
            )}
            {groupRank > 5 && (
              <li>• Ko&apos;proq mashq qilish tavsiya etiladi</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
