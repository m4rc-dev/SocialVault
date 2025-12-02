# Deployment Instructions

## Prerequisites
1. Firebase Project created
2. Firestore Database initialized
3. Firebase Authentication enabled
4. Environment variables configured

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name and accept terms
4. Click "Create project"

### 2. Enable Services
1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" sign-in provider
3. Go to "Firestore Database"
4. Click "Create database"
5. Start in "test mode" for development or set up proper rules

### 3. Get Configuration
1. In Firebase Console, click the gear icon next to "Project Overview" and select "Project settings"
2. In the "General" tab, scroll down to "Your apps"
3. Click the web app icon (</>) or "Add app" and select web icon
4. Enter an app nickname and click "Register app"
5. Copy the Firebase configuration values

### 4. Configure Environment Variables
Create a `.env.production` file with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Build and Deploy

### Build for Production
```bash
npm run build
```

### Deploy Options

#### Option 1: Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
4. Deploy:
   ```bash
   firebase deploy
   ```

#### Option 2: Vercel
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/) and create new project
3. Connect to your GitHub repository
4. Set environment variables in Vercel dashboard
5. Deploy

#### Option 3: Netlify
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com/) and create new site
3. Connect to your GitHub repository
4. Set environment variables in Netlify dashboard
5. Deploy

## Troubleshooting

### White Screen Issues
1. Check browser console for errors
2. Verify Firebase configuration in environment variables
3. Ensure Firestore security rules are properly set

### Authentication Errors
1. Verify Firebase Authentication is enabled
2. Check API key validity
3. Ensure correct OAuth domains are configured

### Database Errors
1. Verify Firestore database is created
2. Check security rules
3. Confirm indexes are properly set up

## Security Rules for Firestore
For development, use these rules in Firestore > Rules tab:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /social_accounts/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

For production, implement more restrictive rules based on your security requirements.