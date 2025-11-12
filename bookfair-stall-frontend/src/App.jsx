import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import StallList from './pages/StallList';
import StallMap from './pages/StallMap';
import ReservationForm from './pages/ReservationForm';
import MyReservations from './pages/MyReservations';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stalls" element={<StallList />} />
            <Route path="/map" element={<StallMap />} />
            <Route path="/reserve/:stallId" element={<ReservationForm />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;