// Mock authentication service for testing while Firebase is being configured
// This simulates the authentication flow without requiring Firebase setup

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
  return { user: userData.user, error: null };
}

export async function signInWithGoogle() {
  console.log('MockAuth: Google sign-in not implemented in mock mode');
  return { user: null, error: 'Google sign-in not available in demo mode.' };
}

export async function logOut() {
  console.log('MockAuth: User logged out');
  return { error: null };
}

export function onAuthChange(callback) {
  // In a real app, this would listen to Firebase auth state changes
  // For mock, we'll just call the callback with null (no user)
  callback(null);
  
  // Return unsubscribe function
  return () => {};
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
