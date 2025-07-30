import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Set or update the user's role in Firestore - STRICT ADMIN ENFORCEMENT
export async function ensureUserRole(user) {
  if (!user) return;
  
  console.log('=== ENSURE USER ROLE CALLED ===');
  console.log('User email:', user.email);
  console.log('User UID:', user.uid);
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  // STRICT ADMIN CHECK - ONLY these emails can be admin
  const adminEmails = ['elie1400674@gmail.com', 'tasneemmostafa200110@gmail.com'];
  const isAdminEmail = adminEmails.includes(user.email);
  
  console.log('Is admin email:', isAdminEmail);
  console.log('Admin emails list:', adminEmails);
  
  let role = 'user'; // Default role
  
  if (isAdminEmail) {
    console.log('✅ User is admin email - setting role to admin');
    role = 'admin';
  } else {
    console.log('❌ User is NOT admin email - checking technician status');
    
    // Check if user is a technician (approved or pending)
    const techRef = doc(db, 'technicians', user.uid);
    const techSnap = await getDoc(techRef);
    
    const pendingRef = doc(db, 'pendingTechnicians', user.uid);
    const pendingSnap = await getDoc(pendingRef);
    
    if (techSnap.exists()) {
      console.log('✅ User is approved technician');
      role = 'technician';
    } else if (pendingSnap.exists()) {
      console.log('✅ User is pending technician');
      role = 'pending';
    } else {
      console.log('✅ User is regular user');
      role = 'user';
    }
  }
  
  console.log('Final role assignment:', role);
  
  if (!userSnap.exists()) {
    // Create new user document
    console.log('Creating new user document with role:', role);
    await setDoc(userRef, {
      email: user.email,
      role: role,
      createdAt: new Date()
    });
  } else {
    // Update existing user document
    const data = userSnap.data();
    console.log('Existing user data:', data);
    
    if (isAdminEmail) {
      // Force admin role for these emails, no matter what
      console.log('Forcing admin role for admin email');
      await setDoc(userRef, { 
        ...data, 
        role: 'admin',
        email: user.email 
      });
    } else {
      // NEVER allow non-admin emails to be admin
      if (data.role === 'admin' && !isAdminEmail) {
        console.log('❌ CRITICAL: Non-admin email has admin role - FIXING');
        await setDoc(userRef, { 
          ...data, 
          role: role, // Force correct role
          email: user.email 
        });
      } else if (data.role !== role) {
        console.log('Updating role from', data.role, 'to', role);
        await setDoc(userRef, { ...data, role: role });
      }
    }
  }
  
  // Set localStorage immediately
  localStorage.setItem('userType', role);
  console.log('localStorage set to:', role);
  return role;
}

// Fetch the user's role from Firestore and store in localStorage - STRICT ADMIN ENFORCEMENT
export async function fetchUserRole(user) {
  if (!user) return null;
  
  console.log('=== FETCH USER ROLE CALLED ===');
  console.log('User email:', user.email);
  console.log('User UID:', user.uid);
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    let role = data.role;
    
    console.log('Current role in Firestore:', role);
    
    // STRICT ADMIN CHECK - ONLY these emails can be admin
    const adminEmails = ['elie1400674@gmail.com', 'tasneemmostafa200110@gmail.com'];
    const isAdminEmail = adminEmails.includes(user.email);
    
    console.log('Is admin email:', isAdminEmail);
    
    if (isAdminEmail) {
      console.log('✅ User is admin email - enforcing admin role');
      role = 'admin';
      // Update Firestore if it's not already set to admin
      if (data.role !== 'admin') {
        console.log('Updating Firestore to admin role');
        await setDoc(userRef, { ...data, role: 'admin' });
      }
    } else {
      console.log('❌ User is NOT admin email - checking technician status');
      
      // NEVER allow non-admin emails to be admin
      if (data.role === 'admin' && !isAdminEmail) {
        console.log('❌ CRITICAL: Non-admin email has admin role - FIXING IMMEDIATELY');
        // Check if user is a technician (approved or pending)
        const techRef = doc(db, 'technicians', user.uid);
        const techSnap = await getDoc(techRef);
        
        const pendingRef = doc(db, 'pendingTechnicians', user.uid);
        const pendingSnap = await getDoc(pendingRef);
        
        let correctRole = 'user';
        if (techSnap.exists()) {
          correctRole = 'technician';
        } else if (pendingSnap.exists()) {
          correctRole = 'pending';
        }
        
        console.log('Fixing admin role to:', correctRole);
        await setDoc(userRef, { ...data, role: correctRole });
        role = correctRole;
      } else {
        // Check if user is a technician (approved or pending)
        const techRef = doc(db, 'technicians', user.uid);
        const techSnap = await getDoc(techRef);
        
        const pendingRef = doc(db, 'pendingTechnicians', user.uid);
        const pendingSnap = await getDoc(pendingRef);
        
        if (techSnap.exists()) {
          role = 'technician';
        } else if (pendingSnap.exists()) {
          role = 'pending';
        } else {
          role = 'user';
        }
      }
    }
    
    console.log('Final role assignment:', role);
    localStorage.setItem('userType', role);
    return role;
  }
  
  // If document doesn't exist, create it with proper role
  return await ensureUserRole(user);
} 

