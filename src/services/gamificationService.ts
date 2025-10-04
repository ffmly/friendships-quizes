import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { User, UserStats, Badge } from '../types';

export const GAMIFICATION_CONFIG = {
  XP_PER_QUIZ: 10,
  XP_PER_LEVEL: 100,
  XP_PER_FRIEND: 5,
  XP_PER_BADGE: 20,
  XP_PER_PERFECT_SCORE: 50,
};

export const BADGES = [
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'star-outline',
    condition: (stats: UserStats) => stats.quizzesCompleted >= 1
  },
  {
    id: 'friend_master',
    name: 'Friend Master',
    description: 'Complete 10 friend mode quizzes',
    icon: 'people-outline',
    condition: (stats: UserStats) => stats.quizzesCompleted >= 10
  },
  {
    id: 'love_expert',
    name: 'Love Expert',
    description: 'Complete 10 partner mode quizzes',
    icon: 'heart-outline',
    condition: (stats: UserStats) => stats.quizzesCompleted >= 10
  },
  {
    id: 'work_pro',
    name: 'Work Pro',
    description: 'Complete 10 coworker mode quizzes',
    icon: 'briefcase-outline',
    condition: (stats: UserStats) => stats.quizzesCompleted >= 10
  },
  {
    id: 'study_buddy',
    name: 'Study Buddy',
    description: 'Complete 10 classmate mode quizzes',
    icon: 'school-outline',
    condition: (stats: UserStats) => stats.quizzesCompleted >= 10
  },
  {
    id: 'perfect_match',
    name: 'Perfect Match',
    description: 'Get 100% compatibility score',
    icon: 'trophy-outline',
    condition: (stats: UserStats) => stats.totalCompatibilityScore >= 100
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 10 friends',
    icon: 'happy-outline',
    condition: (stats: UserStats) => stats.friendsCount >= 10
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: 'medal-outline',
    condition: (stats: UserStats) => stats.quizzesCompleted >= 50
  }
];

export class GamificationService {
  static async addXP(userId: string, xp: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentStats = userData.stats || {
          xp: 0,
          level: 1,
          quizzesCompleted: 0,
          badges: [],
          totalCompatibilityScore: 0,
          friendsCount: 0
        };

        const newXP = currentStats.xp + xp;
        const newLevel = Math.floor(newXP / GAMIFICATION_CONFIG.XP_PER_LEVEL) + 1;

        await updateDoc(userRef, {
          'stats.xp': newXP,
          'stats.level': newLevel
        });

        // Check for new badges
        await this.checkForNewBadges(userId, { ...currentStats, xp: newXP, level: newLevel });
      }
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  }

  static async completeQuiz(userId: string, score: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentStats = userData.stats || {
          xp: 0,
          level: 1,
          quizzesCompleted: 0,
          badges: [],
          totalCompatibilityScore: 0,
          friendsCount: 0
        };

        const newQuizzesCompleted = currentStats.quizzesCompleted + 1;
        const newTotalScore = currentStats.totalCompatibilityScore + score;
        const xpToAdd = GAMIFICATION_CONFIG.XP_PER_QUIZ + (score === 100 ? GAMIFICATION_CONFIG.XP_PER_PERFECT_SCORE : 0);

        await updateDoc(userRef, {
          'stats.quizzesCompleted': newQuizzesCompleted,
          'stats.totalCompatibilityScore': newTotalScore
        });

        // Add XP
        await this.addXP(userId, xpToAdd);

        // Check for new badges
        await this.checkForNewBadges(userId, {
          ...currentStats,
          quizzesCompleted: newQuizzesCompleted,
          totalCompatibilityScore: newTotalScore
        });
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  }

  static async addFriend(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentStats = userData.stats || {
          xp: 0,
          level: 1,
          quizzesCompleted: 0,
          badges: [],
          totalCompatibilityScore: 0,
          friendsCount: 0
        };

        const newFriendsCount = (currentStats.friendsCount || 0) + 1;

        await updateDoc(userRef, {
          'stats.friendsCount': newFriendsCount
        });

        // Add XP for adding friend
        await this.addXP(userId, GAMIFICATION_CONFIG.XP_PER_FRIEND);

        // Check for new badges
        await this.checkForNewBadges(userId, {
          ...currentStats,
          friendsCount: newFriendsCount
        });
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  }

  static async checkForNewBadges(userId: string, stats: UserStats): Promise<Badge[]> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentBadges = userData.stats?.badges || [];
        const newBadges: Badge[] = [];

        for (const badgeConfig of BADGES) {
          const hasBadge = currentBadges.some((badge: Badge) => badge.id === badgeConfig.id);
          
          if (!hasBadge && badgeConfig.condition(stats)) {
            const newBadge: Badge = {
              id: badgeConfig.id,
              name: badgeConfig.name,
              description: badgeConfig.description,
              icon: badgeConfig.icon,
              unlockedAt: new Date()
            };

            newBadges.push(newBadge);
          }
        }

        if (newBadges.length > 0) {
          const allBadges = [...currentBadges, ...newBadges];
          await updateDoc(userRef, {
            'stats.badges': allBadges
          });

          // Add XP for new badges
          await this.addXP(userId, newBadges.length * GAMIFICATION_CONFIG.XP_PER_BADGE);
        }

        return newBadges;
      }
    } catch (error) {
      console.error('Error checking for new badges:', error);
    }

    return [];
  }

  static getLevelInfo(xp: number) {
    const level = Math.floor(xp / GAMIFICATION_CONFIG.XP_PER_LEVEL) + 1;
    const xpForCurrentLevel = xp % GAMIFICATION_CONFIG.XP_PER_LEVEL;
    const xpForNextLevel = GAMIFICATION_CONFIG.XP_PER_LEVEL - xpForCurrentLevel;
    const progress = xpForCurrentLevel / GAMIFICATION_CONFIG.XP_PER_LEVEL;

    return {
      level,
      xpForCurrentLevel,
      xpForNextLevel,
      progress
    };
  }
}
