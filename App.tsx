import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { FriendsScreen } from './src/screens/FriendsScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { OnlineQuizScreen } from './src/screens/OnlineQuizScreen';
import { LoadingScreen } from './src/components/LoadingScreen';
import { RelationshipMode, QuizAnswer, User } from './src/types';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [selectedMode, setSelectedMode] = useState<RelationshipMode | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [partnerName, setPartnerName] = useState<string>('');
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'profile' | 'friends' | 'stats' | 'quiz' | 'onlineQuiz' | 'result'>('home');

  if (loading) {
    return <LoadingScreen />;
  }

  const handleAuthSuccess = () => {
    // Authentication successful, user will be set in context
  };

  const handleSelectMode = (mode: RelationshipMode) => {
    setSelectedMode(mode);
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = (answers: QuizAnswer[]) => {
    setQuizAnswers(answers);
    setCurrentScreen('result');
  };

  const handlePlayAgain = () => {
    setSelectedMode(null);
    setQuizAnswers([]);
    setPartnerName('');
    setCurrentScreen('home');
  };

  const handleGoHome = () => {
    setSelectedMode(null);
    setQuizAnswers([]);
    setPartnerName('');
    setCurrentScreen('home');
  };

  const handleNavigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const handleNavigateToFriends = () => {
    setCurrentScreen('friends');
  };

  const handleNavigateToStats = () => {
    setCurrentScreen('stats');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleInviteToQuiz = (friend: User) => {
    setSelectedFriend(friend);
    setCurrentScreen('onlineQuiz');
  };

  const handleOnlineQuizComplete = (answers: QuizAnswer[], friendAnswers: QuizAnswer[]) => {
    setQuizAnswers(answers);
    setPartnerName(selectedFriend?.name || '');
    setCurrentScreen('result');
  };

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onSelectMode={handleSelectMode}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToFriends={handleNavigateToFriends}
            onNavigateToStats={handleNavigateToStats}
          />
        );
      case 'profile':
        return <ProfileScreen onBack={handleBackToHome} />;
      case 'friends':
        return (
          <FriendsScreen
            onBack={handleBackToHome}
            onInviteToQuiz={handleInviteToQuiz}
          />
        );
      case 'stats':
        return <StatsScreen onBack={handleBackToHome} />;
      case 'quiz':
        return (
          <QuizScreen
            mode={selectedMode!}
            onComplete={handleQuizComplete}
            onBack={handleGoHome}
          />
        );
      case 'onlineQuiz':
        return (
          <OnlineQuizScreen
            mode={selectedMode!}
            friend={selectedFriend!}
            onComplete={handleOnlineQuizComplete}
            onBack={handleGoHome}
          />
        );
      case 'result':
        return (
          <ResultScreen
            mode={selectedMode!}
            answers={quizAnswers}
            partnerName={partnerName}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        );
      default:
        return null;
    }
  };

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {renderCurrentScreen()}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
