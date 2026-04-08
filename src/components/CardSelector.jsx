import React from 'react';

const CardSelector = ({ id, title, description, icon: Icon, selected, onClick }) => {
  return (
    <div 
      className={`project-card ${selected ? 'selected' : ''}`} 
      onClick={() => onClick(id)}
    >
      <div className="icon">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      <p style={{ fontSize: '0.875rem', margin: '0' }}>{description}</p>
    </div>
  );
};

export default CardSelector;
