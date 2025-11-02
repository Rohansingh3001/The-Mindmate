import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Heart, 
  Brain, 
  Waves,
  Wind,
  Sun,
  Moon,
  Star,
  Flame,
  Award,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MINDFULNESS_CHALLENGES = [
  {
    id: 'breathing_basics',
    title: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    category: 'breathing',
    duration: 300, // 5 minutes
    difficulty: 'beginner',
    icon: Wind,
    instructions: [
      'Sit or lie down comfortably',
      'Close your eyes or soften your gaze',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat this cycle'
    ],
    benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system'],
    points: 20
  },
  {
    id: 'body_scan',
    title: 'Progressive Body Scan',
    description: 'Mindfully scan your body from head to toe',
    category: 'body_awareness',
    duration: 600, // 10 minutes
    difficulty: 'intermediate',
    icon: Brain,
    instructions: [
      'Lie down comfortably',
      'Start at the top of your head',
      'Notice any sensations without judgment',
      'Move slowly down through each body part',
      'Spend 30 seconds on each area',
      'End at your toes'
    ],
    benefits: ['Releases tension', 'Increases body awareness', 'Promotes relaxation'],
    points: 35
  },
  {
    id: 'loving_kindness',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others',
    category: 'compassion',
    duration: 450, // 7.5 minutes
    difficulty: 'intermediate',
    icon: Heart,
    instructions: [
      'Sit comfortably with eyes closed',
      'Start by sending love to yourself',
      'Repeat: "May I be happy, may I be healthy"',
      'Extend these wishes to loved ones',
      'Include neutral people',
      'Finally, include difficult people'
    ],
    benefits: ['Increases empathy', 'Reduces negative emotions', 'Builds resilience'],
    points: 30
  },
  {
    id: 'mindful_walking',
    title: 'Mindful Walking',
    description: 'Walk slowly with complete awareness',
    category: 'movement',
    duration: 900, // 15 minutes
    difficulty: 'beginner',
    icon: Sun,
    instructions: [
      'Find a quiet path 10-20 steps long',
      'Walk very slowly',
      'Feel each step connection with ground',
      'Notice the lifting and placing of feet',
      'When you reach the end, turn mindfully',
      'Continue for the full duration'
    ],
    benefits: ['Grounds you in present', 'Improves focus', 'Reduces rumination'],
    points: 25
  },
  {
    id: 'sound_meditation',
    title: 'Sound Awareness',
    description: 'Focus on the sounds around you',
    category: 'sensory',
    duration: 480, // 8 minutes
    difficulty: 'beginner',
    icon: Waves,
    instructions: [
      'Sit comfortably with eyes closed',
      'Listen to sounds without labeling them',
      'Notice near and far sounds',
      'Don\'t try to identify what they are',
      'Simply experience the vibrations',
      'Return to listening when mind wanders'
    ],
    benefits: ['Enhances present moment awareness', 'Calms mental chatter', 'Improves concentration'],
    points: 25
  },
  {
    id: 'gratitude_reflection',
    title: 'Gratitude Practice',
    description: 'Reflect deeply on things you\'re grateful for',
    category: 'appreciation',
    duration: 360, // 6 minutes
    difficulty: 'beginner',
    icon: Star,
    instructions: [
      'Sit quietly and breathe naturally',
      'Bring to mind something you\'re grateful for',
      'Feel the appreciation in your body',
      'Notice the warmth or lightness',
      'Explore why you\'re grateful for this',
      'Move to another item when ready'
    ],
    benefits: ['Increases happiness', 'Reduces depression', 'Improves relationships'],
    points: 20
  },
  {
    id: 'candle_gazing',
    title: 'Candle Gazing (Trataka)',
    description: 'Gaze softly at a candle flame',
    category: 'concentration',
    duration: 600, // 10 minutes
    difficulty: 'advanced',
    icon: Flame,
    instructions: [
      'Light a candle at eye level, arm\'s length away',
      'Sit comfortably with straight spine',
      'Gaze softly at the flame without blinking',
      'When eyes water, close them gently',
      'Visualize the flame in your mind\'s eye',
      'Open eyes and continue'
    ],
    benefits: ['Improves concentration', 'Enhances visualization', 'Calms mind'],
    points: 40
  },
  {
    id: 'moon_meditation',
    title: 'Moon Meditation',
    description: 'Connect with lunar energy and cycles',
    category: 'nature',
    duration: 720, // 12 minutes
    difficulty: 'intermediate',
    icon: Moon,
    instructions: [
      'Best done during visible moon phases',
      'Sit outside or by a window',
      'Gaze softly at the moon',
      'Reflect on cycles and change',
      'Feel connection to natural rhythms',
      'Set intentions aligned with moon phase'
    ],
    benefits: ['Connects with nature', 'Promotes reflection', 'Balances emotions'],
    points: 35
  }
];

