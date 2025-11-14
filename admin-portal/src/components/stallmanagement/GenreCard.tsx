import React from "react";
import type { Genre } from "../../types/genre";

interface GenreCardProps {
  genre: Genre;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, onEdit, onDelete }) => {
  return (
    <div className="bg-gradient-to-r from-cyan-400 to-teal-500 p-4 rounded-xl shadow-lg flex flex-col justify-between">
      <div>
        <h3 className="text-white font-bold text-lg">{genre.name}</h3>
        <p className="text-white/80 text-sm">{genre.description}</p>
      </div>
      <div className="mt-3 flex space-x-2">
        {onEdit && (
          <button
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm"
            onClick={() => onEdit(genre.id)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            onClick={() => onDelete(genre.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default GenreCard;