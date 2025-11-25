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
        const reservations = await apiService.getAllReservations().catch(() => []);
        const reservationsArray = Array.isArray(reservations) ? reservations : [];
        
        const uniqueUserIds = new Set(
          reservationsArray.map((r: any) => r.userId).filter((id: any) => id)
        );

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
            const userReservations = reservationsArray.filter((r: any) => r.userId === userId);
            const reservation = reservationsArray.find((r: any) => r.userId === userId);
            return {
              userId,
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
        const vendorList = vendorsData.filter(v => v.role === "VENDOR");
        setVendors(vendorList);
        setFilteredVendors(vendorList);
      } catch (error: any) {
        console.error("Error fetching vendors:", error);
        showToast("Failed to load vendors", "error");
      } finally {
        hideLoader();
        setLoading(false);
      }
    };

    fetchVendors();
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
    <div className="min-h-screen bg-[#02060d] pt-20 pb-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto text-white">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Vendor Management</h1>
          <p className="text-sm text-[#94a3b8]">View and manage all registered vendors</p>
        </div>

        <div className="dark-card p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
            <input
              type="text"
              placeholder="Search vendors by name, email, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0b1320] border border-[#1f2b40] rounded text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#22c55e]/60 focus:border-[#22c55e]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && vendors.length === 0 ? (
            <div className="col-span-full flex justify-center py-12">
              <FiLoader className="w-6 h-6 text-[#94a3b8] animate-spin" />
            </div>
          ) : filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <div
                key={vendor.userId}
                className="bg-[#0b1320] border border-[#1f2b40] rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-[#111d30] rounded-lg flex items-center justify-center text-[#22c55e]">
                    <FiUser className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-semibold mb-4">{vendor.businessName || vendor.username}</h3>
                
                <div className="space-y-2 text-sm text-[#cbd5f5]">
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4" />
                    <span>{vendor.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    <span>{vendor.contactNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4" />
                    <span>{vendor.role}</span>
                  </div>
                  {vendor.reservationCount !== undefined && (
                    <div className="pt-2 border-t border-[#1f2b40] text-xs text-[#94a3b8]">
                      {vendor.reservationCount} reservation{vendor.reservationCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-[#0b1320] rounded border border-[#1f2b40]">
              <FiUsers className="w-10 h-10 text-[#475569] mx-auto mb-3" />
              <p className="text-sm text-[#94a3b8]">
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
