// src/components/AdminGroups.jsx
import { useSchoolStore } from "../components/store";
import { useState } from "react";

export default function AdminGroups() {
  const { groups, addStudent, removeStudent } = useSchoolStore();
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      addStudent(selectedGroup.id, newName.trim());
      setNewName("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Админ-панель — Управление группами</h1>

      <div className="flex gap-6">
        {/* Список групп */}
        <div className="w-64 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl mb-4">Группы</h2>
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full text-left p-3 rounded mb-2 transition ${
                selectedGroup.id === group.id
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {group.name} ({group.students.length})
            </button>
          ))}
        </div>

        {/* Таблица учеников выбранной группы */}
        <div className="flex-1 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl mb-4">{selectedGroup.name}</h2>

          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Имя ученика"
              className="px-4 py-2 bg-gray-700 rounded flex-1"
            />
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded"
            >
              Добавить
            </button>
          </div>

          <div className="space-y-2">
            {selectedGroup.students.map((student) => (
              <div
                key={student.id}
                className="flex justify-between items-center bg-gray-700 p-3 rounded"
              >
                <span>{student.name}</span>
                <button
                  onClick={() => removeStudent(selectedGroup.id, student.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
