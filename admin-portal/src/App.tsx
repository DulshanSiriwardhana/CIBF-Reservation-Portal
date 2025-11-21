import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/navbar/NavBar";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/footer/Footer";
import { LoaderProvider } from "./context/LoaderContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import StallManagementPage from "./pages/StallManagementPage";
import VendorManagementPage from "./pages/VendorManagementPage";
import ReservationManagementPage from "./pages/ReservationManagementPage";
import MapPage from "./pages/MapPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAuthPage = location.pathname === "/";

  return (
    <div className="font-family-notoserif min-h-screen flex flex-col">
      {!isAuthPage && isAuthenticated && (
        <div className="h-20 flex-shrink-0">
          <NavBar/>
        </div>
      )}
      <div className="flex-1">
        <LoaderProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stall-management"
                element={
                  <ProtectedRoute>
                    <StallManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendors"
                element={
                  <ProtectedRoute>
                    <VendorManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservations"
                element={
                  <ProtectedRoute>
                    <ReservationManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ToastProvider>
        </LoaderProvider>
      </div>
      {!isAuthPage && isAuthenticated && (
        <div className="flex-shrink-0">
          <Footer/>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
