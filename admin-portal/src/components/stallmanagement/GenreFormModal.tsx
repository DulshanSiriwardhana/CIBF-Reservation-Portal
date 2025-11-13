import React, { useState, useEffect } from "react";
import type { Genre } from "../../types/genre";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (genre: Genre) => void;
  initialData?: Genre;
}

const GenreFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [genre, setGenre] = useState<Genre>({ id: 0, name: "", description: "" });

  useEffect(() => { if (initialData) setGenre(initialData); }, [initialData]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Genre" : "Add Genre"}</h2>
        <input className="border p-2 w-full mb-2" placeholder="Name" value={genre.name} onChange={(e) => setGenre({ ...genre, name: e.target.value })} />
        <textarea className="border p-2 w-full mb-2" placeholder="Description" value={genre.description} onChange={(e) => setGenre({ ...genre, description: e.target.value })} />
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded" onClick={() => onSubmit(genre)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default GenreFormModal;
