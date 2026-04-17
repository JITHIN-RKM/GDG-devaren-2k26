// Mock authentication service for testing while Firebase is being configured
// This simulates the authentication flow without requiring Firebase setup
// DEPLOYMENT: Mock auth is active for production use

const mockUsers = new Map(); // In-memory storage for demo purposes

export async function signUpWithEmail(email, password, displayName) {
  console.log('MockAuth: Starting sign up for email:', email);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  if (mockUsers.has(email)) {
    return { user: null, error: 'This email is already registered. Try signing in instead.' };
  }
  
  // Create mock user
  const user = {
    uid: Math.random().toString(36).substring(2, 15),
    email: email,
    displayName: displayName,
    createdAt: new Date().toISOString()
  };
  
  mockUsers.set(email, { user, password });
  console.log('MockAuth: User created successfully:', user.uid);
  
  // Notify listeners of auth state change
  notifyAuthChange(user);
  
  return { user, error: null };
}

export async function signInWithEmail(email, password) {
  console.log('MockAuth: Starting sign in for email:', email);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user exists
  const userData = mockUsers.get(email);
  if (!userData) {
    return { user: null, error: 'No account found with this email. Try signing up.' };
  }
  
  // Check password (in real app, this would be properly hashed)
  if (userData.password !== password) {
    return { user: null, error: 'Incorrect password. Please try again.' };
  }
  
  console.log('MockAuth: User signed in successfully:', userData.user.uid);
  
  // Notify listeners of auth state change
  notifyAuthChange(userData.user);
  
  return { user: userData.user, error: null };
}

export async function signInWithGoogle() {
  console.log('MockAuth: Google sign-in not implemented in mock mode');
  return { user: null, error: 'Google sign-in not available in demo mode.' };
}

export async function logOut() {
  console.log('MockAuth: User logged out');
  
  // Notify listeners of auth state change (no user)
  notifyAuthChange(null);
  
  return { error: null };
}

// Global state to track current user for mock auth
let currentUser = null;
let authChangeListeners = [];

export function onAuthChange(callback) {
  // Add listener to array
  authChangeListeners.push(callback);
  
  // Immediately call with current user state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authChangeListeners = authChangeListeners.filter(listener => listener !== callback);
  };
}

// Helper function to notify all listeners of auth state change
function notifyAuthChange(user) {
  currentUser = user;
  authChangeListeners.forEach(callback => callback(user));
}

export async function saveUserProfile(userId, profileData) {
  console.log('MockAuth: Saving profile for user:', userId, profileData);
  // In a real app, this would save to Firestore
  return { error: null };
}

export async function getUserProfile(userId) {
  console.log('MockAuth: Getting profile for user:', userId);
  // In a real app, this would fetch from Firestore
  return { data: {}, error: null };
}
