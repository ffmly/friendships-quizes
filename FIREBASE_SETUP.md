# Firebase Setup Guide

This guide will help you set up Firebase for the Friendship App.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "Friendship App" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Add Your App

### For React Native (Expo)

1. In the Firebase Console, click "Add app" and select the web icon (</>)
2. Register your app with nickname: "Friendship App Web"
3. Copy the Firebase configuration object
4. Update the `firebase.ts` file with your config

## 3. Enable Authentication

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the following providers:
   - **Email/Password**: Click "Email/Password" and toggle "Enable"
   - **Google**: Click "Google" and toggle "Enable"
     - Add your project support email
     - Save the configuration

## 4. Set up Firestore Database

1. Go to "Firestore Database" in the Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Firestore Security Rules

Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quiz results are readable by participants
    match /results/{resultId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.user1 || 
         request.auth.uid == resource.data.user2);
    }
    
    // Friendships are readable by participants
    match /friendships/{friendshipId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.sender || 
         request.auth.uid == resource.data.receiver);
    }
    
    // Quiz questions are readable by all authenticated users
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 5. Enable Firebase Storage

1. Go to "Storage" in the Firebase Console
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select the same location as Firestore
5. Click "Done"

### Storage Security Rules

Replace the default rules with these:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload and read their own profile images
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Set up Realtime Database (Optional)

For real-time multiplayer quizzes:

1. Go to "Realtime Database" in the Firebase Console
2. Click "Create Database"
3. Choose "Start in test mode"
4. Select a location
5. Click "Done"

### Realtime Database Rules

```json
{
  "rules": {
    "onlineQuizzes": {
      "$quizId": {
        ".read": "auth != null && (data.host == auth.uid || data.participant == auth.uid)",
        ".write": "auth != null && (data.host == auth.uid || data.participant == auth.uid)"
      }
    }
  }
}
```

## 7. Update Your App Configuration

1. Copy your Firebase config from the console
2. Update `firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/"
};
```

## 8. Test Your Setup

1. Run your app: `npm start`
2. Try to sign up with email/password
3. Try to sign in with Google
4. Check the Firebase Console to see if users are created

## 9. Production Considerations

Before deploying to production:

1. **Update Security Rules**: Make them more restrictive
2. **Enable App Check**: For additional security
3. **Set up Monitoring**: Enable Firebase Performance and Crashlytics
4. **Configure Domain**: Add your production domain to authorized domains
5. **Set up Backup**: Configure automated backups for Firestore

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check that your Firebase config is correct
   - Ensure the project ID matches

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - For development, add `localhost` and your Expo development URL

3. **"Firebase: Error (auth/invalid-api-key)"**
   - Verify your API key is correct
   - Check that the API key is enabled in Google Cloud Console

4. **"Firebase: Error (permission-denied)"**
   - Check your Firestore security rules
   - Ensure the user is authenticated

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

## Next Steps

Once Firebase is set up:

1. Test all authentication methods
2. Verify data is being saved to Firestore
3. Test image uploads to Storage
4. Set up your production environment
5. Configure monitoring and analytics
