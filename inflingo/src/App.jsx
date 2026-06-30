import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NoticesProvider } from './context/NoticesContext';
import { SavedProvider } from './context/SavedContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import SavedPage from './pages/SavedPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NoticesProvider>
          <SavedProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories/:categoryKey" element={<CategoryPage />} />
              <Route path="/notice/:id" element={<NoticeDetailPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SavedProvider>
        </NoticesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
