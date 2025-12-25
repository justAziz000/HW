import React, { useState, useEffect } from "react";
import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  getGroups,
  addGroup,
  deleteGroup,
  generatePassword,
  setUserPassword,
  getUserPassword,
  addCoinsWithNotification,
  setStudentCoins,
  changeStudentGroup,
} from "./store1";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  UserPlus,
  Trash2,
  Crown,
  GraduationCap,
  Users,
  TrendingUp,
  Moon,
  Sun,
  Palette,
  Coins,
  Edit3,
  Key,
  Mail,
  Save,
  X,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  UserCog,
  Shield,
  Sparkles,
  Plus,
  Minus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { getAllOrders, updateOrderStatus } from "./shopstore";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState(getGroups());
  const [theme, setTheme] = useState("dark");
  const [showAddForm, setShowAddForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", schedule: "", days: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("students");
  
  // Edit modal states
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Coin modal
  const [coinModal, setCoinModal] = useState({ open: false, student: null, amount: 0, mode: 'add' });
  
  // Password modal
  const [passwordModal, setPasswordModal] = useState({ open: false, student: null, password: '', showPassword: false });
  
  // Group change modal
  const [groupModal, setGroupModal] = useState({ open: false, student: null, newGroupId: '' });
  
  // Copied state
  const [copiedId, setCopiedId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    groupId: groups[0]?.id || "",
    email: "",
    password: "",
    totalScore: 0,
    coins: 0,
    isTeacher: false,
    isAdmin: false,
  });

  useEffect(() => {
    setStudents(getStudents());
    const handler = () => setStudents(getStudents());
    const groupsHandler = () => setGroups(getGroups());
    const orderHandler = () => setOrders(getAllOrders());
    window.addEventListener("students-updated", handler);
    window.addEventListener("focus", handler);
    window.addEventListener("groups-updated", groupsHandler);
    window.addEventListener("shop-orders-updated", orderHandler);
    setOrders(getAllOrders());
    return () => {
      window.removeEventListener("students-updated", handler);
      window.removeEventListener("focus", handler);
      window.removeEventListener("groups-updated", groupsHandler);
      window.removeEventListener("shop-orders-updated", orderHandler);
    };
  }, []);

  // Add new student/teacher
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Ism va email toʻldirilishi shart!");
      return;
    }
    
    const password = form.password || generatePassword();
    const email = form.email.trim().toLowerCase();
    
    addStudent({
      id: Date.now().toString(),
      name: form.name.trim(),
      groupId: form.groupId,
      email: email,
      totalScore: Number(form.totalScore) || 0,
      coins: Number(form.coins) || 0,
      role: form.isTeacher ? "teacher" : "student",
      isAdmin: form.isAdmin,
    });
    
    setUserPassword(email, password);
    
    alert(`✅ ${form.isTeacher ? "O'qituvchi" : "O'quvchi"} qo'shildi!\n\n📧 Email: ${email}\n🔐 Parol: ${password}`);
    
    setForm({
      name: "",
      groupId: groups[0]?.id || "",
      email: "",
      password: "",
      totalScore: 0,
      coins: 0,
      isTeacher: false,
      isAdmin: false,
    });
    setShowAddForm(false);
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!groupForm.name.trim()) {
      alert("Guruh nomini kiriting");
      return;
    }
    addGroup({
      name: groupForm.name.trim(),
      schedule: groupForm.schedule.trim(),
      days: groupForm.days.trim(),
    });
    setGroups(getGroups());
    setGroupForm({ name: "", schedule: "", days: "" });
    setShowAddGroup(false);
  };

  const handleDeleteGroup = (id) => {
    const studentsInGroup = students.filter(s => s.groupId === id);
    if (studentsInGroup.length > 0) {
      alert(`Bu guruhda ${studentsInGroup.length} ta o'quvchi bor. Avval ularni boshqa guruhga ko'chiring.`);
      return;
    }
    if (confirm("Guruhni o'chirmoqchimisiz?")) {
      deleteGroup(id);
      setGroups(getGroups());
    }
  };

  const handleDelete = (id) => {
    if (confirm("O'quvchini rostdan o'chirmoqchimisiz?")) {
      deleteStudent(id);
    }
  };

  const toggleRole = (student, type) => {
    if (type === "teacher") {
      updateStudent(student.id, {
        role: student.role === "teacher" ? "student" : "teacher"
      });
    } else if (type === "admin") {
      updateStudent(student.id, { isAdmin: !student.isAdmin });
    }
  };

  const handleOrderStatus = (id, status) => {
    updateOrderStatus(id, status);
    setOrders(getAllOrders());
  };

  // Edit student
  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      groupId: student.groupId,
    });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) {
      alert("Ism bo'sh bo'lmasligi kerak!");
      return;
    }
    updateStudent(editingStudent.id, {
      name: editForm.name.trim(),
      email: editForm.email.trim().toLowerCase(),
      groupId: editForm.groupId,
    });
    setEditingStudent(null);
    alert("✅ Ma'lumotlar saqlandi!");
  };

  // Coin operations
  const openCoinModal = (student, mode = 'add') => {
    setCoinModal({ open: true, student, amount: 0, mode });
  };

  const handleCoinOperation = () => {
    const amount = Number(coinModal.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("To'g'ri son kiriting!");
      return;
    }
    
    if (coinModal.mode === 'add') {
      addCoinsWithNotification(coinModal.student.id, amount, 'Admin tomonidan berildi');
      alert(`✅ ${amount} coin qo'shildi! O'quvchi keyingi kirishda xabar oladi.`);
    } else if (coinModal.mode === 'subtract') {
      const currentCoins = coinModal.student.coins || 0;
      if (amount > currentCoins) {
        alert("Coinlar yetarli emas!");
        return;
      }
      addCoinsWithNotification(coinModal.student.id, -amount);
      alert(`✅ ${amount} coin ayirildi!`);
    } else if (coinModal.mode === 'set') {
      setStudentCoins(coinModal.student.id, amount);
      alert(`✅ Coinlar ${amount} ga o'rnatildi!`);
    }
    
    setCoinModal({ open: false, student: null, amount: 0, mode: 'add' });
  };

  // Password operations
  const openPasswordModal = (student) => {
    const currentPassword = getUserPassword(student.email) || '';
    setPasswordModal({ open: true, student, password: currentPassword, showPassword: false });
  };

  const generateNewPassword = () => {
    const newPass = generatePassword();
    setPasswordModal(prev => ({ ...prev, password: newPass }));
  };

  const savePassword = () => {
    if (!passwordModal.password.trim()) {
      alert("Parol bo'sh bo'lmasligi kerak!");
      return;
    }
    setUserPassword(passwordModal.student.email, passwordModal.password);
    alert(`✅ Parol saqlandi!\n\n📧 ${passwordModal.student.email}\n🔐 ${passwordModal.password}`);
    setPasswordModal({ open: false, student: null, password: '', showPassword: false });
  };

  // Group change
  const openGroupModal = (student) => {
    setGroupModal({ open: true, student, newGroupId: student.groupId });
  };

  const saveGroupChange = () => {
    changeStudentGroup(groupModal.student.id, groupModal.newGroupId);
    const newGroup = groups.find(g => g.id === groupModal.newGroupId);
    alert(`✅ ${groupModal.student.name} endi "${newGroup?.name}" guruhida!`);
    setGroupModal({ open: false, student: null, newGroupId: '' });
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter students
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: groups.map(g => g.name),
    datasets: [{
      label: "O'quvchilar soni",
      data: groups.map(g => students.filter(s => s.groupId === g.id).length),
      backgroundColor: "rgba(139, 92, 246, 0.7)",
      borderColor: "#c4b5fd",
      borderWidth: 2,
      borderRadius: 12,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    animation: { duration: 1800, easing: "easeOutQuart" },
    plugins: {
      legend: { labels: { color: theme === "dark" ? "#e4e4e7" : "#27272a", font: { size: 14 } } },
      tooltip: { backgroundColor: "rgba(24, 24, 27, 0.9)", cornerRadius: 12 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#a1a1aa" } },
      x: { grid: { display: false }, ticks: { color: "#a1a1aa" } }
    }
  };

  const themeColors = {
    dark: "bg-zinc-950 text-zinc-100",
    light: "bg-gray-50 text-gray-900",
    purple: "bg-purple-950 text-purple-50"
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeColors[theme] || themeColors.dark}`}>
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-zinc-900/50" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-4">
              <Shield className="w-12 h-12 text-purple-400" />
              Admin Panel
            </h1>
            <p className="text-xl mt-2 opacity-80 flex items-center gap-3">
              <Users className="w-6 h-6" />
              {students.length} ta foydalanuvchi • {groups.length} ta guruh
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1">
              <button onClick={() => setTheme("dark")} className={`p-3 rounded-xl transition-all ${theme === "dark" ? "bg-purple-600 text-white" : "text-gray-400"}`}>
                <Moon className="w-5 h-5" />
              </button>
              <button onClick={() => setTheme("light")} className={`p-3 rounded-xl transition-all ${theme === "light" ? "bg-purple-600 text-white" : "text-gray-400"}`}>
                <Sun className="w-5 h-5" />
              </button>
              <button onClick={() => setTheme("purple")} className={`p-3 rounded-xl transition-all ${theme === "purple" ? "bg-purple-600 text-white" : "text-gray-400"}`}>
                <Palette className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: 'students', label: "O'quvchilar", icon: <Users className="w-5 h-5" /> },
            { key: 'groups', label: 'Guruhlar', icon: <GraduationCap className="w-5 h-5" /> },
            { key: 'stats', label: 'Statistika', icon: <TrendingUp className="w-5 h-5" /> },
            { key: 'orders', label: 'Buyurtmalar', icon: <Coins className="w-5 h-5" /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === 'orders' && orders.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 rounded-full text-xs">{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Action Buttons & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Yangi qo'shish
                </button>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Add Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <UserPlus className="w-8 h-8 text-purple-400" />
                      Yangi foydalanuvchi qo'shish
                    </h2>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Ism familiya *</label>
                        <input
                          type="text"
                          placeholder="Ism familiya"
                          className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Parol (bo'sh qoldirsa avtomatik)</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Avtomatik generatsiya"
                            className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none pr-12"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, password: generatePassword() })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg"
                          >
                            <RefreshCw className="w-5 h-5 text-purple-400" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Guruh</label>
                        <select
                          className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                          value={form.groupId}
                          onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                        >
                          {groups.map(g => (
                            <option key={g.id} value={g.id} className="bg-zinc-900">{g.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Boshlang'ich ball</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                          value={form.totalScore}
                          onChange={(e) => setForm({ ...form, totalScore: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Boshlang'ich coinlar</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                          value={form.coins}
                          onChange={(e) => setForm({ ...form, coins: e.target.value })}
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-wrap gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={form.isTeacher} 
                            onChange={e => setForm({ ...form, isTeacher: e.target.checked })} 
                            className="w-5 h-5 accent-purple-500 rounded" 
                          />
                          <span className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-400" /> O'qituvchi
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={form.isAdmin} 
                            onChange={e => setForm({ ...form, isAdmin: e.target.checked })} 
                            className="w-5 h-5 accent-purple-500 rounded" 
                          />
                          <span className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-500" /> Admin
                          </span>
                        </label>
                      </div>

                      <div className="md:col-span-2 flex gap-4 pt-4">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                          <UserPlus className="w-5 h-5" />
                          Qo'shish
                        </button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Students Table */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 text-left">
                      <th className="px-6 py-5 font-semibold">№</th>
                      <th className="px-6 py-5 font-semibold">Ism</th>
                      <th className="px-6 py-5 font-semibold">Guruh</th>
                      <th className="px-6 py-5 font-semibold">Email / Parol</th>
                      <th className="px-6 py-5 font-semibold text-yellow-400">Coinlar</th>
                      <th className="px-6 py-5 font-semibold text-purple-400">Ball</th>
                      <th className="px-6 py-5 font-semibold">Rol</th>
                      <th className="px-6 py-5 font-semibold text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, i) => {
                      const group = groups.find(g => g.id === s.groupId);
                      const password = getUserPassword(s.email);
                      return (
                        <tr key={s.id} className="border-t border-white/10 hover:bg-white/5 transition-all">
                          <td className="px-6 py-4">{i + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                                {s.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{s.name}</p>
                                {s.isAdmin && <span className="text-xs text-yellow-400 flex items-center gap-1"><Crown className="w-3 h-3" /> Admin</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openGroupModal(s)}
                              className="px-3 py-1.5 bg-purple-500/20 rounded-full text-purple-300 text-sm hover:bg-purple-500/30 transition-all flex items-center gap-1"
                            >
                              {group?.name || 'Noma\'lum'}
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-gray-400 text-sm flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {s.email}
                              </p>
                              <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-mono text-gray-500">
                                  {password ? '••••••••' : 'Yo\'q'}
                                </span>
                                <button
                                  onClick={() => openPasswordModal(s)}
                                  className="p-1 hover:bg-white/10 rounded-lg text-purple-400"
                                  title="Parolni ko'rish/o'zgartirish"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openCoinModal(s, 'add')}
                              className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 rounded-xl hover:bg-yellow-500/30 transition-all group"
                            >
                              <Coins className="w-5 h-5 text-yellow-400" />
                              <span className="text-xl font-bold text-yellow-400">{s.coins || 0}</span>
                              <Plus className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-2xl font-bold text-purple-400">{s.totalScore || 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleRole(s, "teacher")}
                              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                                s.role === "teacher" 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-white/10 hover:bg-white/20"
                              }`}
                            >
                              {s.role === "teacher" ? "O'qituvchi" : "Talaba"}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(s)}
                                className="p-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all"
                                title="Tahrirlash"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => toggleRole(s, "admin")}
                                className={`p-2 rounded-xl transition-all ${
                                  s.isAdmin 
                                    ? "bg-yellow-500/20 text-yellow-400" 
                                    : "bg-white/10 text-gray-500 hover:bg-white/20"
                                }`}
                                title="Admin huquqi"
                              >
                                <Crown className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                                title="O'chirish"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Hech qanday foydalanuvchi topilmadi</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Guruhlar boshqaruvi</h2>
              <button
                onClick={() => setShowAddGroup(!showAddGroup)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                Yangi guruh
              </button>
            </div>

            <AnimatePresence>
              {showAddGroup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8">
                    <form onSubmit={handleAddGroup} className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Guruh nomi"
                        className="px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-emerald-500 focus:outline-none"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Vaqti (masalan 18:00-20:00)"
                        className="px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-emerald-500 focus:outline-none"
                        value={groupForm.schedule}
                        onChange={(e) => setGroupForm({ ...groupForm, schedule: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Kunlari (Dush, Chor, Jum)"
                        className="px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-emerald-500 focus:outline-none"
                        value={groupForm.days}
                        onChange={(e) => setGroupForm({ ...groupForm, days: e.target.value })}
                      />
                      <div className="md:col-span-3 flex gap-4">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all">
                          Guruhni saqlash
                        </button>
                        <button type="button" onClick={() => setShowAddGroup(false)} className="px-8 py-4 bg-white/10 rounded-2xl">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(group => {
                const studentsInGroup = students.filter(s => s.groupId === group.id);
                return (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 relative group"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                    
                    {group.schedule && (
                      <p className="text-gray-400 text-sm mb-1">🕐 {group.schedule}</p>
                    )}
                    {group.days && (
                      <p className="text-gray-400 text-sm mb-4">📅 {group.days}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <span className="text-purple-400 font-bold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {studentsInGroup.length} ta o'quvchi
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <TrendingUp className="w-10 h-10 text-purple-400" />
                <h2 className="text-3xl font-bold">Guruhlar statistikasi</h2>
              </div>
              <div className="h-96">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: "Jami o'quvchilar", value: students.filter(s => s.role !== 'teacher').length, icon: <Users />, color: 'purple' },
                { label: "O'qituvchilar", value: students.filter(s => s.role === 'teacher').length, icon: <GraduationCap />, color: 'blue' },
                { label: "Guruhlar", value: groups.length, icon: <Shield />, color: 'green' },
                { label: "Jami coinlar", value: students.reduce((acc, s) => acc + (s.coins || 0), 0), icon: <Coins />, color: 'yellow' },
              ].map((stat, i) => (
                <div key={i} className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6`}>
                  <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-2xl flex items-center justify-center mb-4 text-${stat.color}-400`}>
                    {stat.icon}
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Coins className="w-8 h-8 text-yellow-400" />
              Shop buyurtmalari
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16 text-center">
                <Coins className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-500">Hozircha buyurtmalar yo'q</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-bold text-lg">{order.studentName}</p>
                      <p className="text-gray-400">
                        {order.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleString("uz-UZ")}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOrderStatus(order.id, "rejected")}
                        className="px-5 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-medium"
                      >
                        Rad etish
                      </button>
                      <button
                        onClick={() => handleOrderStatus(order.id, "approved")}
                        className="px-5 py-2.5 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 font-medium"
                      >
                        Tasdiqlash
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditingStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-purple-400" />
                Tahrirlash
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ism</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Guruh</label>
                  <select
                    value={editForm.groupId}
                    onChange={e => setEditForm({ ...editForm, groupId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.id} className="bg-zinc-900">{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Saqlash
                </button>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="px-6 py-3 bg-white/10 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Modal */}
      <AnimatePresence>
        {coinModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setCoinModal({ open: false, student: null, amount: 0, mode: 'add' })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Coins className="w-6 h-6 text-yellow-400" />
                Coin boshqaruvi
              </h3>
              <p className="text-gray-400 mb-6">{coinModal.student?.name}</p>
              
              <div className="bg-yellow-500/10 rounded-2xl p-4 mb-6 text-center">
                <p className="text-sm text-gray-400">Hozirgi balance</p>
                <p className="text-4xl font-bold text-yellow-400">{coinModal.student?.coins || 0}</p>
              </div>
              
              <div className="flex gap-2 mb-4">
                {[
                  { mode: 'add', label: 'Qo\'shish', icon: <Plus className="w-4 h-4" /> },
                  { mode: 'subtract', label: 'Ayirish', icon: <Minus className="w-4 h-4" /> },
                  { mode: 'set', label: 'O\'rnatish', icon: <Edit3 className="w-4 h-4" /> },
                ].map(btn => (
                  <button
                    key={btn.mode}
                    onClick={() => setCoinModal({ ...coinModal, mode: btn.mode })}
                    className={`flex-1 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                      coinModal.mode === btn.mode
                        ? 'bg-yellow-500 text-black'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {btn.icon}
                    {btn.label}
                  </button>
                ))}
              </div>
              
              <input
                type="number"
                placeholder="Miqdor"
                value={coinModal.amount}
                onChange={e => setCoinModal({ ...coinModal, amount: e.target.value })}
                className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-yellow-500 focus:outline-none text-center text-2xl font-bold"
              />
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCoinOperation}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 py-3 rounded-xl font-bold text-black flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Tasdiqlash
                </button>
                <button
                  onClick={() => setCoinModal({ open: false, student: null, amount: 0, mode: 'add' })}
                  className="px-6 py-3 bg-white/10 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {passwordModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPasswordModal({ open: false, student: null, password: '', showPassword: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Key className="w-6 h-6 text-purple-400" />
                Parol boshqaruvi
              </h3>
              <p className="text-gray-400 mb-6">{passwordModal.student?.email}</p>
              
              <div className="relative mb-4">
                <input
                  type={passwordModal.showPassword ? 'text' : 'password'}
                  value={passwordModal.password}
                  onChange={e => setPasswordModal({ ...passwordModal, password: e.target.value })}
                  placeholder="Yangi parol"
                  className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none pr-24 font-mono"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button
                    onClick={() => setPasswordModal({ ...passwordModal, showPassword: !passwordModal.showPassword })}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    {passwordModal.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(passwordModal.password, 'password')}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    {copiedId === 'password' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={generateNewPassword}
                className="w-full py-3 bg-white/10 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all mb-6"
              >
                <RefreshCw className="w-5 h-5" />
                Yangi parol generatsiya qilish
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={savePassword}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Saqlash
                </button>
                <button
                  onClick={() => setPasswordModal({ open: false, student: null, password: '', showPassword: false })}
                  className="px-6 py-3 bg-white/10 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Change Modal */}
      <AnimatePresence>
        {groupModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setGroupModal({ open: false, student: null, newGroupId: '' })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-6 h-6 text-green-400" />
                Guruhni almashtirish
              </h3>
              <p className="text-gray-400 mb-6">{groupModal.student?.name}</p>
              
              <div className="space-y-3 mb-6">
                {groups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGroupModal({ ...groupModal, newGroupId: g.id })}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                      groupModal.newGroupId === g.id
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-white/10 border-2 border-transparent hover:bg-white/20'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{g.name}</p>
                      {g.schedule && <p className="text-sm text-gray-400">{g.schedule}</p>}
                    </div>
                    {groupModal.newGroupId === g.id && (
                      <Check className="w-6 h-6 text-green-400" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={saveGroupChange}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Saqlash
                </button>
                <button
                  onClick={() => setGroupModal({ open: false, student: null, newGroupId: '' })}
                  className="px-6 py-3 bg-white/10 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>  
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
