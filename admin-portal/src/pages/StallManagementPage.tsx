import React, { useState } from "react";
import StallCard from "../components/stallmanagement/StallCard";
import StallFormModal from "../components/stallmanagement/StallFormModal";
import GenreCard from "../components/stallmanagement/GenreCard";
import GenreFormModal from "../components/stallmanagement/GenreFormModal";
import type { Stall } from "../types/stall";
import type { Genre } from "../types/genre";
import { Plus, Grid3x3, LayoutList } from "lucide-react";

const initialStalls: Stall[] = [
  { id: 1, stallName: "A1", size: "SMALL", dimension: 10, price: 100, status: "AVAILABLE", positionX: 50, positionY: 50, genreIds: [1] },
  { id: 2, stallName: "B2", size: "MEDIUM", dimension: 20, price: 200, status: "RESERVED", reservedBy: "John Doe", reservationId: "R1", positionX: 200, positionY: 80, genreIds: [1, 2] },
  { id: 3, stallName: "C3", size: "LARGE", dimension: 30, price: 300, status: "MAINTENANCE", positionX: 350, positionY: 120, genreIds: [2] },
  { id: 4, stallName: "D4", size: "MEDIUM", dimension: 25, price: 250, status: "AVAILABLE", positionX: 150, positionY: 200, genreIds: [3] },
];

const initialGenres: Genre[] = [
  { id: 1, name: "Fiction", description: "Fictional books and literature" },
  { id: 2, name: "Science", description: "Science and technology books" },
  { id: 3, name: "Art", description: "Art and design materials" },
];

const StallManagementPage: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>(initialStalls);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | undefined>(undefined);
  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"stalls" | "genres">("stalls");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    setModalOpen(false);
    setEditingStall(undefined);
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

  const handleEditGenre = (genre: Genre) => {
    setEditingGenre(genre);
    setGenreModalOpen(true);
  };

  const handleDeleteGenre = (id: number) => {
    setGenres((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSaveGenre = (genre: Genre) => {
    if (genre.id) {
      setGenres((prev) => prev.map((g) => (g.id === genre.id ? { ...g, ...genre } : g)));
    } else {
      setGenres((prev) => [...prev, { ...genre, id: Date.now() }]);
    }
    setGenreModalOpen(false);
    setEditingGenre(undefined);
  };

  const stats = {
    total: stalls.length,
    available: stalls.filter((s) => s.status === "AVAILABLE").length,
    reserved: stalls.filter((s) => s.status === "RESERVED").length,
    maintenance: stalls.filter((s) => s.status === "MAINTENANCE").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Stall Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">Manage your marketplace with ease</p>
            </div>
            <button
              onClick={() => (activeTab === "stalls" ? setModalOpen(true) : setGenreModalOpen(true))}
              className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="font-medium">Add {activeTab === "stalls" ? "Stall" : "Genre"}</span>
            </button>
          </div>

          {/* Stats Cards */}
          {activeTab === "stalls" && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-xs text-slate-500 mt-1">Total Stalls</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                <div className="text-2xl font-bold text-emerald-700">{stats.available}</div>
                <div className="text-xs text-emerald-600 mt-1">Available</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                <div className="text-2xl font-bold text-amber-700">{stats.reserved}</div>
                <div className="text-xs text-amber-600 mt-1">Reserved</div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="text-2xl font-bold text-slate-700">{stats.maintenance}</div>
                <div className="text-xs text-slate-500 mt-1">Maintenance</div>
              </div>
            </div>
          )}

          {/* Tabs & View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("stalls")}
                className={`px-6 py-2 font-medium text-sm rounded-lg transition-all ${
                  activeTab === "stalls"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Stalls ({stalls.length})
              </button>
              <button
                onClick={() => setActiveTab("genres")}
                className={`px-6 py-2 font-medium text-sm rounded-lg transition-all ${
                  activeTab === "genres"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Genres ({genres.length})
              </button>
            </div>

            {activeTab === "stalls" && (
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "stalls" ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {stalls.map((stall) => (
              <StallCard
                key={stall.id}
                stall={stall}
                onEdit={handleEdit}
                onApprove={() => handleApprove(stall.id)}
                onCancel={() => handleCancel(stall.id)}
                genres={genres.filter((g) => stall.genreIds?.includes(g.id))}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genres.map((genre) => (
              <GenreCard
                key={genre.id}
                genre={genre}
                onEdit={() => handleEditGenre(genre)}
                onDelete={() => handleDeleteGenre(genre.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <StallFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStall(undefined);
        }}
        onSubmit={handleSaveStall}
        initialData={editingStall}
        genres={genres}
      />

      <GenreFormModal
        isOpen={genreModalOpen}
        onClose={() => {
          setGenreModalOpen(false);
          setEditingGenre(undefined);
        }}
        onSubmit={handleSaveGenre}
        initialData={editingGenre}
      />
    </div>
  );
};

export default StallManagementPage;