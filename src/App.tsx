import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import MapPage from './pages/MapPage';
import ReportWastePage from './pages/ReportWastePage';
import CleanupDrivePage from './pages/CleanupDrivePage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <MapPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/report" element={
            <ProtectedRoute>
              <Layout>
                <ReportWastePage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/cleanup" element={
            <ProtectedRoute>
              <Layout>
                <CleanupDrivePage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/rewards" element={
            <ProtectedRoute>
              <Layout>
                <RewardsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;