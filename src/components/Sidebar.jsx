import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FileText,
  ShoppingBag,
  Trophy,
  Gamepad2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Coins,
  Star,
  Zap,
  User,
  Bell,
} from 'lucide-react';

const menuItems = [
  { key: 'dashboard', label: 'Bosh sahifa', icon: Home },
  { key: 'homeworks', label: 'Vazifalar', icon: FileText, badge: 3 },
  { key: 'games', label: 'Mini O\'yinlar', icon: Gamepad2, badge: 'Yangi' },
  { key: 'shop', label: 'Premium Shop', icon: ShoppingBag },
  { key: 'rating', label: 'Reyting', icon: Trophy },
  { key: 'settings', label: 'Sozlamalar', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, user, onLogout, collapsed, setCollapsed }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <motion.aside
      initial="expanded"
      animate={collapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, rgba(15, 15, 30, 0.98) 0%, rgba(20, 20, 40, 0.98) 100%)',
        borderRight: '1px solid rgba(139, 92, 246, 0.2)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-xl font-bold gradient-text">Mars IT</h1>
                <p className="text-xs text-slate-400">Homework Control</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/5">
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {user?.level || 8}
            </motion.div>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Student'}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-400">{user?.coins || 450}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-300">{user?.totalScore || 2150}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <motion.button
              key={item.key}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => setActiveTab(item.key)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Hover effect */}
              {hoveredItem === item.key && !isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-xl bg-white/5"
                />
              )}

              <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
                  : 'bg-slate-800/50 group-hover:bg-slate-700/50'
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="relative z-10 font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Badge */}
              {item.badge && !collapsed && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`relative z-10 ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
                    typeof item.badge === 'string' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {item.badge}
                </motion.span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && hoveredItem === item.key && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 whitespace-nowrap z-50"
                >
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {/* Notification button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <div className="relative w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">
              2
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Bildirishnomalar
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Logout button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Chiqish
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </motion.button>
    </motion.aside>
  );
}
