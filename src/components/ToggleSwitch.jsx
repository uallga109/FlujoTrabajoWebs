import React from 'react';

const ToggleSwitch = ({ id, label, description, checked, onChange, icon: Icon }) => {
  return (
    <div className="toggle-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {Icon && (
          <div style={{ color: 'var(--text-secondary)' }}>
            <Icon size={24} />
          </div>
        )}
        <div className="toggle-info">
          <h4>{label}</h4>
          <p>{description}</p>
        </div>
      </div>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(id, e.target.checked)} 
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
