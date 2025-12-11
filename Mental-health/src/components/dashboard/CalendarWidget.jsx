import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function CalendarWidget() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch appointments for current month
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser?.uid) return;
      
      try {
        const apptRef = collection(db, 'appointments');
        const snapshot = await getDocs(apptRef);
        
        const dates = snapshot.docs
          .map(doc => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate?.();
            return timestamp;
          })
          .filter(date => {
            if (!date) return false;
            // Filter for current user and current displayed month
            const apptMonth = date.getMonth();
            const apptYear = date.getFullYear();
            return apptMonth === currentDate.getMonth() && 
                   apptYear === currentDate.getFullYear();
          })
          .map(date => date.getDate());
        
        setAppointmentDates(dates);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    
    fetchAppointments();
  }, [currentUser, currentDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">{monthName}</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-purple-700" />
          </motion.button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-700 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isToday = day === today;
          const hasAppointment = appointmentDates.includes(day);

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                isToday
                  ? 'bg-gradient-to-br from-purple-600 to-purple-500 text-white font-bold shadow-lg'
                  : hasAppointment
                  ? 'bg-purple-100 text-gray-900 font-bold border border-purple-300'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-gray-900'
              }`}
            >
              {day}
              {hasAppointment && !isToday && (
                <div className="w-1 h-1 rounded-full bg-purple-600 mt-0.5"></div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-purple-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-600 to-purple-500"></div>
          <span className="text-gray-800 font-semibold">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-600"></div>
          <span className="text-gray-800 font-semibold">Appointments</span>
        </div>
      </div>

      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/user/appointments')}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        View All Appointments
      </motion.button>
    </motion.div>
  );
}

export default CalendarWidget;
