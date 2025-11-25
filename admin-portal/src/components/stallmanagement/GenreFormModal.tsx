import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import type { Genre } from "../../types/genre";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (genre: Genre) => void;
  initialData?: Genre;
}

const GenreFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [genre, setGenre] = useState<Omit<Genre, 'id'> & { id?: number }>({ name: "", description: "" });

  useEffect(() => {
    if (initialData) {
      setGenre(initialData);
    } else {
      setGenre({ name: "", description: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(genre);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-[#0b1320] border border-[#1f2b40] rounded-xl shadow-2xl max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#1f2b40]">
          <h2 className="text-xl font-semibold text-white">{initialData ? "Edit Genre" : "Add Genre"}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#111e34] rounded-lg transition-colors text-[#94a3b8] hover:text-white"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Genre Name</label>
            <input
              type="text"
              required
              placeholder="Enter genre name"
              value={genre.name}
              onChange={(e) => setGenre({ ...genre, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#111e34] border border-[#1f2b40] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e] text-white placeholder:text-[#475569] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Enter genre description"
              value={genre.description}
              onChange={(e) => setGenre({ ...genre, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#111e34] border border-[#1f2b40] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e] text-white placeholder:text-[#475569] resize-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1f2b40]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#1f2b40] text-[#94a3b8] rounded-lg hover:bg-[#111e34] hover:border-[#273654] transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#20b368] text-[#04110a] rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenreFormModal;
