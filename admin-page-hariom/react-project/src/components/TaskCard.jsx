import React from 'react';
import StatusBadge from './StatusBadge';
import './TaskCard.css';

// Placeholder icons
const Calendar = () => <span>[C]</span>;
const User = () => <span>[U]</span>;

const TaskCard = ({ title, description, assignee, date, status }) => {
  return (
    <div className="task-card-container">
      <div className="task-card-header">
        <h3 className="task-card-title">{title}</h3>
        <StatusBadge status={status === 'ongoing' ? 'Ongoing' : 'Pending'} variant={status} />
      </div>
      <p className="task-card-description">{description}</p>
      <div className="task-card-footer">
        <div className="task-card-assignee">
          <User />
          <span>{assignee}</span>
        </div>
        {date && (
          <div className="task-card-date">
            <Calendar />
            <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
