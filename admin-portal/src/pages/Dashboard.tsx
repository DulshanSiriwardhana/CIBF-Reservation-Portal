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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      icon: <FiUsers className="w-6 h-6" />,
      bgColor: "bg-slate-100",
      iconColor: "text-slate-700",
      borderColor: "border-slate-200",
    },
    {
      title: "Total Stalls",
      value: stats.stalls,
      icon: <FiBox className="w-6 h-6" />,
      bgColor: "bg-slate-100",
      iconColor: "text-slate-700",
      borderColor: "border-slate-200",
    },
    {
      title: "Pending Reservations",
      value: stats.pendingReservations,
      icon: <FiClock className="w-6 h-6" />,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-700",
      borderColor: "border-amber-200",
    },
  ];

  const reservationCards = [
    {
      title: "Confirmed",
      value: stats.confirmedReservations,
      icon: <FiCheckCircle className="w-5 h-5" />,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      subtitle: `${occupancyRate}% occupancy`,
    },
    {
      title: "Pending",
      value: stats.pendingReservations,
      icon: <FiClock className="w-5 h-5" />,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-700",
      borderColor: "border-amber-200",
      subtitle: "Awaiting approval",
    },
    {
      title: "Cancelled",
      value: stats.cancelledReservations,
      icon: <FiXCircle className="w-5 h-5" />,
      bgColor: "bg-red-50",
      iconColor: "text-red-700",
      borderColor: "border-red-200",
      subtitle: `${cancellationRate}% cancellation rate`,
    },
  ];

  const quickActions = [
    {
      title: "Approve Reservations",
      description: "Review and approve pending reservations",
      action: () => navigate("/reservations"),
      icon: <FiCheckCircle className="w-5 h-5" />,
    },
    {
      title: "Manage Stalls",
      description: "View and manage all exhibition stalls",
      action: () => navigate("/stall-management"),
      icon: <FiBox className="w-5 h-5" />,
    },
    {
      title: "View Vendors",
      description: "Browse and manage vendor accounts",
      action: () => navigate("/vendors"),
      icon: <FiUsers className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Overview of your reservation system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg border ${card.borderColor} p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} ${card.iconColor} p-3 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-600 mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-slate-900">{card.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Reservation Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reservationCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} border ${card.borderColor} rounded-lg p-5`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={card.iconColor}>{card.icon}</div>
                  <h3 className="text-sm font-semibold text-slate-700">{card.title}</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{card.value}</p>
                <p className="text-xs text-slate-600">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="text-left p-5 border border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-slate-100 text-slate-700 p-2 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  <FiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
