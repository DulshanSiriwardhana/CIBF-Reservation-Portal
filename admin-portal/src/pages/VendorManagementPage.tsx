import React, { useState, useEffect } from "react";
import { FiUsers, FiMail, FiPhone, FiBriefcase, FiSearch, FiLoader, FiUser } from "react-icons/fi";
import { useLoader } from "../context/LoaderContext";
import { apiService } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { Vendor } from "../types/vendor";

interface VendorWithReservations extends Vendor {
  reservationCount?: number;
  lastReservation?: string;
}

const VendorManagementPage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const [vendors, setVendors] = useState<VendorWithReservations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<VendorWithReservations[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      showLoader();
      setLoading(true);
      try {
        // Since there's no "get all users" endpoint, we'll fetch from reservations
        // and extract unique user IDs, then fetch each user
        const reservations = await apiService.getAllReservations().catch(() => []);
        const reservationsArray = Array.isArray(reservations) ? reservations : [];
        
        // Get unique user IDs from reservations
        const uniqueUserIds = new Set(
          reservationsArray.map((r: any) => r.userId).filter((id: any) => id)
        );

        // Fetch user details for each unique user ID
        const vendorPromises = Array.from(uniqueUserIds).map(async (userId: any) => {
          try {
            const userData = await apiService.getUserById(userId);
            const userReservations = reservationsArray.filter((r: any) => r.userId === userId);
            return {
              ...userData,
              reservationCount: userReservations.length,
              lastReservation: userReservations.length > 0 
                ? userReservations[userReservations.length - 1].reserveDate 
                : undefined,
            };
          } catch (error) {
            // If user fetch fails, return basic info from reservation
            const userReservations = reservationsArray.filter((r: any) => r.userId === userId);
            const reservation = reservationsArray.find((r: any) => r.userId === userId);
            return {
              userId: userId,
              username: `User ${userId}`,
              email: reservation?.email || "N/A",
              role: "VENDOR",
              businessName: "N/A",
              contactNumber: "N/A",
              reservationCount: userReservations.length,
            };
          }
        });

        const vendorsData = await Promise.all(vendorPromises);
        setVendors(vendorsData.filter(v => v.role === "VENDOR"));
        setFilteredVendors(vendorsData.filter(v => v.role === "VENDOR"));
      } catch (error: any) {
        console.error("Error fetching vendors:", error);
        showToast("Failed to load vendors", "error");
      } finally {
        hideLoader();
        setLoading(false);
      }
    };

    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [searchTerm, vendors]);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Vendor Management</h1>
          <p className="text-slate-600 text-lg">View and manage all registered vendors</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendors by name, email, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && vendors.length === 0 ? (
            <div className="col-span-full flex justify-center py-20">
              <FiLoader className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <div
                key={vendor.userId}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-slate-100 text-slate-700 p-3 rounded-lg">
                    <FiUser className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-4">{vendor.businessName || vendor.username}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FiUsers className="w-4 h-4" />
                    <span className="font-medium">{vendor.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <FiMail className="w-4 h-4" />
                    <span className="font-medium truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <FiPhone className="w-4 h-4" />
                    <span className="font-medium">{vendor.contactNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <FiBriefcase className="w-4 h-4" />
                    <span className="font-medium">{vendor.role}</span>
                  </div>
                  {vendor.reservationCount !== undefined && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-xs text-slate-500">
                        {vendor.reservationCount} reservation{vendor.reservationCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-slate-200">
              <FiUsers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">
                {searchTerm ? "No vendors found matching your search" : "No vendors found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorManagementPage;
