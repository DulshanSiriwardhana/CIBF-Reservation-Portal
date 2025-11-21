import React, { useState, useEffect } from "react";
import { FiMap, FiMapPin, FiInfo } from "react-icons/fi";
import { useLoader } from "../context/LoaderContext";
import type { Stall } from "../types/stall";

const MapPage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("map");

  useEffect(() => {
    const fetchStalls = async () => {
      showLoader();
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const mockStalls: Stall[] = [
          { id: 1, stallName: "A1", size: "SMALL", dimension: 10, price: 100, status: "AVAILABLE", positionX: 50, positionY: 50 },
          { id: 2, stallName: "B2", size: "MEDIUM", dimension: 20, price: 200, status: "RESERVED", reservedBy: "User1", reservationId: "R1", positionX: 200, positionY: 80 },
          { id: 3, stallName: "C3", size: "LARGE", dimension: 30, price: 300, status: "AVAILABLE", positionX: 350, positionY: 50 },
          { id: 4, stallName: "D4", size: "SMALL", dimension: 10, price: 100, status: "MAINTENANCE", positionX: 500, positionY: 80 },
          { id: 5, stallName: "E5", size: "MEDIUM", dimension: 20, price: 200, status: "RESERVED", reservedBy: "User2", reservationId: "R2", positionX: 50, positionY: 200 },
          { id: 6, stallName: "F6", size: "LARGE", dimension: 30, price: 300, status: "AVAILABLE", positionX: 200, positionY: 200 },
        ];
        
        setStalls(mockStalls);
      } catch (error) {
        console.error("Error fetching stalls:", error);
      } finally {
        hideLoader();
      }
    };

    fetchStalls();
  }, [showLoader, hideLoader]);

  const getStatusColor = (status: Stall["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-500";
      case "RESERVED":
        return "bg-amber-500";
      case "MAINTENANCE":
        return "bg-rose-500";
    }
  };

  const getStatusText = (status: Stall["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "RESERVED":
        return "Reserved";
      case "MAINTENANCE":
        return "Maintenance";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black text-slate-800 mb-3">
              Stall Map
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Visual overview of all stalls and their status
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                viewMode === "map"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FiMap className="w-5 h-5 inline mr-2" />
              Map View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                viewMode === "grid"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Grid View
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-2 border-slate-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-sm font-medium text-slate-700">Reserved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-rose-500"></div>
              <span className="text-sm font-medium text-slate-700">Maintenance</span>
            </div>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-200 relative overflow-hidden">
            <div className="relative bg-slate-100 rounded-2xl" style={{ minHeight: "600px" }}>
              {stalls.map((stall) => (
                <div
                  key={stall.id}
                  onClick={() => setSelectedStall(stall)}
                  className={`absolute ${getStatusColor(stall.status)} rounded-xl p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-white ${
                    selectedStall?.id === stall.id ? "ring-4 ring-teal-400" : ""
                  }`}
                  style={{
                    left: `${stall.positionX}px`,
                    top: `${stall.positionY}px`,
                    minWidth: "80px",
                  }}
                >
                  <div className="text-white font-black text-center">
                    <FiMapPin className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-sm">{stall.stallName}</div>
                    <div className="text-xs opacity-90">{stall.size}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedStall && (
              <div className="mt-6 bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-black text-slate-800">{selectedStall.stallName}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getStatusColor(selectedStall.status)}`}>
                    {getStatusText(selectedStall.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-slate-600">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Size</p>
                    <p className="font-medium">{selectedStall.size}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Dimension</p>
                    <p className="font-medium">{selectedStall.dimension} m²</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Price</p>
                    <p className="font-medium">${selectedStall.price}</p>
                  </div>
                  {selectedStall.reservedBy && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Reserved By</p>
                      <p className="font-medium">{selectedStall.reservedBy}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stalls.map((stall) => (
              <div
                key={stall.id}
                onClick={() => setSelectedStall(stall)}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 cursor-pointer transition-all hover:shadow-xl ${
                  selectedStall?.id === stall.id
                    ? "border-teal-600 ring-4 ring-teal-200"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${getStatusColor(stall.status)} rounded-lg p-2`}>
                      <FiMapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">{stall.stallName}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(stall.status)}`}>
                    {getStatusText(stall.status)}
                  </span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">Size:</span>
                    <span className="font-medium">{stall.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">Dimension:</span>
                    <span className="font-medium">{stall.dimension} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">Price:</span>
                    <span className="font-medium">${stall.price}</span>
                  </div>
                  {stall.reservedBy && (
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Reserved By:</span>
                      <span className="font-medium">{stall.reservedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {stalls.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
            <FiMap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg font-medium">No stalls available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;

