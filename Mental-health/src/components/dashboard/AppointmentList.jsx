import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Edit, Eye, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
  '�': '#A9A9A9',
};

function AppointmentList() {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
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

  // Fetch past journals
  useEffect(() => {
    const fetchJournals = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setLoading(true);
        
        // Try to fetch from Firebase first
        const journalsRef = collection(db, 'journals');
        const q = query(
          journalsRef,
          where('uid', '==', currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        
        const snapshot = await getDocs(q);
        
        if (snapshot.docs.length > 0) {
          const firebaseJournals = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              entry: data.entry,
              mood: data.mood || '�',
              timestamp: data.timestamp?.toDate?.() || new Date(),
              source: 'firebase'
            };
          });
          setJournals(firebaseJournals);
        } else {
          // Fallback to gamified journals from localStorage
          const gamifiedJournals = JSON.parse(localStorage.getItem('gamified_journals') || '[]');
          const recentJournals = gamifiedJournals
            .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
            .slice(0, 5)
            .map(journal => ({
              id: journal.id,
              entry: journal.entry || journal.content,
              mood: journal.mood || '�',
              timestamp: new Date(journal.timestamp || journal.date),
              source: 'local'
            }));
          setJournals(recentJournals);
        }
      } catch (error) {
        console.error('Error fetching journals:', error);
        // Fallback to localStorage
        const gamifiedJournals = JSON.parse(localStorage.getItem('gamified_journals') || '[]');
        const recentJournals = gamifiedJournals
          .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
          .slice(0, 5)
          .map(journal => ({
            id: journal.id,
            entry: journal.entry || journal.content,
            mood: journal.mood || '📝',
            timestamp: new Date(journal.timestamp || journal.date),
            source: 'local'
          }));
        setJournals(recentJournals);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournals();
  }, [currentUser]);
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Past Journals</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-purple-100 rounded-2xl"></div>
          <div className="h-20 bg-purple-100 rounded-2xl"></div>
          <div className="h-20 bg-purple-100 rounded-2xl"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Past Journals</h3>
        <button 
          onClick={() => navigate('/user/journals')}
          className="text-sm text-purple-600 font-bold hover:text-purple-700 transition-colors"
        >
          View All
        </button>
      </div>

      {journals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm mb-2">No Journal Entries Yet</h4>
          <p className="text-xs text-gray-600 mb-4 max-w-xs">
            Start documenting your thoughts and feelings today!
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/gamified-journal')}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Write Your First Entry
          </motion.button>
        </div>
      ) : (
        <>
          {/* Scrollable Journals List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
            {journals.map((journal, index) => (
              <motion.div
                key={journal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  {/* Mood Icon */}
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                    style={{ 
                      backgroundColor: MOOD_COLORS[journal.mood] || '#a855f7',
                      opacity: 0.9
                    }}
                  >
                    {journal.mood}
                  </div>

                  {/* Journal Details */}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-2">
                      {journal.entry}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {journal.timestamp instanceof Date && !isNaN(journal.timestamp)
                          ? format(journal.timestamp, 'MMM dd, yyyy')
                          : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* View Icon */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/user/journal-viewer', { state: { journal } })}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Eye className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Write New Journal Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/gamified-journal')}
            className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-purple-100 to-purple-100 border-2 border-dashed border-purple-400 text-purple-700 font-bold rounded-xl hover:bg-purple-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Write New Entry</span>
          </motion.button>
        </>
      )}
    </motion.div>
  );
}

export default AppointmentList;
