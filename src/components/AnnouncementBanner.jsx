import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Plus, Trash2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ANNOUNCEMENTS_KEY = 'admin-announcements';

export function AnnouncementBanner({ role = 'student' }) {
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem(ANNOUNCEMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'bonus', // bonus, announcement, event
    icon: '🎉',
    validFor: 'all', // all, students, teachers, parents
  });

  const handleAddAnnouncement = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Barcha maydonlarni to\'ldiring');
      return;
    }

    const newAnnouncement = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));

    setFormData({
      title: '',
      description: '',
      type: 'bonus',
      icon: '🎉',
      validFor: 'all',
    });
    setShowForm(false);
  };

  const handleDeleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
  };

  // Filter announcements based on role
  const visibleAnnouncements = announcements.filter(a => {
    if (a.validFor === 'all') return true;
    if (a.validFor === 'students') return role === 'student';
    if (a.validFor === 'teachers') return role === 'teacher';
    if (a.validFor === 'parents') return role === 'parent';
    return false;
  });

  if (announcements.length === 0 && role === 'admin') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Yangi E'lon
        </button>

        {showForm && <AnnouncementForm formData={formData} setFormData={setFormData} onAdd={handleAddAnnouncement} onCancel={() => setShowForm(false)} />}

        <div className="bg-slate-900/30 border border-slate-700/50 rounded-2xl p-6 text-center text-slate-400">
          Hali e'lon mavjud emas
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {role === 'admin' && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Yangi E'lon
          </button>
        </div>
      )}

      {showForm && role === 'admin' && (
        <AnnouncementForm
          formData={formData}
          setFormData={setFormData}
          onAdd={handleAddAnnouncement}
          onCancel={() => setShowForm(false)}
        />
      )}

      {visibleAnnouncements.length > 0 ? (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-prev',
              nextEl: '.swiper-next',
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={visibleAnnouncements.length > 1}
            className="rounded-2xl overflow-hidden"
          >
            {visibleAnnouncements.map((announcement) => (
              <SwiperSlide key={announcement.id}>
                <AnnouncementCard
                  announcement={announcement}
                  isAdmin={role === 'admin'}
                  onDelete={() => handleDeleteAnnouncement(announcement.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {visibleAnnouncements.length > 1 && (
            <>
              <button className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-700/50 rounded-2xl p-6 text-center text-slate-400">
          Sizga uchun e'lonlar yo'q
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({ announcement, isAdmin, onDelete }) {
  const typeConfig = {
    bonus: { color: 'from-yellow-500 to-orange-500', label: '🎁 Bonus' },
    announcement: { color: 'from-blue-500 to-indigo-500', label: '📢 E\'lon' },
    event: { color: 'from-pink-500 to-rose-500', label: '🎉 Tadbir' },
  };

  const config = typeConfig[announcement.type] || typeConfig.announcement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-gradient-to-r ${config.color} rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{announcement.icon}</span>
              <span className="text-sm font-semibold opacity-90">{config.label}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">{announcement.title}</h3>
          </div>

          {isAdmin && (
            <button
              onClick={onDelete}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="O'chirish"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-base md:text-lg opacity-90 mb-4">{announcement.description}</p>

        <div className="flex items-center justify-between text-sm opacity-75">
          <span>Siz uchun: {getTargetLabel(announcement.validFor)}</span>
          <span>{new Date(announcement.createdAt).toLocaleDateString('uz-UZ')}</span>
        </div>
      </div>
    </motion.div>
  );
}

function AnnouncementForm({ formData, setFormData, onAdd, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Sarlavha</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="E'lon sarlavhasi..."
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Tavsifi</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="E'lonning to'liq mazmuni..."
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          maxLength={300}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Turi</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bonus">Bonus</option>
            <option value="announcement">E'lon</option>
            <option value="event">Tadbir</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Ikonka</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="🎉">🎉 Bayram</option>
            <option value="🎁">🎁 Sovg'a</option>
            <option value="🏆">🏆 Mukofot</option>
            <option value="⭐">⭐ Yulduz</option>
            <option value="🚀">🚀 Yangi</option>
            <option value="📢">📢 E'lon</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Kimlar uchun</label>
        <select
          value={formData.validFor}
          onChange={(e) => setFormData({ ...formData, validFor: e.target.value })}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Barcha uchun</option>
          <option value="students">Faqat o'quvchilar uchun</option>
          <option value="teachers">Faqat o'qituvchilar uchun</option>
          <option value="parents">Faqat ota-onalar uchun</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700">
        <button
          onClick={onAdd}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Saqlash
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
        >
          Bekor
        </button>
      </div>
    </motion.div>
  );
}

function getTargetLabel(validFor) {
  const labels = {
    all: 'Barcha',
    students: "O'quvchilar",
    teachers: "O'qituvchilar",
    parents: 'Ota-onalar',
  };
  return labels[validFor] || 'Noma\'lum';
}
