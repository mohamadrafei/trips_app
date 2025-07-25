import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AdminCalendar.css';

const localizer = momentLocalizer(moment);

const AdminCalendar = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [visibleAppointments, setVisibleAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');

  // Set up real-time listener for appointments
  useEffect(() => {
    let unsubscribe;
    setLoading(true);

    const setupListener = async () => {
      try {
        let q;
        if (selectedClinic === 'all') {
          q = query(collection(db, "appointments"));
        } else {
          q = query(collection(db, "appointments"), where("clinic", "==", selectedClinic));
        }

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedAppointments = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Handle cases where datetime might be missing or invalid
            const start = data.datetime ? new Date(data.datetime) : new Date();
            const end = moment(start).add(30, 'minutes').toDate();

            return {
              id: doc.id,
              title: `${data.fullName || 'Unknown'} - ${data.clinic || 'No Clinic'}`,
              start,
              end,
              status: data.status || "pending",
              allDay: false,
              ...data
            };
          });

          setAllAppointments(fetchedAppointments);
          setLoading(false);
        });

      } catch (error) {
        console.error("Error setting up listener:", error);
        setLoading(false);
      }
    };

    setupListener();

    // Clean up listener on unmount or when selectedClinic changes
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedClinic]);

  // Update visible appointments when date or allAppointments change
  useEffect(() => {
    let filtered = allAppointments;

    if (currentView === 'week') {
      const startOfWeek = moment(currentDate).startOf('week').toDate();
      const endOfWeek = moment(currentDate).endOf('week').toDate();
      filtered = allAppointments.filter(appt => {
        if (!appt.start || isNaN(appt.start.getTime())) return false;
        return appt.start >= startOfWeek && appt.start <= endOfWeek;
      });
    } else if (currentView === 'day') {
      const startOfDay = moment(currentDate).startOf('day').toDate();
      const endOfDay = moment(currentDate).endOf('day').toDate();
      filtered = allAppointments.filter(appt => {
        if (!appt.start || isNaN(appt.start.getTime())) return false;
        return appt.start >= startOfDay && appt.start <= endOfDay;
      });
    } else if (currentView === 'month') {
      const startOfMonth = moment(currentDate).startOf('month').toDate();
      const endOfMonth = moment(currentDate).endOf('month').toDate();
      filtered = allAppointments.filter(appt => {
        if (!appt.start || isNaN(appt.start.getTime())) return false;
        return appt.start >= startOfMonth && appt.start <= endOfMonth;
      });
    }

    setVisibleAppointments(filtered);
  }, [allAppointments, currentDate, currentView]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Simplified eventStyleGetter for mobile
  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    switch (event.status) {
      case 'accepted':
      case 'confirmed':
      case 'completed':
        backgroundColor = '#17a2b8';
        break;
      case 'rejected':
      case 'cancelled':
        backgroundColor = '#dc3545';
        break;
      case 'pending':
      case 'open':
      default:
        backgroundColor = '#ffc107';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.75rem',
        padding: '2px 4px',
        minHeight: '16px',
        lineHeight: '1.2',
        fontWeight: '500'
      }
    };
  };

  // Mobile-optimized event component
  const MobileEvent = ({ event }) => (
    <div style={{ 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      whiteSpace: 'nowrap',
      fontSize: '0.7rem',
      lineHeight: '1.1'
    }}>
      <div style={{ fontWeight: '600' }}>
        {event.fullName || 'Unknown'}
      </div>
      <div style={{ fontSize: '0.65rem', opacity: 0.9 }}>
        {moment(event.start).format('h:mm A')}
      </div>
    </div>
  );

  // Get responsive view based on screen size
  const getResponsiveView = () => {
    if (window.innerWidth <= 768) {
      return 'day'; // Default to day view on mobile
    } else if (window.innerWidth <= 1024) {
      return 'week'; // Week view on tablets
    }
    return currentView; // Use selected view on desktop
  };

  const responsiveView = getResponsiveView();

  if (loading) {
    return (
      <div className="admin-calendar-container">
        <div className="loading">Loading calendar data...</div>
      </div>
    );
  }

  return (
    <div className="admin-calendar-container">
      <div className="calendar-header">
        <h2>Appointment Calendar</h2>
        <div className="calendar-stats">
          <span className="stat-item">
            <span className="stat-number">{visibleAppointments.length}</span>
            <span className="stat-label">Appointments</span>
          </span>
        </div>
      </div>

      <div className="calendar-controls">
        <div className="control-group">
          <label htmlFor="clinic-filter">Clinic:</label>
          <select 
            id="clinic-filter"
            value={selectedClinic} 
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="clinic-filter"
          >
            <option value="all">All Clinics</option>
            <option value="clinic1">Clinic 1</option>
            <option value="clinic2">Clinic 2</option>
            <option value="clinic3">Clinic 3</option>
          </select>
        </div>

        <div className="view-controls">
          <button 
            className={`view-btn ${responsiveView === 'day' ? 'active' : ''}`}
            onClick={() => setCurrentView('day')}
          >
            Day
          </button>
          <button 
            className={`view-btn ${responsiveView === 'week' ? 'active' : ''}`}
            onClick={() => setCurrentView('week')}
          >
            Week
          </button>
          <button 
            className={`view-btn ${responsiveView === 'month' ? 'active' : ''}`}
            onClick={() => setCurrentView('month')}
          >
            Month
          </button>
        </div>

        <button 
          className="today-button"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
      </div>

      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={visibleAppointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: window.innerWidth <= 768 ? 500 : 700 }}
          eventPropGetter={eventStyleGetter}
          view={responsiveView}
          views={window.innerWidth <= 768 ? ['day', 'agenda'] : ['day', 'week', 'month', 'agenda']}
          date={currentDate}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          selectable
          popup
          showMultiDayTimes
          step={30}
          timeslots={1}
          min={new Date(1970, 1, 1, 8, 0)}   // 8:00 AM
          max={new Date(1970, 1, 1, 19, 0)}  // 7:00 PM
          components={{
            event: MobileEvent
          }}
          formats={{
            timeGutterFormat: (date, culture, localizer) =>
              localizer.format(date, window.innerWidth <= 768 ? 'HH:mm' : 'h:mm A', culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              localizer.format(start, window.innerWidth <= 768 ? 'HH:mm' : 'h:mm A', culture) +
              ' - ' +
              localizer.format(end, window.innerWidth <= 768 ? 'HH:mm' : 'h:mm A', culture)
          }}
        />
      </div>

      <div className="calendar-legend">
        <h4>Status Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color pending"></span>
            <span>Pending</span>
          </div>
          <div className="legend-item">
            <span className="legend-color accepted"></span>
            <span>Accepted</span>
          </div>
          <div className="legend-item">
            <span className="legend-color rejected"></span>
            <span>Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;