import React from "react";
import type { Genre } from "../../types/genre";

interface Props {
  genres: Genre[];
  onEdit: (genre: Genre) => void;
  onDelete: (id: number) => void;
}

export const GenreList: React.FC<Props> = ({ genres, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {genres.map((g) => {
        const genreId = g.id;
        const canDelete = typeof genreId === "number";
        return (
          <div key={g.id} className="border rounded-xl p-4 shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{g.name}</h3>
              <p className="text-gray-600">{g.description}</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => onEdit(g)}>Edit</button>
              {canDelete && (
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => onDelete(genreId)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
