import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Set or update the user's role in Firestore
export async function ensureUserRole(user) {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  let role = 'user';
  
  // ALWAYS enforce admin role for this specific email
  if (user.email === 'elie1400674@gmail.com') {
    role = 'admin';
  } else {
    // Check if user is a technician (approved or pending)
    const techRef = doc(db, 'technicians', user.uid);
    const techSnap = await getDoc(techRef);
    if (techSnap.exists()) {
      role = 'technician';
    } else {
      const pendingRef = doc(db, 'pendingTechnicians', user.uid);
      const pendingSnap = await getDoc(pendingRef);
      if (pendingSnap.exists()) {
        role = 'pending';
      }
    }
  }
  
  if (!userSnap.exists()) {
    // Create new user document
    await setDoc(userRef, {
      email: user.email,
      role: role,
      createdAt: new Date()
    });
  } else {
    // Update existing user document - ALWAYS enforce admin role for the specific email
    const data = userSnap.data();
    if (user.email === 'elie1400674@gmail.com') {
      // Force admin role for this email, no matter what
      await setDoc(userRef, { 
        ...data, 
        role: 'admin',
        email: user.email 
      });
    } else if (data.role !== role) {
      // Update role for other users if it changed
      await setDoc(userRef, { ...data, role: role });
    }
  }
  
  // Set localStorage immediately
  localStorage.setItem('userType', role);
  return role;
}

// Fetch the user's role from Firestore and store in localStorage
export async function fetchUserRole(user) {
  if (!user) return null;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    let role = data.role;
    
    // ALWAYS enforce admin role for this email, even when fetching
    if (user.email === 'elie1400674@gmail.com') {
      role = 'admin';
      // Update Firestore if it's not already set to admin
      if (data.role !== 'admin') {
        await setDoc(userRef, { ...data, role: 'admin' });
      }
    } else {
      // Check if user is a technician (approved or pending)
      const techRef = doc(db, 'technicians', user.uid);
      const techSnap = await getDoc(techRef);
      if (techSnap.exists()) {
        role = 'technician';
      } else {
        const pendingRef = doc(db, 'pendingTechnicians', user.uid);
        const pendingSnap = await getDoc(pendingRef);
        if (pendingSnap.exists()) {
          role = 'pending';
        }
      }
    }
    
    localStorage.setItem('userType', role);
    return role;
  }
  
  // If document doesn't exist, create it with proper role
  return await ensureUserRole(user);
} 