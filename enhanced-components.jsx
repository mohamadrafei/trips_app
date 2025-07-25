// Enhanced Mobile-First React Components

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection, addDoc, doc, setDoc, getDocs, increment, getDoc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import doctorImg from "../assets/doctor.webp";

// Enhanced Navbar Component
const EnhancedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setIsMenuOpen(false);
    }
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="title">
        <span role="img" aria-label="Medical">🏥</span>
        Healthcare App
      </div>
      
      <div className={`navLinks ${isMenuOpen ? 'navLinks--open' : ''}`}>
        <button 
          className="navButton"
          onClick={() => scrollToSection('home')}
          aria-label="Go to home section"
        >
          Home
        </button>
        <button 
          className="navButton"
          onClick={() => scrollToSection('services')}
          aria-label="Go to services section"
        >
          Services
        </button>
        <button 
          className="navButton"
          onClick={() => scrollToSection('appointment')}
          aria-label="Go to appointment section"
        >
          Appointment
        </button>
        <button 
          className="navButton"
          onClick={() => scrollToSection('contact')}
          aria-label="Go to contact section"
        >
          Contact
        </button>
        <button 
          className="signUpButton"
          aria-label="Sign up for account"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

// Enhanced Hero Section Component
const EnhancedHeroSection = () => {
  const scrollToAppointment = useCallback(() => {
    const element = document.getElementById('appointment');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  return (
    <section id="home" className="heroSection">
      <div className="leftContent">
        <p className="servingText">SERVING TO THE PEOPLE</p>
        <h1 className="heading">A Dedicated Doctor You Can Trust</h1>
        <p className="paragraph">
          This is open to everyone everyday and provides primary health care 
          with experienced professionals and modern facilities.
        </p>
        <div className="buttonsContainer">
          <button 
            className="contactButton"
            onClick={scrollToAppointment}
            aria-label="Book an appointment"
          >
            <span>Get Appointment</span>
            <span role="img" aria-label="Arrow">➡️</span>
          </button>
        </div>
      </div>
      <div className="imageContainer">
        <img 
          src={doctorImg} 
          alt="Professional doctor in medical attire" 
          className="doctorImage"
          loading="lazy"
          width="320"
          height="400"
        />
      </div>
    </section>
  );
};

// Enhanced Features Section Component
const EnhancedFeaturesSection = () => {
  const features = useMemo(() => [
    {
      id: 1,
      title: "24 Hours Service",
      description: "Round-the-clock medical service availability for emergencies and consultations",
      icon: "🕐",
      className: "feature1"
    },
    {
      id: 2,
      title: "Qualified Doctors",
      description: "Highly trained and certified medical professionals with years of experience",
      icon: "👨‍⚕️",
      className: "feature2"
    },
    {
      id: 3,
      title: "Emergency Care",
      description: "Immediate response and treatment for urgent medical cases and emergencies",
      icon: "🚨",
      className: "feature3"
    },
    {
      id: 4,
      title: "Modern Technology",
      description: "Cutting-edge medical technology and equipment for accurate diagnosis",
      icon: "🔬",
      className: "feature4"
    }
  ], []);

  return (
    <section id="services" className="whyWeBest">
      <h2 className="whyWeTitle">
        WHY WE<br />
        ARE<br />
        THE BEST?
      </h2>
      <div 
        className="featuresContainer"
        role="list"
        aria-label="Our key features and services"
      >
        {features.map((feature) => (
          <div 
            key={feature.id}
            className={feature.className}
            role="listitem"
            tabIndex="0"
            aria-labelledby={`feature-title-${feature.id}`}
            aria-describedby={`feature-desc-${feature.id}`}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">
              {feature.icon}
            </div>
            <h3 id={`feature-title-${feature.id}`}>{feature.title}</h3>
            <p id={`feature-desc-${feature.id}`}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Enhanced Loading Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="loading" role="status" aria-live="polite">
    <span>{message}</span>
    <span className="sr-only">Please wait while we process your request</span>
  </div>
);

// Enhanced Message Component
const StatusMessage = ({ message, type = "info", onDismiss }) => (
  <div 
    className={`message ${type}`}
    role="alert"
    aria-live="assertive"
  >
    <span>{message}</span>
    {onDismiss && (
      <button 
        onClick={onDismiss}
        aria-label="Dismiss message"
        style={{ 
          marginLeft: '1rem', 
          background: 'none', 
          border: 'none', 
          fontSize: '1.2rem',
          cursor: 'pointer'
        }}
      >
        ✕
      </button>
    )}
  </div>
);

// Enhanced Form Field Component
const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  helpText 
}) => (
  <div>
    {label && (
      <label style={{ 
        display: 'block', 
        marginBottom: '0.5rem', 
        fontWeight: '500',
        color: '#374151'
      }}>
        {label}
        {required && <span aria-label="required" style={{ color: '#ef4444' }}> *</span>}
      </label>
    )}
    {children}
    {error && <div className="error-message" role="alert">{error}</div>}
    {helpText && !error && (
      <div style={{ 
        fontSize: '0.875rem', 
        color: '#6b7280', 
        marginTop: '0.5rem' 
      }}>
        {helpText}
      </div>
    )}
  </div>
);

// Enhanced Appointment Section Component
const EnhancedAppointmentSection = () => {
  const [user, loading, authError] = useAuthState(auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    date: '',
    time: '',
    clinic: ''
  });

  const [userPhone, setUserPhone] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Enhanced user data fetching
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserPhone(userData.phoneNumber || '');
          setFormData(prev => ({
            ...prev,
            fullName: userData.fullName || userData.displayName || ''
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage("Error loading user information");
        setMessageType("error");
      }
    };

    fetchUserData();
  }, [user]);

  // Enhanced availability fetching
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        setMessage("Loading available dates...");
        setMessageType("info");
        
        const slotsSnap = await getDocs(collection(db, "doctor_availability"));
        const slots = slotsSnap.docs.map(doc => doc.data());
        
        const exceptionSnap = await getDocs(collection(db, "availability_exceptions"));
        const exceptions = exceptionSnap.docs.map(doc => doc.data());

        const today = new Date();
        const upcomingDates = Array.from({ length: 30 }, (_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() + i + 1); // Start from tomorrow
          return d.toISOString().split("T")[0];
        });

        const validDates = upcomingDates.filter(dateStr => {
          const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
          
          // Skip if there's an all-day exception
          const isAllDayException = exceptions.some(exc => exc.date === dateStr && exc.isAllDay);
          if (isAllDayException) return false;

          return slots.some(slot => {
            if (slot.startDate && dateStr < slot.startDate) return false;
            if (slot.endDate && dateStr > slot.endDate) return false;

            switch (slot.recurrence) {
              case 'daily': return true;
              case 'weekdays': return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayName);
              case 'weekends': return ['Saturday', 'Sunday'].includes(dayName);
              case 'weekly': return slot.dayOfWeek === dayName;
              default: return false;
            }
          });
        });

        setAvailableDates(validDates);
        setMessage("");
      } catch (err) {
        console.error("Error loading availability", err);
        setMessage("Error loading available dates. Please try again.");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  // Enhanced time slots fetching
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!formData.date) {
        setAvailableTimes([]);
        return;
      }

      try {
        setIsLoading(true);
        setMessage("Loading available times...");
        setMessageType("info");

        const dayName = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' });
        const slotsSnap = await getDocs(collection(db, "doctor_availability"));
        const slots = slotsSnap.docs.map(doc => doc.data());

        const exceptionSnap = await getDocs(collection(db, "availability_exceptions"));
        const exceptions = exceptionSnap.docs
          .map(doc => doc.data())
          .filter(exc => exc.date === formData.date);

        const bookedSnap = await getDocs(collection(db, "appointments"));
        const bookedTimes = bookedSnap.docs
          .map(doc => doc.data())
          .filter(appt => appt.date === formData.date && appt.status !== 'cancelled')
          .map(appt => appt.time);

        const matchedSlots = slots.filter(slot => {
          if (slot.startDate && formData.date < slot.startDate) return false;
          if (slot.endDate && formData.date > slot.endDate) return false;

          switch (slot.recurrence) {
            case 'daily': return true;
            case 'weekdays': return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayName);
            case 'weekends': return ['Saturday', 'Sunday'].includes(dayName);
            case 'weekly': return slot.dayOfWeek === dayName;
            default: return false;
          }
        });

        const timeOptions = [];
        matchedSlots.forEach(slot => {
          const start = new Date(`2000-01-01T${slot.startTime}`);
          const end = new Date(`2000-01-01T${slot.endTime}`);
          const current = new Date(start);

          while (current < end) {
            const timeStr = current.toTimeString().substring(0, 5);
            
            if (bookedTimes.includes(timeStr)) {
              current.setMinutes(current.getMinutes() + 30);
              continue;
            }

            const isBlocked = exceptions.some(exc => {
              if (exc.isAllDay) return true;
              
              const excStart = new Date(`2000-01-01T${exc.startTime}`);
              const excEnd = new Date(`2000-01-01T${exc.endTime}`);
              const timeToCheck = new Date(`2000-01-01T${timeStr}`);
              
              return timeToCheck >= excStart && timeToCheck < excEnd;
            });

            if (!isBlocked) {
              timeOptions.push(timeStr);
            }

            current.setMinutes(current.getMinutes() + 30);
          }
        });

        setAvailableTimes(timeOptions);
        setMessage("");
      } catch (err) {
        console.error("Error loading times", err);
        setMessage("Error loading time slots. Please try again.");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [formData.date]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Reset time when date changes
    if (name === 'date' && formData.time) {
      setFormData(prev => ({ ...prev, time: '' }));
    }
  }, [errors, formData.time]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.date) {
      newErrors.date = "Please select an appointment date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select an appointment time";
    }

    if (!formData.clinic) {
      newErrors.clinic = "Please select a clinic";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Please fix the errors below");
      setMessageType("error");
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.focus();
      }
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Booking your appointment...");
      setMessageType("info");

      // Check if time slot is still available
      const bookedSnap = await getDocs(collection(db, "appointments"));
      const isTimeSlotTaken = bookedSnap.docs
        .map(doc => doc.data())
        .some(appt => 
          appt.date === formData.date && 
          appt.time === formData.time && 
          appt.status !== 'cancelled'
        );

      if (isTimeSlotTaken) {
        setMessage("Sorry, this time slot has been taken. Please select another time.");
        setMessageType("error");
        // Refresh available times
        const updatedTimes = availableTimes.filter(t => t !== formData.time);
        setAvailableTimes(updatedTimes);
        setFormData(prev => ({ ...prev, time: '' }));
        return;
      }

      const appointmentData = {
        userId: user.uid,
        userEmail: user.email,
        ...formData,
        phone: userPhone,
        datetime: `${formData.date} ${formData.time}`,
        status: "confirmed",
        createdAt: new Date(),
        lastModified: new Date()
      };

      await addDoc(collection(db, "appointments"), appointmentData);

      await setDoc(
        doc(db, "patients", user.uid),
        {
          ...formData,
          phone: userPhone,
          userEmail: user.email,
          userId: user.uid,
          lastAppointment: `${formData.date} ${formData.time}`,
          lastModified: new Date(),
          appointmentCount: increment(1)
        },
        { merge: true }
      );

      // Update available times
      setAvailableTimes(prev => prev.filter(t => t !== formData.time));
      setMessage("✅ Appointment booked successfully! You will receive a confirmation email shortly.");
      setMessageType("success");
      
      // Reset form
      setFormData(prev => ({ 
        fullName: prev.fullName, // Keep name
        date: '', 
        time: '', 
        clinic: '' 
      }));

      // Auto-dismiss success message after 10 seconds
      setTimeout(() => {
        if (messageType === "success") {
          setMessage("");
        }
      }, 10000);

    } catch (err) {
      console.error("Booking failed", err);
      setMessage("❌ Failed to book appointment. Please try again or contact support.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, user, userPhone, availableTimes, errors, messageType]);

  const dismissMessage = useCallback(() => {
    setMessage("");
  }, []);

  const formatDateForDisplay = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const formatTimeForDisplay = useCallback((timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }, []);

  return (
    <section id="appointment" className="appointmentSection">
      <h2 className="appointmentTitle">Make An Appointment</h2>

      {message && (
        <StatusMessage 
          message={message} 
          type={messageType}
          onDismiss={messageType !== "info" ? dismissMessage : null}
        />
      )}

      <form 
        className="appointmentForm" 
        onSubmit={handleSubmit} 
        noValidate
        aria-label="Appointment booking form"
      >
        <div className="formRow">
          <FormField
            label="Full Name"
            error={errors.fullName}
            required
            helpText="Enter your complete name as it appears on your ID"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={`inputField ${errors.fullName ? 'error' : ''}`}
              disabled={isLoading}
              autoComplete="name"
              aria-describedby={errors.fullName ? "fullName-error" : "fullName-help"}
            />
          </FormField>

          {userPhone && (
            <FormField
              label="Phone Number"
              helpText="Using your registered phone number"
            >
              <input
                type="tel"
                placeholder="Phone Number"
                value={userPhone}
                className="inputField"
                disabled={true}
                style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
                aria-label="Your registered phone number"
              />
            </FormField>
          )}
        </div>

        <div className="formRow">
          <FormField
            label="Appointment Date"
            error={errors.date}
            required
            helpText={availableDates.length > 0 ? `${availableDates.length} dates available` : "Loading available dates..."}
          >
            <select
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`inputField ${errors.date ? 'error' : ''}`}
              disabled={isLoading || availableDates.length === 0}
              aria-describedby={errors.date ? "date-error" : "date-help"}
            >
              <option value="">Select a Date</option>
              {availableDates.map((date, index) => (
                <option key={index} value={date}>
                  {formatDateForDisplay(date)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Appointment Time"
            error={errors.time}
            required
            helpText={formData.date ? 
              (availableTimes.length > 0 ? `${availableTimes.length} slots available` : "No slots available for this date") :
              "Select a date first"
            }
          >
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`inputField ${errors.time ? 'error' : ''}`}
              disabled={isLoading || !formData.date || availableTimes.length === 0}
              aria-describedby={errors.time ? "time-error" : "time-help"}
            >
              <option value="">Select a Time</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>
                  {formatTimeForDisplay(time)}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="formRow">
          <FormField
            label="Select Clinic"
            error={errors.clinic}
            required
            helpText="Choose your preferred clinic location"
          >
            <select
              name="clinic"
              value={formData.clinic}
              onChange={handleChange}
              className={`inputField ${errors.clinic ? 'error' : ''}`}
              disabled={isLoading}
              aria-describedby={errors.clinic ? "clinic-error" : "clinic-help"}
            >
              <option value="">Choose Clinic Location</option>
              <option value="downtown">Downtown Medical Center</option>
              <option value="northside">Northside Family Clinic</option>
              <option value="westend">West End Specialty Center</option>
              <option value="eastgate">Eastgate Community Health</option>
            </select>
          </FormField>
        </div>

        <button 
          type="submit" 
          className="confirmButton" 
          disabled={isLoading || availableDates.length === 0}
          aria-describedby="submit-help"
        >
          {isLoading ? (
            <>
              <span>Processing...</span>
              <span className="sr-only">Please wait while we book your appointment</span>
            </>
          ) : (
            <>
              <span>Confirm Appointment</span>
              <span role="img" aria-label="Confirm" style={{ marginLeft: '0.5rem' }}>✓</span>
            </>
          )}
        </button>
        <div id="submit-help" className="sr-only">
          Click to book your appointment with the selected date, time, and clinic
        </div>
      </form>

      <button
        type="button"
        className="historyButton"
        onClick={() => navigate("/appointments")}
        disabled={isLoading}
        aria-label="View your appointment history"
      >
        <span role="img" aria-label="History">📅</span>
        View My Appointment History
      </button>
    </section>
  );
};

// Screen Reader Only utility class (add to CSS)
const srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

// Export all components
export {
  EnhancedNavbar,
  EnhancedHeroSection,
  EnhancedFeaturesSection,
  EnhancedAppointmentSection,
  LoadingSpinner,
  StatusMessage,
  FormField
};

// Main App Component combining all sections
const EnhancedMobileApp = () => {
  return (
    <div className="container">
      <EnhancedNavbar />
      <main>
        <EnhancedHeroSection />
        <EnhancedFeaturesSection />
        <EnhancedAppointmentSection />
      </main>
    </div>
  );
};

export default EnhancedMobileApp;