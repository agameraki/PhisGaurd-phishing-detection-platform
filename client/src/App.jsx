import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import ScanPage from "./pages/ScanPage";
import HistoryPage from "./pages/HistoryPage";
import PremiumPage from "./pages/PremiumPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NotFound from "./pages/NotFound";
import Loader from "./components/shared/Loader";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Public route wrapper (redirect to scan if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (user) return <Navigate to="/scan" replace />;
  return children;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <ScanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <PremiumPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;