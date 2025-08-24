import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, reactive } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Create reactive authentication state
export const authState = reactive({
  user: null,
  userType: null,
  isLoading: true,
  isAuthenticated: false
});

// Function to determine correct user role from Firestore
async function determineUserRoleFromFirestore(user) {
  if (!user) return 'user';
  
  console.log('=== DETERMINING USER ROLE FROM FIRESTORE ===');
  console.log('User email:', user.email);
  console.log('User UID:', user.uid);
  
  try {
    // STRICT ADMIN CHECK - ONLY these emails can be admin
    const adminEmails = ['elie1400674@gmail.com', 'tasneemmostafa200110@gmail.com'];
    const isAdminEmail = adminEmails.includes(user.email);
    
    if (isAdminEmail) {
      console.log('✅ User is admin email - role: admin');
      return 'admin';
    }
    
    // Check user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log('User data from Firestore:', userData);
      
      // Check if user is a technician (approved or pending)
      const techRef = doc(db, 'technicians', user.uid);
      const techSnap = await getDoc(techRef);
      
      const pendingRef = doc(db, 'pendingTechnicians', user.uid);
      const pendingSnap = await getDoc(pendingRef);
      
      if (techSnap.exists()) {
        console.log('✅ User is approved technician');
        return 'technician';
      } else if (pendingSnap.exists()) {
        console.log('✅ User is pending technician');
        return 'pending';
      } else {
        console.log('✅ User is regular user');
        return 'user';
      }
    } else {
      console.log('User document not found, defaulting to user');
      return 'user';
    }
  } catch (error) {
    console.error('Error determining user role:', error);
    // Fallback to localStorage or default
    return localStorage.getItem('userType') || 'user';
  }
}

// Initialize authentication state
export function initializeAuth() {
  console.log('=== INITIALIZING AUTH ===');
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      
      if (user) {
        // User is signed in
        authState.user = user;
        authState.isAuthenticated = true;
        
        // Determine role from Firestore instead of just localStorage
        const userType = await determineUserRoleFromFirestore(user);
        authState.userType = userType;
        localStorage.setItem('userType', userType);
        
        console.log('User authenticated:', {
          uid: user.uid,
          email: user.email,
          userType: authState.userType
        });
      } else {
        // User is signed out
        authState.user = null;
        authState.userType = null;
        authState.isAuthenticated = false;
        
        // Clear localStorage on logout
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        sessionStorage.clear();
        
        console.log('User signed out, cleared auth state');
      }
      
      authState.isLoading = false;
      console.log('=== AUTH INITIALIZATION COMPLETE ===');
      resolve();
    });
    
    // Return unsubscribe function for cleanup
    return unsubscribe;
  });
}

// Check if user is authenticated
export function isAuthenticated() {
  return authState.isAuthenticated && authState.user !== null;
}

// Check if user is admin
export function isAdmin() {
  return authState.userType === 'admin' && isAuthenticated();
}

// Check if user is technician
export function isTechnician() {
  return authState.userType === 'technician' && isAuthenticated();
}

// Check if user is regular user
export function isUser() {
  return authState.userType === 'user' && isAuthenticated();
}

// Get current user
export function getCurrentUser() {
  return authState.user;
}

// Get user type
export function getUserType() {
  return authState.userType;
}

// Set user type
export function setUserType(type) {
  authState.userType = type;
  localStorage.setItem('userType', type);
}

// Clear authentication state
export function clearAuthState() {
  authState.user = null;
  authState.userType = null;
  authState.isAuthenticated = false;
  localStorage.removeItem('userType');
  localStorage.removeItem('userEmail');
  sessionStorage.clear();
}

// Wait for authentication to be ready
export function waitForAuth() {
  return new Promise((resolve) => {
    if (!authState.isLoading) {
      resolve();
    } else {
      const checkAuth = () => {
        if (!authState.isLoading) {
          resolve();
        } else {
          setTimeout(checkAuth, 100);
        }
      };
      checkAuth();
    }
  });
}
