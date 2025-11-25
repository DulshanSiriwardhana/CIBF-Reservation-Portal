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
import QRScannerPage from "./pages/QRScannerPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#d7dde8] border-t-[#b7ff5e] mx-auto mb-4"></div>
          <p className="text-[#475569] font-medium">Loading...</p>
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
    <div className="font-family-notoserif min-h-screen flex flex-col bg-[#f6f8fb]">
      {!isAuthPage && isAuthenticated && (
        <div className="flex-shrink-0">
          <NavBar/>
        </div>
      )}
      <main className="flex-1 min-h-0 pt-8 pb-16">
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
                path="/qr-scanner"
                element={
                  <ProtectedRoute>
                    <QRScannerPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ToastProvider>
        </LoaderProvider>
      </main>
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
