import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { RelationshipMode } from '../types';

interface HomeScreenProps {
  onSelectMode: (mode: RelationshipMode) => void;
  onNavigateToProfile: () => void;
  onNavigateToFriends: () => void;
  onNavigateToStats: () => void;
}

const { width } = Dimensions.get('window');

const RELATIONSHIP_MODES = [
  {
    mode: 'friend' as RelationshipMode,
    title: 'Friend Mode',
    description: 'Discover your friendship compatibility',
    icon: 'people-outline',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E8E']
  },
  {
    mode: 'partner' as RelationshipMode,
    title: 'Partner Mode',
    description: 'Explore romantic compatibility',
    icon: 'heart-outline',
    color: '#FF69B4',
    gradient: ['#FF69B4', '#FFB6C1']
  },
  {
    mode: 'coworker' as RelationshipMode,
    title: 'Coworker Mode',
    description: 'Check work compatibility',
    icon: 'briefcase-outline',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#7FDBDA']
  },
  {
    mode: 'classmate' as RelationshipMode,
    title: 'Classmate Mode',
    description: 'Find your perfect study buddy',
    icon: 'school-outline',
    color: '#45B7D1',
    gradient: ['#45B7D1', '#96CEB4']
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMode,
  onNavigateToProfile,
  onNavigateToFriends,
  onNavigateToStats
}) => {
  const { user } = useAuth();

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/60' }}
              style={styles.avatar}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Welcome back!</Text>
              <Text style={styles.userName}>{user?.name || 'Anonymous'}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={onNavigateToProfile}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.stats.quizzesCompleted || 0}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.stats.level || 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.stats.badges.length || 0}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Choose Your Relationship Mode</Text>
          
          <View style={styles.modesGrid}>
            {RELATIONSHIP_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.mode}
                style={styles.modeCard}
                onPress={() => onSelectMode(mode.mode)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={mode.gradient}
                  style={styles.modeGradient}
                >
                  <View style={styles.modeIconContainer}>
                    <Ionicons name={mode.icon as any} size={32} color="#fff" />
                  </View>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onNavigateToFriends}
            >
              <Ionicons name="people" size={24} color="#667eea" />
              <Text style={styles.actionButtonText}>My Friends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onNavigateToStats}
            >
              <Ionicons name="stats-chart" size={24} color="#667eea" />
              <Text style={styles.actionButtonText}>My Stats</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  modeCard: {
    width: (width - 60) / 2,
    height: 140,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modeGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeIconContainer: {
    marginBottom: 10,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  modeDescription: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
});
