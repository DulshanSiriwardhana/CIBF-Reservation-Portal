import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/navbar/NavBar";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/footer/Footer";
import { LoaderProvider } from "./context/LoaderContext";
import StallManagementPage from "./pages/StallManagementPage";

function App() {
  return (
    <BrowserRouter>
      <div className="font-family-notoserif">
        <div className="h-20">
          <NavBar/>
        </div>
        <LoaderProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/stall-management" element={<StallManagementPage />} />
          </Routes>
        </LoaderProvider>
        <div>
          <Footer/>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
