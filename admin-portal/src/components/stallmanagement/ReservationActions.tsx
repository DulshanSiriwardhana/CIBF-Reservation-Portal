import React from "react";

interface ReservationActionsProps {
  reservationId: string;
  onApprove: () => void;
  onCancel: () => void;
}

const ReservationActions: React.FC<ReservationActionsProps> = ({ onApprove, onCancel }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onApprove}
        className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
      >
        Approve
      </button>
      <button
        onClick={onCancel}
        className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default ReservationActions;
