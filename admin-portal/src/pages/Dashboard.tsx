import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBox, FiClock, FiCheckCircle, FiXCircle, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import StatCard from "../components/dashboard/StatCard";
import ReservationCard from "../components/dashboard/ReservationCard";
import ActionButton from "../components/dashboard/ActionButton";
import ActivityItem from "../components/dashboard/ActivityItem";
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
        // Fetch all data in parallel
        const [stalls, reservations] = await Promise.all([
          apiService.getAllStalls().catch(() => []),
          apiService.getAllReservations().catch(() => []),
        ]);

        // Process stalls data
        const totalStalls = Array.isArray(stalls) ? stalls.length : 0;
        
        // Process reservations data
        const reservationsArray = Array.isArray(reservations) ? reservations : [];
        const pending = reservationsArray.filter((r: any) => r.status === "PENDING").length;
        const confirmed = reservationsArray.filter((r: any) => r.status === "CONFIRMED").length;
        const cancelled = reservationsArray.filter((r: any) => r.status === "CANCELLED").length;

        // Count unique vendors from reservations
        const uniqueVendors = new Set(
          reservationsArray
            .map((r: any) => r.userId)
            .filter((id: any) => id)
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
  }, [showLoader, hideLoader, showToast]);

  const occupancyRate = stats.stalls > 0 
    ? ((stats.confirmedReservations / stats.stalls) * 100).toFixed(1)
    : "0.0";
  
  const totalReservations = stats.confirmedReservations + stats.cancelledReservations + stats.pendingReservations;
  const cancellationRate = totalReservations > 0
    ? ((stats.cancelledReservations / totalReservations) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Real-time insights and statistics for CIBF Admin Portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Vendors"
            value={stats.vendors}
            icon={<FiUsers className="w-6 h-6 text-white" />}
            iconBgColor="bg-gradient-to-br from-indigo-600 to-purple-600"
            trend="Active"
            trendColor="bg-indigo-100 text-indigo-800"
          />
          
          <StatCard
            title="Total Stalls"
            value={stats.stalls}
            icon={<FiBox className="w-6 h-6 text-white" />}
            iconBgColor="bg-gradient-to-br from-purple-600 to-pink-600"
            trend="Available"
            trendColor="bg-purple-100 text-purple-800"
          />
          
          <StatCard
            title="Pending Reservations"
            value={stats.pendingReservations}
            icon={<FiClock className="w-6 h-6 text-white" />}
            iconBgColor="bg-gradient-to-br from-pink-600 to-rose-600"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border-2 border-white/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-3 shadow-lg">
              <FiShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Reservation Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReservationCard
              title="Confirmed"
              value={stats.confirmedReservations}
              icon={<FiCheckCircle className="w-6 h-6 text-white" />}
              bgColor="bg-emerald-50"
              iconBgColor="bg-emerald-600"
              textColor="text-emerald-700"
              borderColor="border-emerald-200"
              hoverBorderColor="hover:border-emerald-400"
              subtitle={`${occupancyRate}% occupancy rate`}
            />

            <ReservationCard
              title="Pending"
              value={stats.pendingReservations}
              icon={<FiClock className="w-6 h-6 text-white" />}
              bgColor="bg-amber-50"
              iconBgColor="bg-amber-600"
              textColor="text-amber-700"
              borderColor="border-amber-200"
              hoverBorderColor="hover:border-amber-400"
              subtitle="Awaiting approval"
            />

            <ReservationCard
              title="Cancelled"
              value={stats.cancelledReservations}
              icon={<FiXCircle className="w-6 h-6 text-white" />}
              bgColor="bg-rose-50"
              iconBgColor="bg-rose-600"
              textColor="text-rose-700"
              borderColor="border-rose-200"
              hoverBorderColor="hover:border-rose-400"
              subtitle={`${cancellationRate}% cancellation rate`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-white/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-2.5 shadow-lg">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <ActionButton
                text="Approve Pending Reservations"
                bgColor="bg-gradient-to-r from-indigo-600 to-purple-600"
                hoverBgColor="hover:from-indigo-700 hover:to-purple-700"
                onClick={() => navigate("/reservations")}
              />
              <ActionButton
                text="Manage Stalls"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
                hoverBgColor="hover:from-purple-700 hover:to-pink-700"
                onClick={() => navigate("/stall-management")}
              />
              <ActionButton
                text="View All Vendors"
                bgColor="bg-gradient-to-r from-pink-600 to-rose-600"
                hoverBgColor="hover:from-pink-700 hover:to-rose-700"
                onClick={() => navigate("/vendors")}
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-white/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-2.5 shadow-lg">
                <FiClock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <ActivityItem
                icon={<FiCheckCircle className="w-4 h-4 text-white" />}
                iconBgColor="bg-emerald-600"
                bgColor="bg-emerald-50"
                borderColor="border-emerald-200"
                title="System operational"
                time="Just now"
              />
              <ActivityItem
                icon={<FiClock className="w-4 h-4 text-white" />}
                iconBgColor="bg-amber-600"
                bgColor="bg-amber-50"
                borderColor="border-amber-200"
                title={`${stats.pendingReservations} reservations pending approval`}
                time="Live"
              />
              <ActivityItem
                icon={<FiBox className="w-4 h-4 text-white" />}
                iconBgColor="bg-cyan-600"
                bgColor="bg-cyan-50"
                borderColor="border-cyan-200"
                title={`${stats.stalls} stalls available`}
                time="Live"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
