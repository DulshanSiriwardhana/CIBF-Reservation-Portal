import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
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
  const [stall, setStall] = useState<Stall>({
    id: 0,
    stallName: "",
    size: "SMALL",
    dimension: 0,
    price: 0,
    status: "AVAILABLE",
    positionX: 50,
    positionY: 50,
    genreIds: [],
  });

  useEffect(() => {
    if (initialData) {
      setStall(initialData);
    } else {
      setStall({
        id: 0,
        stallName: "",
        size: "SMALL",
        dimension: 0,
        price: 0,
        status: "AVAILABLE",
        positionX: 50,
        positionY: 50,
        genreIds: [],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(stall);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">{initialData ? "Edit Stall" : "Add Stall"}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <FiX className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Stall Name</label>
            <input
              type="text"
              required
              placeholder="Enter stall name"
              value={stall.stallName}
              onChange={(e) => setStall({ ...stall, stallName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Size</label>
              <select
                value={stall.size}
                onChange={(e) => setStall({ ...stall, size: e.target.value as Stall["size"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
              >
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={stall.status}
                onChange={(e) => setStall({ ...stall, status: e.target.value as Stall["status"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Dimension (m²)</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                placeholder="0"
                value={stall.dimension}
                onChange={(e) => setStall({ ...stall, dimension: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={stall.price}
                onChange={(e) => setStall({ ...stall, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Position X</label>
              <input
                type="number"
                min="0"
                placeholder="50"
                value={stall.positionX}
                onChange={(e) => setStall({ ...stall, positionX: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Position Y</label>
              <input
                type="number"
                min="0"
                placeholder="50"
                value={stall.positionY}
                onChange={(e) => setStall({ ...stall, positionY: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
              />
            </div>
          </div>

          {genres.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Genres</label>
              <select
                multiple
                value={stall.genreIds?.map(String) || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                  setStall({ ...stall, genreIds: selected });
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 min-h-[100px]"
              >
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold text-sm"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StallFormModal;
