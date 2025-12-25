import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { homeworks } from '../data/mockData';

export function AdminHomeworks() {
  const [showModal, setShowModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [formData, setFormData] = useState({
    lessonNumber: '',
    title: '',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingHomework) {
      alert(`Vazifa yangilandi:\n${formData.lessonNumber}-dars: ${formData.title}`);
    } else {
      alert(`Yangi vazifa qo'shildi:\n${formData.lessonNumber}-dars: ${formData.title}\nMuddat: ${formData.deadline}`);
    }
    setShowModal(false);
    setEditingHomework(null);
    setFormData({ lessonNumber: '', title: '', description: '', deadline: '' });
  };

  const handleEdit = (homework) => {
    setEditingHomework(homework);
    setFormData({
      lessonNumber: homework.lessonNumber.toString(),
      title: homework.title,
      description: homework.description,
      deadline: homework.deadline || ''
    });
    setShowModal(true);
  };

  const handleDelete = (homeworkId, title) => {
    if (confirm(`"${title}" vazifasini o'chirmoqchimisiz?`)) {
      alert(`${title} vazifasi o'chirildi`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Vazifalar boshqaruvi</h2>
        <button
          onClick={() => {
            setEditingHomework(null);
            setFormData({ lessonNumber: '', title: '', description: '', deadline: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Yangi vazifa
        </button>
      </div>

      <div className="space-y-4">
        {homeworks.map(homework => (
          <div key={homework.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {homework.lessonNumber}-dars
                  </span>
                  {homework.deadline && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(homework.deadline).toLocaleDateString('uz-UZ')}
                    </div>
                  )}
                </div>
                <h3 className="text-gray-900 mb-2">{homework.title}</h3>
                <p className="text-gray-600">{homework.description}</p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(homework)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(homework.id, homework.title)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-6">
              {editingHomework ? 'Vazifani tahrirlash' : 'Yangi vazifa qo\'shish'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Dars raqami</label>
                <input
                  type="number"
                  value={formData.lessonNumber}
                  onChange={(e) => setFormData({ ...formData, lessonNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Vazifa nomi</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Flexbox va Grid"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Izoh</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Vazifa haqida qisqacha ma'lumot..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Muddat</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingHomework ? 'Saqlash' : 'Qo\'shish'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingHomework(null);
                    setFormData({ lessonNumber: '', title: '', description: '', deadline: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
