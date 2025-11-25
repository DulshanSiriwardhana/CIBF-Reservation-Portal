import React, { useState, useEffect } from "react";
import { FiBox, FiPlus, FiEdit, FiTrash2, FiLoader, FiTag } from "react-icons/fi";
import { useLoader } from "../context/LoaderContext";
import { apiService } from "../services/api";
import { useToast } from "../context/ToastContext";
import StallFormModal from "../components/stallmanagement/StallFormModal";
import GenreFormModal from "../components/stallmanagement/GenreFormModal";
import type { Stall } from "../types/stall";
import type { Genre } from "../types/genre";

const StallManagementPage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [stallModalOpen, setStallModalOpen] = useState(false);
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | undefined>(undefined);
  const [editingGenre, setEditingGenre] = useState<Genre | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchStalls = async () => {
    try {
      const data = await apiService.getAllStalls();
      setStalls(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast("Failed to load stalls", "error");
    }
  };

  const fetchGenres = async () => {
    try {
      const data = await apiService.getAllGenres();
      setGenres(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast("Failed to load genres", "error");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      showLoader();
      setLoading(true);
      await Promise.all([fetchStalls(), fetchGenres()]);
      hideLoader();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleEditStall = (stall: Stall) => {
    setEditingStall(stall);
    setStallModalOpen(true);
  };

  const handleDeleteStall = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this stall?")) return;

    setLoading(true);
    try {
      await apiService.deleteStall(id);
      showToast("Stall deleted successfully", "success");
      await fetchStalls();
    } catch (error: any) {
      showToast(error.message || "Failed to delete stall", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStall = async (stall: Stall) => {
    setLoading(true);
    try {
      if (stall.id) {
        await apiService.updateStall(stall.id, stall);
        showToast("Stall updated successfully", "success");
      } else {
        await apiService.createStall(stall);
        showToast("Stall created successfully", "success");
      }
      await fetchStalls();
      setStallModalOpen(false);
      setEditingStall(undefined);
    } catch (error: any) {
      showToast(error.message || "Failed to save stall", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGenre = (genre: Genre) => {
    setEditingGenre(genre);
    setGenreModalOpen(true);
  };

  const handleDeleteGenre = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this genre?")) return;

    setLoading(true);
    try {
      await apiService.deleteGenre(id);
      showToast("Genre deleted successfully", "success");
      await fetchGenres();
    } catch (error: any) {
      showToast(error.message || "Failed to delete genre", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGenre = async (genre: Genre) => {
    setLoading(true);
    try {
      if (genre.id && genre.id > 0) {
        await apiService.updateGenre(genre.id, genre);
        showToast("Genre updated successfully", "success");
      } else {
        const { id, ...genreData } = genre;
        await apiService.createGenre(genreData);
        showToast("Genre created successfully", "success");
      }
      await fetchGenres();
      setGenreModalOpen(false);
      setEditingGenre(undefined);
    } catch (error: any) {
      showToast(error.message || "Failed to save genre", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Stall["status"]) => {
    const styles = {
      AVAILABLE: "bg-green-100 text-green-800 border-green-300",
      RESERVED: "bg-amber-100 text-amber-800 border-amber-300",
      MAINTENANCE: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#02060d] pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1">Stall Management</h1>
            <p className="text-sm text-[#94a3b8]">Manage exhibition stalls and genres</p>
          </div>
          <button
            onClick={() => {
              setEditingStall(undefined);
              setStallModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#20b368] text-[#04110a] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <FiPlus className="w-4 h-4" />
            Add Stall
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading && stalls.length === 0 ? (
            <div className="col-span-full flex justify-center py-12">
              <FiLoader className="w-6 h-6 text-[#94a3b8] animate-spin" />
            </div>
          ) : stalls.length > 0 ? (
            stalls.map((stall) => (
              <div
                key={stall.id}
                className="bg-[#0b1320] border border-[#1f2b40] rounded p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-[#111d30] rounded flex items-center justify-center">
                        <FiBox className="w-4 h-4 text-[#94a3b8]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{stall.stallName}</h3>
                        {getStatusBadge(stall.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditStall(stall)}
                      className="p-2 text-[#94a3b8] bg-[#0b1320] rounded"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStall(stall.id)}
                      className="p-2 text-[#f87171] bg-[#2b0b12] rounded"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm pt-4 border-t border-[#1f2b40]">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Size:</span>
                    <span className="font-medium text-white">{stall.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Dimension:</span>
                    <span className="font-medium text-white">{stall.dimension} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Price:</span>
                    <span className="font-medium text-white">${stall.price}</span>
                  </div>
                  {stall.reservedBy && (
                    <div className="flex justify-between pt-2 border-t border-[#1f2b40]">
                      <span className="text-[#94a3b8]">Reserved By:</span>
                      <span className="font-medium text-white">{stall.reservedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-[#0b1320] rounded border border-[#1f2b40]">
              <FiBox className="w-10 h-10 text-[#94a3b8] mx-auto mb-3" />
              <p className="text-[#94a3b8] text-sm">No stalls found</p>
            </div>
          )}
        </div>

        <div className="bg-[#0b1320] border border-[#1f2b40] rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Genres</h2>
              <p className="text-xs text-[#94a3b8]">Manage book genres for categorization</p>
            </div>
            <button
              onClick={() => {
                setEditingGenre(undefined);
                setGenreModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#20b368] text-[#04110a] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <FiPlus className="w-4 h-4" />
              Add Genre
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genres.length > 0 ? (
              genres.map((genre) => (
                <div
                  key={genre.id}
                  className="border border-[#1f2b40] rounded p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FiTag className="w-4 h-4 text-[#94a3b8]" />
                      <h3 className="font-medium text-white">{genre.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditGenre(genre)}
                        className="p-1.5 text-[#94a3b8] bg-[#0b1320] rounded"
                        title="Edit"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGenre(genre.id!)}
                        className="p-1.5 text-[#f87171] bg-[#2b0b12] rounded"
                        title="Delete"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#94a3b8]">{genre.description || "No description"}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <FiTag className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                <p className="text-[#94a3b8] text-sm">No genres found</p>
              </div>
            )}
          </div>
        </div>

        <StallFormModal
          isOpen={stallModalOpen}
          onClose={() => {
            setStallModalOpen(false);
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
    </div>
  );
};

export default StallManagementPage;
