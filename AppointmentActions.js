import React from 'react';
import { FaCheck, FaTimes, FaTrash, FaUndo } from 'react-icons/fa';

const AppointmentActions = ({ appointment, updateStatus, deleteAppointment }) => {
  const handleStatusChange = (newStatus) => {
    updateStatus(appointment.id, newStatus);
  };

  const handleDelete = () => {
    deleteAppointment(appointment.id);
  };

  const getAvailableActions = (currentStatus) => {
    const actions = [];
    
    switch (currentStatus?.toLowerCase()) {
      case 'open':
        actions.push(
          { label: 'Confirm', status: 'confirmed', icon: FaCheck, color: '#10b981' },
          { label: 'Complete', status: 'completed', icon: FaCheck, color: '#8b5cf6' }
        );
        break;
      case 'confirmed':
        actions.push(
          { label: 'Complete', status: 'completed', icon: FaCheck, color: '#8b5cf6' },
          { label: 'Reopen', status: 'open', icon: FaUndo, color: '#3b82f6' }
        );
        break;
      case 'completed':
        actions.push(
          { label: 'Reopen', status: 'open', icon: FaUndo, color: '#3b82f6' }
        );
        break;
      default:
        actions.push(
          { label: 'Confirm', status: 'confirmed', icon: FaCheck, color: '#10b981' },
          { label: 'Complete', status: 'completed', icon: FaCheck, color: '#8b5cf6' }
        );
    }

    return actions;
  };

  const availableActions = getAvailableActions(appointment.status);

  return (
    <>
      {availableActions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleStatusChange(action.status)}
          style={{ 
            backgroundColor: action.color,
            color: 'white',
            marginRight: '0.25rem'
          }}
          title={action.label}
        >
          <action.icon />
        </button>
      ))}
      <button
        onClick={handleDelete}
        style={{ 
          backgroundColor: '#ef4444',
          color: 'white'
        }}
        title="Delete"
      >
        <FaTrash />
      </button>
    </>
  );
};

export default AppointmentActions;