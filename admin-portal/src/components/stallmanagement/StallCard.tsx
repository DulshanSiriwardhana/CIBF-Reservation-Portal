import React from "react";
import ReservationActions from "./ReservationActions";

interface StallCardProps {
  id: number;
  stallName: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  dimension: number;
  price: number;
  status: "AVAILABLE" | "RESERVED" | "MAINTENANCE";
  reservedBy?: string;
  reservationId?: string;
  onEdit: (stallName: string) => void;
  onApprove?: () => void;
  onCancel?: () => void;
}

const statusColors = {
  AVAILABLE: "bg-green-500",
  RESERVED: "bg-yellow-400",
  MAINTENANCE: "bg-red-500",
};

const StallCard: React.FC<StallCardProps> = ({
  stallName,
  size,
  dimension,
  price,
  status,
  reservedBy,
  reservationId,
  onEdit,
  onApprove,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between hover:shadow-2xl transition cursor-pointer">
      <div>
        <div className={`inline-block px-2 py-1 rounded text-white font-bold ${statusColors[status]}`}>
          {status}
        </div>
        <h3 className="text-xl font-semibold mt-2">{stallName}</h3>
        <p className="text-gray-600 mt-1">Size: {size}</p>
        <p className="text-gray-600">Dimension: {dimension} m²</p>
        <p className="text-gray-600">Price: ${price}</p>
        {reservedBy && <p className="text-gray-800 mt-1">Reserved By: {reservedBy}</p>}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => onEdit(stallName)}
          className="px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700 transition"
        >
          Edit
        </button>
        {status === "RESERVED" && reservationId && onApprove && onCancel && (
          <ReservationActions
            reservationId={reservationId}
            onApprove={onApprove}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
};

export default StallCard;
