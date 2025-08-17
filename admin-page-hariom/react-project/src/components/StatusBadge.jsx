import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, variant }) => {
  const getVariantClass = (variant) => {
    switch (variant) {
      case 'confirmed':
      case 'completed':
      case 'paid':
      case 'eligible':
      case 'submitted':
        return 'variant-confirmed';
      case 'pending':
      case 'under-review':
      case 'ongoing':
      case 'inprogress':
        return 'variant-pending';
      case 'scheduled':
        return 'variant-scheduled';
      case 'not-started':
      case 'not-generated':
      case 'not-sent':
        return 'variant-not-started';
      default:
        return 'variant-default';
    }
  };

  return (
    <span className={`status-badge ${getVariantClass(variant)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
