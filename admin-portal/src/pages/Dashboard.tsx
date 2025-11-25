import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBox, FiClock, FiCheckCircle, FiXCircle, FiShoppingBag, FiArrowRight } from "react-icons/fi";
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
  const navigate = useNavigate();
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

  const occupancyRate = stats.stalls > 0 
    ? ((stats.confirmedReservations / stats.stalls) * 100).toFixed(1)
    : "0.0";
  
  const totalReservations = stats.confirmedReservations + stats.cancelledReservations + stats.pendingReservations;
  const cancellationRate = totalReservations > 0
    ? ((stats.cancelledReservations / totalReservations) * 100).toFixed(1)
    : "0.0";

  const statCards = [
    {
      title: "Total Vendors",
      value: stats.vendors,
      icon: <FiUsers className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Stalls",
      value: stats.stalls,
      icon: <FiBox className="w-5 h-5" />,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      title: "Pending Reservations",
      value: stats.pendingReservations,
      icon: <FiClock className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const reservationCards = [
    {
      title: "Confirmed",
      value: stats.confirmedReservations,
      icon: <FiCheckCircle className="w-4 h-4" />,
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      subtitle: `${occupancyRate}% occupancy`,
    },
    {
      title: "Pending",
      value: stats.pendingReservations,
      icon: <FiClock className="w-4 h-4" />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      subtitle: "Awaiting approval",
    },
    {
      title: "Cancelled",
      value: stats.cancelledReservations,
      icon: <FiXCircle className="w-4 h-4" />,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      subtitle: `${cancellationRate}% cancellation rate`,
    },
  ];

  const quickActions = [
    {
      title: "Approve Reservations",
      description: "Review and approve pending reservations",
      action: () => navigate("/reservations"),
      icon: <FiCheckCircle className="w-4 h-4" />,
    },
    {
      title: "Manage Stalls",
      description: "View and manage all exhibition stalls",
      action: () => navigate("/stall-management"),
      icon: <FiBox className="w-4 h-4" />,
    },
    {
      title: "View Vendors",
      description: "Browse and manage vendor accounts",
      action: () => navigate("/vendors"),
      icon: <FiUsers className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#02060d] pt-20 pb-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94a3b8]">CIBF CONTROL ROOM</p>
          <h1 className="text-3xl lg:text-4xl font-semibold text-white">Operational Dashboard</h1>
          <p className="text-sm text-[#94a3b8]">Pulse of the reservation platform at a glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="dark-card p-6 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(circle at top, #22c55e, transparent)" }} />
              <div className="relative flex items-center justify-between mb-6">
                <div className={`${card.bg} ${card.color.replace("text", "text")} p-2.5 rounded-lg`}>
                  {card.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#475569]">LIVE</span>
              </div>
              <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-[0.3em] mb-2">{card.title}</h3>
              <p className="text-3xl font-semibold">{card.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="dark-card p-8 shadow-[0_25px_120px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#0d1627] border border-[#1f2b40] rounded-xl p-3 text-[#22c55e]">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Reservation Statistics</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">Realtime tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reservationCards.map((card, index) => (
              <div
                key={index}
                className="bg-[#0b1320] border border-[#1f2b40] rounded-2xl p-5 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg border border-[#1f2b40] ${card.text.replace("text", "text")}`}>{card.icon}</div>
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                </div>
                <p className="text-3xl font-semibold mb-1">{card.value}</p>
                <p className="text-xs text-[#94a3b8]">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dark-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">Shortcuts</p>
              <h2 className="text-xl text-white font-semibold mt-1">Quick Actions</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="text-left bg-[#0b1320] border border-[#1f2b40] rounded-xl p-5 text-white hover:border-[#22c55e] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#091122] text-[#e2e8f0] p-3 rounded-lg border border-[#1f2b40]">
                    {action.icon}
                  </div>
                  <FiArrowRight className="w-4 h-4 text-[#94a3b8]" />
                </div>
                <h3 className="font-semibold text-base mb-2">{action.title}</h3>
                <p className="text-sm text-[#94a3b8]">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
