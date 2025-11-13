import React, { useState } from "react";
import StallCard from "../components/stallmanagement/StallCard";
import StallFormModal from "../components/stallmanagement/StallFormModal";
import { GenreList } from "../components/stallmanagement/GenreList";
import type { Genre } from "../types/genre";

interface Stall {
  id: number;
  stallName: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  dimension: number;
  price: number;
  status: "AVAILABLE" | "RESERVED" | "MAINTENANCE";
  reservedBy?: string;
  reservationId?: string;
  positionX: number;
  positionY: number;
}

const initialStalls: Stall[] = [
  { id: 1, stallName: "A1", size: "SMALL", dimension: 10, price: 100, status: "AVAILABLE", positionX: 50, positionY: 50 },
  { id: 2, stallName: "B2", size: "MEDIUM", dimension: 20, price: 200, status: "RESERVED", reservedBy: "User1", reservationId: "R1", positionX: 200, positionY: 80 },
  { id: 3, stallName: "C3", size: "LARGE", dimension: 30, price: 300, status: "MAINTENANCE", positionX: 400, positionY: 120 },
];

const StallManagementPage: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>(initialStalls);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | undefined>(undefined);

  const [genres, setGenres] = useState<Genre[]>([
    { id: 1, name: "Fiction", description: "Fictional books", exhibitorIDs: [], createdAt: "", updatedAt: "" },
    { id: 2, name: "Science", description: "Science books", exhibitorIDs: [], createdAt: "", updatedAt: "" },
    ]);

  const handleEdit = (stallName: string) => {
    const stall = stalls.find((s) => s.stallName === stallName);
    if (stall) {
      setEditingStall(stall);
      setModalOpen(true);
    }
  };

  const handleSaveStall = (stall: Stall) => {
    if (stall.id) {
      setStalls((prev) => prev.map((s) => (s.id === stall.id ? { ...s, ...stall } : s)));
    } else {
      setStalls((prev) => [...prev, { ...stall, id: Date.now(), positionX: 50, positionY: 50 }]);
    }
  };

  const handleApprove = (id: number) => {
    setStalls((prev) => prev.map((s) => (s.id === id ? { ...s, status: "RESERVED" } : s)));
  };

  const handleCancel = (id: number) => {
    setStalls((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "AVAILABLE", reservedBy: undefined, reservationId: undefined } : s
      )
    );
  };

  const handleEditGenre = (id: number) => {
    alert(`Edit genre ${id}`);
  };

  const handleDeleteGenre = (id: number) => {
    setGenres((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stall Management</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
        >
          Add Stall
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stalls.map((stall) => (
          <StallCard
            key={stall.id}
            {...stall}
            onEdit={handleEdit}
            onApprove={() => handleApprove(stall.id)}
            onCancel={() => handleCancel(stall.id)}
          />
        ))}
      </div>

      <StallFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingStall(undefined); }}
        onSubmit={handleSaveStall}
        initialData={editingStall}
      />
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Manage Genres</h2>
        <GenreList
            genres={genres}
            onEdit={(id) => handleEditGenre(id)}
            onDelete={(id) => handleDeleteGenre(id)}
        />
        </div>
    </div>
  );
};

export default StallManagementPage;
