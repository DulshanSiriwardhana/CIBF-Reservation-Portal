import React from "react";
import { FiTrendingUp } from "react-icons/fi";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor?: string;
  iconBgColor: string;
  trend?: string;
  trendColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor="bg-black", iconBgColor, trend, trendColor }) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconBgColor} rounded-xl p-3 shadow-md`}>
          {icon}
        </div>
        {trend && (
          <div className={`${trendColor} px-3 py-1 rounded-full flex items-center space-x-1`}>
            <FiTrendingUp className="w-3 h-3" />
            <span className="text-xs font-bold">{trend}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-white text-sm font-semibold">{title}</h3>
        <p className="text-4xl font-black text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StatCard;