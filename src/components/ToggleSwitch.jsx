import React from 'react';

const ToggleSwitch = ({ id, label, description, checked, onChange, icon: Icon }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="text-gray-500">
            <Icon size={24} />
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">{label}</h4>
          <p className="text-xs text-gray-500 m-0">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(id, e.target.checked)} 
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
