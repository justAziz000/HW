// src/App.tsx
import { useEffect, useState } from "react";
import { getUser, logoutUser, updateSessionTime, isSessionValid, forceLogout } from "./components/auth";
import { LoginPage } from "./components/LoginPage";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { ParentDashboard } from "./components/ParentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { ThemeProvider, ThemeToggleButton, useTheme } from "./components/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnnouncementSwiper } from "./components/AnnouncementSwiper";
import { Coins } from "lucide-react";

// -------------------- Modals --------------------
function SessionTimeoutModal({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏰</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sessiya tugadi</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Xavfsizlik uchun siz 1 soat faoliyatsiz qoldingiz. Iltimos, qayta kiring.
          </p>
          <button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition duration-200"
          >
            Qayta kirish
          </button>
        </div>
      </div>
    </div>
  );
}

function CoinNotificationModal({ gained, onClose }: { gained: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-3xl border-2 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)] text-center max-w-sm mx-4 animate-in zoom-in slide-in-from-bottom-10">
        <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-yellow-500/50">
          <Coins className="w-12 h-12 text-yellow-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">TABRIKLAYMIZ!</h2>
        <p className="text-slate-300 mb-6 text-lg">
          Siz <span className="text-yellow-400 font-bold text-2xl">+{gained}</span> coin oldingiz!
        </p>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95"
        >
          Ajoyib!
        </button>
      </div>
    </div>
  );
}

function FirstTimeGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="aspect-video bg-black flex items-center justify-center">
          <div className="text-center text-white p-10">
            <h3 className="text-2xl font-bold mb-4">Platformadan foydalanish bo'yicha qo'llanma</h3>
            <p className="opacity-70">Video player bu yerda bo'ladi...</p>
          </div>
        </div>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Xush kelibsiz!</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-lg mx-auto">
            Platformamizdan samarali foydalanish uchun qisqa videodarslikni ko'rib chiqing.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition"
          >
            Tushundim, boshlash!
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- App Shell --------------------
function AppShell() {
  const { theme } = useTheme();
  const user = getUser();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [coinsGained, setCoinsGained] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Session check interval
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        setShowSessionModal(true);
      }
    }, 30000);

    // Track user activity
    const trackActivity = () => updateSessionTime();
    window.addEventListener("mousedown", trackActivity);
    window.addEventListener("keydown", trackActivity);
    window.addEventListener("scroll", trackActivity);
    window.addEventListener("touchstart", trackActivity);

    // Coins logic
    const lastCoinsKey = `last_coins_${user.id}`;
    const lastCoins = localStorage.getItem(lastCoinsKey);
    const currentCoins = user.coins || 0;
    if (lastCoins !== null) {
      const diff = currentCoins - Number(lastCoins);
      if (diff > 0) {
        setCoinsGained(diff);
        setShowCoinModal(true);
      }
    }
    localStorage.setItem(lastCoinsKey, currentCoins.toString());

    // First time guide
    const guideKey = `guide_seen_${user.id}`;
    if (!localStorage.getItem(guideKey)) setShowGuide(true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousedown", trackActivity);
      window.removeEventListener("keydown", trackActivity);
      window.removeEventListener("scroll", trackActivity);
      window.removeEventListener("touchstart", trackActivity);
    };
  }, [user]);

  const handleCloseGuide = () => {
    if (user) localStorage.setItem(`guide_seen_${user.id}`, "true");
    setShowGuide(false);
  };

  const handleCloseCoinModal = () => setShowCoinModal(false);

  if (!user) return <LoginPage onLogin={() => window.location.reload()} />;
  if (showSessionModal) return <SessionTimeoutModal onLogout={() => forceLogout("Session timeout")} />;

  const Dashboard =
    user.role === "teacher"
      ? TeacherDashboard
      : user.role === "student"
      ? StudentDashboard
      : user.role === "parent"
      ? ParentDashboard
      : user.role === "admin"
      ? AdminDashboard
      : TeacherDashboard;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      {showCoinModal && <CoinNotificationModal gained={coinsGained} onClose={handleCloseCoinModal} />}
      {showGuide && <FirstTimeGuide onClose={handleCloseGuide} />}

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/70 shadow-sm">
        <AnnouncementSwiper />
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
              HC
            </div>
            <div>
              <h1 className="text-xl font-semibold hidden sm:block">Homework Control</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <div className="text-right hidden sm:block">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">ID: {user.id}</p>
            </div>
            <button
              onClick={logoutUser}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-sm transition"
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <Dashboard user={user} onLogout={logoutUser} />
      </main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick draggable pauseOnHover theme={theme} />
    </div>
  );
}

// -------------------- Main App --------------------
export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
