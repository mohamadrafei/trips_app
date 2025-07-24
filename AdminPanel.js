import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase.js"; 
import './AdminPanel.css';
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';

import SidePanel from "./SidePanel";
import AppointmentsList from "./AppointmentsList";
import PatientsList from "./PatientsList";
import PatientDetails from "./PatientDetails";
import AdminCalendar from "../AdminCalendar/AdminCalendar";
import PatientStats from "./PatientStats";
import ViewToggle from "./ViewToggle";
import DoctorAvailabilityManager from "./DoctorAvailabilityManager";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  deleteDoc,
  where
} from "firebase/firestore";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [loading, setLoading] = useState({
    appointments: true,
    patients: true,
    patientDetails: false
  });
  const [activeTab, setActiveTab] = useState('Appointments');
  const [viewMode, setViewMode] = useState('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminSession = () => {
      const isAdmin = localStorage.getItem("isAdmin");
      const adminId = localStorage.getItem("adminId");
      
      if (!isAdmin || !adminId || !auth.currentUser) {
        navigate("/admin-login");
      }
    };
    
    checkAdminSession();
  }, [navigate]);

  const handleAddAppointment = async (appointmentData) => {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        fullName: `${appointmentData.firstName} ${appointmentData.lastName}`,
        status: 'Open',
        createdAt: serverTimestamp()
      });

      const newAppointment = {
        id: docRef.id,
        ...appointmentData,
        fullName: `${appointmentData.firstName} ${appointmentData.lastName}`,
        status: 'Open'
      };

      setAppointments(prev => [...prev, newAppointment]);
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(prev => ({ ...prev, appointments: true }));
        const q = query(collection(db, "appointments"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(prev => ({ ...prev, appointments: false }));
      }
    };

    const fetchPatients = async () => {
      try {
        setLoading(prev => ({ ...prev, patients: true }));

        const patientsSnapshot = await getDocs(collection(db, "patients"));
        const patientsData = patientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const appointmentsSnapshot = await getDocs(collection(db, "appointments"));
        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Create a map to count appointments per patient
        const appointmentCountMap = {};
        appointmentsData.forEach(app => {
          const key = app.phone || app.email;
          if (key) {
            appointmentCountMap[key] = (appointmentCountMap[key] || 0) + 1;
          }
        });

        const uniquePatients = {};

        patientsData.forEach(patient => {
          const key = patient.phone || patient.email;
          uniquePatients[key] = {
            ...patient,
            source: 'patients',
            appointmentCount: appointmentCountMap[key] || 0
          };
        });

        appointmentsData.forEach(app => {
          const key = app.phone || app.email;
          if (!uniquePatients[key]) {
            uniquePatients[key] = {
              fullName: app.fullName || `${app.firstName} ${app.lastName}`,
              phone: app.phone,
              email: app.email,
              source: 'appointments',
              appointmentCount: appointmentCountMap[key] || 0
            };
          }
        });

        setPatients(Object.values(uniquePatients));
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(prev => ({ ...prev, patients: false }));
      }
    };

    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchPatientAppointments = async (patientPhone) => {
    try {
      setLoading(prev => ({ ...prev, patientDetails: true }));
      const q = query(
        collection(db, "appointments"),
        where("phone", "==", patientPhone)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatientAppointments(data);
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
    } finally {
      setLoading(prev => ({ ...prev, patientDetails: false }));
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    if (patient.phone) {
      fetchPatientAppointments(patient.phone);
    }
  };

  const handleBackToPatients = () => {
    setSelectedPatient(null);
    setPatientAppointments([]);
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      const appointmentSnap = await getDoc(appointmentRef);
      const appointmentData = appointmentSnap.data();

      await addDoc(collection(db, "notifications"), {
        userId: appointmentData.userId,
        appointmentId: appointmentId,
        type: "appointment_status",
        message: `Your appointment on ${appointmentData.datetime} has been ${newStatus}`,
        status: newStatus,
        read: false,
        createdAt: serverTimestamp(),
      });

      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      
      if (selectedPatient) {
        setPatientAppointments(prev =>
          prev.map(appt =>
            appt.id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      });

      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, status: "cancelled" } : app
        )
      );

      if (selectedPatient) {
        setPatientAppointments(prev =>
          prev.map(app =>
            app.id === appointmentId ? { ...app, status: "cancelled" } : app
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const deleteAllAppointments = async () => {
    if (!window.confirm("Are you sure you want to delete ALL appointments?")) return;

    try {
      const q = query(collection(db, "appointments"));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      setAppointments([]);
      setPatientAppointments([]);
    } catch (error) {
      console.error("Error deleting all appointments:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading.appointments && activeTab === 'Appointments') return <div className="loading">Loading appointments...</div>;
  if (loading.patients && activeTab === 'Patients') return <div className="loading">Loading patients...</div>;

  return (
    <div className="admin-container">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'show' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      <SidePanel 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
      />
      
      <div className="main-content">
        <div className="content-header">
          <h1>{activeTab}</h1>
          {activeTab === 'Appointments' && (
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          )}
        </div>
        
        {activeTab === 'Appointments' && viewMode === 'list' ? (
          <AppointmentsList 
            appointments={appointments.filter(a => a.status !== "cancelled")} 
            updateStatus={updateStatus}
            deleteAppointment={deleteAppointment}
            deleteAllAppointments={deleteAllAppointments}
            addAppointment={handleAddAppointment} 
          />
        ) : activeTab === 'Appointments' && viewMode === 'calendar' ? (
          <div className="calendar-container">
            <AdminCalendar events={appointments} />
          </div>
        ) : activeTab === 'Patients' ? (
          selectedPatient ? (
            <PatientDetails 
              patient={selectedPatient}
              appointments={patientAppointments}
              loading={loading.patientDetails}
              onBack={handleBackToPatients}
              updateStatus={updateStatus}
              deleteAppointment={deleteAppointment}
            />
          ) : (
            <PatientsList 
              patients={patients} 
              onPatientSelect={handlePatientSelect} 
            />
          )
        ) : activeTab === 'Patient Records' ? (
          <div className="comingsoon">
            <PatientStats appointments={appointments} />
          </div>
        ) : activeTab === 'Availability' ? (
          <DoctorAvailabilityManager />
        ) : (
          <div className="coming-soon">
            <p>Settings section coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;