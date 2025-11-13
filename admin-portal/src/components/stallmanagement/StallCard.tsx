import React from "react";
import type { Stall } from "../../types/stall";
import type { Genre } from "../../types/genre";
import { Edit2, Check, X, DollarSign, Maximize2 } from "lucide-react";

interface StallCardProps {
  stall: Stall;
  onEdit: (stallName: string) => void;
  onApprove: () => void;
  onCancel: () => void;
  genres?: Genre[];
  viewMode?: "grid" | "list";
}

const statusConfig = {
  AVAILABLE: {
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    glow: "shadow-emerald-100",
  },
  RESERVED: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    glow: "shadow-amber-100",
  },
  MAINTENANCE: {
    bg: "bg-gradient-to-br from-slate-50 to-gray-50",
    border: "border-slate-200",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    glow: "shadow-slate-100",
  },
};

const sizeConfig = {
  SMALL: { icon: "S", color: "bg-blue-100 text-blue-700" },
  MEDIUM: { icon: "M", color: "bg-purple-100 text-purple-700" },
  LARGE: { icon: "L", color: "bg-pink-100 text-pink-700" },
};

const StallCard: React.FC<StallCardProps> = ({
  stall,
  onEdit,
  onApprove,
  onCancel,
  genres,
  viewMode = "grid",
}) => {
  const config = statusConfig[stall.status];
  const sizeInfo = sizeConfig[stall.size];

  if (viewMode === "list") {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:scale-[1.02] group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            {/* Stall Name & Size */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${sizeInfo.color} rounded-xl flex items-center justify-center font-bold text-lg`}>
                {sizeInfo.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{stall.stallName}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge} mt-1`}>
                  {stall.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center gap-8 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <Maximize2 size={16} className="text-slate-400" />
                <span className="text-slate-600">{stall.dimension} m²</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={16} className="text-slate-400" />
                <span className="font-semibold text-slate-900">${stall.price}</span>
              </div>
              {stall.reservedBy && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-slate-600">{stall.reservedBy}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="flex gap-1.5">
                {genres.slice(0, 3).map((g) => (
                  <span key={g.id} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100">
                    {g.name}
                  </span>
                ))}
                {genres.length > 3 && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                    +{genres.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(stall.stallName)}
              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              <Edit2 size={18} />
            </button>
            {stall.status === "AVAILABLE" && (
              <button
                onClick={onApprove}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium text-sm"
              >
                <Check size={16} />
                Reserve
              </button>
            )}
            {stall.status === "RESERVED" && (
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium text-sm"
              >
                <X size={16} />
                Release
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${config.bg} rounded-2xl border ${config.border} overflow-hidden hover:shadow-xl ${config.glow} transition-all hover:scale-105 group backdrop-blur-sm`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${sizeInfo.color} rounded-xl flex items-center justify-center font-bold text-lg shadow-sm`}>
              {sizeInfo.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {stall.stallName}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge} mt-1`}>
                {stall.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => onEdit(stall.stallName)}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white/80 rounded-xl transition-all opacity-0 group-hover:opacity-100"
          >
            <Edit2 size={18} />
          </button>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Maximize2 size={16} className="text-slate-400" />
              <span>Dimension</span>
            </div>
            <span className="font-semibold text-slate-900">{stall.dimension} m²</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <DollarSign size={16} className="text-slate-400" />
              <span>Price</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">${stall.price}</span>
          </div>
          {stall.reservedBy && (
            <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-200/50">
              <span className="text-slate-600">Reserved By</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="font-medium text-slate-900">{stall.reservedBy}</span>
              </div>
            </div>
          )}
        </div>

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 pt-4 border-t border-slate-200/50">
            {genres.map((g) => (
              <span
                key={g.id}
                className="px-2.5 py-1 bg-white/70 backdrop-blur-sm text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100 shadow-sm"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        {stall.status === "AVAILABLE" && (
          <button
            onClick={onApprove}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 font-medium"
          >
            <Check size={18} />
            Mark as Reserved
          </button>
        )}
        {stall.status === "RESERVED" && (
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white transition-all border border-slate-200 font-medium"
          >
            <X size={18} />
            Mark as Available
          </button>
        )}
      </div>
    </div>
  );
};

export default StallCard;