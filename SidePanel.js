import React from 'react';
import { FaCalendarAlt, FaUser, FaChartBar, FaCog } from 'react-icons/fa';

const SidePanel = ({ activeTab, setActiveTab, mobileMenuOpen, closeMobileMenu }) => {
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <div className={`side-panel ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <h2>Admin Panel</h2>
        <div className="doctor-info">
          <div className="doctor-avatar">DR</div>
          <div className="doctor-details">
            <h3>Dr. Abedulnour Rafie</h3>
            <p>Administrator</p>
          </div>
        </div>
      </div>
      
      <nav className="navigation">
        <button 
          className={activeTab === 'Appointments' ? 'active' : ''}
          onClick={() => handleTabChange('Appointments')}
        >
          <FaCalendarAlt /> Appointments
        </button>
        <button 
          className={activeTab === 'Patients' ? 'active' : ''}
          onClick={() => handleTabChange('Patients')}
        >
          <FaUser /> Patients
        </button>
        <button 
          className={activeTab === 'Patient Records' ? 'active' : ''}
          onClick={() => handleTabChange('Patient Records')}
        >
          <FaChartBar /> Patient Stats
        </button>
        <button 
          className={activeTab === 'Setting' ? 'active' : ''}
          onClick={() => handleTabChange('Setting')}
        >
          <FaCog /> Setting
        </button>
        <button 
          className={activeTab === 'Availability' ? 'active' : ''} 
          onClick={() => handleTabChange('Availability')}
        >
          <FaCog /> Availability
        </button>
      </nav>
    </div>
  );
};

export default SidePanel;