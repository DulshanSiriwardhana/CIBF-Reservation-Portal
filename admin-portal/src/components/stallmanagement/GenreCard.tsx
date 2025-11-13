import React from "react";
import type { Genre } from "../../types/genre";
import { Edit2, Trash2, BookOpen } from "lucide-react";

interface GenreCardProps {
  genre: Genre;
  onEdit: () => void;
  onDelete: () => void;
}

const gradients = [
  "from-violet-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-pink-500",
  "from-rose-500 to-red-500",
  "from-indigo-500 to-blue-500",
];

const GenreCard: React.FC<GenreCardProps> = ({ genre, onEdit, onDelete }) => {
  const gradientClass = gradients[genre.id % gradients.length];

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all hover:scale-105">
      {/* Colored Top Bar */}
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      
      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
              <BookOpen size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {genre.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradientClass}`} />
                <span className="text-xs text-slate-500">Genre Category</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={onEdit}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
          {genre.description}
        </p>

        {/* Footer Stats (Optional) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">ID: {genre.id}</span>
          <div className={`px-2.5 py-1 bg-gradient-to-r ${gradientClass} bg-opacity-10 rounded-lg`}>
            <span className="text-xs font-medium text-slate-700">Active</span>
          </div>
        </div>
      </div>

      {/* Hover Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
    </div>
  );
};

export default GenreCard;