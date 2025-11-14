import React, { useEffect, useState } from "react";
import { FiUsers, FiBox, FiClock, FiCheckCircle, FiXCircle, FiShoppingBag } from "react-icons/fi";
import StatCard from "../components/dashboard/StatCard";
import ReservationCard from "../components/dashboard/ReservationCard";
import ActionButton from "../components/dashboard/ActionButton";
import ActivityItem from "../components/dashboard/ActivityItem";
import { useLoader } from "../context/LoaderContext";

interface DashboardStats {
  vendors: number;
  stalls: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
}

const Dashboard: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStats({
          vendors: 247,
          stalls: 180,
          pendingReservations: 38,
          confirmedReservations: 156,
          cancelledReservations: 24,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        hideLoader();
      }
    };

    fetchDashboardData();
  }, [showLoader, hideLoader]);

  const occupancyRate = ((stats.confirmedReservations / stats.stalls) * 100).toFixed(1);
  const totalReservations = stats.confirmedReservations + stats.cancelledReservations + stats.pendingReservations;
  const cancellationRate = ((stats.cancelledReservations / totalReservations) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-slate-800 mb-3">
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
            iconBgColor="bg-purple-600"
            trend="+12%"
            trendColor="bg-purple-200 text-purple-800"
          />
          
          <StatCard
            title="Total Stalls"
            value={stats.stalls}
            icon={<FiBox className="w-6 h-6 text-white" />}
            iconBgColor="bg-cyan-600"
            trend="+8%"
            trendColor="bg-cyan-200 text-cyan-800"
          />
          
          <StatCard
            title="Pending Reservations"
            value={stats.pendingReservations}
            icon={<FiClock className="w-6 h-6 text-white" />}
            iconBgColor="bg-orange-600"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-teal-600 rounded-xl p-2.5 shadow-lg">
              <FiShoppingBag className="w-5 h-5 text-white" />
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
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-200">
            <h3 className="text-xl font-black text-slate-800 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <ActionButton
                text="Approve Pending Reservations"
                bgColor="bg-emerald-600"
                hoverBgColor="hover:bg-emerald-700"
              />
              <ActionButton
                text="Manage Stalls"
                bgColor="bg-cyan-600"
                hoverBgColor="hover:bg-cyan-700"
              />
              <ActionButton
                text="View All Vendors"
                bgColor="bg-purple-600"
                hoverBgColor="hover:bg-purple-700"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-200">
            <h3 className="text-xl font-black text-slate-800 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <ActivityItem
                icon={<FiCheckCircle className="w-4 h-4 text-white" />}
                iconBgColor="bg-emerald-600"
                bgColor="bg-emerald-50"
                borderColor="border-emerald-200"
                title="New vendor registered"
                time="5 minutes ago"
              />
              <ActivityItem
                icon={<FiClock className="w-4 h-4 text-white" />}
                iconBgColor="bg-amber-600"
                bgColor="bg-amber-50"
                borderColor="border-amber-200"
                title="Reservation pending approval"
                time="12 minutes ago"
              />
              <ActivityItem
                icon={<FiBox className="w-4 h-4 text-white" />}
                iconBgColor="bg-cyan-600"
                bgColor="bg-cyan-50"
                borderColor="border-cyan-200"
                title="Stall updated"
                time="1 hour ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;