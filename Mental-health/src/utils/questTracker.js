/**
 * Quest Tracker Utility
 * 
 * This module handles automatic quest completion based on real user actions.
 * Call the appropriate tracking function whenever a user completes an activity.
 */

/**
 * Track journal entry completion
 * @param {Object} journal - Journal entry data
 * @returns {Array} - Newly completed quest IDs
 */
export const trackJournalEntry = (journal) => {
  const completedQuests = [];
  
  // Get current quest data
  const activeQuests = [
    ...JSON.parse(localStorage.getItem('active_daily_quests') || '[]'),
    ...JSON.parse(localStorage.getItem('active_weekly_quests') || '[]')
  ];
  
  const questProgress = JSON.parse(localStorage.getItem('quest_progress') || '{}');
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');

  // Update progress for journal-related quests
  activeQuests.forEach(quest => {
    if (alreadyCompleted.includes(quest.id)) return;

    // Daily journal quest
    if (quest.id === 'daily_journal') {
      const wordCount = journal.content?.split(/\s+/).length || 0;
      if (wordCount >= 50) {
        completeQuest(quest.id);
        completedQuests.push(quest.id);
      }
    }

    // Weekly deep journaling quest
    if (quest.id === 'weekly_journal_depth') {
      const progress = questProgress[quest.id] || { entries: 0 };
      const wordCount = journal.content?.split(/\s+/).length || 0;
      
      if (wordCount >= 200) {
        progress.entries = (progress.entries || 0) + 1;
        questProgress[quest.id] = progress;
        
        if (progress.entries >= 3) {
          completeQuest(quest.id);
          completedQuests.push(quest.id);
        }
      }
      
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    }
  });

  return completedQuests;
};

/**
 * Track mood log completion
 * @param {Object} moodLog - Mood log data
 * @returns {Array} - Newly completed quest IDs
 */
export const trackMoodLog = (moodLog) => {
  const completedQuests = [];
  
  const activeQuests = [
    ...JSON.parse(localStorage.getItem('active_daily_quests') || '[]'),
    ...JSON.parse(localStorage.getItem('active_weekly_quests') || '[]')
  ];
  
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');
  const questProgress = JSON.parse(localStorage.getItem('quest_progress') || '{}');

  activeQuests.forEach(quest => {
    if (alreadyCompleted.includes(quest.id)) return;

    // Daily mood log quest
    if (quest.id === 'daily_mood_log') {
      completeQuest(quest.id);
      completedQuests.push(quest.id);
    }

    // Special: Mood diversity quest
    if (quest.id === 'mood_master') {
      const allMoodLogs = JSON.parse(localStorage.getItem('mindmates.moodLogs') || '[]');
      const uniqueMoods = new Set(allMoodLogs.map(log => log.mood || log.moodType)).size;
      
      const progress = questProgress[quest.id] || { uniqueMoods: 0 };
      progress.uniqueMoods = uniqueMoods;
      questProgress[quest.id] = progress;
      
      if (uniqueMoods >= 30) {
        completeQuest(quest.id);
        completedQuests.push(quest.id);
      }
      
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    }
  });

  return completedQuests;
};

/**
 * Track breathing exercise completion
 * @param {number} duration - Duration in seconds
 * @returns {Array} - Newly completed quest IDs
 */
export const trackBreathingExercise = (duration) => {
  const completedQuests = [];
  
  const activeQuests = JSON.parse(localStorage.getItem('active_daily_quests') || '[]');
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');

  activeQuests.forEach(quest => {
    if (alreadyCompleted.includes(quest.id)) return;

    // Daily breathing quest (5 minutes = 300 seconds)
    if (quest.id === 'daily_breathing' && duration >= 300) {
      completeQuest(quest.id);
      completedQuests.push(quest.id);
    }
  });

  return completedQuests;
};

/**
 * Track gratitude practice completion
 * @param {Array} gratitudeItems - Array of gratitude items
 * @returns {Array} - Newly completed quest IDs
 */
export const trackGratitudePractice = (gratitudeItems) => {
  const completedQuests = [];
  
  const activeQuests = JSON.parse(localStorage.getItem('active_daily_quests') || '[]');
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');

  activeQuests.forEach(quest => {
    if (alreadyCompleted.includes(quest.id)) return;

    // Daily gratitude quest (3 items required)
    if (quest.id === 'daily_gratitude' && gratitudeItems.length >= 3) {
      completeQuest(quest.id);
      completedQuests.push(quest.id);
    }
  });

  return completedQuests;
};

/**
 * Track social interaction
 * @returns {Array} - Newly completed quest IDs
 */
export const trackSocialInteraction = () => {
  const completedQuests = [];
  
  const activeQuests = JSON.parse(localStorage.getItem('active_weekly_quests') || '[]');
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');
  const questProgress = JSON.parse(localStorage.getItem('quest_progress') || '{}');

  activeQuests.forEach(quest => {
    if (alreadyCompleted.includes(quest.id)) return;

    // Weekly social interaction quest
    if (quest.id === 'weekly_social') {
      const progress = questProgress[quest.id] || { interactions: 0 };
      progress.interactions = (progress.interactions || 0) + 1;
      questProgress[quest.id] = progress;
      
      if (progress.interactions >= 3) {
        completeQuest(quest.id);
        completedQuests.push(quest.id);
      }
      
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    }
  });

  return completedQuests;
};

/**
 * Track mental health exercise completion
 * @returns {Array} - Newly completed quest IDs
 */
