// New Mental Health Gamified Features Routes
// Add these to your existing Routes.js file

import GamifiedJournal from '../components/GamifiedJournal';
import MentalHealthQuests from '../components/MentalHealthQuests';
import MoodGarden from '../components/MoodGarden';
import MindfulnessChallenges from '../components/MindfulnessChallenges';
import MentalHealthProgress from '../components/MentalHealthProgress';

// Add these route objects to your existing routes array:

const newGamifiedRoutes = [
  {
    path: '/gamified-journal',
    element: <GamifiedJournal />,
    name: 'Gamified Journal',
    description: 'Enhanced journaling with achievements and points'
  },
  {
    path: '/mental-health-quests',
    element: <MentalHealthQuests />,
    name: 'Mental Health Quests',
    description: 'Complete daily, weekly, and special mental health challenges'
  },
  {
    path: '/mood-garden',
    element: <MoodGarden />,
    name: 'Mood Garden',
    description: 'Grow a virtual garden based on your emotions'
  },
  {
    path: '/mindfulness-challenges',
    element: <MindfulnessChallenges />,
    name: 'Mindfulness Challenges',
    description: 'Guided meditation and mindfulness exercises'
  },
  {
    path: '/mental-health-progress',
    element: <MentalHealthProgress />,
    name: 'Progress Tracker',
    description: 'Track your mental health journey with badges and analytics'
  }
];

// Navigation items for your sidebar/menu:
const gamifiedNavItems = [
  {
    icon: '✨',
    title: 'Gamified Journal',
    path: '/gamified-journal',
    description: 'Write with purpose and earn rewards'
  },
  {
    icon: '🎯',
    title: 'Mental Health Quests',
    path: '/mental-health-quests',
    description: 'Complete challenges for better wellbeing'
  },
  {
    icon: '🌻',
    title: 'Mood Garden',
    path: '/mood-garden',
    description: 'Cultivate your emotional landscape'
  },
  {
    icon: '🧘‍♀️',
    title: 'Mindfulness',
    path: '/mindfulness-challenges',
    description: 'Practice mindfulness and meditation'
  },
  {
    icon: '📊',
    title: 'Progress',
    path: '/mental-health-progress',
    description: 'Track your journey with detailed analytics'
  }
];

export { newGamifiedRoutes, gamifiedNavItems };
