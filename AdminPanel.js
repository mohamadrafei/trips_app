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

        // Normalize phone numbers for consistent matching
        const normalizePhone = (phone) => {
          if (!phone) return '';
          const cleaned = phone.replace(/\D/g, ''); // Remove all non-digits
          // Handle international numbers - remove leading 1 if it's 11 digits
          if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return cleaned.substring(1);
          }
          return cleaned;
        };

        // Create multiple possible keys for a patient/appointment
        const createKeys = (phone, email, fullName) => {
          const keys = [];
          
          if (phone) {
            const normalized = normalizePhone(phone);
            if (normalized) keys.push(`phone:${normalized}`);
          }
          
          if (email) {
            keys.push(`email:${email.toLowerCase()}`);
          }
          
          if (fullName) {
            const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (cleanName) keys.push(`name:${cleanName}`);
          }
          
          return keys;
        };

        // Create a map to count appointments per patient
        const appointmentCountMap = {};
        
        console.log("🔍 Processing appointments for count:", appointmentsData.length);
        console.log("📋 Sample appointment data:", appointmentsData.slice(0, 2));
        
        appointmentsData.forEach((app, index) => {
          const fullName = app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim();
          const possibleKeys = createKeys(app.phone, app.email, fullName);
          
          console.log(`📞 Processing appointment ${index + 1}:`, {
            originalPhone: app.phone,
            email: app.email,
            fullName,
            possibleKeys,
            patientName: fullName
          });
          
          if (possibleKeys.length > 0) {
            // Use the first available key (phone has priority)
            const primaryKey = possibleKeys[0];
            appointmentCountMap[primaryKey] = (appointmentCountMap[primaryKey] || 0) + 1;
            console.log(`✅ Appointment count for key "${primaryKey}":`, appointmentCountMap[primaryKey]);
            
            // Also map other keys to the same primary key for cross-referencing
            possibleKeys.slice(1).forEach(altKey => {
              appointmentCountMap[altKey] = appointmentCountMap[primaryKey];
            });
          } else {
            console.log("❌ No valid key found for appointment:", app);
          }
        });

        console.log("🎯 Final appointment count map:", appointmentCountMap);

        const uniquePatients = {};

        // Process patients from patients collection first
        console.log("👥 Processing patients from patients collection:", patientsData.length);
        
        patientsData.forEach((patient, index) => {
          const possibleKeys = createKeys(patient.phone, patient.email, patient.fullName);
          
          console.log(`👤 Processing patient ${index + 1}:`, {
            name: patient.fullName,
            originalPhone: patient.phone,
            email: patient.email,
            possibleKeys
          });
          
          if (possibleKeys.length > 0) {
            // Find the best matching key from appointment counts
            let bestCount = 0;
            let bestKey = possibleKeys[0];
            
            possibleKeys.forEach(key => {
              const count = appointmentCountMap[key] || 0;
              if (count > bestCount) {
                bestCount = count;
                bestKey = key;
              }
            });
            
            uniquePatients[bestKey] = {
              ...patient,
              source: 'patients',
              appointmentCount: bestCount
            };
            
            console.log(`✅ Patient "${patient.fullName}" has ${bestCount} appointments (key: ${bestKey})`);
          } else {
            console.log("❌ No valid key for patient:", patient);
          }
        });

        // Process patients from appointments (who might not be in patients collection)
        console.log("📋 Processing patients from appointments who aren't in patients collection...");
        
        appointmentsData.forEach(app => {
          const fullName = app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim();
          const possibleKeys = createKeys(app.phone, app.email, fullName);
          
          if (possibleKeys.length > 0) {
            const primaryKey = possibleKeys[0];
            
            // Check if we already have this patient
            const existingPatient = Object.values(uniquePatients).find(p => {
              const pKeys = createKeys(p.phone, p.email, p.fullName);
              return pKeys.some(pk => possibleKeys.includes(pk));
            });
            
            if (!existingPatient) {
              uniquePatients[primaryKey] = {
                fullName,
                phone: app.phone,
                email: app.email,
                source: 'appointments',
                appointmentCount: appointmentCountMap[primaryKey] || 0,
                patientId: `APT-${primaryKey.slice(-4)}` // Generate ID from key
              };
              console.log(`➕ Added new patient from appointments: "${fullName}" with ${appointmentCountMap[primaryKey] || 0} appointments`);
            }
          }
        });

        const finalPatients = Object.values(uniquePatients);
        console.log("🏁 Final patients with appointment counts:", finalPatients);
        
        // Debug: Show summary
        const totalAppointments = appointmentsData.length;
        const totalPatients = finalPatients.length;
        const patientsWithAppointments = finalPatients.filter(p => p.appointmentCount > 0).length;
        
        console.log("📊 Summary:", {
          totalAppointments,
          totalPatients,
          patientsWithAppointments,
          appointmentKeys: Object.keys(appointmentCountMap),
          patientKeys: finalPatients.map(p => createKeys(p.phone, p.email, p.fullName)[0] || 'no-key'),
          samplePatients: finalPatients.slice(0, 3).map(p => ({
            name: p.fullName,
            phone: p.phone,
            count: p.appointmentCount
          }))
        });
        
        setPatients(finalPatients);
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
              onAddPatient={(newPatient) => {
                console.log("Adding new patient:", newPatient);
                // Add the patient to Firestore patients collection
                // For now, we'll add it locally to see the counts
                setPatients(prev => [...prev, { ...newPatient, appointmentCount: 0 }]);
              }}
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