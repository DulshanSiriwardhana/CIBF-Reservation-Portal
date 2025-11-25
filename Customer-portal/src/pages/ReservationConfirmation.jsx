import React, { useState } from 'react';

const ReservationConfirmation = ({ 
  isOpen, 
  onClose, 
  stall, 
  userEmail,
  userId,
  onConfirm 
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirmReservation = async () => {
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          email: userEmail,
          stallId: stall.id,
          amount: stall.price,
          status: 'CONFIRMED',
          reserveDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      const data = await response.json();
      
      // Call parent success handler
      if (onConfirm) {
        onConfirm(data);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to confirm reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeBadgeColor = (size) => {
    switch(size?.toUpperCase()) {
      case 'LARGE': return 'bg-purple-100 text-purple-700';
      case 'MEDIUM': return 'bg-green-100 text-green-700';
      case 'SMALL': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Confirm Your Reservation
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Stall Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Stall Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stall Name:</span>
                  <span className="font-semibold text-gray-800">{stall.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSizeBadgeColor(stall.size)}`}>
                    {stall.size?.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-semibold text-gray-800">{stall.area} sq.m</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-semibold text-gray-800">({stall.position?.x}, {stall.position?.y})</span>
                </div>

                {stall.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">{stall.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Pricing</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-orange-600">
                  Rs. {stall.price?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Your Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{userEmail}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  A confirmation email with QR code will be sent to this address.
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setError('');
                  }}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-orange-600 hover:text-orange-700 underline" target="_blank">
                    terms and conditions
                  </a>
                  {' '}and understand that this reservation is non-refundable.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReservation}
                disabled={isLoading || !agreedToTerms}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm Reservation'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmation;