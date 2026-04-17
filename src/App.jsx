import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ListingDetail from './pages/ListingDetail';
import AuthModal from './components/AuthModal';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { isLoggedIn, isAuthLoading } = useApp();
  
  if (isAuthLoading) return null; // Or a loading spinner
  if (!isLoggedIn) return <Navigate to="/" replace />;
  
  return children;
}

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const { isLoggedIn, isAuthLoading, isProfileComplete } = useApp();
  const location = useLocation();

  // Handle redirect to onboarding if profile is incomplete
  if (!isAuthLoading && isLoggedIn && !isProfileComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Handle redirect to dashboard if profile is complete and on landing/onboarding
  if (!isAuthLoading && isLoggedIn && isProfileComplete && (location.pathname === '/' || location.pathname === '/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuthLoading) {
    return (
      <div className="loading-screen">
        <div className="auth-modal__spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <>
      <Navbar onAuthClick={() => setShowAuth(true)} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listing/:id"
          element={
            <ProtectedRoute>
              <ListingDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
