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
    onSubmit(genre);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white border border-[#e1e7ef] rounded-xl shadow-[0_20px_70px_rgba(15,23,42,0.15)] max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#e1e7ef]">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">{initialData ? "Edit Genre" : "Add Genre"}</h2>
            <p className="text-xs text-[#94a3b8] mt-1">{initialData ? "Update genre information" : "Create a new book genre"}</p>
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
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">Genre Name</label>
            <input
              type="text"
              required
              placeholder="Enter genre name"
              value={genre.name}
              onChange={(e) => setGenre({ ...genre, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] placeholder:text-[#94a3b8] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Enter genre description"
              value={genre.description}
              onChange={(e) => setGenre({ ...genre, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/60 focus:border-[#0f172a] text-[#0f172a] placeholder:text-[#94a3b8] resize-none transition-all"
            />
          </div>

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
              {initialData ? "Update Genre" : "Create Genre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenreFormModal;
