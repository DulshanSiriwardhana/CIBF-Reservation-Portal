import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave } from 'react-icons/fa';
import { stallService } from '../services/stallService';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ReservationConfirmation from './ReservationConfirmation';
import { useAuth } from '../context/AuthContext';

const StallList = () => {
  const [stalls, setStalls] = useState([]);
  const [filteredStalls, setFilteredStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reservation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  // TODO: Get from your auth context/state
  const {user} = useAuth();
  const userEmail = user.email || "publisher@example.com"; // Replace with actual user email
  const userId = user.userId; // Replace with actual user ID

  useEffect(() => {
    fetchStalls();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sizeFilter, statusFilter, priceRange, stalls]);

  const fetchStalls = async () => {
    try {
      setLoading(true);
      const response = await stallService.getAllStalls();
      if (response.success && response.data) {
        setStalls(response.data);
        console.log('Stalls data:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch stalls');
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch stalls');
      toast.error('Failed to load stalls');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...stalls];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stall =>
        stall.stallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stall.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Size filter
    if (sizeFilter !== 'ALL') {
      filtered = filtered.filter(stall => stall.size === sizeFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(stall => stall.status === statusFilter);
    }

    // Price range filter
    filtered = filtered.filter(stall =>
      stall.price >= priceRange.min && stall.price <= priceRange.max
    );

    setFilteredStalls(filtered);
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
    
    setSelectedStall(stallData);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'badge-success';
      case 'RESERVED': return 'badge-danger';
      case 'MAINTENANCE': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  const getSizeColor = (size) => {
    switch (size) {
      case 'SMALL': return 'text-blue-600 bg-blue-50';
      case 'MEDIUM': return 'text-green-600 bg-green-50';
      case 'LARGE': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) return <Loading message="Loading stalls..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStalls} />;

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Stalls</h1>
        <p className="text-gray-600">Find the perfect stall for your exhibition</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Size Filter */}
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Sizes</option>
            <option value="SMALL">Small (10 sq.m)</option>
            <option value="MEDIUM">Medium (20 sq.m)</option>
            <option value="LARGE">Large (30 sq.m)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price: Rs. {priceRange.max.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredStalls.length} of {stalls.length} stalls</span>
          <button
            onClick={() => {
              setSearchTerm('');
              setSizeFilter('ALL');
              setStatusFilter('ALL');
              setPriceRange({ min: 0, max: 100000 });
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stall Grid */}
      {filteredStalls.length === 0 ? (
        <div className="text-center py-12">
          <FaFilter className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No stalls found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStalls.map((stall) => (
            <div key={stall.id} className="card hover:shadow-xl transition-all duration-300 group">
              {/* Stall Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                    Stall {stall.stallName}
                  </h3>
                  <span className={`badge ${getSizeColor(stall.size)} mt-2`}>
                    {stall.size}
                  </span>
                </div>
                <span className={`badge ${getStatusColor(stall.status)}`}>
                  {stall.status}
                </span>
              </div>

              {/* Stall Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaRulerCombined className="mr-3 text-primary-600" />
                  <span>{stall.dimension} sq.m</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMoneyBillWave className="mr-3 text-primary-600" />
                  <span className="font-semibold text-lg text-gray-800">
                    Rs. {stall.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-3 text-primary-600" />
                  <span>Position: ({stall.positionX}, {stall.positionY})</span>
                </div>
              </div>

              {/* Description */}
              {stall.description && (
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {stall.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {stall.status === 'AVAILABLE' ? (
                  <button
                    onClick={() => handleReserveClick(stall)}
                    className="flex-1 btn-primary text-center"
                  >
                    Reserve Now
                  </button>
                ) : (
                  <button disabled className="flex-1 btn-primary opacity-50 cursor-not-allowed">
                    Not Available
                  </button>
                )}
                <Link
                  to={`/map?highlight=${stall.id}`}
                  className="btn-outline"
                >
                  <FaMapMarkerAlt />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Confirmation Modal */}
      {selectedStall && (
        <ReservationConfirmation
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stall={selectedStall}
          userEmail={userEmail}
          userId={userId}
          onConfirm={handleConfirmSuccess}
        />
      )}
    </div>
  );
};

export default StallList;