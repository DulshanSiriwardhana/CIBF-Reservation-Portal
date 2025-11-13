import React from "react";
import type { Genre } from "../../types/genre";
import GenreCard from "./GenreCard";

interface GenreListProps {
  genres: Genre[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const GenreList: React.FC<GenreListProps> = ({ genres, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {genres.map((genre) => (
        <GenreCard key={genre.id} genre={genre} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
