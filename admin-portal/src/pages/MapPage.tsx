import React, { useState, useEffect } from "react";
import { FiMap, FiMapPin, FiGrid } from "react-icons/fi";
import { useLoader } from "../context/LoaderContext";
import { apiService } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { Stall } from "../types/stall";

const MapPage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    const fetchStalls = async () => {
      showLoader();
      try {
        const data = await apiService.getAllStalls();
        setStalls(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error("Error fetching stalls:", error);
        showToast("Failed to load stalls", "error");
      } finally {
        hideLoader();
      }
    };

    fetchStalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusBadge = (status: Stall["status"]) => {
    const styles = {
      AVAILABLE: "bg-emerald-100 text-emerald-800 border-emerald-300",
      RESERVED: "bg-amber-100 text-amber-800 border-amber-300",
      MAINTENANCE: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Stall Map</h1>
            <p className="text-slate-600 text-lg">Visual overview of all exhibition stalls</p>
          </div>
          <div className="flex gap-2 bg-white border-2 border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FiGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                viewMode === "map"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FiMap className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-600"></div>
              <span className="text-sm font-medium text-slate-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-600"></div>
              <span className="text-sm font-medium text-slate-700">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              <span className="text-sm font-medium text-slate-700">Maintenance</span>
            </div>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 relative overflow-hidden">
            <div className="relative bg-slate-100 rounded-lg" style={{ minHeight: "600px" }}>
              {stalls.map((stall) => {
                const statusColors = {
                  AVAILABLE: "bg-emerald-600",
                  RESERVED: "bg-amber-600",
                  MAINTENANCE: "bg-red-600",
                };
                return (
                  <div
                    key={stall.id}
                    onClick={() => setSelectedStall(stall)}
                    className={`absolute ${statusColors[stall.status]} text-white rounded-lg p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-white ${
                      selectedStall?.id === stall.id ? "ring-4 ring-slate-900" : ""
                    }`}
                    style={{
                      left: `${stall.positionX || 50}px`,
                      top: `${stall.positionY || 50}px`,
                      minWidth: "80px",
                    }}
                  >
                    <div className="text-center">
                      <FiMapPin className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-sm font-bold">{stall.stallName}</div>
                      <div className="text-xs opacity-90">{stall.size}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedStall && (
              <div className="mt-6 bg-slate-50 rounded-lg border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{selectedStall.stallName}</h3>
                  {getStatusBadge(selectedStall.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Size</p>
                    <p className="font-semibold text-slate-900">{selectedStall.size}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Dimension</p>
                    <p className="font-semibold text-slate-900">{selectedStall.dimension} m²</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Price</p>
                    <p className="font-semibold text-slate-900">${selectedStall.price}</p>
                  </div>
                  {selectedStall.reservedBy && (
                    <div>
                      <p className="text-slate-600 mb-1">Reserved By</p>
                      <p className="font-semibold text-slate-900">{selectedStall.reservedBy}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stalls.length > 0 ? (
              stalls.map((stall) => (
                <div
                  key={stall.id}
                  onClick={() => setSelectedStall(stall)}
                  className={`bg-white rounded-lg border ${
                    selectedStall?.id === stall.id
                      ? "border-slate-900 ring-2 ring-slate-900"
                      : "border-slate-200"
                  } shadow-sm p-6 cursor-pointer hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 text-slate-700 p-2 rounded-lg">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{stall.stallName}</h3>
                    </div>
                    {getStatusBadge(stall.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Size:</span>
                      <span className="font-semibold text-slate-900">{stall.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dimension:</span>
                      <span className="font-semibold text-slate-900">{stall.dimension} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Price:</span>
                      <span className="font-semibold text-slate-900">${stall.price}</span>
                    </div>
                    {stall.reservedBy && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Reserved By:</span>
                        <span className="font-semibold text-slate-900">{stall.reservedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-slate-200">
                <FiMap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No stalls available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
