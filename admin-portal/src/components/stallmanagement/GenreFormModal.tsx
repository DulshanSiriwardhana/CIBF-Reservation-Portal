import React, { useState, useEffect } from "react";
import type { Genre } from "../../types/genre";
import { X, Save, BookOpen, FileText } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (genre: Genre) => void;
  initialData?: Genre;
}

const GenreFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [genre, setGenre] = useState<Genre>({ id: 0, name: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setGenre(initialData);
    } else {
      setGenre({ id: 0, name: "", description: "" });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!genre.name.trim()) newErrors.name = "Genre name is required";
    if (!genre.description.trim()) newErrors.description = "Description is required";
    if (genre.description.length < 10) newErrors.description = "Description must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(genre);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {initialData ? "Edit Genre" : "Create New Genre"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {initialData ? "Update genre information" : "Add a new category for your stalls"}
                </p>
              </div>
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
        <div className="p-8 space-y-6">
          {/* Genre Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                Genre Name <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                errors.name ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              placeholder="e.g., Fiction, Science, Art"
              value={genre.name}
              onChange={(e) => setGenre({ ...genre, name: e.target.value })}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                Description <span className="text-red-500">*</span>
              </div>
            </label>
            <textarea
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none ${
                errors.description ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              placeholder="Brief description of the genre category..."
              rows={5}
              value={genre.description}
              onChange={(e) => setGenre({ ...genre, description: e.target.value })}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-500">Minimum 10 characters</p>
              <p className={`text-xs ${genre.description.length < 10 ? "text-slate-400" : "text-green-600"}`}>
                {genre.description.length} characters
              </p>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
            <div className="text-xs font-semibold text-purple-700 mb-2">PREVIEW</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">{genre.name || "Genre Name"}</div>
                <div className="text-sm text-slate-600 line-clamp-2">
                  {genre.description || "Genre description will appear here..."}
                </div>
              </div>
            </div>
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 font-medium"
          >
            <Save size={18} />
            {initialData ? "Update" : "Create"} Genre
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreFormModal;