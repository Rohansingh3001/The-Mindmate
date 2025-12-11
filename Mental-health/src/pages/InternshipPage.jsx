import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Loader,
  Send,
  FileText,
  Briefcase,
  GraduationCap,
  Star,
  TrendingUp
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const InternshipPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    degree: '',
    graduationYear: '',
    department: '',
    duration: '',
    experience: '',
    motivation: '',
    availability: '',
    resume: null,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const auth = getAuth();

  const internshipPositions = [
    {
      id: 1,
      title: 'Mental Health Counseling Intern',
      department: 'Clinical Services',
      duration: '3-6 months',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      responsibilities: [
        'Assist in client counseling sessions',
        'Prepare session notes and reports',
        'Support mental health workshops',
        'Conduct research on therapeutic techniques'
      ]
    },
    {
      id: 2,
      title: 'Community Outreach Intern',
      department: 'Social Impact',
      duration: '3-4 months',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      responsibilities: [
        'Organize mental health awareness campaigns',
        'Engage with community partners',
        'Create educational content',
        'Coordinate peer support programs'
      ]
    },
    {
      id: 3,
      title: 'Content & Research Intern',
      department: 'Research & Development',
      duration: '2-4 months',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      responsibilities: [
        'Research mental health topics',
        'Write blog posts and articles',
        'Develop educational resources',
        'Analyze mental health trends'
      ]
    },
    {
      id: 4,
      title: 'Technology & Product Intern',
      department: 'Product Development',
      duration: '3-6 months',
      icon: Briefcase,
      color: 'from-orange-500 to-red-500',
      responsibilities: [
        'Assist in platform development',
        'Test new features and tools',
        'Gather user feedback',
        'Support technical documentation'
      ]
    }
  ];

  const benefits = [
    { icon: Award, title: 'Certificate of Completion', desc: 'Official recognition of your work' },
    { icon: GraduationCap, title: 'Learning Opportunities', desc: 'Hands-on experience in mental health' },
    { icon: Users, title: 'Mentorship Program', desc: 'Guidance from experienced professionals' },
    { icon: Star, title: 'Letter of Recommendation', desc: 'For outstanding performance' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5000000) { // 5MB limit
      setFormData(prev => ({ ...prev, resume: file }));
    } else {
      toast.error('File size must be less than 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      toast.error('Please login to apply');
      return;
    }

    setLoading(true);

    try {
      // In a real application, you'd upload the resume to Firebase Storage
      // For now, we'll just store the filename
      await addDoc(collection(db, 'internship_applications'), {
        ...formData,
        resumeFileName: formData.resume?.name || '',
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        status: 'pending',
        appliedAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
        notes: ''
      });

      toast.success('Application submitted successfully!');
      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        university: '',
        degree: '',
        graduationYear: '',
        department: '',
        duration: '',
        experience: '',
        motivation: '',
        availability: '',
        resume: null,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6"
          >
            Join Our Internship Program
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-8 max-w-3xl mx-auto"
          >
            Make a difference in mental health while gaining valuable experience. 
            Work with professionals, learn from experts, and contribute to meaningful projects.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-6 flex-wrap"
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 px-6">
              <div className="text-3xl font-bold">4+</div>
              <div className="text-sm">Departments</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 px-6">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm">Interns Placed</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 px-6">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm">Completion Rate</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Available Positions */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Positions</h2>
          <p className="text-gray-600 text-lg">Choose the role that matches your interests and skills</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {internshipPositions.map((position, index) => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${position.color} flex items-center justify-center shadow-lg`}>
                  <position.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{position.title}</h3>
                  <p className="text-purple-600 font-semibold text-sm">{position.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {position.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Remote/Hybrid
                </span>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Key Responsibilities:</h4>
                <ul className="space-y-1">
                  {position.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What You'll Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          id="apply"
          className="bg-white rounded-3xl p-8 shadow-xl border border-purple-200"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply Now</h2>
          <p className="text-gray-600 mb-8">Fill out the form below to start your journey with us</p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for applying. Our team will review your application and get back to you within 5-7 business days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    University/College *
                  </label>
                  <input
                    type="text"
                    name="university"
                    required
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                    placeholder="Your Institution"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Degree/Program *
                  </label>
                  <input
                    type="text"
                    name="degree"
                    required
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                    placeholder="B.A. Psychology, MSW, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Expected Graduation Year *
                  </label>
                  <input
                    type="text"
                    name="graduationYear"
                    required
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                    placeholder="2025, 2026, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Preferred Department *
                  </label>
                  <select
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                  >
                    <option value="">Select Department</option>
                    <option value="clinical">Clinical Services</option>
                    <option value="outreach">Community Outreach</option>
                    <option value="research">Research & Development</option>
                    <option value="technology">Technology & Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Preferred Duration *
                  </label>
                  <select
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                  >
                    <option value="">Select Duration</option>
                    <option value="2-3">2-3 months</option>
                    <option value="3-4">3-4 months</option>
                    <option value="4-6">4-6 months</option>
                    <option value="6+">6+ months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Relevant Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors resize-none"
                  placeholder="Describe any relevant experience, courses, or projects..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Why do you want to join? *
                </label>
                <textarea
                  name="motivation"
                  required
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors resize-none"
                  placeholder="Tell us about your motivation and what you hope to learn..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Availability *
                </label>
                <input
                  type="text"
                  name="availability"
                  required
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                  placeholder="e.g., Weekdays, 20 hours/week, Starting January 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Resume/CV (PDF, Max 5MB)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                />
                {formData.resume && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {formData.resume.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipPage;
