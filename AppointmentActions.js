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
      case 'pending':
      case 'open':
        actions.push(
          { label: 'Accept', status: 'accepted', icon: FaCheck, color: '#17a2b8' },
          { label: 'Reject', status: 'rejected', icon: FaTimes, color: '#dc3545' }
        );
        break;
      case 'accepted':
      case 'confirmed':
      case 'completed':
        actions.push(
          { label: 'Reject', status: 'rejected', icon: FaTimes, color: '#dc3545' },
          { label: 'Reset', status: 'pending', icon: FaUndo, color: '#ffc107' }
        );
        break;
      case 'rejected':
      case 'cancelled':
        actions.push(
          { label: 'Accept', status: 'accepted', icon: FaCheck, color: '#17a2b8' },
          { label: 'Reset', status: 'pending', icon: FaUndo, color: '#ffc107' }
        );
        break;
      default:
        actions.push(
          { label: 'Accept', status: 'accepted', icon: FaCheck, color: '#17a2b8' },
          { label: 'Reject', status: 'rejected', icon: FaTimes, color: '#dc3545' }
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