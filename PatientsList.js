import React, { useState } from 'react';
import { FaSearch, FaUserInjured, FaPhone, FaCalendarAlt, FaPlus, FaTimes } from 'react-icons/fa';
import './PatientsList.css';

const PatientsList = ({ patients, onPatientSelect, onAddPatient }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    phone: '',
    patientId: '',
    isVIP: false
  });
  const [errors, setErrors] = useState({});

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (patient.fullName || "").toLowerCase().includes(searchLower) ||
      (patient.phone || "").replace(/\D/g, '').includes(searchLower) ||
      (patient.patientId || "").toLowerCase().includes(searchLower)
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newPatient.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!newPatient.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddPatient(newPatient);
      setNewPatient({
        fullName: '',
        phone: '',
        patientId: '',
        isVIP: false
      });
      setShowAddForm(false);
      setErrors({});
    }
  };

  return (
    <div className="patients-list">
      <div className="list-header">
        <div className="header-top">
          <h2>
            <FaUserInjured className="header-icon" />
            Patient Registry
          </h2>
          <button className="add-patient-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <FaTimes /> : <FaPlus />}
            {showAddForm ? 'Cancel' : 'Add Patient'}
          </button>
        </div>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, phone, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showAddForm && (
        <div className="add-patient-form">
          <h3>Add New Patient</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name*</label>
              <input
                type="text"
                name="fullName"
                value={newPatient.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Phone*</label>
              <input
                type="tel"
                name="phone"
                value={newPatient.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={newPatient.patientId}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVIP"
                    checked={newPatient.isVIP}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, isVIP: e.target.checked }))}
                  />
                  VIP Patient
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Add Patient
              </button>
            </div>
          </form>
        </div>
      )}

      {sortedPatients.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('fullName')}>
                    Name {sortConfig.key === 'fullName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('phone')}>
                    <FaPhone /> Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('appointmentCount')}>
                    <FaCalendarAlt /> Appts {sortConfig.key === 'appointmentCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Medical Record</th>
                </tr>
              </thead>
              <tbody>
                {sortedPatients.map(patient => (
                  <tr key={patient.patientId || patient.phone}>
                    <td>
                      <div className="patient-name">
                        {patient.fullName || 'Unknown Patient'}
                        {patient.isVIP && <span className="vip-badge">VIP</span>}
                      </div>
                      <small className="patient-id">ID: {patient.patientId || 'N/A'}</small>
                    </td>
                    <td className="nowrap">{formatPhoneNumber(patient.phone)}</td>
                    <td className="appointment-count">
                      <span className={`count-badge ${getAppointmentStatusClass(patient.appointmentCount)}`}>
                        {patient.appointmentCount || 0}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => onPatientSelect(patient)} className="view-btn">
                        View Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="patients-mobile-cards">
            {sortedPatients.map(patient => (
              <div key={patient.patientId || patient.phone} className="patient-card">
                <div className="card-header">
                  <div className="card-info">
                    <div className="card-name">
                      {patient.fullName || 'Unknown Patient'}
                      {patient.isVIP && <span className="vip-badge">VIP</span>}
                    </div>
                    <div className="card-id">ID: {patient.patientId || 'N/A'}</div>
                    <div className="card-phone">{formatPhoneNumber(patient.phone)}</div>
                  </div>
                  <span className={`count-badge ${getAppointmentStatusClass(patient.appointmentCount)}`}>
                    {patient.appointmentCount || 0}
                  </span>
                </div>
                <div className="card-actions">
                  <div className="card-appointments">
                    <FaCalendarAlt />
                    {patient.appointmentCount || 0} appointments
                  </div>
                  <button onClick={() => onPatientSelect(patient)} className="view-btn">
                    View Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-patients">
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}>👥</div>
          <p>No matching patients found</p>
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Helper functions
const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
};

const getAppointmentStatusClass = (count) => {
  if (!count || count === 0) return 'none';
  if (count <= 3) return 'low';
  if (count <= 10) return 'medium';
  return 'high';
};

export default PatientsList;