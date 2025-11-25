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
  }, []);

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
    <div className="min-h-screen bg-[#02060d] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Stall Map</h1>
            <p className="text-sm text-[#94a3b8]">Visual overview of all exhibition stalls</p>
          </div>
          <div className="flex gap-1 bg-[#0b1320] border border-[#1f2b40] rounded p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-[#050c1c] text-white"
                  : "text-[#e2e8f0]"
              }`}
            >
              <FiGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 ${
                viewMode === "map"
                  ? "bg-[#050c1c] text-white"
                  : "text-[#e2e8f0]"
              }`}
            >
              <FiMap className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        <div className="bg-[#0b1320] border border-[#1f2b40] rounded p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-600"></div>
              <span className="text-sm text-[#e2e8f0]">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-600"></div>
              <span className="text-sm text-[#e2e8f0]">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-600"></div>
              <span className="text-sm text-[#e2e8f0]">Maintenance</span>
            </div>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="bg-[#0b1320] border border-[#1f2b40] rounded p-6">
            <div className="relative bg-[#111d30] rounded" style={{ minHeight: "500px" }}>
              {stalls.map((stall) => {
                const statusColors = {
                  AVAILABLE: "bg-green-600",
                  RESERVED: "bg-amber-600",
                  MAINTENANCE: "bg-red-600",
                };
                return (
                  <div
                    key={stall.id}
                    onClick={() => setSelectedStall(stall)}
                    className={`absolute ${statusColors[stall.status]} text-white rounded p-2 shadow cursor-pointer border border-white ${
                      selectedStall?.id === stall.id ? "ring-2 ring-[#22c55e]" : ""
                    }`}
                    style={{
                      left: `${stall.positionX || 50}px`,
                      top: `${stall.positionY || 50}px`,
                      minWidth: "70px",
                    }}
                  >
                    <div className="text-center">
                      <FiMapPin className="w-3 h-3 mx-auto mb-1" />
                      <div className="text-xs font-medium">{stall.stallName}</div>
                      <div className="text-xs opacity-90">{stall.size}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedStall && (
              <div className="mt-4 bg-[#0b1320] rounded border border-[#1f2b40] p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">{selectedStall.stallName}</h3>
                  {getStatusBadge(selectedStall.status)}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[#94a3b8] mb-1">Size</p>
                    <p className="font-medium text-white">{selectedStall.size}</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] mb-1">Dimension</p>
                    <p className="font-medium text-white">{selectedStall.dimension} m²</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] mb-1">Price</p>
                    <p className="font-medium text-white">${selectedStall.price}</p>
                  </div>
                  {selectedStall.reservedBy && (
                    <div>
                      <p className="text-[#94a3b8] mb-1">Reserved By</p>
                      <p className="font-medium text-white">{selectedStall.reservedBy}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stalls.length > 0 ? (
              stalls.map((stall) => (
                <div
                  key={stall.id}
                  onClick={() => setSelectedStall(stall)}
                  className={`bg-[#0b1320] border rounded p-4 cursor-pointer ${
                    selectedStall?.id === stall.id
                      ? "border-[#22c55e] ring-1 ring-[#22c55e]"
                      : "border-[#1f2b40]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#111d30] text-[#e2e8f0] p-1.5 rounded">
                        <FiMapPin className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-semibold text-white">{stall.stallName}</h3>
                    </div>
                    {getStatusBadge(stall.status)}
                  </div>
                  <div className="space-y-1.5 text-sm">
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
                      <div className="flex justify-between pt-1.5 border-t border-[#1f2b40]">
                        <span className="text-[#94a3b8]">Reserved By:</span>
                        <span className="font-medium text-white">{stall.reservedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-[#0b1320] rounded border border-[#1f2b40]">
                <FiMap className="w-10 h-10 text-[#94a3b8] mx-auto mb-3" />
                <p className="text-[#94a3b8] text-sm">No stalls available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
