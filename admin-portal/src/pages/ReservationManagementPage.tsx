import React, { useState, useEffect } from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiSearch, FiFilter, FiRefreshCw, FiLoader } from "react-icons/fi";
import { useLoader } from "../context/LoaderContext";
import { apiService } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { Reservation } from "../types/reservation";

const ReservationManagementPage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    showLoader();
    setLoading(true);
    try {
      const data = await apiService.getAllReservations();
      const reservationsArray = Array.isArray(data) ? data : [];
      setReservations(reservationsArray);
      setFilteredReservations(reservationsArray);
    } catch (error: any) {
      console.error("Error fetching reservations:", error);
      showToast("Failed to load reservations", "error");
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.reservationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.stallId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, reservations]);

  const handleApprove = async (reservationId: string) => {
    if (!window.confirm("Are you sure you want to approve this reservation?")) return;

    setLoading(true);
    try {
      await apiService.confirmReservation(reservationId);
      showToast("Reservation approved successfully", "success");
      await fetchReservations();
    } catch (error: any) {
      showToast(error.message || "Failed to approve reservation", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    setLoading(true);
    try {
      await apiService.cancelReservation(reservationId);
      showToast("Reservation cancelled successfully", "success");
      await fetchReservations();
    } catch (error: any) {
      showToast(error.message || "Failed to cancel reservation", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Reservation["status"]) => {
    switch (status) {
      case "PENDING":
        return <FiClock className="w-5 h-5 text-amber-600" />;
      case "CONFIRMED":
        return <FiCheckCircle className="w-5 h-5 text-emerald-600" />;
      case "CANCELLED":
        return <FiXCircle className="w-5 h-5 text-rose-600" />;
    }
  };

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-300";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              Reservation Management
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Review and manage all stall reservations
            </p>
          </div>
          <button
            onClick={fetchReservations}
            disabled={loading}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-bold shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 mb-6 border-2 border-white/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by reservation ID, user ID, or stall..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition-colors font-medium"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="pl-12 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition-colors appearance-none bg-white font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading && !filteredReservations.length ? (
            <div className="flex justify-center items-center py-20">
              <FiLoader className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      {getStatusIcon(reservation.status)}
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                      <span className="text-xl font-black text-slate-800">
                        {reservation.reservationId || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-600">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">User ID</p>
                        <p className="font-semibold">{reservation.userId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Stall ID</p>
                        <p className="font-semibold">{reservation.stallId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email</p>
                        <p className="font-semibold text-sm">{reservation.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                          {reservation.status === "CONFIRMED" ? "Confirmed Date" : 
                           reservation.status === "CANCELLED" ? "Cancelled Date" : "Reserved Date"}
                        </p>
                        <p className="font-semibold text-sm">
                          {formatDate(
                            reservation.reserveConfirmDate?.toString() ||
                            reservation.reserveCancelDate?.toString() ||
                            reservation.reserveDate?.toString()
                          )}
                        </p>
                      </div>
                      {reservation.amount && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Amount</p>
                          <p className="font-semibold">${reservation.amount.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {reservation.status === "PENDING" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleApprove(reservation.reservationId)}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <FiCheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(reservation.reservationId)}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <FiXCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border-2 border-white/50">
              <FiClock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">
                {searchTerm || statusFilter !== "ALL" 
                  ? "No reservations found matching your filters" 
                  : "No reservations found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationManagementPage;
