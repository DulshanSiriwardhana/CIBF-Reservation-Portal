import React, { useState, useEffect } from "react";
import type { Stall } from "../../types/stall";
import type { Genre } from "../../types/genre";
import { X, Save, DollarSign, Maximize2, Tag } from "lucide-react";

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

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!stall.stallName.trim()) newErrors.stallName = "Stall name is required";
    if (stall.dimension <= 0) newErrors.dimension = "Dimension must be greater than 0";
    if (stall.price <= 0) newErrors.price = "Price must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(stall);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {initialData ? "Edit Stall" : "Create New Stall"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {initialData ? "Update stall information" : "Add a new stall to your marketplace"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Stall Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Stall Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.stallName ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              placeholder="e.g., A1, B2, C3"
              value={stall.stallName}
              onChange={(e) => setStall({ ...stall, stallName: e.target.value })}
            />
            {errors.stallName && <p className="text-xs text-red-600 mt-1">{errors.stallName}</p>}
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Stall Size <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["SMALL", "MEDIUM", "LARGE"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setStall({ ...stall, size: size as Stall["size"] })}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    stall.size === size
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {size === "SMALL" ? "S" : size === "MEDIUM" ? "M" : "L"}
                  </div>
                  <div className="text-xs">{size}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Maximize2 size={16} />
                  Dimension (m²) <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="number"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.dimension ? "border-red-300 bg-red-50" : "border-slate-300"
                }`}
                placeholder="0"
                min="0"
                value={stall.dimension || ""}
                onChange={(e) => setStall({ ...stall, dimension: Number(e.target.value) })}
              />
              {errors.dimension && <p className="text-xs text-red-600 mt-1">{errors.dimension}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  Price ($) <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="number"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.price ? "border-red-300 bg-red-50" : "border-slate-300"
                }`}
                placeholder="0"
                min="0"
                value={stall.price || ""}
                onChange={(e) => setStall({ ...stall, price: Number(e.target.value) })}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <Tag size={16} />
                Genres
              </div>
            </label>
            <div className="border border-slate-300 rounded-xl p-4 max-h-48 overflow-y-auto bg-slate-50">
              {genres.length > 0 ? (
                <div className="space-y-2">
                  {genres.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={stall.genreIds?.includes(g.id)}
                        onChange={(e) => {
                          const newGenreIds = e.target.checked
                            ? [...(stall.genreIds || []), g.id]
                            : (stall.genreIds || []).filter((id) => id !== g.id);
                          setStall({ ...stall, genreIds: newGenreIds });
                        }}
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                          {g.name}
                        </div>
                        <div className="text-xs text-slate-500">{g.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No genres available</p>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">Select genres that apply to this stall</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 rounded-b-3xl flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
          >
            <Save size={18} />
            {initialData ? "Update" : "Create"} Stall
          </button>
        </div>
      </div>
    </div>
  );
};

export default StallFormModal;