import React from 'react';

const CardSelector = ({ id, title, description, icon: Icon, selected, onClick }) => {
  return (
    <div 
      className={`relative flex flex-col items-start gap-3 p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        selected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm hover:-translate-y-0.5'
      }`} 
      onClick={() => onClick(id)}
    >
      <div className={`transition-colors ${selected ? 'text-blue-500' : 'text-gray-500'}`}>
        <Icon size={28} />
      </div>
      <h3 className="text-base font-semibold m-0 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 m-0">{description}</p>
    </div>
  );
};

export default CardSelector;
