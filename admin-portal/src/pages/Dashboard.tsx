import React, { useEffect, useState } from "react";
import { FiUsers, FiBox, FiClock, FiCheckCircle, FiXCircle, FiShoppingBag } from "react-icons/fi";
import { useLoader } from "../context/LoaderContext";
import { apiService } from "../services/api";
import { useToast } from "../context/ToastContext";

interface DashboardStats {
  vendors: number;
  stalls: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
}

const Dashboard: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    vendors: 0,
    stalls: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    cancelledReservations: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      showLoader();
      try {
        const [stalls, reservations] = await Promise.all([
          apiService.getAllStalls().catch(() => []),
          apiService.getAllReservations().catch(() => []),
        ]);

        const totalStalls = Array.isArray(stalls) ? stalls.length : 0;
        const reservationsArray = Array.isArray(reservations) ? reservations : [];
        const pending = reservationsArray.filter((r: any) => r.status === "PENDING").length;
        const confirmed = reservationsArray.filter((r: any) => r.status === "CONFIRMED").length;
        const cancelled = reservationsArray.filter((r: any) => r.status === "CANCELLED").length;

        const uniqueVendors = new Set(
          reservationsArray.map((r: any) => r.userId).filter((id: any) => id)
        ).size;

        setStats({
          vendors: uniqueVendors,
          stalls: totalStalls,
          pendingReservations: pending,
          confirmedReservations: confirmed,
          cancelledReservations: cancelled,
        });
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        showToast("Failed to load dashboard data", "error");
      } finally {
        hideLoader();
      }
    };

    fetchDashboardData();
  }, []);

  const occupancyRate = stats.stalls > 0 ? ((stats.confirmedReservations / stats.stalls) * 100).toFixed(1) : "0.0";
  const totalReservations = stats.confirmedReservations + stats.cancelledReservations + stats.pendingReservations;
  const cancellationRate = totalReservations > 0 ? ((stats.cancelledReservations / totalReservations) * 100).toFixed(1) : "0.0";

  const statCards = [
    {
      title: "Total Vendors",
      value: stats.vendors,
      icon: <FiUsers className="w-5 h-5" />,
      chipClass: "bg-[#0f0f0f] text-white",
      hint: "Vendor accounts",
    },
    {
      title: "Total Stalls",
      value: stats.stalls,
      icon: <FiBox className="w-5 h-5" />,
      chipClass: "bg-[#f1f5f9] text-[#0f172a]",
      hint: "Active spaces",
    },
    {
      title: "Pending Reservations",
      value: stats.pendingReservations,
      icon: <FiClock className="w-5 h-5" />,
      chipClass: "bg-[#fff6e4] text-[#b45309]",
      hint: "Awaiting action",
    },
  ];

  const reservationCards = [
    {
      title: "Confirmed",
      value: stats.confirmedReservations,
      icon: <FiCheckCircle className="w-4 h-4" />,
      accent: "text-[#0f172a]",
      border: "border-[#e1e7ef]",
      subtitle: `${occupancyRate}% occupancy`,
    },
    {
      title: "Pending",
      value: stats.pendingReservations,
      icon: <FiClock className="w-4 h-4" />,
      accent: "text-[#b45309]",
      border: "border-[#fde7c7]",
      subtitle: "Awaiting approval",
    },
    {
      title: "Cancelled",
      value: stats.cancelledReservations,
      icon: <FiXCircle className="w-4 h-4" />,
      accent: "text-[#dc2626]",
      border: "border-[#ffe4e6]",
      subtitle: `${cancellationRate}% cancellation rate`,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f8fb] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#94a3b8]">CIBF Control Room</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#0f172a]">Operational Dashboard</h1>
          <p className="text-sm text-[#475569]">Pulse of the reservation platform at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, index) => (
            <div key={index} className="surface-card p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(183,255,94,0.35), transparent 55%)" }} />
              <div className="relative flex items-center justify-between mb-4">
                <div className={`${card.chipClass} px-3 py-2 rounded-2xl text-xs font-semibold`}>{card.icon}</div>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#94a3b8]">LIVE</span>
              </div>
              <h3 className="text-xs font-medium text-[#94a3b8] uppercase tracking-[0.3em] mb-2">{card.title}</h3>
              <p className="text-3xl font-semibold text-[#0f172a]">{card.value.toLocaleString()}</p>
              <p className="text-xs text-[#94a3b8] mt-2">{card.hint}</p>
            </div>
          ))}
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#0f0f0f] text-white flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">Reservation Statistics</h2>
              <p className="text-xs uppercase tracking-[0.4em] text-[#94a3b8]">Realtime tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reservationCards.map((card, index) => (
              <div key={index} className={`bg-white border ${card.border} rounded-xl p-5`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl bg-[#f8fafc] ${card.accent}`}>{card.icon}</div>
                  <h3 className="text-sm font-medium text-[#0f172a]">{card.title}</h3>
                </div>
                <p className="text-3xl font-semibold text-[#0f172a] mb-1">{card.value}</p>
                <p className="text-xs text-[#94a3b8]">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
