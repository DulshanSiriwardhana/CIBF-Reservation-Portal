import React, { useState, useEffect } from "react";
import { FiUsers, FiMail, FiPhone, FiBriefcase, FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";
import { useLoader } from "../context/LoaderContext";
import type { Vendor } from "../types/vendor";

const VendorManagementPage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      showLoader();
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const mockVendors: Vendor[] = [
          {
            userId: "1",
            username: "vendor1",
            email: "vendor1@example.com",
            role: "VENDOR",
            businessName: "Book World",
            contactNumber: "0771234567",
            createdAt: "2024-01-15T10:00:00Z"
          },
          {
            userId: "2",
            username: "vendor2",
            email: "vendor2@example.com",
            role: "VENDOR",
            businessName: "Literary Haven",
            contactNumber: "0772345678",
            createdAt: "2024-01-20T10:00:00Z"
          },
          {
            userId: "3",
            username: "vendor3",
            email: "vendor3@example.com",
            role: "VENDOR",
            businessName: "Novel Corner",
            contactNumber: "0773456789",
            createdAt: "2024-02-01T10:00:00Z"
          },
        ];
        
        setVendors(mockVendors);
        setFilteredVendors(mockVendors);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        hideLoader();
      }
    };

    fetchVendors();
  }, [showLoader, hideLoader]);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [searchTerm, vendors]);

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors(prev => prev.filter(v => v.userId !== userId));
      setFilteredVendors(prev => prev.filter(v => v.userId !== userId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-slate-800 mb-3">
            Vendor Management
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Manage all registered vendors and their information
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-2 border-slate-200">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendors by name, email, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.userId}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-teal-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-teal-600 rounded-xl p-3 shadow-md">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => alert("Edit functionality coming soon")}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Edit"
                  >
                    <FiEdit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.userId)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2">{vendor.businessName}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-slate-600">
                  <FiUsers className="w-4 h-4" />
                  <span className="text-sm font-medium">{vendor.username}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <FiMail className="w-4 h-4" />
                  <span className="text-sm font-medium">{vendor.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <FiPhone className="w-4 h-4" />
                  <span className="text-sm font-medium">{vendor.contactNumber}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <FiBriefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">{vendor.role}</span>
                </div>
              </div>

              {vendor.createdAt && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Registered: {new Date(vendor.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg font-medium">
              {searchTerm ? "No vendors found matching your search" : "No vendors registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManagementPage;

