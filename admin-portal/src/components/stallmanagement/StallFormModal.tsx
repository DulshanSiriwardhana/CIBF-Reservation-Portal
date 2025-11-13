import React, { useState, useEffect } from "react";
import type { Stall } from "../../types/stall";
import type { Genre } from "../../types/genre";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stall: Stall) => void;
  initialData?: Stall;
  genres: Genre[];
}

const StallFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, genres }) => {
  const [stall, setStall] = useState<Stall>({ id: 0, stallName: "", size: "SMALL", dimension: 0, price: 0, status: "AVAILABLE", positionX: 50, positionY: 50, genreIds: [] });

  useEffect(() => {
    if (initialData) setStall(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Stall" : "Add Stall"}</h2>
        <input className="border p-2 w-full mb-2" placeholder="Stall Name" value={stall.stallName} onChange={(e) => setStall({ ...stall, stallName: e.target.value })} />
        <select className="border p-2 w-full mb-2" value={stall.size} onChange={(e) => setStall({ ...stall, size: e.target.value as Stall["size"] })}>
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>
        <input className="border p-2 w-full mb-2" placeholder="Dimension" type="number" value={stall.dimension} onChange={(e) => setStall({ ...stall, dimension: Number(e.target.value) })} />
        <input className="border p-2 w-full mb-2" placeholder="Price" type="number" value={stall.price} onChange={(e) => setStall({ ...stall, price: Number(e.target.value) })} />
        <div className="mb-2">
          <label className="font-bold mb-1 block">Genres:</label>
          <select multiple className="border p-2 w-full" value={stall.genreIds?.map(String)} onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
            setStall({ ...stall, genreIds: selected });
          }}>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded" onClick={() => onSubmit(stall)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default StallFormModal;
