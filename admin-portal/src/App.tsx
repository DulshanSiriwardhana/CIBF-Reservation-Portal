import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/navbar/NavBar";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/footer/Footer";
import { LoaderProvider } from "./context/LoaderContext";
import StallManagementPage from "./pages/StallManagementPage";
import React from "react";

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/";

  return (
    <div className="font-family-notoserif flex flex-col min-h-screen">
      {!isAuthPage && <div className="h-20"><NavBar /></div>}
      <LoaderProvider>
        <main className="flex-grow">{children}</main>
      </LoaderProvider>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/stall-management" element={<StallManagementPage />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
