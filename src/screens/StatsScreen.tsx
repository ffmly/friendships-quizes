import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface StatsScreenProps {
  onBack: () => void;
}

const { width } = Dimensions.get('window');

const BADGES = [
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'star-outline',
    unlocked: true
  },
  {
    id: 'friend_master',
    name: 'Friend Master',
    description: 'Complete 10 friend mode quizzes',
    icon: 'people-outline',
    unlocked: false
  },
  {
    id: 'love_expert',
    name: 'Love Expert',
    description: 'Complete 10 partner mode quizzes',
    icon: 'heart-outline',
    unlocked: false
  },
  {
    id: 'work_pro',
    name: 'Work Pro',
    description: 'Complete 10 coworker mode quizzes',
    icon: 'briefcase-outline',
    unlocked: false
  },
  {
    id: 'study_buddy',
    name: 'Study Buddy',
    description: 'Complete 10 classmate mode quizzes',
    icon: 'school-outline',
    unlocked: false
  },
  {
    id: 'perfect_match',
    name: 'Perfect Match',
    description: 'Get 100% compatibility score',
    icon: 'trophy-outline',
    unlocked: false
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 10 friends',
    icon: 'happy-outline',
    unlocked: false
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: 'medal-outline',
    unlocked: false
  }
];

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  const { user } = useAuth();

  const getLevelProgress = () => {
    const currentLevel = user?.stats.level || 1;
    const currentXP = user?.stats.xp || 0;
    const xpForNextLevel = currentLevel * 100;
    const progress = (currentXP % 100) / 100;
    
    return {
      currentLevel,
      currentXP,
      xpForNextLevel,
      progress
    };
  };

  const levelInfo = getLevelProgress();

  const renderBadge = (badge: any) => (
    <View
      key={badge.id}
      style={[
        styles.badgeItem,
        !badge.unlocked && styles.lockedBadge
      ]}
    >
      <View style={styles.badgeIcon}>
        <Ionicons
          name={badge.icon as any}
          size={24}
          color={badge.unlocked ? '#4CAF50' : '#666'}
        />
      </View>
      <View style={styles.badgeInfo}>
        <Text style={[
          styles.badgeName,
          !badge.unlocked && styles.lockedText
        ]}>
          {badge.name}
        </Text>
        <Text style={[
          styles.badgeDescription,
          !badge.unlocked && styles.lockedText
        ]}>
          {badge.description}
        </Text>
      </View>
      {badge.unlocked && (
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Stats</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Level Progress */}
        <View style={styles.levelCard}>
          <Text style={styles.cardTitle}>Level Progress</Text>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level {levelInfo.currentLevel}</Text>
            <Text style={styles.xpText}>{levelInfo.currentXP} XP</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${levelInfo.progress * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {100 - (levelInfo.currentXP % 100)} XP to next level
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Quiz Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.stats.quizzesCompleted || 0}</Text>
              <Text style={styles.statLabel}>Quizzes Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {user?.stats.totalCompatibilityScore ? 
                  Math.round(user.stats.totalCompatibilityScore / (user.stats.quizzesCompleted || 1)) : 0}%
              </Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.stats.badges.length || 0}</Text>
              <Text style={styles.statLabel}>Badges Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.stats.level || 1}</Text>
              <Text style={styles.statLabel}>Current Level</Text>
            </View>
          </View>
        </View>

        {/* Mode Breakdown */}
        <View style={styles.modeCard}>
          <Text style={styles.cardTitle}>Quiz Mode Breakdown</Text>
          <View style={styles.modeStats}>
            <View style={styles.modeItem}>
              <Ionicons name="people" size={20} color="#FF6B6B" />
              <Text style={styles.modeLabel}>Friend Mode</Text>
              <Text style={styles.modeCount}>0</Text>
            </View>
            <View style={styles.modeItem}>
              <Ionicons name="heart" size={20} color="#FF69B4" />
              <Text style={styles.modeLabel}>Partner Mode</Text>
              <Text style={styles.modeCount}>0</Text>
            </View>
            <View style={styles.modeItem}>
              <Ionicons name="briefcase" size={20} color="#4ECDC4" />
              <Text style={styles.modeLabel}>Coworker Mode</Text>
              <Text style={styles.modeCount}>0</Text>
            </View>
            <View style={styles.modeItem}>
              <Ionicons name="school" size={20} color="#45B7D1" />
              <Text style={styles.modeLabel}>Classmate Mode</Text>
              <Text style={styles.modeCount}>0</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesCard}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <View style={styles.badgesList}>
            {BADGES.map(renderBadge)}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  levelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  xpText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  modeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  modeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeItem: {
    width: (width - 80) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modeLabel: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  modeCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  badgesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: (width - 80) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  lockedBadge: {
    opacity: 0.5,
  },
  badgeIcon: {
    marginRight: 10,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  badgeDescription: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
  },
  lockedText: {
    opacity: 0.5,
  },
});
