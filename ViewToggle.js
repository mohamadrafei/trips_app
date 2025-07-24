import React from 'react';
import { FaList, FaCalendarAlt } from 'react-icons/fa';

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="view-toggle">
      <button 
        className={viewMode === 'list' ? 'active' : ''}
        onClick={() => setViewMode('list')}
      >
        <FaList style={{ marginRight: '0.5rem' }} />
        List
      </button>
      <button 
        className={viewMode === 'calendar' ? 'active' : ''}
        onClick={() => setViewMode('calendar')}
      >
        <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
        Calendar
      </button>
    </div>
  );
};

export default ViewToggle;