import React, { useState } from "react";
import StallCard from "../components/stallmanagement/StallCard";
import StallFormModal from "../components/stallmanagement/StallFormModal";
import { GenreList } from "../components/stallmanagement/GenreList";
import GenreFormModal from "../components/stallmanagement/GenreFormModal";
import type { Stall } from "../types/stall";
import type { Genre } from "../types/genre";

const initialStalls: Stall[] = [
  { id: 1, stallName: "A1", size: "SMALL", dimension: 10, price: 100, status: "AVAILABLE", positionX: 50, positionY: 50 },
  { id: 2, stallName: "B2", size: "MEDIUM", dimension: 20, price: 200, status: "RESERVED", reservedBy: "User1", reservationId: "R1", positionX: 200, positionY: 80 },
];

const initialGenres: Genre[] = [
  { id: 1, name: "Fiction", description: "Fictional books" },
  { id: 2, name: "Science", description: "Science books" },
];

const StallManagementPage: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>(initialStalls);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | undefined>(undefined);
  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | undefined>(undefined);

  const handleEdit = (stallName: string) => {
    const stall = stalls.find((s) => s.stallName === stallName);
    if (stall) { setEditingStall(stall); setModalOpen(true); }
  };

  const handleSaveStall = (stall: Stall) => {
    if (stall.id) { setStalls((prev) => prev.map((s) => (s.id === stall.id ? { ...s, ...stall } : s))); }
    else { setStalls((prev) => [...prev, { ...stall, id: Date.now(), positionX: 50, positionY: 50 }]); }
    setModalOpen(false); setEditingStall(undefined);
  };

  const handleApprove = (id: number) => { setStalls((prev) => prev.map((s) => (s.id === id ? { ...s, status: "RESERVED" } : s))); };
  const handleCancel = (id: number) => { setStalls((prev) => prev.map((s) => (s.id === id ? { ...s, status: "AVAILABLE", reservedBy: undefined, reservationId: undefined } : s))); };

  const handleEditGenre = (genre: Genre) => { setEditingGenre(genre); setGenreModalOpen(true); };
  const handleDeleteGenre = (id: number) => { setGenres((prev) => prev.filter((g) => g.id !== id)); };
  const handleSaveGenre = (genre: Genre) => {
    if (genre.id) {
      setGenres((prev) => prev.map((g) => (g.id === genre.id ? { ...g, ...genre } : g)));
    } else {
      setGenres((prev) => [...prev, { ...genre, id: Date.now() }]);
    }
    setGenreModalOpen(false);
    setEditingGenre(undefined);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stall Management</h1>
        <button onClick={() => setModalOpen(true)} className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition">Add Stall</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stalls.map((stall) => (
          <StallCard 
          key={stall.id} {...stall} 
          onEdit={handleEdit} 
          onApprove={() => handleApprove(stall.id)} 
          onCancel={() => handleCancel(stall.id)} 
          genres={genres.filter(g => stall.genreIds?.includes(g.id))}/>
        ))}
      </div>
      <StallFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingStall(undefined); }} onSubmit={handleSaveStall} initialData={editingStall} genres={genres}/>
      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Manage Genres</h2>
        <button onClick={() => setGenreModalOpen(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition">Add Genre</button>
      </div>
      <GenreList genres={genres} onEdit={handleEditGenre} onDelete={handleDeleteGenre} />
      <GenreFormModal isOpen={genreModalOpen} onClose={() => { setGenreModalOpen(false); setEditingGenre(undefined); }} onSubmit={handleSaveGenre} initialData={editingGenre} />
    </div>
  );
};

export default StallManagementPage;
