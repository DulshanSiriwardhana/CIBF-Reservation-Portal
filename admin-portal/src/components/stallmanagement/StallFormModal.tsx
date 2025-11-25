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

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Disable scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      if (isOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(stall);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white border border-[#e1e7ef] rounded-xl shadow-[0_20px_70px_rgba(15,23,42,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#e1e7ef] sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">{initialData ? "Edit Stall" : "Add Stall"}</h2>
            <p className="text-xs text-[#94a3b8] mt-1">{initialData ? "Update stall information" : "Create a new exhibition stall"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors text-[#94a3b8] hover:text-[#0f172a]"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">Stall Name</label>
            <input
              type="text"
              required
              placeholder="Enter stall name"
              value={stall.stallName}
              onChange={(e) => setStall({ ...stall, stallName: e.target.value })}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] placeholder:text-[#94a3b8] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Size</label>
              <select
                value={stall.size}
                onChange={(e) => setStall({ ...stall, size: e.target.value as Stall["size"] })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] transition-all"
              >
                <option value="SMALL" className="bg-white">Small</option>
                <option value="MEDIUM" className="bg-white">Medium</option>
                <option value="LARGE" className="bg-white">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Status</label>
              <select
                value={stall.status}
                onChange={(e) => setStall({ ...stall, status: e.target.value as Stall["status"] })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] transition-all"
              >
                <option value="AVAILABLE" className="bg-white">Available</option>
                <option value="RESERVED" className="bg-white">Reserved</option>
                <option value="MAINTENANCE" className="bg-white">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Dimension (m²)</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                placeholder="0"
                value={stall.dimension}
                onChange={(e) => setStall({ ...stall, dimension: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] placeholder:text-[#94a3b8] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={stall.price}
                onChange={(e) => setStall({ ...stall, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] placeholder:text-[#94a3b8] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Position X</label>
              <input
                type="number"
                min="0"
                placeholder="50"
                value={stall.positionX}
                onChange={(e) => setStall({ ...stall, positionX: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] placeholder:text-[#94a3b8] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Position Y</label>
              <input
                type="number"
                min="0"
                placeholder="50"
                value={stall.positionY}
                onChange={(e) => setStall({ ...stall, positionY: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] placeholder:text-[#94a3b8] transition-all"
              />
            </div>
          </div>

          {genres.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Genres</label>
              <select
                multiple
                value={stall.genreIds?.map(String) || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                  setStall({ ...stall, genreIds: selected });
                }}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] min-h-[120px] transition-all"
              >
                {genres.map(g => (
                  <option key={g.id} value={g.id} className="bg-white py-2">{g.name}</option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8] mt-2">Hold Ctrl/Cmd to select multiple genres</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e7ef]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#e1e7ef] text-[#0f172a] rounded-lg hover:bg-[#f1f5f9] hover:border-[#0f172a] transition-all font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0f0f0f] text-white rounded-lg hover:opacity-90 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
            >
              {initialData ? "Update Stall" : "Create Stall"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StallFormModal;
