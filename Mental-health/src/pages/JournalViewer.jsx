import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Sparkles, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopHeader from '../components/dashboard/DashboardTopHeader';
import { format } from 'date-fns';

const MOOD_COLORS = {
  '😊': '#FFD700',
  '😢': '#4169E1',
  '😠': '#DC143C',
  '😴': '#9370DB',
  '🥰': '#FF69B4',
  '😰': '#FF6347',
  '🤔': '#20B2AA',
  '🎉': '#FF1493',
  '😌': '#98FB98',
  '😐': '#A9A9A9',
};

function JournalViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const journal = location.state?.journal;

  if (!journal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Journal Not Found</h2>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const wordCount = journal.entry?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 flex flex-col">
      <div className="flex flex-1">
        {/* Left Sidebar - Desktop Only */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <DashboardTopHeader />

          {/* Journal Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/user/dashboard')}
                className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </motion.button>

              {/* Journal Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-purple-200 overflow-hidden"
              >
                {/* Header with Mood */}
                <div 
                  className="p-8 border-b border-purple-200"
                  style={{
                    background: `linear-gradient(135deg, ${MOOD_COLORS[journal.mood] || '#a855f7'}15, ${MOOD_COLORS[journal.mood] || '#a855f7'}05)`
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                        style={{ 
                          backgroundColor: MOOD_COLORS[journal.mood] || '#a855f7',
                          opacity: 0.9
                        }}
                      >
                        {journal.mood}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Journal Entry</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {journal.timestamp instanceof Date && !isNaN(journal.timestamp)
                              ? format(journal.timestamp, 'MMMM dd, yyyy')
                              : 'Recent'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {journal.timestamp instanceof Date && !isNaN(journal.timestamp)
                              ? format(journal.timestamp, 'hh:mm a')
                              : 'Today'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/gamified-journal')}
                        className="p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{wordCount}</div>
                        <div className="text-xs text-gray-600">words</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{readingTime} min</div>
                        <div className="text-xs text-gray-600">read time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journal Content */}
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {journal.entry}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-purple-50 border-t border-purple-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 italic">
                      "Every word you write is a step towards understanding yourself better."
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/gamified-journal')}
                      className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Write New Entry
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Related Actions */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/user/journals')}
                  className="p-6 bg-white rounded-2xl shadow-lg border border-purple-200 hover:border-purple-300 transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-2">View All Journals</h3>
                  <p className="text-sm text-gray-600">Browse your complete journal collection</p>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/mental-health-progress')}
                  className="p-6 bg-white rounded-2xl shadow-lg border border-purple-200 hover:border-purple-300 transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">See your mental health journey insights</p>
                </motion.button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default JournalViewer;
