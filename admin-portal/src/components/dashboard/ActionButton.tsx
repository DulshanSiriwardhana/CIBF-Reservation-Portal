import React from "react";

interface ActionButtonProps {
  text: string;
  bgColor: string;
  hoverBgColor: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, bgColor, hoverBgColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full ${bgColor} ${hoverBgColor} text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] text-left`}
    >
      {text}
    </button>
  );
};

export default ActionButton;