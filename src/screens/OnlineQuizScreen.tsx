import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ref, set, onValue, off, push, update } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { realtimeDb } from '../../firebase';
import { RelationshipMode, QuizAnswer, User } from '../types';
import { QUIZ_QUESTIONS } from '../constants/quizData';

interface OnlineQuizScreenProps {
  mode: RelationshipMode;
  friend: User;
  onComplete: (answers: QuizAnswer[], friendAnswers: QuizAnswer[]) => void;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

export const OnlineQuizScreen: React.FC<OnlineQuizScreenProps> = ({
  mode,
  friend,
  onComplete,
  onBack
}) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [friendAnswers, setFriendAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [waitingForFriend, setWaitingForFriend] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  const quiz = QUIZ_QUESTIONS[mode];
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  useEffect(() => {
    if (!user) return;

    // Create or join quiz session
    createQuizSession();

    return () => {
      if (quizSessionId) {
        // Clean up session when component unmounts
        const sessionRef = ref(realtimeDb, `onlineQuizzes/${quizSessionId}`);
        off(sessionRef);
      }
    };
  }, []);

  const createQuizSession = async () => {
    try {
      const sessionRef = ref(realtimeDb, 'onlineQuizzes');
      const newSessionRef = push(sessionRef);
      const sessionId = newSessionRef.key!;
      
      setQuizSessionId(sessionId);
      setIsHost(true);

      // Create session
      await set(newSessionRef, {
        host: user?.uid,
        participant: friend.uid,
        mode: mode,
        status: 'waiting',
        currentQuestion: 0,
        answers: {},
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
      });

      // Listen for session updates
      onValue(newSessionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (data.status === 'in-progress') {
            setCurrentQuestion(data.currentQuestion);
            setWaitingForFriend(false);
          } else if (data.status === 'completed') {
            // Quiz completed, process results
            const userAnswers = data.answers[user?.uid || ''] || [];
            const friendAnswersData = data.answers[friend.uid] || [];
            onComplete(userAnswers, friendAnswersData);
          }
        }
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to create quiz session');
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = async () => {
    if (!selectedOption || !quizSessionId) return;

    const option = question.options.find(opt => opt.id === selectedOption);
    if (!option) return;

    const newAnswer: QuizAnswer = {
      questionId: question.id,
      optionId: selectedOption,
      value: option.value
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    try {
      // Update session with current answer
      const sessionRef = ref(realtimeDb, `onlineQuizzes/${quizSessionId}`);
      await update(sessionRef, {
        [`answers/${user?.uid}/${currentQuestion}`]: newAnswer,
        currentQuestion: currentQuestion + 1,
        status: 'in-progress'
      });

      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setWaitingForFriend(true);
      } else {
        // Quiz completed
        await update(sessionRef, {
          status: 'completed'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer');
    }
  };

  const handleBack = () => {
    onBack();
  };

  if (waitingForFriend) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <View style={styles.waitingContainer}>
          <Ionicons name="people" size={64} color="#fff" style={styles.waitingIcon} />
          <Text style={styles.waitingTitle}>Waiting for {friend.name}</Text>
          <Text style={styles.waitingText}>
            They're answering the same question...
          </Text>
          <View style={styles.loadingDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Online Quiz with {friend.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} of {quiz.questions.length}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>
        <Text style={styles.categoryText}>{question.category}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption === option.id && styles.selectedOption
            ]}
            onPress={() => handleOptionSelect(option.id)}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionIndicator,
                selectedOption === option.id && styles.selectedIndicator
              ]}>
                {selectedOption === option.id && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={[
                styles.optionText,
                selectedOption === option.id && styles.selectedOptionText
              ]}>
                {option.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedOption && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!selectedOption}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion < quiz.questions.length - 1 ? 'Next' : 'Finish'}
          </Text>
          <Ionicons 
            name={currentQuestion < quiz.questions.length - 1 ? "arrow-forward" : "checkmark"} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    opacity: 0.8,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 28,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#fff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  waitingIcon: {
    marginBottom: 20,
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  waitingText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    opacity: 0.6,
  },
});
