import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import ProfileModal from './components/layout/ProfileModal';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StallList from './pages/StallList';
import StallMap from './pages/StallMap';
import ReservationForm from './pages/ReservationForm';
import MyReservations from './pages/MyReservations';
import AdminDashboard from './pages/AdminDashboard';
import Genres from './pages/Genre';

function App() {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar onShowProfile={() => setShowProfile(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stalls" element={<StallList />} />
            <Route path="/map" element={<StallMap />} />
            <Route path="/genres" element={<Genres/>}/>
            <Route path="/reserve/:stallId" element={<ReservationForm />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </Router>
    </AuthProvider>
  );
}

export default App;