// Quick Admin Role Fix for elie1400674@gmail.com
// Copy and paste this entire code block into your browser console when logged into your app

(async function() {
  try {
    console.log('=== QUICK ADMIN ROLE FIX ===');
    
    // Import Firebase functions (this will work if you're in the app)
    const { doc, getDoc, setDoc, collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js');
    
    // Get the db instance from the app
    const { db } = await import('./src/firebase.js');
    
    const targetEmail = 'elie1400674@gmail.com';
    
    console.log('Looking for user:', targetEmail);
    
    // Find the user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', targetEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ User not found. Creating new admin user...');
      
      // Create new admin user
      const newUserId = 'admin_' + Date.now();
      const userRef = doc(db, 'users', newUserId);
      
      await setDoc(userRef, {
        email: targetEmail,
        role: 'admin',
        createdAt: new Date(),
        isAdmin: true
      });
      
      console.log('✅ Created new admin user with ID:', newUserId);
      alert('✅ Admin user created successfully!');
      
    } else {
      // Update existing user
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;
      
      console.log('Found user with ID:', userId);
      console.log('Current role:', userData.role);
      
      if (userData.role !== 'admin') {
        console.log('❌ User does not have admin role. Fixing...');
        
        await setDoc(doc(db, 'users', userId), {
          ...userData,
          role: 'admin',
          isAdmin: true,
          updatedAt: new Date()
        });
        
        console.log('✅ Successfully updated user to admin role');
        alert('✅ Admin role updated successfully!');
      } else {
        console.log('✅ User already has admin role');
        alert('✅ User already has admin role');
      }
    }
    
    console.log('=== FIX COMPLETE ===');
    
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error: ' + error.message);
  }
})();

// Alternative: If the above doesn't work, try this simpler version:
/*
// Simple version - run this in the browser console
const targetEmail = 'elie1400674@gmail.com';
const usersRef = firebase.firestore().collection('users');
const q = usersRef.where('email', '==', targetEmail);

q.get().then((querySnapshot) => {
  if (querySnapshot.empty) {
    console.log('User not found, creating...');
    const newUserId = 'admin_' + Date.now();
    usersRef.doc(newUserId).set({
      email: targetEmail,
      role: 'admin',
      createdAt: new Date(),
      isAdmin: true
    }).then(() => {
      console.log('Admin user created!');
      alert('Admin user created!');
    });
  } else {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    console.log('Found user:', userData);
    
    if (userData.role !== 'admin') {
      userDoc.ref.update({
        role: 'admin',
        isAdmin: true,
        updatedAt: new Date()
      }).then(() => {
        console.log('Admin role updated!');
        alert('Admin role updated!');
      });
    } else {
      console.log('User already admin');
      alert('User already admin');
    }
  }
});
*/ 