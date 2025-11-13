interface ReservationCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  borderColor: string;
  hoverBorderColor: string;
  subtitle: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconBgColor,
  textColor,
  borderColor,
  hoverBorderColor,
  subtitle
}) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 border-2 ${borderColor} ${hoverBorderColor} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center space-x-4 mb-3">
        <div className={`${iconBgColor} rounded-xl p-3 shadow-md`}>
          {icon}
        </div>
        <div>
          <p className={`${textColor} text-sm font-bold`}>{title}</p>
          <p className={`text-4xl font-black ${textColor}`}>{value}</p>
        </div>
      </div>
      <div className="mt-4 bg-white rounded-lg px-3 py-2">
        <p className={`text-xs ${textColor} font-semibold`}>{subtitle}</p>
      </div>
    </div>
  );
};

export default ReservationCard;