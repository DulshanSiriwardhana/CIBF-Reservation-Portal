import React, { useState, useEffect } from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiSearch, FiFilter, FiRefreshCw, FiLoader, FiEye } from "react-icons/fi";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getStatusBadge = (status: Reservation["status"]) => {
    const styles = {
      PENDING: "bg-amber-100 text-amber-800 border-amber-300",
      CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
      CANCELLED: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reservation Management</h1>
            <p className="text-slate-600">Manage and review all stall reservations</p>
          </div>
          <button
            onClick={fetchReservations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by reservation ID, user ID, or stall..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm appearance-none bg-white"
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
            <div className="flex justify-center items-center py-20 bg-white rounded-lg border border-slate-200">
              <FiLoader className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      {getStatusBadge(reservation.status)}
                      <span className="text-lg font-bold text-slate-900">
                        {reservation.reservationId || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">User ID</p>
                        <p className="text-sm font-semibold text-slate-900">{reservation.userId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Stall ID</p>
                        <p className="text-sm font-semibold text-slate-900">{reservation.stallId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</p>
                        <p className="text-sm font-semibold text-slate-900">{reservation.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          {reservation.status === "CONFIRMED" ? "Confirmed Date" : 
                           reservation.status === "CANCELLED" ? "Cancelled Date" : "Reserved Date"}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatDate(
                            reservation.reserveConfirmDate ||
                            reservation.reserveCancelDate ||
                            reservation.reserveDate
                          )}
                        </p>
                      </div>
                      {reservation.amount && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Amount</p>
                          <p className="text-sm font-semibold text-slate-900">${reservation.amount.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {reservation.status === "PENDING" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleApprove(reservation.reservationId)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold disabled:opacity-50"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(reservation.reservationId)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50"
                      >
                        <FiXCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <FiClock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">
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
