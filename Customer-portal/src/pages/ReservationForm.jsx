import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { stallService } from '../services/stallService';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Loading from '../components/common/Loading';

const ReservationForm = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canReserve, setCanReserve] = useState(true);
  const [userId, setUserId] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchStallDetails();
    
    // Simulate user ID (in real app, get from auth context)
    const storedUserId = localStorage.getItem('userId') || Math.floor(Math.random() * 1000);
    localStorage.setItem('userId', storedUserId);
    setUserId(parseInt(storedUserId));
    checkUserReservationLimit(parseInt(storedUserId));
  }, [stallId]);

  const fetchStallDetails = async () => {
    try {
      const response = await stallService.getStallById(stallId);
      setStall(response.data);
      
      if (response.data.status !== 'AVAILABLE') {
        toast.warning('This stall is not available for reservation');
      }
    } catch (err) {
      toast.error('Failed to load stall details');
    } finally {
      setLoading(false);
    }
  };

  const checkUserReservationLimit = async (uid) => {
    try {
      const response = await stallService.canUserReserveMore(uid);
      setCanReserve(response.data.canReserve);
    } catch (err) {
      console.error('Failed to check reservation limit');
    }
  };

  const onSubmit = async (data) => {
    if (!canReserve) {
      toast.error('You have reached the maximum reservation limit of 3 stalls');
      return;
    }

    try {
      setSubmitting(true);
      const reservationId = Date.now(); // Generate unique reservation ID
      
      await stallService.reserveStall(stallId, userId, reservationId);
      
      toast.success('Stall reserved successfully!');
      navigate('/my-reservations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reserve stall');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading reservation form..." />;

  if (!stall) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center">
          <FaExclamationTriangle className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Stall Not Found</h2>
          <button onClick={() => navigate('/stalls')} className="btn-primary mt-4">
            Back to Stalls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Reserve Stall {stall.stallName}</h1>
        <p className="text-gray-600 mb-8">Complete the form below to reserve your stall</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservation Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">Exhibitor Information</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      {...register('organizationName', { required: 'Organization name is required' })}
                      className="input-field"
                      placeholder="Enter organization name"
                    />
                    {errors.organizationName && (
                      <p className="text-red-500 text-sm mt-1">{errors.organizationName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      {...register('contactPerson', { required: 'Contact person is required' })}
                      className="input-field"
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPerson && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      className="input-field"
                      placeholder="0771234567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Literary Genres/Categories
                  </label>
                  <textarea
                    {...register('genres')}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="E.g., Fiction, Non-fiction, Children's books, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    {...register('specialRequirements')}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('agreeTerms', { required: 'You must agree to terms' })}
                    className="mt-1 mr-3"
                  />
                  <label className="text-sm text-gray-600">
                    I agree to the terms and conditions of the Colombo International Bookfair
                    and understand the payment and cancellation policies. *
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>
                )}

                {!canReserve && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                    <FaExclamationTriangle className="text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      You have reached the maximum reservation limit of 3 stalls per business.
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting || !canReserve || stall.status !== 'AVAILABLE'}
                    className="btn-primary flex-1"
                  >
                    {submitting ? 'Processing...' : 'Confirm Reservation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/stalls')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Stall Summary */}
          <div>
            <div className="card sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Reservation Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Stall Number</p>
                  <p className="text-2xl font-bold text-primary-600">{stall.stallName}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Size</span>
                    <span className="font-semibold">{stall.size}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Dimension</span>
                    <span className="font-semibold">{stall.dimension} sq.m</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Position</span>
                    <span className="font-semibold">({stall.positionX}, {stall.positionY})</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Stall Price</span>
                    <span className="text-xl font-bold text-gray-800">
                      Rs. {stall.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm text-green-800">
                      An email confirmation with your QR code entry pass will be sent upon successful reservation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;