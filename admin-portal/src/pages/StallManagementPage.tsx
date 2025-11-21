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
    <div className="min-h-screen bg-slate-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-black text-slate-800 mb-3">Stall Management</h1>
              <p className="text-slate-600 text-lg font-medium">Manage stalls, genres, and reservations</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-bold shadow-lg hover:shadow-xl">Add Stall</button>
          </div>
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
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Manage Genres</h2>
              <p className="text-slate-600 text-sm font-medium">Organize book genres for stall categorization</p>
            </div>
            <button onClick={() => setGenreModalOpen(true)} className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-bold shadow-lg hover:shadow-xl">Add Genre</button>
          </div>
          <GenreList genres={genres} onEdit={handleEditGenre} onDelete={handleDeleteGenre} />
        </div>
        <StallFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingStall(undefined); }} onSubmit={handleSaveStall} initialData={editingStall} genres={genres}/>
        <GenreFormModal isOpen={genreModalOpen} onClose={() => { setGenreModalOpen(false); setEditingGenre(undefined); }} onSubmit={handleSaveGenre} initialData={editingGenre} />
      </div>
    </div>
  );
};

export default StallManagementPage;
