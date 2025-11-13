import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/navbar/NavBar";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/footer/Footer";
import { LoaderProvider } from "./context/LoaderContext";

function App() {
  return (
    <BrowserRouter>
      <div className="font-family-notoserif">
        <div>
          <NavBar/>
        </div>
        <LoaderProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
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
