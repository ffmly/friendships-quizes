# Friendship & Relationship Compatibility App

A React Native (Expo) mobile app that compares users' personalities and habits through fun quizzes, shows compatibility percentages, and supports different relationship types (friend, partner, work mate, classmate).

## 🌟 Features

- **Multiple Relationship Modes**: Friend, Partner, Coworker, and Classmate modes with tailored questions
- **Firebase Authentication**: Google Sign-In and Email/Password authentication
- **Quiz System**: Offline solo quizzes and real-time multiplayer quizzes
- **Compatibility Scoring**: Smart algorithm to calculate relationship compatibility
- **Result Sharing**: Save and share compatibility results as images
- **User Profiles**: Avatar, bio, and relationship preferences
- **Gamification**: XP system, levels, and badges
- **Modern UI**: Beautiful gradients, animations, and responsive design


## 📱 App Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── screens/
│   ├── AuthScreen.tsx           # Login/Register screen
│   ├── HomeScreen.tsx           # Main dashboard
│   ├── QuizScreen.tsx           # Quiz interface
│   └── ResultScreen.tsx         # Results and sharing
├── types/
│   └── index.ts                 # TypeScript type definitions
└── constants/
    └── quizData.ts              # Quiz questions and messages
```


### Firebase Setup

1. **Authentication**
   - Enable Email/Password authentication
   - Enable Google authentication
   - Configure OAuth consent screen

2. **Firestore Database**
   - Create collections: `users`, `quizzes`, `results`, `friendships`
   - Set up security rules for authenticated users

3. **Storage**
   - Enable Firebase Storage for user avatars
   - Configure storage rules



## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

3. Contact the development team

---

Made with ❤️ for building better relationships!
