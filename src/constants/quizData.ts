import { Quiz, CompatibilityMessage, RelationshipMode } from '../types';

export const QUIZ_QUESTIONS: Record<RelationshipMode, Quiz> = {
  friend: {
    id: 'friend-quiz',
    mode: 'friend',
    title: 'Best Friend Quiz',
    description: 'Discover how well you and your friend would get along!',
    estimatedTime: 5,
    questions: [
      {
        id: 'f1',
        text: 'What\'s your ideal Friday night?',
        category: 'lifestyle',
        weight: 1,
        options: [
          { id: 'f1a', text: 'Netflix and chill at home', value: 1 },
          { id: 'f1b', text: 'Party with friends', value: 3 },
          { id: 'f1c', text: 'Adventure outdoors', value: 2 },
          { id: 'f1d', text: 'Trying new restaurants', value: 2 }
        ]
      },
      {
        id: 'f2',
        text: 'How do you handle conflicts?',
        category: 'communication',
        weight: 2,
        options: [
          { id: 'f2a', text: 'Talk it out immediately', value: 3 },
          { id: 'f2b', text: 'Give space and time', value: 2 },
          { id: 'f2c', text: 'Avoid confrontation', value: 1 },
          { id: 'f2d', text: 'Use humor to diffuse', value: 2 }
        ]
      },
      {
        id: 'f3',
        text: 'What makes you laugh most?',
        category: 'personality',
        weight: 1,
        options: [
          { id: 'f3a', text: 'Silly memes and jokes', value: 2 },
          { id: 'f3b', text: 'Witty wordplay', value: 3 },
          { id: 'f3c', text: 'Physical comedy', value: 1 },
          { id: 'f3d', text: 'Dark humor', value: 2 }
        ]
      },
      {
        id: 'f4',
        text: 'Your energy level is...',
        category: 'personality',
        weight: 1,
        options: [
          { id: 'f4a', text: 'Always high energy', value: 3 },
          { id: 'f4b', text: 'Moderate, depends on mood', value: 2 },
          { id: 'f4c', text: 'Usually calm and relaxed', value: 1 },
          { id: 'f4d', text: 'Varies throughout the day', value: 2 }
        ]
      },
      {
        id: 'f5',
        text: 'How do you show you care?',
        category: 'communication',
        weight: 2,
        options: [
          { id: 'f5a', text: 'Through words and compliments', value: 2 },
          { id: 'f5b', text: 'By doing thoughtful actions', value: 3 },
          { id: 'f5c', text: 'Giving gifts', value: 1 },
          { id: 'f5d', text: 'Spending quality time', value: 3 }
        ]
      }
    ]
  },
  partner: {
    id: 'partner-quiz',
    mode: 'partner',
    title: 'Romantic Compatibility Quiz',
    description: 'Explore your romantic connection and compatibility!',
    estimatedTime: 7,
    questions: [
      {
        id: 'p1',
        text: 'What\'s your love language?',
        category: 'romance',
        weight: 2,
        options: [
          { id: 'p1a', text: 'Words of affirmation', value: 2 },
          { id: 'p1b', text: 'Physical touch', value: 3 },
          { id: 'p1c', text: 'Quality time', value: 3 },
          { id: 'p1d', text: 'Acts of service', value: 2 }
        ]
      },
      {
        id: 'p2',
        text: 'How do you handle stress in relationships?',
        category: 'communication',
        weight: 2,
        options: [
          { id: 'p2a', text: 'Talk through it together', value: 3 },
          { id: 'p2b', text: 'Need space to process', value: 2 },
          { id: 'p2c', text: 'Seek comfort and support', value: 3 },
          { id: 'p2d', text: 'Focus on solutions', value: 2 }
        ]
      },
      {
        id: 'p3',
        text: 'What\'s your ideal date?',
        category: 'lifestyle',
        weight: 1,
        options: [
          { id: 'p3a', text: 'Cozy dinner at home', value: 2 },
          { id: 'p3b', text: 'Adventure and exploration', value: 3 },
          { id: 'p3c', text: 'Cultural activities', value: 2 },
          { id: 'p3d', text: 'Spontaneous road trip', value: 3 }
        ]
      },
      {
        id: 'p4',
        text: 'How important is independence in a relationship?',
        category: 'values',
        weight: 2,
        options: [
          { id: 'p4a', text: 'Very important - need space', value: 1 },
          { id: 'p4b', text: 'Important but balanced', value: 3 },
          { id: 'p4c', text: 'Less important - prefer closeness', value: 2 },
          { id: 'p4d', text: 'Depends on the situation', value: 2 }
        ]
      },
      {
        id: 'p5',
        text: 'What\'s your communication style?',
        category: 'communication',
        weight: 2,
        options: [
          { id: 'p5a', text: 'Direct and honest', value: 3 },
          { id: 'p5b', text: 'Gentle and considerate', value: 2 },
          { id: 'p5c', text: 'Playful and teasing', value: 2 },
          { id: 'p5d', text: 'Deep and philosophical', value: 2 }
        ]
      }
    ]
  },
  coworker: {
    id: 'coworker-quiz',
    mode: 'coworker',
    title: 'Work Compatibility Quiz',
    description: 'See how well you\'d work together as colleagues!',
    estimatedTime: 6,
    questions: [
      {
        id: 'w1',
        text: 'What\'s your work style?',
        category: 'workstyle',
        weight: 2,
        options: [
          { id: 'w1a', text: 'Structured and organized', value: 2 },
          { id: 'w1b', text: 'Creative and flexible', value: 3 },
          { id: 'w1c', text: 'Collaborative and team-focused', value: 3 },
          { id: 'w1d', text: 'Independent and self-directed', value: 1 }
        ]
      },
      {
        id: 'w2',
        text: 'How do you handle deadlines?',
        category: 'workstyle',
        weight: 2,
        options: [
          { id: 'w2a', text: 'Plan ahead and finish early', value: 2 },
          { id: 'w2b', text: 'Work best under pressure', value: 3 },
          { id: 'w2c', text: 'Steady progress throughout', value: 3 },
          { id: 'w2d', text: 'Break it into smaller tasks', value: 2 }
        ]
      },
      {
        id: 'w3',
        text: 'What motivates you most at work?',
        category: 'motivation',
        weight: 1,
        options: [
          { id: 'w3a', text: 'Recognition and praise', value: 2 },
          { id: 'w3b', text: 'Challenging projects', value: 3 },
          { id: 'w3c', text: 'Helping others succeed', value: 3 },
          { id: 'w3d', text: 'Financial rewards', value: 1 }
        ]
      },
      {
        id: 'w4',
        text: 'How do you prefer to communicate at work?',
        category: 'communication',
        weight: 2,
        options: [
          { id: 'w4a', text: 'Face-to-face meetings', value: 2 },
          { id: 'w4b', text: 'Email and written updates', value: 2 },
          { id: 'w4c', text: 'Instant messaging', value: 3 },
          { id: 'w4d', text: 'Video calls', value: 2 }
        ]
      },
      {
        id: 'w5',
        text: 'What\'s your approach to problem-solving?',
        category: 'workstyle',
        weight: 2,
        options: [
          { id: 'w5a', text: 'Analyze data first', value: 2 },
          { id: 'w5b', text: 'Brainstorm with others', value: 3 },
          { id: 'w5c', text: 'Try quick experiments', value: 3 },
          { id: 'w5d', text: 'Research best practices', value: 2 }
        ]
      }
    ]
  },
  classmate: {
    id: 'classmate-quiz',
    mode: 'classmate',
    title: 'Study Buddy Quiz',
    description: 'Find out if you\'d make great study partners!',
    estimatedTime: 5,
    questions: [
      {
        id: 'c1',
        text: 'What\'s your study style?',
        category: 'studystyle',
        weight: 2,
        options: [
          { id: 'c1a', text: 'Quiet library, solo focus', value: 1 },
          { id: 'c1b', text: 'Group study sessions', value: 3 },
          { id: 'c1c', text: 'Coffee shops with background noise', value: 2 },
          { id: 'c1d', text: 'Home with music', value: 2 }
        ]
      },
      {
        id: 'c2',
        text: 'How do you prepare for exams?',
        category: 'studystyle',
        weight: 2,
        options: [
          { id: 'c2a', text: 'Start weeks in advance', value: 2 },
          { id: 'c2b', text: 'Cram the night before', value: 1 },
          { id: 'c2c', text: 'Study groups and discussions', value: 3 },
          { id: 'c2d', text: 'Practice problems repeatedly', value: 2 }
        ]
      },
      {
        id: 'c3',
        text: 'What motivates you to learn?',
        category: 'motivation',
        weight: 1,
        options: [
          { id: 'c3a', text: 'Good grades', value: 2 },
          { id: 'c3b', text: 'Understanding the material', value: 3 },
          { id: 'c3c', text: 'Future career goals', value: 2 },
          { id: 'c3d', text: 'Peer competition', value: 1 }
        ]
      },
      {
        id: 'c4',
        text: 'How do you handle difficult subjects?',
        category: 'studystyle',
        weight: 2,
        options: [
          { id: 'c4a', text: 'Ask for help immediately', value: 3 },
          { id: 'c4b', text: 'Research and figure it out', value: 2 },
          { id: 'c4c', text: 'Form study groups', value: 3 },
          { id: 'c4d', text: 'Practice until it clicks', value: 2 }
        ]
      },
      {
        id: 'c5',
        text: 'What\'s your ideal study break?',
        category: 'lifestyle',
        weight: 1,
        options: [
          { id: 'c5a', text: 'Quick walk or stretch', value: 2 },
          { id: 'c5b', text: 'Social media scroll', value: 1 },
          { id: 'c5c', text: 'Chat with study partners', value: 3 },
          { id: 'c5d', text: 'Grab a snack', value: 2 }
        ]
      }
    ]
  }
};

