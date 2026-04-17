# Firebase Setup Guide for Production

This guide explains how to properly configure Firebase Authentication for the GDG Hackathon website.

## Current Status

The website is currently using **mock authentication** for testing purposes. The authentication flow works perfectly, but it's not connected to a real Firebase backend.

## Steps to Enable Real Firebase Authentication

### 1. Create/Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use the existing one (`gdg-hackathon-f9844`)
3. Enable **Authentication** service:
   - Go to Authentication section
   - Click "Get Started"
   - Enable **Email/Password** sign-in method
   - Enable **Google** sign-in method (optional)

### 2. Update Firebase Configuration

Replace the mock authentication with real Firebase by updating `src/services/firebase.js`:

```javascript
// Change this line at the top of the file
const USE_MOCK_AUTH = false; // Set to false for production
```

### 3. Configure Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Create a new database
3. Start in **test mode** for development
4. Create a `profiles` collection with the following structure:
   ```json
   {
     "major": "Computer Science",
     "interests": ["AI/ML", "Web Development"],
     "year": "junior",
     "cgpa": "3.8",
     "state": "California",
     "county": "Santa Clara",
     "college": "University Name",
     "updatedAt": "2026-04-17T09:34:50.755Z"
   }
   ```

### 4. Security Rules

For Firestore, add these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Environment Variables (Optional)

For better security, move Firebase config to environment variables:

1. Create `.env.local` file:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. Update `src/services/firebase.js` to use these variables

### 6. Testing

After switching to real Firebase:

1. Test sign-up with a real email
2. Test sign-in functionality
3. Test profile creation and onboarding
4. Verify data appears in Firestore console

## Troubleshooting

### Common Issues

1. **"auth/configuration-not-found" error**: 
   - Ensure Authentication is enabled in Firebase Console
   - Check that Email/Password sign-in method is enabled

2. **Permission denied errors**:
   - Check Firestore security rules
   - Ensure user is authenticated before accessing data

3. **CORS issues**:
   - Make sure your domain is added to Firebase Auth authorized domains

### Switching Back to Mock Mode

For development without Firebase, set:
```javascript
const USE_MOCK_AUTH = true; // Back to mock mode
```

## Production Checklist

- [ ] Firebase Authentication enabled
- [ ] Email/Password sign-in method enabled
- [ ] Firestore Database created
- [ ] Security rules configured
- [ ] Environment variables set (optional but recommended)
- [ ] Domain added to authorized domains
- [ ] Test complete authentication flow
- [ ] Verify data persistence in Firestore

## Support

If you encounter issues:

1. Check Firebase Console for error messages
2. Verify your configuration matches the project settings
3. Test with the mock system to isolate issues
4. Check browser console for detailed error messages
