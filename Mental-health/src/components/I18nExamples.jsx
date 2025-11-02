// Example: How to use i18n in Mindmate components
// This file demonstrates various use cases for mental health app

import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatMoney, pluralizeMentalHealth, getTimeBasedGreeting, formatWellnessScore } from '../i18n/lexiUtils';
import LanguageSwitcher from './LanguageSwitcher';

export default function I18nExamples() {
  const { t, i18n, ready } = useTranslation();

  // If translations aren't loaded yet
  if (!ready) {
    return <div>Loading translations...</div>;
  }

  // Example data
  const journalCount = 5;
  const appointmentDate = new Date('2025-11-15');
  const walletBalance = 500;
  const wellnessScore = 75;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      
      {/* Language Switcher */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Language Switcher</h2>
        <LanguageSwitcher />
      </div>

      {/* Basic Translation */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Basic Translation</h2>
        <p>{t('nav.dashboard')}</p>
        <p>{t('dashboard.welcome')}</p>
        <p>{t('common.loading')}</p>
      </div>

      {/* Variable Interpolation */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Variable Interpolation</h2>
        <p>{t('chat.wallet')}: {formatMoney(walletBalance)}</p>
        <p>{getTimeBasedGreeting()}</p>
      </div>

      {/* Pluralization */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Pluralization</h2>
        <p>{pluralizeMentalHealth('journal', journalCount)}</p>
        <p>{pluralizeMentalHealth('appointment', 1)}</p>
        <p>{pluralizeMentalHealth('achievement', 10)}</p>
      </div>

      {/* Date Formatting */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Date Formatting</h2>
        <p>Appointment: {formatDate(appointmentDate, 'short')}</p>
        <p>Last Active: {formatDate(new Date(), 'relative')}</p>
      </div>

      {/* Wellness Score with Context */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Wellness Score</h2>
        {(() => {
          const { score, label, color, message } = formatWellnessScore(wellnessScore);
          return (
            <div className={`p-4 rounded-lg bg-${color}-100 border border-${color}-300`}>
              <p className="font-bold">{label}: {score}%</p>
              <p>{message}</p>
            </div>
          );
        })()}
      </div>

      {/* Navigation Example */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Navigation Menu</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block hover:underline">{t('nav.dashboard')}</a>
          <a href="/chat" className="block hover:underline">{t('nav.chat')}</a>
          <a href="/appointments" className="block hover:underline">{t('nav.appointments')}</a>
          <a href="/journals" className="block hover:underline">{t('nav.journals')}</a>
          <a href="/settings" className="block hover:underline">{t('nav.settings')}</a>
        </nav>
      </div>

      {/* Dashboard Stats Example */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Dashboard Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-gray-600">{t('dashboard.todayMood')}</p>
            <p className="text-2xl font-bold">😊</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-sm text-gray-600">{t('dashboard.weeklyProgress')}</p>
            <p className="text-2xl font-bold">+15%</p>
          </div>
        </div>
      </div>

      {/* Chat Example */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Chat Interface</h2>
        <div className="border rounded-lg p-4 space-y-2">
          <p className="font-semibold">{t('chat.title')}</p>
          <p className="text-sm text-gray-600">{t('chat.selectPersona')}</p>
          <div className="flex items-center justify-between">
            <span>{t('chat.wallet')}:</span>
            <span className="font-bold">{formatMoney(walletBalance)}</span>
          </div>
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {t('chat.startConversation')}
          </button>
        </div>
      </div>

      {/* Error Messages Example */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Error Messages</h2>
        <div className="space-y-2">
          <p className="p-3 bg-red-100 text-red-700 rounded">{t('error.network')}</p>
          <p className="p-3 bg-yellow-100 text-yellow-700 rounded">{t('error.auth')}</p>
        </div>
      </div>

      {/* Settings Example */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Settings Page</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{t('settings.appearance')}</h3>
            <p className="text-sm text-gray-600">{t('settings.appearance.subtitle')}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('settings.notifications')}</h3>
            <p className="text-sm text-gray-600">{t('settings.notifications.subtitle')}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('settings.privacy')}</h3>
            <p className="text-sm text-gray-600">{t('settings.privacy.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Current Language Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="font-semibold">Current Language: {i18n.language}</p>
        <p className="text-sm text-gray-600">Translations Ready: {ready ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

/*
 * USAGE IN YOUR COMPONENTS:
 * 
 * 1. Import the hook:
 *    import { useTranslation } from 'react-i18next';
 * 
 * 2. Use in component:
 *    const { t, i18n } = useTranslation();
 * 
 * 3. Translate text:
 *    <h1>{t('dashboard.welcome')}</h1>
 * 
 * 4. Change language:
 *    <button onClick={() => i18n.changeLanguage('hi')}>Hindi</button>
 * 
 * 5. Use utilities:
 *    import { formatDate, formatMoney } from '../i18n/lexiUtils';
 *    <p>{formatMoney(500)}</p>
 *    <p>{formatDate(new Date(), 'relative')}</p>
 */
