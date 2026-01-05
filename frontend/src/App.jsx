import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/privateRoute';
import PublicRoute from './routes/publicRoute';

// Lazy load pages
const PublicLogin = lazy(() => import('./pages/public/Login'));
const PublicRegister = lazy(() => import('./pages/public/Register'));
const Product = lazy(() => import('./pages/private/Product'));
const Feedback = lazy(() => import('./pages/private/Feedback'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Layout for private routes (with navbar)
const PrivateLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public pages */}
            <Route path="/login" element={<PublicRoute><PublicLogin /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><PublicRegister /></PublicRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Private pages with Navbar */}
            <Route element={<PrivateLayout />}>
              <Route path="/dashboard" element={<PrivateRoute><Product /></PrivateRoute>} />
              <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;