# Firebase Setup Guide

## Getting Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "boltfix"
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon (</>)
7. Register your app with a nickname (e.g., "BoltFix Web")
8. Copy the config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "boltfix.firebaseapp.com",
  projectId: "boltfix",
  storageBucket: "boltfix.appspot.com",
  messagingSenderId: "507303368867",
  appId: "1:507303368867:web:..."
};
```

9. Replace the config in `src/firebase.js` with your actual configuration

## Enable Required Services

Make sure these services are enabled in your Firebase project:

1. **Firestore Database**: Go to Firestore Database in the sidebar and create a database
2. **Storage**: Go to Storage in the sidebar and set up storage rules

## Create Team Collection

In Firestore, create a collection called "team" with documents containing:
- name: string
- description: string  
- imagePath: string (path to image in Storage)
- rating: number (1-5)

## Upload Team Images

In Firebase Storage, create a folder structure like:
- team/
  - member1.jpg
  - member2.jpg
  - etc.

Then set the imagePath in your Firestore documents to match these paths. 