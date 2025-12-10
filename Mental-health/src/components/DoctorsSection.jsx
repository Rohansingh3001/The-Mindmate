import { useState } from "react";
import femaleImage from "../assets/femlae.jpg";
import maleImage from "../assets/male.avif";

export default function DoctorsSection() {
  const doctors = [
    {
      name: "Dr. Priya Nair",
      specialty: "Psychiatrist",
      description:
        "Experienced psychiatrist with expertise in mental wellness, stress management, and emotional well-being.",
      image: femaleImage,
      rating: 4.8,
    },
    {
      name: "Dr. Aarav Mehta",
      specialty: "Clinical Psychologist",
      description:
        "Specializing in cognitive behavioral therapy (CBT), anxiety, depression, and trauma treatment.",
      image: maleImage,
      rating: 4.9,
    },
    {
      name: "Dr. Sneha Iyer",
      specialty: "Therapist",
      description:
        "Expert therapist offering personalized therapy sessions to support mental clarity and emotional healing.",
      image: femaleImage,
      rating: 4.7,
    },
    {
      name: "Dr. Rahul Sharma",
      specialty: "Counseling Psychologist",
      description:
        "Providing counseling for individuals and couples, focusing on relationship and personal growth.",
      image: maleImage,
      rating: 4.6,
    },
    {
      name: "Dr. Ananya Roy",
      specialty: "Child Psychologist",
      description:
        "Helping children and adolescents navigate emotions, learning difficulties, and developmental challenges.",
      image: femaleImage,
      rating: 4.9,
    },
    {
      name: "Dr. Vikram Das",
      specialty: "Neuropsychologist",
      description:
        "Specialist in brain-behavior relationships, cognitive assessments, and neurological rehabilitation.",
      image: maleImage,
      rating: 4.8,
    },
  ];

  return (
    <div id="doctors" className="bg-[#f5f0ff] py-16 px-6 relative">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#8f71ff] mb-12 tracking-tight">
        Meet Our Doctors
      </h2>
      
      {/* Blurred Content */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 blur-md select-none pointer-events-none">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:bg-[#f3efff] relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-blue-200 opacity-30 rounded-3xl"></div>

              {/* Star Rating at the Top Right Corner */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-[2px] sm:gap-1">
                <span className="text-yellow-500 flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < Math.round(doctor.rating)
                          ? "fill-yellow-400"
                          : "fill-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967h4.175c.969 0 1.371 1.24.588 1.81l-3.379 2.455 1.287 3.966c.3.922-.755 1.688-1.54 1.117L10 13.011l-3.379 2.455c-.784.571-1.838-.195-1.539-1.117l1.287-3.966-3.379-2.455c-.784-.57-.38-1.81.588-1.81h4.175L9.05 2.927z" />
                    </svg>
                  ))}
                </span>
                <span className="text-gray-500 text-sm sm:text-base font-semibold">
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

        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-white px-10 py-8 sm:px-16 sm:py-12 rounded-3xl shadow-2xl text-center border-[6px] border-mindmate-600 transform hover:scale-105 transition-all duration-300">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-mindmate-600 drop-shadow-md">
                Coming Soon! 🚀
              </h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Will be available soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
