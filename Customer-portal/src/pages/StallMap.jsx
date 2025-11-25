import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { stallService } from '../services/stallService';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import ReservationConfirmation from './ReservationConfirmation';
import { useAuth } from '../context/AuthContext';

const StallMap = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation ] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const {user} = useAuth();
  const userEmail = user.email || "publisher@example.com"; // Replace with actual user email
  const userId = user.userId; // Replace with actual user ID

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    try {
      const response = await stallService.getAllStalls();
      setStalls(response.data || []);
      
      if (highlightId) {
        const stall = response.data.find(s => s.id === parseInt(highlightId));
        if (stall) setSelectedStall(stall);
      }
    } catch (err) {
      toast.error('Failed to load stall map');
    } finally {
      setLoading(false);
    }
  };

  const handleReserveClick = (stall) => {
    // Transform stall data to match modal's expected format
    const stallData = {
      id: stall.id,
      name: stall.stallName,
      size: stall.size?.toLowerCase(), // Convert to lowercase for badge colors
      area: stall.dimension,
      price: stall.price,
      position: { x: stall.positionX, y: stall.positionY },
      description: stall.description,
      status: stall.status
    };
    console.log(stall);
    setOpenConfirmation(stallData);
    setIsModalOpen(true);
  };

  const handleConfirmSuccess = (reservationData) => {
    console.log('Reservation confirmed:', reservationData);
    toast.success('Reservation confirmed! Check your email for QR code.');
    
    // Refresh stalls to update availability
    fetchStalls();
    
    // Optionally navigate to My Reservations page
    // navigate('/my-reservations');
  };
  

  const getStallColor = (stall) => {
    if (selectedStall?.id === stall.id) return 'bg-yellow-400 border-yellow-600';
    
    switch (stall.status) {
      case 'AVAILABLE': return 'bg-green-500 border-green-700 hover:bg-green-600';
      case 'RESERVED': return 'bg-red-500 border-red-700';
      case 'MAINTENANCE': return 'bg-gray-400 border-gray-600';
      default: return 'bg-gray-300 border-gray-500';
    }
  };

  const getSizeClass = (size) => {
    switch (size) {
      case 'SMALL': return 'w-16 h-16';
      case 'MEDIUM': return 'w-20 h-20';
      case 'LARGE': return 'w-24 h-24';
      default: return 'w-16 h-16';
    }
  };

  // Create grid
  const maxX = Math.max(...stalls.map(s => s.positionX), 0);
  const maxY = Math.max(...stalls.map(s => s.positionY), 0);

  if (loading) return <Loading message="Loading stall map..." />;

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Exhibition Stall Map</h1>
      <p className="text-gray-600 mb-8">Click on any stall to view details</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card overflow-auto">
            <div className="inline-block min-w-full p-8">
              <div 
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${maxX + 1}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${maxY + 1}, minmax(0, 1fr))`
                }}
              >
                {stalls.map((stall) => (
                  <div
                    key={stall.id}
                    style={{
                      gridColumn: stall.positionX + 1,
                      gridRow: stall.positionY + 1
                    }}
                    className={`${getSizeClass(stall.size)} ${getStallColor(stall)} 
                              border-2 rounded-lg flex flex-col items-center justify-center 
                              cursor-pointer transition-all duration-200 transform hover:scale-105
                              ${stall.status === 'AVAILABLE' ? 'shadow-md hover:shadow-lg' : ''}`}
                    onClick={() => setSelectedStall(stall)}
                  >
                    <span className="text-white font-bold text-sm">{stall.stallName}</span>
                    <span className="text-white text-xs">{stall.size[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="card mt-4">
            <h3 className="font-semibold mb-3">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 border-2 border-green-700 rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 border-2 border-red-700 rounded"></div>
                <span className="text-sm">Reserved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 border-2 border-gray-600 rounded"></div>
                <span className="text-sm">Maintenance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 border-2 border-yellow-600 rounded"></div>
                <span className="text-sm">Selected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stall Details */}
        <div>
          <div className="card sticky top-24">
            {selectedStall ? (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Stall {selectedStall.stallName}
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`badge ${
                      selectedStall.status === 'AVAILABLE' ? 'badge-success' :
                      selectedStall.status === 'RESERVED' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {selectedStall.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-semibold">{selectedStall.size}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimension:</span>
                    <span className="font-semibold">{selectedStall.dimension} sq.m</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-lg text-primary-600">
                      Rs. {selectedStall.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span className="font-semibold">
                      ({selectedStall.positionX}, {selectedStall.positionY})
                    </span>
                  </div>
                </div>

                {selectedStall.description && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-600 text-sm">{selectedStall.description}</p>
                  </div>
                )}

                {selectedStall.status === 'AVAILABLE' && (
                  <button
                    onClick={() => handleReserveClick(selectedStall)}
                    className="flex-1 self-center btn-primary content-center items-center text-center"
                  >
                    Reserve Now
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2">No stall selected</p>
                <p className="text-sm">Click on a stall to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Reservation Confirmation Modal */}
      {openConfirmation && (
        <ReservationConfirmation
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stall={openConfirmation}
          userEmail={userEmail}
          userId={userId}
          onConfirm={handleConfirmSuccess}
        />
      )}
    </div>
  );
};

export default StallMap;