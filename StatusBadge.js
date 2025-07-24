import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'status-badge open';
      case 'confirmed':
        return 'status-badge confirmed';
      case 'completed':
        return 'status-badge completed';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge open';
    }
  };

  return (
    <span className={getStatusClass(status)}>
      {status || 'Open'}
    </span>
  );
};

export default StatusBadge;