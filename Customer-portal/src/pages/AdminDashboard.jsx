import React, { useState, useEffect } from 'react';
import { stallService } from '../services/stallService';
import { FaStore, FaCheckCircle, FaTimesCircle, FaTools } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Loading from '../components/common/Loading';

const AdminDashboard = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    reserved: 0,
    maintenance: 0
  });

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    try {
      const response = await stallService.getAllStalls();
      const stallData = response.data || [];
      setStalls(stallData);
      calculateStats(stallData);
    } catch (err) {
      console.error('Failed to load stalls');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (stallData) => {
    setStats({
      total: stallData.length,
      available: stallData.filter(s => s.status === 'AVAILABLE').length,
      reserved: stallData.filter(s => s.status === 'RESERVED').length,
      maintenance: stallData.filter(s => s.status === 'MAINTENANCE').length
    });
  };

  const sizeData = [
    { name: 'Small', count: stalls.filter(s => s.size === 'SMALL').length },
    { name: 'Medium', count: stalls.filter(s => s.size === 'MEDIUM').length },
    { name: 'Large', count: stalls.filter(s => s.size === 'LARGE').length },
  ];

  const statusData = [
    { name: 'Available', value: stats.available, color: '#22c55e' },
    { name: 'Reserved', value: stats.reserved, color: '#ef4444' },
    { name: 'Maintenance', value: stats.maintenance, color: '#6b7280' },
  ];

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Total Stalls</p>
              <p className="text-4xl font-bold">{stats.total}</p>
            </div>
            <FaStore className="text-5xl text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1">Available</p>
              <p className="text-4xl font-bold">{stats.available}</p>
            </div>
            <FaCheckCircle className="text-5xl text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 mb-1">Reserved</p>
              <p className="text-4xl font-bold">{stats.reserved}</p>
            </div>
            <FaTimesCircle className="text-5xl text-red-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 mb-1">Maintenance</p>
              <p className="text-4xl font-bold">{stats.maintenance}</p>
            </div>
            <FaTools className="text-5xl text-gray-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Stalls by Size</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sizeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ed6420" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">All Stalls</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stall
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stalls.map((stall) => (
                <tr key={stall.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{stall.stallName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stall.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rs. {stall.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${
                      stall.status === 'AVAILABLE' ? 'badge-success' :
                      stall.status === 'RESERVED' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {stall.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ({stall.positionX}, {stall.positionY})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;