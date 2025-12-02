# Firebase Setup Guide for SocialVault

This guide will help you set up Firebase for your SocialVault application.

## Prerequisites

- A Google account
- Node.js installed on your machine

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "SocialVault")
4. Accept the terms and conditions
5. Choose whether to enable Google Analytics (optional)
6. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the gear icon next to "Project Overview" and select "Project settings"
2. In the "General" tab, scroll down to "Your apps"
3. Click the web app icon (</>), or if you already have apps, click "Add app" and select the web icon
4. Enter an app nickname (e.g., "SocialVault Web App")
5. Optionally, set up Firebase Hosting
6. Click "Register app"

## Step 3: Get Your Firebase Configuration

1. After registering your app, you'll see a code snippet with your Firebase configuration
2. Copy the `firebaseConfig` object values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 4: Configure Your Local Environment

1. In your project directory, locate the `.env.local` file
2. Replace the placeholder values with your actual Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 5: Enable Firebase Services

1. In the Firebase Console, go to "Build" > "Authentication"
2. Click "Get started" and enable the "Email/Password" sign-in provider
3. Go to "Build" > "Firestore Database"
4. Click "Create database"
5. Start in "test mode" (for development only) or "production mode" based on your needs
6. Select a location and click "Enable"

## Step 6: Install Dependencies and Run

1. Install project dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

## Troubleshooting

- Make sure all environment variables in `.env.local` are correctly set
- Ensure you've enabled Authentication and Firestore in the Firebase Console
- Check browser console for any error messages
- Verify your Firebase project rules for security

## Security Notes

- Never commit your `.env.local` file to version control
- The `.gitignore` file is already configured to exclude `*.local` files
- For production deployment, configure environment variables according to your hosting provider's documentation