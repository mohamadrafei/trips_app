import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEnvelope } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import AppointmentActions from './AppointmentActions';
import './AdminPanel.css';
import axios from 'axios';

const AppointmentsList = ({
  appointments,
  updateStatus,
  deleteAppointment,
  deleteAllAppointments,
  addAppointment
}) => {
  const [newAppointment, setNewAppointment] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    datetime: ''
  });

  // Track which appointment is currently messaging
  const [messagingId, setMessagingId] = useState(null);
  const [messageText, setMessageText] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = () => {
    const { firstName, lastName, phone, datetime } = newAppointment;
    if (!firstName || !lastName || !phone || !datetime) {
      alert('Please fill all fields');
      return;
    }
    addAppointment(newAppointment);
    setNewAppointment({ firstName: '', lastName: '', phone: '', datetime: '' });
  };

  const handleSendMessage = async (appointment) => {
    console.log('🚀 Starting handleSendMessage');
    console.log('📋 Appointment received:', appointment);
    console.log('💬 Message text from input:', messageText);
    
    // ✅ Check if user actually typed a message
    if (!messageText.trim()) {
      alert('Please enter a message before sending');
      return;
    }
    
    const phone = appointment.phone;
    const formattedPhone = phone.replace(/\D/g, '');
    
    // ✅ Use the user's custom message instead of hardcoded text
    const title = "Message from Clinic";
    const body = messageText.trim(); // Use the actual message the user typed

    console.log("Sending message to phone:", phone, "Message:", body);
    console.log('📞 Formatted phone:', formattedPhone);

    try {
      const response = await axios.post("http://localhost:3001/send-notification", {
        phone,
        title,
        body, // This will now be the custom message
      });

      console.log("Response from server:", response.data);
      alert("Message sent successfully!");
      
      // ✅ Clear the message and close the messaging interface after sending
      setMessageText('');
      setMessagingId(null);
      
    } catch (error) {
      console.error('💥 Error in handleSendMessage:', error);
      console.error('📍 Error stack:', error.stack);
      console.error("Error sending notification:", error.response?.data || error.message);
      
      // Better error handling based on server response
      if (error.response?.status === 404) {
        alert("No appointment found for this phone number");
      } else if (error.response?.status === 412) {
        alert("Patient hasn't enabled notifications");
      } else {
        alert(`Failed to send notification: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="data-table-container">
      {/* Add Appointment Form */}
      <div className="add-appointment-form">
        <h3>New Appointment</h3>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={newAppointment.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={newAppointment.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={newAppointment.phone}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="datetime"
          value={newAppointment.datetime}
          onChange={handleInputChange}
          required
        />
        <button className="add-btn" onClick={handleAddAppointment}>
          <FaPlus style={{ marginRight: '6px' }} />
          Add Appointment
        </button>
      </div>

      {/* Delete All Button */}
      <div className="table-actions">
        <button className="delete-all-btn" onClick={deleteAllAppointments}>
          <FaTrash style={{ marginRight: '6px' }} />
          Delete All
        </button>
      </div>

      {/* Appointments Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <React.Fragment key={app.id}>
              <tr>
                <td>
                  {app.firstName || app.fullName?.split(' ')[0] || 'N/A'} 
                  {app.lastName || app.fullName?.split(' ')[1] ? ` ${app.lastName || app.fullName?.split(' ')[1]}` : ''}
                </td>
                <td>{app.phone || 'N/A'}</td>
                <td>{app.datetime ? new Date(app.datetime).toLocaleString() : 'N/A'}</td>
                <td>
                  <StatusBadge status={app.status || 'Open'} />
                </td>
                <td className="action-buttons">
                  <AppointmentActions
                    appointment={app}
                    updateStatus={updateStatus}
                    deleteAppointment={deleteAppointment}
                  />
                  <button
                    className="message-btn"
                    onClick={() => {
                      if (messagingId === app.id) {
                        setMessagingId(null);
                        setMessageText('');
                      } else {
                        setMessagingId(app.id);
                      }
                    }}
                    title="Send Message"
                  >
                    <FaEnvelope />
                  </button>
                </td>
              </tr>
              {messagingId === app.id && (
                <tr>
                  <td colSpan={5}>
                    <input
                      type="text"
                      placeholder="Type your message here"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      style={{ width: '80%', marginRight: '10px' }}
                    />
                    <button onClick={() => handleSendMessage(app)}>Send</button>
                    <button onClick={() => setMessagingId(null)} style={{ marginLeft: '10px' }}>
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Appointments Card View for Mobile */}
      <div className="appointments-grid">
        {appointments.map(app => (
          <div key={app.id} className="appointment-card">
            <div className="appointment-card-header">
              <div>
                <h3 className="appointment-card-name">
                  {app.firstName || app.fullName?.split(' ')[0] || 'N/A'} 
                  {app.lastName || app.fullName?.split(' ')[1] ? ` ${app.lastName || app.fullName?.split(' ')[1]}` : ''}
                </h3>
                <p className="appointment-card-time">
                  {app.datetime ? new Date(app.datetime).toLocaleString() : 'N/A'}
                </p>
                <p className="appointment-card-phone">{app.phone || 'N/A'}</p>
              </div>
              <StatusBadge status={app.status || 'Open'} />
            </div>
            
            <div className="appointment-card-actions">
              <AppointmentActions
                appointment={app}
                updateStatus={updateStatus}
                deleteAppointment={deleteAppointment}
              />
              <button
                className="message-btn"
                onClick={() => {
                  if (messagingId === app.id) {
                    setMessagingId(null);
                    setMessageText('');
                  } else {
                    setMessagingId(app.id);
                  }
                }}
                title="Send Message"
              >
                <FaEnvelope /> Message
              </button>
            </div>

            {messagingId === app.id && (
              <div className="card-messaging-section">
                <input
                  type="text"
                  placeholder="Type your message here"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <div className="messaging-buttons">
                  <button className="send-btn" onClick={() => handleSendMessage(app)}>
                    Send
                  </button>
                  <button className="cancel-btn" onClick={() => setMessagingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsList;