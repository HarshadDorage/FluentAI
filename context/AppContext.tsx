import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, Settings } from '../types';

interface AppState {
  stats: UserStats;
  settings: Settings;
  updateStats: (newStats: Partial<UserStats>) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  addPracticeTime: (seconds: number) => void;
  saveConversationScore: (score: number) => void;
}

const defaultStats: UserStats = {
  totalTimePracticed: 0,
  topicsCompleted: 0,
  currentStreak: 1,
  fluencyHistory: [],
  lastPracticeDate: new Date().toISOString(),
};

const defaultSettings: Settings = {
  darkMode: false,
  voiceSpeed: 1,
  voiceAccent: 'en-US',
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('fluentai_stats');
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('fluentai_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('fluentai_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('fluentai_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addPracticeTime = (seconds: number) => {
    setStats(prev => ({
      ...prev,
      totalTimePracticed: prev.totalTimePracticed + seconds
    }));
  };

  const saveConversationScore = (score: number) => {
    setStats(prev => {
      const today = new Date().toLocaleDateString();
      // Only keep last 30 entries to avoid bloat
      const newHistory = [...prev.fluencyHistory, { date: today, score }];
      if (newHistory.length > 30) newHistory.shift();
      return { ...prev, fluencyHistory: newHistory };
    });
  };

  return (
    <AppContext.Provider value={{ stats, settings, updateStats, updateSettings, addPracticeTime, saveConversationScore }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};