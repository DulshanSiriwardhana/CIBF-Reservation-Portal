import React, { useState, useEffect } from 'react';
import { stallService } from '../services/stallService';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaQrcode } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import Loading from '../components/common/Loading';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
      fetchReservations(parseInt(storedUserId));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchReservations = async (uid) => {
    try {
      const response = await stallService.getUserStalls(uid);
      setReservations(response.data || []);
    } catch (err) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (stallId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await stallService.releaseStall(stallId);
      toast.success('Reservation cancelled successfully');
      fetchReservations(userId);
    } catch (err) {
      toast.error('Failed to cancel reservation');
    }
  };

  if (loading) return <Loading message="Loading your reservations..." />;

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">No User Session</h2>
          <p className="text-gray-600 mb-6">Please browse stalls and make a reservation first</p>
          <a href="/stalls" className="btn-primary inline-block">Browse Stalls</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">My Reservations</h1>
      <p className="text-gray-600 mb-8">View and manage your stall reservations</p>

      {reservations.length === 0 ? (
        <div className="card text-center py-12">
          <FaTimesCircle className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reservations Yet</h3>
          <p className="text-gray-500 mb-6">You haven't made any stall reservations</p>
          <a href="/stalls" className="btn-primary inline-block">Browse Available Stalls</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((stall) => (
            <div key={stall.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Stall {stall.stallName}</h3>
                  <span className="badge badge-success mt-2">Reserved</span>
                </div>
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>

              <div className="space-y-2 mb-6 text-gray-600">
                <p><span className="font-semibold">Size:</span> {stall.size}</p>
                <p><span className="font-semibold">Dimension:</span> {stall.dimension} sq.m</p>
                <p><span className="font-semibold">Price:</span> Rs. {stall.price.toLocaleString()}</p>
                <p><span className="font-semibold">Position:</span> ({stall.positionX}, {stall.positionY})</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowQR(stall)}
                  className="btn-primary flex-1"
                >
                  <FaQrcode className="inline mr-2" />
                  View QR Code
                </button>
                <button
                  onClick={() => handleCancelReservation(stall.id)}
                  className="btn-outline text-red-600 hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-6">
              Stall {showQR.stallName} - Entry Pass
            </h3>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white border-4 border-primary-600 rounded-lg">
                <QRCodeSVG 
                  value={`STALL-${showQR.stallName}-RES-${showQR.reservationId}`}
                  size={200}
                  level="H"
                />
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                Show this QR code at the entrance to access your stall
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Reservation ID: {showQR.reservationId}
              </p>
            </div>

            <button
              onClick={() => setShowQR(null)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;