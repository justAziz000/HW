import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    FileText,
    Gamepad2,
    ShoppingBag,
    Trophy,
    Code,
    Settings,
    LogOut,
    Menu,
    X,
    Coins,
    Star,
    ChevronRight,
} from 'lucide-react';

export function ITSidebar({ activeTab, onTabChange, onLogout, user }) {
    const [isOpen, setIsOpen] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);

    const menuItems = [
        {
            id: 'lessons',
            label: 'Darslar',
            icon: Code,
            description: 'Video darslar va materiallar',
        },
        {
            id: 'homeworks',
            label: 'Vazifalar',
            icon: FileText,
            description: 'Uy vazifalari',
        },
        {
            id: 'games',
            label: 'Mini O\'yinlar',
            icon: Gamepad2,
            description: 'Coin yig\'ish',
        },
        {
            id: 'shop',
            label: 'Shop',
            icon: ShoppingBag,
            description: 'Sovg\'alar',
        },
        {
            id: 'rating',
            label: 'Reyting',
            icon: Trophy,
            description: 'Top o\'quvchilar',
        },
    ];

    const bottomItems = [
        {
            id: 'profile',
            label: 'Profil',
            icon: Settings, // Using Settings icon for Profile as per common pattern, or could use User icon
        },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 left-6 z-50 md:hidden p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-2xl"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>

            {/* Sidebar */}
            <AnimatePresence>
                {(isOpen || window.innerWidth >= 768) && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 h-screen w-80 z-40 overflow-hidden shadow-2xl"
                    >
                        {/* Background - Clean Black/Dark Gray Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#0f0f0f] transition-colors duration-500" />

                        {/* Subtle Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }} />
                        </div>

                        {/* Right border */}
                        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />

                        {/* Content */}
                        <div className="relative h-full flex flex-col p-6">
                            {/* Logo & Welcome */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center shadow-lg">
                                        <Code className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">
                                            IT Academy
                                        </h1>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Dasturlashni o'rgan</p>
                                    </div>
                                </div>

                                {/* User Card - Clean Style */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center font-black text-white text-lg shadow-md">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{user?.name || 'User'}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.groupName || 'NF-2941'}</p>
                                        </div>
                                    </div>

                                    {/* Stats - Clean */}
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Coins className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{user?.coins || 0}</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Top {user?.rank || 3}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Main Menu - Clean */}
                            <nav className="flex-1 space-y-2">
                                {menuItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    const isHovered = hoveredItem === item.id;

                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => onTabChange(item.id)}
                                            onMouseEnter={() => setHoveredItem(item.id)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            className="relative w-full group"
                                        >
                                            {/* Active/Hover background */}
                                            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${isActive
                                                ? 'bg-slate-800 dark:bg-slate-700 shadow-lg'
                                                : isHovered
                                                    ? 'bg-slate-100 dark:bg-slate-800/50'
                                                    : ''
                                                }`} />

                                            {/* White border on hover/active */}
                                            <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${isHovered || isActive
                                                ? 'border-slate-300 dark:border-slate-600'
                                                : 'border-transparent'
                                                }`} />

                                            {/* Content */}
                                            <div className={`relative flex items-center gap-3 p-4 rounded-2xl transition-all ${isActive
                                                ? 'text-white'
                                                : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                <div className={`p-2 rounded-xl transition-all ${isActive
                                                    ? 'bg-white/10'
                                                    : 'bg-slate-200 dark:bg-slate-700'
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>

                                                <div className="flex-1 text-left">
                                                    <p className="font-bold text-sm">{item.label}</p>
                                                    <p className="text-xs opacity-60">{item.description}</p>
                                                </div>

                                                {isActive && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="p-1 rounded-lg bg-white/10"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </nav>

                            {/* Bottom Section */}
                            <div className="space-y-2 pt-6 border-t border-slate-200 dark:border-slate-700">
                                {bottomItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </motion.button>
                                    );
                                })}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-red-200 dark:border-red-500/20"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Chiqish</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile */}
            {isOpen && window.innerWidth < 768 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                />
            )}
        </>
    );
}
