export enum Sender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
}

export interface DailyChallenge {
  id: string;
  type: 'speak' | 'translate' | 'pronounce' | 'explain' | 'quiz';
  question: string;
  targetAnswer?: string; // For pronunciation or translation
  completed: boolean;
}

export interface PronunciationResult {
  score: number;
  fluencyScore: number;
  pronunciationScore: number;
  mistakes: string[];
  correctedVersion: string;
  feedback: string;
}

export interface UserStats {
  totalTimePracticed: number; // in seconds
  topicsCompleted: number;
  currentStreak: number;
  fluencyHistory: { date: string; score: number }[];
  lastPracticeDate: string;
}

export interface Settings {
  darkMode: boolean;
  voiceSpeed: number; // 0.5 to 2
  voiceAccent: string; // limited browser support, usually maps to lang code
}