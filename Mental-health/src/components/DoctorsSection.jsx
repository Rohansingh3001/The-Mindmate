import { useState } from "react";

export default function DoctorsSection() {
  const doctors = [
    {
      name: "Dr. Priya Nair",
      specialty: "Psychiatrist",
      description:
        "Experienced psychiatrist with expertise in mental wellness, stress management, and emotional well-being.",
      image: "/images/dr-priya.jpg",
      rating: 4.8,
    },
    {
      name: "Dr. Aarav Mehta",
      specialty: "Clinical Psychologist",
      description:
        "Specializing in cognitive behavioral therapy (CBT), anxiety, depression, and trauma treatment.",
      image: "/images/dr-aarav.jpg",
      rating: 4.9,
    },
    {
      name: "Dr. Sneha Iyer",
      specialty: "Therapist",
      description:
        "Expert therapist offering personalized therapy sessions to support mental clarity and emotional healing.",
      image: "/images/dr-sneha.jpg",
      rating: 4.7,
    },
    {
      name: "Dr. Rahul Sharma",
      specialty: "Counseling Psychologist",
      description:
        "Providing counseling for individuals and couples, focusing on relationship and personal growth.",
      image: "/images/dr-rahul.jpg",
      rating: 4.6,
    },
  ];

  return (
    <div id="doctors" className="bg-[#f5f0ff] py-16 px-6">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#8f71ff] mb-12 tracking-tight">
        Meet Our Doctors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:bg-[#f3efff] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-blue-200 opacity-30 rounded-3xl"></div>

            {/* Star Rating at the Top Right Corner */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className="text-yellow-500 flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      i < Math.round(doctor.rating) ? "fill-yellow-400" : "fill-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967h4.175c.969 0 1.371 1.24.588 1.81l-3.379 2.455 1.287 3.966c.3.922-.755 1.688-1.54 1.117L10 13.011l-3.379 2.455c-.784.571-1.838-.195-1.539-1.117l1.287-3.966-3.379-2.455c-.784-.57-.38-1.81.588-1.81h4.175L9.05 2.927z" />
                  </svg>
                ))}
              </span>

              <span className="text-gray-500 text-lg font-semibold">
                ({doctor.rating})
              </span>
            </div>

            <img
              src={doctor.image}
              alt={doctor.name}
              className="rounded-full w-28 h-28 sm:w-36 sm:h-36 mb-6 object-cover border-4 border-[#8f71ff] shadow-xl"
            />
            <h3 className="text-xl sm:text-2xl font-semibold text-[#6a4eeb] mb-2">
              {doctor.name}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              {doctor.specialty}
            </p>
            <p className="text-sm sm:text-base text-gray-700 text-center mb-6">
              {doctor.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