// Test function to verify role enforcement logic
export async function testRoleEnforcement(email) {
  console.log('Testing role enforcement for:', email);
  
  // Simulate the role determination logic
  let role = 'user';
  
  // ALWAYS enforce admin role for these specific emails
  if (email === 'elie1400674@gmail.com' || email === 'tasneemmostafa200110@gmail.com') {
    role = 'admin';
    console.log('✅ Email is in admin list, role should be: admin');
  } else {
    console.log('❌ Email is NOT in admin list, role should NOT be admin');
    
    // Check if user is a technician (approved or pending)
    // This would require the actual user object to check collections
    console.log('Would check technicians and pendingTechnicians collections for this user');
  }
  
  return role;
}

// Function to debug a specific user's role
export async function debugUserRole(email) {
  try {
    console.log('=== DEBUGGING USER ROLE ===');
    console.log('Email:', email);
    
    // Check if email is in admin list
    const isAdminEmail = email === 'elie1400674@gmail.com' || email === 'tasneemmostafa200110@gmail.com';
    console.log('Is admin email:', isAdminEmail);
    
    if (isAdminEmail) {
      console.log('✅ This email should ALWAYS be admin');
    } else {
      console.log('❌ This email should NEVER be admin');
    }
    
    // Get user document from Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('User not found in users collection');
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    console.log('Current user data:', userData);
    console.log('Current role in Firestore:', userData.role);
    
    // Check if user is in pendingTechnicians collection
    const pendingRef = doc(db, 'pendingTechnicians', userDoc.id);
    const pendingSnap = await getDoc(pendingRef);
    console.log('User in pendingTechnicians:', pendingSnap.exists());
    
    // Check if user is in technicians collection
    const techRef = doc(db, 'technicians', userDoc.id);
    const techSnap = await getDoc(techRef);
    console.log('User in technicians:', techSnap.exists());
    
    // Determine correct role
    let correctRole = 'user';
    if (isAdminEmail) {
      correctRole = 'admin';
    } else if (techSnap.exists()) {
      correctRole = 'technician';
    } else if (pendingSnap.exists()) {
      correctRole = 'pending';
    }
    
    console.log('Correct role should be:', correctRole);
    console.log('Role mismatch:', userData.role !== correctRole);
    
    return {
      currentRole: userData.role,
      correctRole: correctRole,
      isMismatch: userData.role !== correctRole,
      userId: userDoc.id
    };
    
  } catch (error) {
    console.error('Error debugging user role:', error);
    return null;
  }
}

// EMERGENCY FUNCTION: Fix ALL users with incorrect admin roles
export async function fixAllIncorrectAdminRoles() {
  try {
    console.log('=== EMERGENCY: FIXING ALL INCORRECT ADMIN ROLES ===');
    
    const adminEmails = ['elie1400674@gmail.com', 'tasneemmostafa200110@gmail.com'];
    
    // Get all users from Firestore
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    let fixedCount = 0;
    let adminCount = 0;
    
    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      const email = userData.email;
      const currentRole = userData.role;
      
      console.log(`Checking user: ${email}, current role: ${currentRole}`);
      
      const isAdminEmail = adminEmails.includes(email);
      
      if (currentRole === 'admin' && !isAdminEmail) {
        console.log(`❌ CRITICAL: ${email} has admin role but is NOT admin email - FIXING`);
        
        // Check if user is in technicians or pendingTechnicians collections
        const techRef = doc(db, 'technicians', doc.id);
        const techSnap = await getDoc(techRef);
        
        const pendingRef = doc(db, 'pendingTechnicians', doc.id);
        const pendingSnap = await getDoc(pendingRef);
        
        let correctRole = 'user';
        if (techSnap.exists()) {
          correctRole = 'technician';
        } else if (pendingSnap.exists()) {
          correctRole = 'pending';
        }
        
        console.log(`Fixing ${email} from admin to ${correctRole}`);
        
        await setDoc(doc(db, 'users', doc.id), {
          ...userData,
          role: correctRole,
          fixedAt: new Date()
        });
        
        fixedCount++;
      } else if (currentRole === 'admin' && isAdminEmail) {
        console.log(`✅ ${email} correctly has admin role`);
        adminCount++;
      }
    }
    
    console.log(`=== FIX COMPLETE ===`);
    console.log(`Fixed ${fixedCount} incorrect admin roles`);
    console.log(`Found ${adminCount} correct admin roles`);
    
    alert(`Fixed ${fixedCount} incorrect admin roles. Found ${adminCount} correct admin roles.`);
    
  } catch (error) {
    console.error('Error fixing admin roles:', error);
    alert('Error fixing admin roles: ' + error.message);
  }
}

// Usage: Call fixAllIncorrectAdminRoles() in the browser console to fix all incorrect admin roles 