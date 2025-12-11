import React, { useState, useEffect } from 'react';
import { Video, Clock, Calendar as CalendarIcon, CalendarPlus, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';

function UpcomingAppointmentCard() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, name: user.displayName });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch upcoming appointment
  useEffect(() => {
    const fetchUpcomingAppointment = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setLoading(true);
        const apptRef = collection(db, 'appointments');
        const snapshot = await getDocs(apptRef);
        
        const now = new Date();
        const upcomingAppts = snapshot.docs
          .map(doc => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate?.();
            return {
              id: doc.id,
              ...data,
              timestamp
            };
          })
          .filter(appt => {
            return appt.userId === currentUser.uid && appt.timestamp > now;
          })
          .sort((a, b) => a.timestamp - b.timestamp);
        
        if (upcomingAppts.length > 0) {
          const nextAppt = upcomingAppts[0];
          setAppointment({
            doctorName: `Dr. ${nextAppt.doctor}`,
            specialty: 'Mental Health Professional',
            date: format(nextAppt.timestamp, 'MMM dd, yyyy'),
            time: format(nextAppt.timestamp, 'hh:mm a'),
            type: nextAppt.mode,
            avatar: '👨‍⚕️',
          });
        } else {
          setAppointment(null);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUpcomingAppointment();
  }, [currentUser]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Appointment</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-purple-100 rounded-2xl"></div>
          <div className="h-4 bg-purple-100 rounded w-3/4"></div>
          <div className="h-4 bg-purple-100 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  // No appointments state
  if (!appointment) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Appointment</h3>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <CalendarPlus className="w-10 h-10 text-purple-500" />
          </div>
          <h4 className="font-bold text-gray-900 text-base mb-2">No Upcoming Appointments</h4>
          <p className="text-sm text-gray-600 mb-6 max-w-xs">
            You don't have any scheduled sessions. Book one to get started!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/appointments')}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Book Appointment
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const data = appointment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Appointment</h3>

      <div className="flex items-start gap-4">
        {/* Doctor Illustration */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center text-3xl border border-purple-300">
            {data.avatar}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="flex-grow">
          <h4 className="font-bold text-gray-900 text-base">{data.doctorName}</h4>
          <p className="text-sm text-purple-600 font-semibold mb-3">{data.specialty}</p>

          {/* Date & Time Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-300">
              <CalendarIcon className="w-3.5 h-3.5" />
              {data.date}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-300">
              <Clock className="w-3.5 h-3.5" />
              {data.time}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-300">
              <Video className="w-3.5 h-3.5" />
              {data.type}
            </span>
          </div>

          {/* Join Session Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Join Session
          </motion.button>
        </div>
      </div>

      {/* Preparation Tips */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-xs text-purple-700 font-bold mb-2">💡 Preparation Tips</p>
        <ul className="text-xs text-gray-700 font-medium space-y-1">
          <li>• Find a quiet, comfortable space</li>
          <li>• Have a glass of water nearby</li>
          <li>• Test your camera and microphone</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default UpcomingAppointmentCard;