const CHALLENGE_TRACKS = [
  {
    id: 'beginner_week',
    title: '7-Day Beginner Journey',
    description: 'Start your mindfulness practice',
    challenges: ['breathing_basics', 'sound_meditation', 'gratitude_reflection', 'mindful_walking', 'breathing_basics', 'gratitude_reflection', 'sound_meditation'],
    reward: 'Mindful Beginner Badge',
    points: 150
  },
  {
    id: 'stress_relief',
    title: 'Stress Relief Track',
    description: 'Challenges focused on reducing stress',
    challenges: ['breathing_basics', 'body_scan', 'loving_kindness', 'mindful_walking'],
    reward: 'Stress Warrior Badge',
    points: 120
  },
  {
    id: 'focus_builder',
    title: 'Focus & Concentration',
    description: 'Build your concentration skills',
    challenges: ['candle_gazing', 'sound_meditation', 'body_scan', 'breathing_basics'],
    reward: 'Focus Master Badge',
    points: 140
  }
];

export default function MindfulnessChallenges() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('prepare'); // prepare, active, complete
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackProgress, setTrackProgress] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            completeChallenge();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const loadUserData = () => {
    const savedCompleted = JSON.parse(localStorage.getItem('completed_mindfulness_challenges') || '[]');
    const savedPoints = parseInt(localStorage.getItem('mindfulness_points') || '0');
    const savedTrackProgress = JSON.parse(localStorage.getItem('track_progress') || '{}');
    const savedAchievements = JSON.parse(localStorage.getItem('mindfulness_achievements') || '[]');

    setCompletedChallenges(savedCompleted);
    setUserPoints(savedPoints);
    setTrackProgress(savedTrackProgress);
    setAchievements(savedAchievements);
  };

  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setTimeRemaining(challenge.duration);
    setCurrentPhase('prepare');
  };

  const beginPractice = () => {
    setCurrentPhase('active');
    setIsActive(true);
  };

  const pauseChallenge = () => {
    setIsActive(!isActive);
  };

  const resetChallenge = () => {
    setIsActive(false);
    setTimeRemaining(selectedChallenge?.duration || 0);
    setCurrentPhase('prepare');
  };

  const completeChallenge = () => {
    if (!selectedChallenge) return;

    setIsActive(false);
    setCurrentPhase('complete');

    // Add to completed challenges
    const newCompleted = [...completedChallenges, {
      id: selectedChallenge.id,
      completedAt: new Date().toISOString(),
      points: selectedChallenge.points
    }];

    // Add points
    const newPoints = userPoints + selectedChallenge.points;

    // Update state
    setCompletedChallenges(newCompleted);
    setUserPoints(newPoints);

    // Save to localStorage
    localStorage.setItem('completed_mindfulness_challenges', JSON.stringify(newCompleted));
    localStorage.setItem('mindfulness_points', newPoints.toString());

    // Check track progress
    updateTrackProgress(selectedChallenge.id);

    // Show completion animation
    setShowCompletion(true);
    setTimeout(() => setShowCompletion(false), 3000);

    // Check for achievements
    checkAchievements(newCompleted, newPoints);
  };

  const updateTrackProgress = (challengeId) => {
    if (!currentTrack) return;

    const track = CHALLENGE_TRACKS.find(t => t.id === currentTrack);
    if (!track) return;

    const currentProgress = trackProgress[currentTrack] || { completed: [], currentIndex: 0 };
    
    if (track.challenges[currentProgress.currentIndex] === challengeId) {
      const newProgress = {
        completed: [...currentProgress.completed, challengeId],
        currentIndex: currentProgress.currentIndex + 1
      };

      const updatedTrackProgress = { ...trackProgress, [currentTrack]: newProgress };
      setTrackProgress(updatedTrackProgress);
      localStorage.setItem('track_progress', JSON.stringify(updatedTrackProgress));

      // Check if track is complete
      if (newProgress.currentIndex >= track.challenges.length) {
        completeTrack(track);
      }
    }
  };

  const completeTrack = (track) => {
    const newAchievements = [...achievements, track.id];
    const newPoints = userPoints + track.points;
    
    setAchievements(newAchievements);
    setUserPoints(newPoints);
    
    localStorage.setItem('mindfulness_achievements', JSON.stringify(newAchievements));
    localStorage.setItem('mindfulness_points', newPoints.toString());
  };

  const checkAchievements = (completed, points) => {
    const newAchievements = [...achievements];

    // First challenge
    if (completed.length === 1 && !achievements.includes('first_challenge')) {
      newAchievements.push('first_challenge');
    }

    // Points milestones
    if (points >= 100 && !achievements.includes('points_100')) {
      newAchievements.push('points_100');
    }
    if (points >= 500 && !achievements.includes('points_500')) {
      newAchievements.push('points_500');
    }

    // Challenge count milestones
    if (completed.length >= 10 && !achievements.includes('challenges_10')) {
      newAchievements.push('challenges_10');
    }

    setAchievements(newAchievements);
    localStorage.setItem('mindfulness_achievements', JSON.stringify(newAchievements));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      breathing: 'from-blue-500 to-cyan-500',
      body_awareness: 'from-green-500 to-teal-500',
      compassion: 'from-pink-500 to-rose-500',
      movement: 'from-orange-500 to-amber-500',
      sensory: 'from-purple-500 to-violet-500',
      appreciation: 'from-yellow-500 to-orange-500',
      concentration: 'from-red-500 to-pink-500',
      nature: 'from-indigo-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  if (selectedChallenge && currentPhase !== 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
        <div className="max-w-4xl mx-auto p-6">
          
          {/* Challenge Header */}
          <div className="text-center space-y-4 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${getCategoryColor(selectedChallenge.category)} flex items-center justify-center`}
            >
              <selectedChallenge.icon className="text-white" size={36} />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {selectedChallenge.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedChallenge.description}
            </p>
          </div>

          {currentPhase === 'prepare' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Preparation
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions:</h3>
                  <ul className="space-y-2">
                    {selectedChallenge.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Benefits:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.benefits.map((benefit, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {formatTime(selectedChallenge.duration)} • +{selectedChallenge.points} points
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                    {selectedChallenge.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Back to Challenges
                </button>
                <button
                  onClick={beginPractice}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  Begin Practice
                </button>
              </div>
            </motion.div>
          )}

          {currentPhase === 'active' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-center space-y-8"
            >
              {/* Timer Display */}
              <div className="space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl font-bold text-purple-600 dark:text-purple-400"
                >
                  {formatTime(timeRemaining)}
                </motion.div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ 
                      width: `${(timeRemaining / selectedChallenge.duration) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Breathing Guide (for breathing exercises) */}
              {selectedChallenge.category === 'breathing' && (
                <motion.div
                  className="text-2xl font-medium text-gray-700 dark:text-gray-300"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Breathe with the rhythm
                </motion.div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={pauseChallenge}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                >
                  {isActive ? <Pause size={20} /> : <Play size={20} />}
                  <span>{isActive ? 'Pause' : 'Resume'}</span>
                </button>
                
                <button
                  onClick={resetChallenge}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                >
                  <RotateCcw size={20} />
                  <span>Reset</span>
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 italic">
                Focus on the present moment. Let thoughts come and go without judgment.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🧘‍♀️ Mindfulness Challenges
          </h1>
          
          <div className="flex justify-center items-center space-x-6 flex-wrap gap-2">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
              <Award className="text-purple-500" size={20} />
              <span className="font-semibold">{userPoints} Points</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
              <CheckCircle className="text-green-500" size={20} />
              <span className="font-semibold">{completedChallenges.length} Completed</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
              <Target className="text-blue-500" size={20} />
              <span className="font-semibold">{achievements.length} Achievements</span>
            </div>
          </div>
        </div>

        {/* Challenge Tracks */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Guided Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHALLENGE_TRACKS.map((track) => {
              const progress = trackProgress[track.id] || { completed: [], currentIndex: 0 };
              const isComplete = progress.currentIndex >= track.challenges.length;
              const progressPercentage = (progress.currentIndex / track.challenges.length) * 100;
              
              return (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 transition-all ${
                    currentTrack === track.id 
                      ? 'border-purple-400' 
                      : 'border-transparent hover:border-purple-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {track.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {track.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{progress.currentIndex}/{track.challenges.length}</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      +{track.points} points
                    </span>
                    {isComplete ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Complete ✓</span>
                    ) : (
                      <button
                        onClick={() => setCurrentTrack(track.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          currentTrack === track.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                        }`}
                      >
                        {currentTrack === track.id ? 'Active Track' : 'Start Track'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Individual Challenges */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">All Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MINDFULNESS_CHALLENGES.map((challenge) => {
              const Icon = challenge.icon;
              const isCompleted = completedChallenges.some(c => c.id === challenge.id);
              const isRecommended = currentTrack && 
                CHALLENGE_TRACKS.find(t => t.id === currentTrack)?.challenges[
                  trackProgress[currentTrack]?.currentIndex || 0
                ] === challenge.id;
              
              return (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 transition-all cursor-pointer ${
                    isCompleted 
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                      : isRecommended
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-transparent hover:border-purple-300'
                  }`}
                  onClick={() => !isCompleted && startChallenge(challenge)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${getCategoryColor(challenge.category)}`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {isCompleted && <CheckCircle className="text-green-500" size={20} />}
                      {isRecommended && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {challenge.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatTime(challenge.duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        +{challenge.points}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Animation */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                Challenge Complete!
              </h3>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {selectedChallenge?.title}
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                +{selectedChallenge?.points} Points Earned!
              </p>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
