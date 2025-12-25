// src/App.jsx
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ToastContainer } from 'react-toastify';

import { LoginPage } from './components/LoginPage';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { AdminDashboard } from './components/AdminDashboard';

// Защищённый роут — только для авторизованных
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl bg-gray-50">
        Yuklanmoqda...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Роут для логина — только если не авторизован
function PublicRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return null;

  if (user) {
    // Перенаправляем по роли
    const redirectMap = {
      teacher: '/teacher',
      student: '/student',
      parent: '/parent',
      admin: '/admin',
    };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  return children;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          {/* Публичный роут — логин */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Защищённые роуты */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/*"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Дефолтный редирект */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div>404 — Sahifa topilmadi</div>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}