export const COMPATIBILITY_MESSAGES: CompatibilityMessage[] = [
  // Friend messages
  { mode: 'friend', scoreRange: [90, 100], message: 'You\'re practically twins! This friendship is meant to be!', emoji: '👯‍♀️' },
  { mode: 'friend', scoreRange: [80, 89], message: 'Amazing friends! You\'ll have endless fun together!', emoji: '🤝' },
  { mode: 'friend', scoreRange: [70, 79], message: 'Great friendship potential! You\'ll complement each other well!', emoji: '😊' },
  { mode: 'friend', scoreRange: [60, 69], message: 'Good friends! You\'ll learn a lot from each other!', emoji: '👍' },
  { mode: 'friend', scoreRange: [50, 59], message: 'Decent friendship! Give it time to grow!', emoji: '🤔' },
  { mode: 'friend', scoreRange: [0, 49], message: 'Opposites attract! This could be interesting!', emoji: '🤷‍♀️' },
  
  // Partner messages
  { mode: 'partner', scoreRange: [90, 100], message: 'A match made in heaven! True love awaits!', emoji: '💕' },
  { mode: 'partner', scoreRange: [80, 89], message: 'Incredible chemistry! This romance has serious potential!', emoji: '💘' },
  { mode: 'partner', scoreRange: [70, 79], message: 'Great connection! You\'ll make a wonderful couple!', emoji: '💖' },
  { mode: 'partner', scoreRange: [60, 69], message: 'Good compatibility! Worth exploring further!', emoji: '💝' },
  { mode: 'partner', scoreRange: [50, 59], message: 'Decent match! Communication will be key!', emoji: '💗' },
  { mode: 'partner', scoreRange: [0, 49], message: 'Opposites attract! This could be exciting!', emoji: '💫' },
  
  // Coworker messages
  { mode: 'coworker', scoreRange: [90, 100], message: 'Dream team! You\'ll accomplish amazing things together!', emoji: '🚀' },
  { mode: 'coworker', scoreRange: [80, 89], message: 'Excellent work partnership! Productivity will soar!', emoji: '💼' },
  { mode: 'coworker', scoreRange: [70, 79], message: 'Great colleagues! You\'ll work well together!', emoji: '🤝' },
  { mode: 'coworker', scoreRange: [60, 69], message: 'Good work compatibility! Communication is key!', emoji: '📊' },
  { mode: 'coworker', scoreRange: [50, 59], message: 'Decent work relationship! Give it time!', emoji: '📈' },
  { mode: 'coworker', scoreRange: [0, 49], message: 'Different approaches! This could be complementary!', emoji: '⚖️' },
  
  // Classmate messages
  { mode: 'classmate', scoreRange: [90, 100], message: 'Perfect study buddies! You\'ll ace everything together!', emoji: '🎓' },
  { mode: 'classmate', scoreRange: [80, 89], message: 'Amazing study partners! Academic success awaits!', emoji: '📚' },
  { mode: 'classmate', scoreRange: [70, 79], message: 'Great study compatibility! You\'ll learn well together!', emoji: '✏️' },
  { mode: 'classmate', scoreRange: [60, 69], message: 'Good study match! Communication will help!', emoji: '📝' },
  { mode: 'classmate', scoreRange: [50, 59], message: 'Decent study partnership! Give it a try!', emoji: '📖' },
  { mode: 'classmate', scoreRange: [0, 49], message: 'Different learning styles! This could be beneficial!', emoji: '🔍' }
];
