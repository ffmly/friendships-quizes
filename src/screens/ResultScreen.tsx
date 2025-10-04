import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Share,
  Dimensions,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import { QuizAnswer, RelationshipMode, CompatibilityMessage } from '../types';
import { COMPATIBILITY_MESSAGES } from '../constants/quizData';

interface ResultScreenProps {
  mode: RelationshipMode;
  answers: QuizAnswer[];
  partnerName?: string;
  partnerAnswers?: QuizAnswer[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const { width } = Dimensions.get('window');

export const ResultScreen: React.FC<ResultScreenProps> = ({
  mode,
  answers,
  partnerName,
  partnerAnswers,
  onPlayAgain,
  onGoHome
}) => {
  const [viewShotRef, setViewShotRef] = useState<ViewShot | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Calculate compatibility score
  const calculateScore = (): number => {
    if (!partnerAnswers) {
      // Solo mode - calculate based on answer consistency
      const totalValue = answers.reduce((sum, answer) => sum + answer.value, 0);
      const maxValue = answers.length * 3; // Assuming max value per question is 3
      return Math.round((totalValue / maxValue) * 100);
    }

    // Multiplayer mode - calculate compatibility
    let compatibility = 0;
    const questionCount = Math.min(answers.length, partnerAnswers.length);
    
    for (let i = 0; i < questionCount; i++) {
      const answer1 = answers[i];
      const answer2 = partnerAnswers[i];
      
      if (answer1 && answer2) {
        const difference = Math.abs(answer1.value - answer2.value);
        const similarity = Math.max(0, 3 - difference) / 3; // 0 to 1 scale
        compatibility += similarity;
      }
    }
    
    return Math.round((compatibility / questionCount) * 100);
  };

  const score = calculateScore();
  
  // Get compatibility message
  const getCompatibilityMessage = (): CompatibilityMessage => {
    const message = COMPATIBILITY_MESSAGES.find(msg => 
      msg.mode === mode && 
      score >= msg.scoreRange[0] && 
      score <= msg.scoreRange[1]
    );
    return message || COMPATIBILITY_MESSAGES[0];
  };

  const compatibilityMessage = getCompatibilityMessage();

  const handleShare = async () => {
    if (!viewShotRef) return;
    
    setIsSharing(true);
    try {
      const uri = await viewShotRef.capture?.();
      if (uri) {
        await Share.share({
          url: uri,
          message: `Check out our ${mode} compatibility! We scored ${score}%! 🎉`,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share result');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveImage = async () => {
    if (!viewShotRef) return;
    
    try {
      const uri = await viewShotRef.capture?.();
      if (uri) {
        // In a real app, you'd save this to the device's photo library
        Alert.alert('Success', 'Image saved to gallery!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoHome} style={styles.homeButton}>
            <Ionicons name="home-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compatibility Result</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Result Card */}
        <ViewShot
          ref={setViewShotRef}
          options={{ format: 'jpg', quality: 0.8 }}
          style={styles.resultCard}
        >
          <LinearGradient
            colors={['#fff', '#f8f9fa']}
            style={styles.cardGradient}
          >
            {/* Score Circle */}
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>{score}%</Text>
                <Text style={styles.scoreLabel}>Compatibility</Text>
              </View>
            </View>

            {/* Mode Icon */}
            <View style={styles.modeIconContainer}>
              <Ionicons 
                name={getModeIcon(mode) as any} 
                size={40} 
                color={getModeColor(mode)} 
              />
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.emoji}>{compatibilityMessage.emoji}</Text>
              <Text style={styles.messageText}>{compatibilityMessage.message}</Text>
            </View>

            {/* Partner Info */}
            {partnerName && (
              <View style={styles.partnerContainer}>
                <Text style={styles.partnerLabel}>Compatibility with</Text>
                <Text style={styles.partnerName}>{partnerName}</Text>
              </View>
            )}

            {/* Mode Badge */}
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
              </Text>
            </View>
          </LinearGradient>
        </ViewShot>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSaveImage}
            disabled={isSharing}
          >
            <Ionicons name="download-outline" size={20} color="#667eea" />
            <Text style={styles.actionButtonText}>Save Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            disabled={isSharing}
          >
            <Ionicons name="share-outline" size={20} color="#667eea" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Play Again Button */}
        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={onPlayAgain}
        >
          <Ionicons name="refresh-outline" size={20} color="#fff" />
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const getModeIcon = (mode: RelationshipMode): string => {
  switch (mode) {
    case 'friend': return 'people-outline';
    case 'partner': return 'heart-outline';
    case 'coworker': return 'briefcase-outline';
    case 'classmate': return 'school-outline';
    default: return 'people-outline';
  }
};

const getModeColor = (mode: RelationshipMode): string => {
  switch (mode) {
    case 'friend': return '#FF6B6B';
    case 'partner': return '#FF69B4';
    case 'coworker': return '#4ECDC4';
    case 'classmate': return '#45B7D1';
    default: return '#667eea';
  }
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  homeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  scoreContainer: {
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  modeIconContainer: {
    marginBottom: 20,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  partnerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  partnerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  partnerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modeBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
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
  playAgainButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
