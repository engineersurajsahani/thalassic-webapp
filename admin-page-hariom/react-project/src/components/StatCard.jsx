import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, change, changeType, icon: Icon }) => {
  return (
    <div className="stat-card-container">
      <div className="stat-card-content">
        <div className="stat-card-info">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
          {change && (
            <p className={`stat-card-change ${changeType === 'positive' ? 'positive' : 'negative'}`}>
              {change}
            </p>
          )}
        </div>
        <div className="stat-card-icon-wrapper">
          <Icon className="stat-card-icon" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
