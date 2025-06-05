import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';

const Scheduler = ({ userDetails }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());

  const doctors = [
    "Dr. Avinash Kumar",
    "Dr. Sneha Roy",
    "Dr. Rohan Mehta",
    "Dr. Priya Sharma",
    "Dr. Arjun Nair"
  ];

  const handleSchedule = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor.');
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        doctor: selectedDoctor,
        user: userDetails?.name,
        email: userDetails?.email,
        date: appointmentDate.toISOString(),
      });
      toast.success('Appointment booked successfully!');
      setSelectedDoctor('');
      setAppointmentDate(new Date());
    } catch (error) {
      toast.error('Error booking appointment.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl shadow-xl p-8 transition duration-300 ease-in-out hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-[#8f71ff] mb-6 text-center">
          Schedule an Appointment
        </h2>

        {/* Doctor Dropdown */}
        <div className="mb-5">
          <label className="block text-gray-800 font-semibold mb-2">Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-3 border rounded-xl bg-white bg-opacity-70 focus:ring-2 ring-[#8f71ff] outline-none"
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map((doc, idx) => (
              <option key={idx} value={doc}>{doc}</option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-5">
          <label className="block text-gray-800 font-semibold mb-2">Choose Date & Time</label>
          <DatePicker
            selected={appointmentDate}
            onChange={(date) => setAppointmentDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="w-full p-3 border rounded-xl bg-white bg-opacity-70 focus:ring-2 ring-[#8f71ff] outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSchedule}
          className="w-full mt-4 bg-[#8f71ff] hover:bg-[#7c63ff] text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default Scheduler;
