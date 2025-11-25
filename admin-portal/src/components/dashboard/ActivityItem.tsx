import React from "react";

interface ActivityItemProps {
  icon: React.ReactNode;
  iconBgColor: string;
  bgColor: string;
  borderColor: string;
  title: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, iconBgColor, bgColor, borderColor, title, time }) => {
  return (
    <div className={`flex items-start space-x-3 p-3 ${bgColor} rounded-xl border ${borderColor}`}>
      <div className={`${iconBgColor} rounded-lg p-2 mt-0.5`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-600">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;