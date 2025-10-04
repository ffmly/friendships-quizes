export interface User {
  uid: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  relationshipPreference: RelationshipMode;
  stats: UserStats;
  createdAt: Date;
  lastSeen: Date;
}

export interface UserStats {
  xp: number;
  level: number;
  quizzesCompleted: number;
  badges: Badge[];
  totalCompatibilityScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export type RelationshipMode = 'friend' | 'partner' | 'coworker' | 'classmate';

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  category: string;
  weight: number;
}

export interface QuizOption {
  id: string;
  text: string;
  value: number;
  description?: string;
}

export interface Quiz {
  id: string;
  mode: RelationshipMode;
  questions: QuizQuestion[];
  title: string;
  description: string;
  estimatedTime: number; // in minutes
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
  value: number;
}

export interface QuizResult {
  id: string;
  user1: string;
  user2: string;
  mode: RelationshipMode;
  score: number;
  message: string;
  answers1: QuizAnswer[];
  answers2: QuizAnswer[];
  timestamp: Date;
  shared: boolean;
}

export interface Friendship {
  id: string;
  sender: string;
  receiver: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

export interface OnlineQuizSession {
  id: string;
  host: string;
  participant?: string;
  mode: RelationshipMode;
  status: 'waiting' | 'in-progress' | 'completed';
  currentQuestion: number;
  answers: { [userId: string]: QuizAnswer[] };
  createdAt: Date;
  expiresAt: Date;
}

export interface CompatibilityMessage {
  mode: RelationshipMode;
  scoreRange: [number, number];
  message: string;
  emoji: string;
}
