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

  const getStatusBadge = (status: Reservation["status"]) => {
    const styles = {
      PENDING: "bg-amber-100 text-amber-800 border-amber-300",
      CONFIRMED: "bg-green-100 text-green-800 border-green-300",
      CANCELLED: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[status]}`}>
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
    <div className="min-h-screen bg-[#02060d] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Reservation Management</h1>
            <p className="text-sm text-[#94a3b8]">Manage and review all stall reservations</p>
          </div>
          <button
            onClick={fetchReservations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#0b1320] border border-[#1f2b40] rounded text-sm font-medium disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-[#0b1320] border border-[#1f2b40] rounded p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
              <input
                type="text"
                placeholder="Search by reservation ID, user ID, or stall..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#273654] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="pl-10 pr-8 py-2 border border-[#273654] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-[#0b1320]"
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
            <div className="flex justify-center items-center py-12 bg-[#0b1320] rounded border border-[#1f2b40]">
              <FiLoader className="w-6 h-6 text-[#94a3b8] animate-spin" />
            </div>
          ) : filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="bg-[#0b1320] border border-[#1f2b40] rounded p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      {getStatusBadge(reservation.status)}
                      <span className="text-base font-semibold text-white">
                        {reservation.reservationId || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-medium text-[#94a3b8] mb-1">User ID</p>
                        <p className="text-sm font-medium text-white">{reservation.userId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#94a3b8] mb-1">Stall ID</p>
                        <p className="text-sm font-medium text-white">{reservation.stallId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#94a3b8] mb-1">Email</p>
                        <p className="text-sm font-medium text-white">{reservation.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#94a3b8] mb-1">
                          {reservation.status === "CONFIRMED" ? "Confirmed Date" : 
                           reservation.status === "CANCELLED" ? "Cancelled Date" : "Reserved Date"}
                        </p>
                        <p className="text-sm font-medium text-white">
                          {formatDate(
                            reservation.reserveConfirmDate ||
                            reservation.reserveCancelDate ||
                            reservation.reserveDate
                          )}
                        </p>
                      </div>
                      {reservation.amount && (
                        <div>
                          <p className="text-xs font-medium text-[#94a3b8] mb-1">Amount</p>
                          <p className="text-sm font-medium text-white">${reservation.amount.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {reservation.status === "PENDING" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleApprove(reservation.reservationId)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium disabled:opacity-50"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(reservation.reservationId)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium disabled:opacity-50"
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
            <div className="text-center py-12 bg-[#0b1320] rounded border border-[#1f2b40]">
              <FiClock className="w-10 h-10 text-[#94a3b8] mx-auto mb-3" />
              <p className="text-[#94a3b8] text-sm">
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
