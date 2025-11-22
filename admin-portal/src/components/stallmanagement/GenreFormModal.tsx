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
  const [genre, setGenre] = useState<Genre>({ id: 0, name: "", description: "" });

  useEffect(() => {
    if (initialData) {
      setGenre(initialData);
    } else {
      setGenre({ id: 0, name: "", description: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(genre);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{initialData ? "Edit Genre" : "Add Genre"}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Genre Name</label>
            <input
              type="text"
              required
              placeholder="Enter genre name"
              value={genre.name}
              onChange={(e) => setGenre({ ...genre, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Enter genre description"
              value={genre.description}
              onChange={(e) => setGenre({ ...genre, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 resize-none"
            />
          </div>

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

export default GenreFormModal;
