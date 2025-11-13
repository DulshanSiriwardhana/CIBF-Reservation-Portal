import React from "react";
import type { Stall } from "../../types/stall";
import type { Genre } from "../../types/genre";

interface StallCardProps extends Stall {
  onEdit: (stallName: string) => void;
  onApprove: () => void;
  onCancel: () => void;
  genres?: Genre[];
}

const statusColors: Record<Stall["status"], string> = {
  AVAILABLE: "bg-green-500",
  RESERVED: "bg-yellow-500",
  MAINTENANCE: "bg-red-500",
};

const StallCard: React.FC<StallCardProps> = ({
  stallName,
  size,
  dimension,
  price,
  status,
  reservedBy,
  onEdit,
  onApprove,
  onCancel,
  genres,
}) => {
  return (
    <div className="border rounded-xl p-4 shadow-lg flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <div className={`px-3 py-1 rounded-xl text-white font-bold ${statusColors[status]}`}>
          {status}
        </div>
        <button onClick={() => onEdit(stallName)} className="text-blue-600 font-bold hover:underline">
          Edit
        </button>
      </div>
      <h2 className="text-lg font-bold">{stallName}</h2>
      <p>Size: {size}</p>
      <p>Dimension: {dimension} m²</p>
      <p>Price: ${price}</p>
      {reservedBy && <p>Reserved By: {reservedBy}</p>}
      {status === "AVAILABLE" && <button onClick={onApprove} className="px-4 py-2 bg-green-600 text-white rounded-xl">Approve</button>}
      {status === "RESERVED" && <button onClick={onCancel} className="px-4 py-2 bg-red-600 text-white rounded-xl">Cancel</button>}
      {genres && genres.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {genres.map((g) => (
            <span key={g.id} className="bg-gray-200 px-2 py-1 rounded text-sm">{g.name}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default StallCard;
