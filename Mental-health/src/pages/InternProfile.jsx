import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Briefcase, 
  Award, 
  Linkedin, 
  Github, 
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';
import { INTERNS } from '../data/internsData';

const InternProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const intern = INTERNS.find(i => i.slug === slug);

  if (!intern) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Intern Not Found</h1>
          <p className="text-gray-600 mb-8">The intern profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
          >
            Go to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={intern.photo}
              alt={intern.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-white"
            />

            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{intern.name}</h1>
                <p className="text-xl text-white/90 mb-4">{intern.role}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <Briefcase className="w-4 h-4" />
                    {intern.department}
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    {intern.duration}
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    {intern.location}
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              {intern.linkedin && (
                <a
                  href={intern.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              )}
              {intern.github && (
                <a
                  href={intern.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              )}
              <a
                href={`mailto:${intern.email}`}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-purple-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Testimonial</h2>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "{intern.testimonial}"
              </p>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-purple-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Key Achievements</h2>
              </div>
              <ul className="space-y-4">
                {intern.achievements.map((achievement, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {intern.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Verification Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 shadow-xl text-white text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">✓ Verified Intern</h3>
              <p className="text-white/90 text-sm mb-4">
                Successfully completed internship at The MindMate and contributed to our mission of mental health support.
              </p>
              {intern.certificateId && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="bg-white rounded-xl p-4 mt-4 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <p className="text-purple-600 font-bold text-sm uppercase tracking-wide">Certificate ID</p>
                  </div>
                  <p className="text-gray-900 font-mono font-bold text-lg tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {intern.certificateId}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Share Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">Share This Profile</h3>
              <div className="bg-gray-100 rounded-xl p-3 mb-3">
                <code className="text-sm text-gray-700 break-all">
                  {window.location.href}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Profile link copied to clipboard!');
                }}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Copy Link
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4 mt-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in Joining Our Team?</h2>
          <p className="text-xl text-white/90 mb-8">
            Apply for our internship program and make a difference in mental health
          </p>
          <button
            onClick={() => navigate('/internship')}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-shadow"
          >
            Apply for Internship
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InternProfile;
