import React from "react";
import type { Genre } from "../../types/genre";

interface GenreCardProps {
  genre: Genre;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">{genre.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <h3 className="text-slate-900 font-bold text-lg mb-2">{genre.name}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{genre.description}</p>
      </div>
      <div className="mt-4 flex space-x-2 pt-4 border-t border-slate-100">
        {onEdit && (
          <button
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => onEdit(genre.id!)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-red-200"
            onClick={() => onDelete(genre.id!)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default GenreCard;