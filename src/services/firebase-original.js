/**
 * Firebase Configuration
 * Using Firebase Auth for authentication
 */

// Configuration flag - set to true to use mock auth for testing
const USE_MOCK_AUTH = true;

if (USE_MOCK_AUTH) {
  // Export mock auth functions for testing
  export * from './mockAuth';
} else {
  // Use real Firebase
  import { initializeApp } from 'firebase/app';
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
  } from 'firebase/auth';
  import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
  } from 'firebase/firestore';

  // Firebase configuration
  // Replace these values with your actual Firebase project config
  const firebaseConfig = {
    apiKey: "AIzaSyDwXLc14ndVfg7I30Pzdch7_iRnDVdLHcU",
    authDomain: "gdg-hackathon-f9844.firebaseapp.com",
    projectId: "gdg-hackathon-f9844",
    storageBucket: "gdg-hackathon-f9844.firebasestorage.app",
    messagingSenderId: "836200455265",
    appId: "1:836200455265:web:70ce34253eccef6c665e20",
    measurementId: "G-Z55BRP8SYH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  /**
   * Sign up with email and password
   */
  export async function signUpWithEmail(email, password, displayName) {
    try {
      console.log('Firebase: Starting sign up for email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase: User created successfully:', userCredential.user.uid);
      
      await updateProfile(userCredential.user, { displayName });
      console.log('Firebase: Profile updated with display name:', displayName);
      
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error('Firebase: Sign up error:', error.code, error.message);
      return { user: null, error: getErrorMessage(error.code) };
    }
  }

  /**
   * Sign in with email and password
   */
  export async function signInWithEmail(email, password) {
    try {
      console.log('Firebase: Starting sign in for email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase: User signed in successfully:', userCredential.user.uid);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error('Firebase: Sign in error:', error.code, error.message);
      return { user: null, error: getErrorMessage(error.code) };
    }
  }

  /**
   * Sign in with Google
   */
  export async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: getErrorMessage(error.code) };
    }
  }

  /**
   * Sign out
   */
  export async function logOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Save user profile to Firestore
   */
  export async function saveUserProfile(userId, profileData) {
    try {
      await setDoc(doc(db, 'profiles', userId), {
        ...profileData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Get user profile from Firestore
   */
  export async function getUserProfile(userId) {
    try {
      const docSnap = await getDoc(doc(db, 'profiles', userId));
      if (docSnap.exists()) {
        return { data: docSnap.data(), error: null };
      }
      return { data: {}, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Listen for auth state changes
   */
  export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  function getErrorMessage(code) {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try signing in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/user-not-found':
        return 'No account found with this email. Try signing up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/configuration-not-found':
        return 'Firebase Authentication is not properly configured. Please contact the administrator.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
