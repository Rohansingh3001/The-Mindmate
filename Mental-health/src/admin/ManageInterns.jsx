import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  ExternalLink, 
  Copy, 
  Check,
  Briefcase,
  Calendar,
  MapPin,
  Mail,
  Linkedin,
  Github
} from 'lucide-react';
import { INTERNS } from '../data/internsData';
import { toast } from 'react-hot-toast';

const ManageInterns = () => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (slug, name) => {
    const url = `${window.location.origin}/intern/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(`Copied ${name}'s profile link!`);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const departmentColors = {
    'Clinical Services': 'from-purple-500 to-pink-500',
    'Product Development': 'from-blue-500 to-cyan-500',
    'Research & Development': 'from-green-500 to-emerald-500',
    'Social Impact': 'from-orange-500 to-red-500',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Interns</h1>
            <p className="text-gray-600">View and share verified intern profiles</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600 text-sm font-semibold">Total Interns</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{INTERNS.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600 text-sm font-semibold">Departments</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">2</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-gray-600 text-sm font-semibold">University</span>
          </div>
          <div className="text-xl font-bold text-gray-900">NIT Kolkata</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span className="text-gray-600 text-sm font-semibold">Completion Rate</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">100%</div>
        </motion.div>
      </div>

      {/* Interns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {INTERNS.map((intern, index) => (
          <motion.div
            key={intern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={intern.photo}
                alt={intern.name}
                className="w-16 h-16 rounded-full border-2 border-purple-200 bg-gray-100"
              />
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{intern.name}</h3>
                <p className="text-purple-600 font-semibold text-sm mb-2">{intern.role}</p>
                
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {intern.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {intern.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {intern.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {intern.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
                {intern.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                    +{intern.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Contact & Links */}
            <div className="flex flex-wrap gap-2 mb-4">
              <a
                href={`mailto:${intern.email}`}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4 text-gray-700" />
              </a>
              {intern.linkedin && (
                <a
                  href={intern.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-blue-700" />
                </a>
              )}
              {intern.github && (
                <a
                  href={intern.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4 text-white" />
                </a>
              )}
            </div>

            {/* Profile URL */}
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <div className="text-xs text-gray-500 mb-1 font-semibold">Shareable Profile Link:</div>
              <code className="text-xs text-gray-700 break-all">
                {window.location.origin}/intern/{intern.slug}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(intern.slug, intern.name)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                {copiedId === intern.slug ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
              
              <a
                href={`/intern/${intern.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">About Intern Profiles</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              These verified intern profiles are publicly shareable. Each intern can use their unique profile link as proof of their work experience at MindMate. 
              The full list of interns is only accessible through this admin panel. Individual profiles can be shared publicly via the shareable links above.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageInterns;