export const trackExerciseCompletion = () => {
  const completedQuests = [];
  
  const activeQuests = JSON.parse(localStorage.getItem('active_weekly_quests') || '[]');
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');
  const questProgress = JSON.parse(localStorage.getItem('quest_progress') || '{}');

  activeQuests.forEach(quest => {
    if (alreadyCompleted.includes(quest.id)) return;

    // Weekly learning quest
    if (quest.id === 'weekly_learning') {
      const progress = questProgress[quest.id] || { exercises: 0 };
      progress.exercises = (progress.exercises || 0) + 1;
      questProgress[quest.id] = progress;
      
      if (progress.exercises >= 3) {
        completeQuest(quest.id);
        completedQuests.push(quest.id);
      }
      
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    }
  });

  return completedQuests;
};

/**
 * Track daily streak for weekly quest
 * Call this at the end of each day if user completed daily quests
 */
export const trackDailyStreak = () => {
  const completedQuests = [];
  
  const activeQuests = JSON.parse(localStorage.getItem('active_weekly_quests') || '[]');
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');
  const questProgress = JSON.parse(localStorage.getItem('quest_progress') || '{}');

  activeQuests.forEach(quest => {
    if (alreadyCompleted.includes(quest.id)) return;

    // Weekly streak quest
    if (quest.id === 'weekly_streak') {
      // Calculate actual streak from journals
      const journals = JSON.parse(localStorage.getItem('gamified_journals') || '[]');
      const streakDays = calculateStreak(journals);
      
      const progress = questProgress[quest.id] || { streakDays: 0 };
      progress.streakDays = streakDays;
      questProgress[quest.id] = progress;
      
      if (streakDays >= 5) {
        completeQuest(quest.id);
        completedQuests.push(quest.id);
      }
      
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    }
  });

  return completedQuests;
};

/**
 * Track first week completion (special quest)
 */
export const trackFirstWeekComplete = () => {
  const completedQuests = [];
  
  const alreadyCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');
  
  if (alreadyCompleted.includes('first_week')) return completedQuests;

  // Check if user has been active for 7 days
  const journals = JSON.parse(localStorage.getItem('gamified_journals') || '[]');
  if (journals.length === 0) return completedQuests;

  const firstEntry = journals.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
  const daysSinceFirst = Math.floor((Date.now() - new Date(firstEntry.timestamp)) / (1000 * 60 * 60 * 24));

  if (daysSinceFirst >= 7) {
    completeQuest('first_week');
    completedQuests.push('first_week');
  }

  return completedQuests;
};

/**
 * Complete a quest and award XP
 * @param {string} questId - Quest ID to complete
 */
const completeQuest = (questId) => {
  // Get quest data
  const allQuests = [
    ...JSON.parse(localStorage.getItem('active_daily_quests') || '[]'),
    ...JSON.parse(localStorage.getItem('active_weekly_quests') || '[]'),
  ];

  // Import special quests data
  const SPECIAL_QUESTS = [
    {
      id: 'first_week',
      xp: 200
    },
    {
      id: 'mood_master',
      xp: 150
    }
  ];

  const quest = [...allQuests, ...SPECIAL_QUESTS].find(q => q.id === questId);
  if (!quest) return;

  // Mark as completed
  const completedQuests = JSON.parse(localStorage.getItem('completed_quests') || '[]');
  if (!completedQuests.includes(questId)) {
    completedQuests.push(questId);
    localStorage.setItem('completed_quests', JSON.stringify(completedQuests));

    // Award XP
    const currentXP = parseInt(localStorage.getItem('user_xp') || '0');
    const newXP = currentXP + (quest.xp || 0);
    localStorage.setItem('user_xp', newXP.toString());

    // Update level
    const newLevel = Math.floor(newXP / 100) + 1;
    localStorage.setItem('user_level', newLevel.toString());

    console.log(`✅ Quest completed: ${questId} (+${quest.xp} XP)`);
  }
};

/**
 * Calculate journal streak
 * @param {Array} journals - Array of journal entries
 * @returns {number} - Current streak in days
 */
const calculateStreak = (journals) => {
  if (journals.length === 0) return 0;
  
  const sortedJournals = journals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const dates = [...new Set(sortedJournals.map(j => new Date(j.timestamp).toDateString()))];
  
  let streak = 0;
  let checkDate = new Date();
  
  for (let date of dates) {
    if (date === checkDate.toDateString()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Get all currently active quests with their progress
 * @returns {Array} - Active quests with progress data
 */
export const getActiveQuestsWithProgress = () => {
  const activeQuests = [
    ...JSON.parse(localStorage.getItem('active_daily_quests') || '[]'),
    ...JSON.parse(localStorage.getItem('active_weekly_quests') || '[]')
  ];
  
  const questProgress = JSON.parse(localStorage.getItem('quest_progress') || '{}');
  const completedQuests = JSON.parse(localStorage.getItem('completed_quests') || '[]');

  return activeQuests.map(quest => ({
    ...quest,
    progress: questProgress[quest.id] || {},
    isCompleted: completedQuests.includes(quest.id)
  }));
};

/**
 * Check and update all quest progress
 * Call this periodically or on app load to sync progress
 */
export const syncQuestProgress = () => {
  trackDailyStreak();
  trackFirstWeekComplete();
  
  // Update mood diversity
  const moodLogs = JSON.parse(localStorage.getItem('mindmates.moodLogs') || '[]');
  if (moodLogs.length > 0) {
    trackMoodLog(moodLogs[moodLogs.length - 1]);
  }
};
