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

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FriendshipApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Enable Firebase Storage
   - Copy your Firebase config and update `firebase.ts`

4. **Update Firebase Configuration**
   ```typescript
   // firebase.ts
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com/"
   };
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or use iOS Simulator / Android Emulator

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

## 🔧 Configuration

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

### Environment Variables

Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=your_database_url
```

## 🎮 Usage

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Select Mode**: Choose relationship type (Friend, Partner, Coworker, Classmate)
3. **Take Quiz**: Answer 5-10 questions about yourself
4. **View Results**: See compatibility percentage and personalized message
5. **Share Results**: Save as image or share on social media

## 🛠️ Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Adding New Quiz Questions

Edit `src/constants/quizData.ts` to add new questions for each relationship mode:

```typescript
{
  id: 'question-id',
  text: 'Your question here?',
  category: 'personality',
  weight: 1,
  options: [
    { id: 'option1', text: 'Option 1', value: 1 },
    { id: 'option2', text: 'Option 2', value: 2 },
    // ...
  ]
}
```

### Customizing Compatibility Messages

Update the `COMPATIBILITY_MESSAGES` array in `src/constants/quizData.ts`:

```typescript
{
  mode: 'friend',
  scoreRange: [90, 100],
  message: 'Your custom message here!',
  emoji: '🎉'
}
```

## 📦 Dependencies

- **React Native & Expo**: Mobile app framework
- **Firebase**: Authentication, database, and storage
- **React Navigation**: Screen navigation
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **React Native View Shot**: Image capture for sharing
- **React Native Share**: Social media sharing
- **Lottie React Native**: Animations

## 🚀 Deployment

### Building for Production

1. **Configure app.json** with your app details
2. **Build for Android**:
   ```bash
   expo build:android
   ```
3. **Build for iOS**:
   ```bash
   expo build:ios
   ```

### App Store Submission

1. Follow Expo's guide for app store submission
2. Configure app icons and splash screens
3. Test on physical devices
4. Submit to Google Play Store / Apple App Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- Firebase for backend services
- React Native community for excellent libraries
- Design inspiration from modern dating and social apps

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Contact the development team

---

Made with ❤️ for building better relationships!
