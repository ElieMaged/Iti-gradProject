<template>
  <div class="notification-container">
    <!-- Notification Bell Icon -->
    <div class="notification-bell" @click="toggleNotifications">
      <i class="fas fa-bell"></i>
      <!-- Unread count badge -->
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </div>
    
    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="notifications-dropdown">
      <div class="notifications-header">
        <h3>Notifications</h3>
        <button @click="markAllAsRead" class="mark-all-read">Mark all as read</button>
      </div>
      
      <div class="notifications-list">
        <div v-if="notifications.length === 0" class="no-notifications">
          No notifications
        </div>
        
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon">
            <i class="fas fa-dollar-sign" v-if="notification.type === 'payment_received'"></i>
            <i class="fas fa-calendar-plus" v-else-if="notification.type === 'booking_request'"></i>
            <i class="fas fa-check-circle" v-else-if="notification.type === 'booking_status_update' && notification.status === 'accepted'"></i>
            <i class="fas fa-times-circle" v-else-if="notification.type === 'booking_status_update' && notification.status === 'rejected'"></i>
            <i class="fas fa-user-plus" v-else-if="notification.type === 'technician_application'"></i>
            <i class="fas fa-check-circle" v-else-if="notification.type === 'application_status_update' && notification.status === 'approved'"></i>
            <i class="fas fa-times-circle" v-else-if="notification.type === 'application_status_update' && notification.status === 'rejected'"></i>
            <i class="fas fa-info-circle" v-else></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
          </div>
        </div>
      </div>
      
      <div class="notifications-footer">
        <button @click="viewAllNotifications">View All</button>
        <button @click="clearAllNotifications" class="test-notification-btn">Clear All</button>
        <button @click="debugNotifications" class="debug-notification-btn">Debug Notifications</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, query, where, orderBy, limit, onSnapshot, updateDoc, doc, addDoc, getDocs, getDoc, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'

const notifications = ref([])
const showNotifications = ref(false)
const loading = ref(false)

// Get current user
const currentUser = computed(() => auth.currentUser)

// Unread notifications count
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Toggle notifications dropdown
function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

// Format notification time
function formatTime(timestamp) {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString()
}

// Mark notification as read
async function markAsRead(notificationId) {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

// Mark all notifications as read
async function markAllAsRead() {
  try {
    const unreadNotifications = notifications.value.filter(n => !n.read)
    const updatePromises = unreadNotifications.map(notification => 
      updateDoc(doc(db, 'notifications', notification.id), { read: true })
    )
    await Promise.all(updatePromises)
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

// View all notifications (could navigate to a notifications page)
function viewAllNotifications() {
  // TODO: Navigate to notifications page
  console.log('Navigate to notifications page')
  showNotifications.value = false
}

// Clear all notifications
async function clearAllNotifications() {
  console.log('=== CLEARING ALL NOTIFICATIONS ===');
  
  if (!currentUser.value) {
    console.error('❌ No current user logged in to clear notifications.');
    alert('❌ No current user logged in to clear notifications.');
    return;
  }

  if (notifications.value.length === 0) {
    alert('No notifications to clear.');
    return;
  }

  if (!confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
    return;
  }

  console.log('Current user UID:', currentUser.value.uid);
  console.log('Current user email:', currentUser.value.email);
  console.log('Notifications to delete:', notifications.value.length);

  try {
    // Delete all notifications for this user
    const deletePromises = notifications.value.map(notification => 
      deleteDoc(doc(db, 'notifications', notification.id))
    );
    
    await Promise.all(deletePromises);
    
    console.log('✅ All notifications deleted successfully');
    alert(`✅ Successfully deleted ${notifications.value.length} notifications.`);
    
    // Clear the local notifications array
    notifications.value = [];
    
  } catch (error) {
    console.error('❌ Error deleting notifications:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    alert('❌ Error deleting notifications: ' + error.message);
  }
}

// Debug notifications (for debugging)
async function debugNotifications() {
  console.log('=== DEBUGGING NOTIFICATIONS ===');
  
  if (!currentUser.value) {
    console.error('❌ No current user logged in to debug notifications.');
    alert('❌ No current user logged in to debug notifications.');
    return;
  }

  console.log('Current user UID:', currentUser.value.uid);
  console.log('Current user email:', currentUser.value.email);
  
  // Check user type
  const userType = localStorage.getItem('userType');
  console.log('User type from localStorage:', userType);

  try {
    // First, let's check if the user exists in the database
    console.log('Checking if user exists in database...');
    
    // Check in users collection
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.value.uid));
      if (userDoc.exists()) {
        console.log('✅ User found in users collection:', userDoc.data());
      } else {
        console.log('⚠️ User not found in users collection');
      }
    } catch (userError) {
      console.log('❌ Error checking users collection:', userError);
    }
    
    // Check in technicians collection
    try {
      const techDoc = await getDoc(doc(db, 'technicians', currentUser.value.uid));
      if (techDoc.exists()) {
        console.log('✅ User found in technicians collection:', techDoc.data());
      } else {
        console.log('⚠️ User not found in technicians collection');
      }
    } catch (techError) {
      console.log('❌ Error checking technicians collection:', techError);
    }
    
    // Check by email in both collections
    console.log('Searching for user by email:', currentUser.value.email);
    
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', currentUser.value.email)
      );
      const usersSnapshot = await getDocs(usersQuery);
      console.log('Users found by email:', usersSnapshot.docs.length);
      usersSnapshot.docs.forEach(doc => {
        console.log('User by email:', { id: doc.id, ...doc.data() });
      });
    } catch (emailError) {
      console.log('❌ Error searching users by email:', emailError);
    }
    
    try {
      const techsQuery = query(
        collection(db, 'technicians'),
        where('email', '==', currentUser.value.email)
      );
      const techsSnapshot = await getDocs(techsQuery);
      console.log('Technicians found by email:', techsSnapshot.docs.length);
      techsSnapshot.docs.forEach(doc => {
        console.log('Technician by email:', { id: doc.id, ...doc.data() });
      });
    } catch (emailError) {
      console.log('❌ Error searching technicians by email:', emailError);
    }
    
    // Check ALL notifications in the database
    console.log('=== CHECKING ALL NOTIFICATIONS IN DATABASE ===');
    try {
      const allNotificationsQuery = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const allNotificationsSnapshot = await getDocs(allNotificationsQuery);
      console.log('Total notifications in database:', allNotificationsSnapshot.docs.length);
      
      allNotificationsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`Database Notification ${index + 1}:`, {
          id: doc.id,
          recipientId: data.recipientId,
          recipientType: data.recipientType,
          type: data.type,
          title: data.title,
          message: data.message,
          createdAt: data.createdAt
        });
      });
    } catch (allNotificationsError) {
      console.log('❌ Error checking all notifications:', allNotificationsError);
    }
    
    // Create a persistent test notification
    console.log('Creating a persistent test notification...');
    const testNotification = {
      title: 'Debug Test Notification',
      message: `This is a persistent test notification for ${currentUser.value.email} (UID: ${currentUser.value.uid})`,
      type: 'debug',
      recipientId: currentUser.value.uid,
      recipientType: userType || 'user',
      recipientEmail: currentUser.value.email,
      createdAt: new Date(),
      read: false,
      debugInfo: {
        userUid: currentUser.value.uid,
        userEmail: currentUser.value.email,
        userType: userType,
        timestamp: new Date().toISOString()
      }
    };
    
    const testDocRef = await addDoc(collection(db, 'notifications'), testNotification);
    console.log('✅ Persistent test notification created with ID:', testDocRef.id);
    
    // Now let's check what notifications exist
    console.log('Checking existing notifications...');
    
    try {
      // Get all notifications for this user with orderBy
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('recipientId', '==', currentUser.value.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(notificationsQuery);
      console.log('Total notifications found for user:', snapshot.docs.length);
      
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`Notification ${index + 1}:`, {
          id: doc.id,
          type: data.type,
          title: data.title,
          message: data.message,
          recipientId: data.recipientId,
          recipientType: data.recipientType,
          createdAt: data.createdAt,
          read: data.read
        });
      });
    } catch (indexError) {
      console.log('🔄 Index still building, trying fallback query...');
      // Fallback query without orderBy
      const fallbackQuery = query(
        collection(db, 'notifications'),
        where('recipientId', '==', currentUser.value.uid)
      );
      
      const fallbackSnapshot = await getDocs(fallbackQuery);
      console.log('Total notifications found for user (fallback):', fallbackSnapshot.docs.length);
      
      const notifications = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort client-side
      notifications.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      
      notifications.forEach((notification, index) => {
        console.log(`Notification ${index + 1}:`, {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          recipientId: notification.recipientId,
          recipientType: notification.recipientType,
          createdAt: notification.createdAt,
          read: notification.read
        });
      });
    }
    
    // Also check notifications by email
    console.log('Checking notifications by email...');
    try {
      const emailQuery = query(
        collection(db, 'notifications'),
        where('recipientId', '==', currentUser.value.email)
      );
      
      const emailSnapshot = await getDocs(emailQuery);
      console.log('Total notifications found by email:', emailSnapshot.docs.length);
      
      emailSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`Email Notification ${index + 1}:`, {
          id: doc.id,
          type: data.type,
          title: data.title,
          message: data.message,
          recipientId: data.recipientId,
          recipientType: data.recipientType,
          createdAt: data.createdAt,
          read: data.read
        });
      });
    } catch (emailError) {
      console.log('❌ Error checking notifications by email:', emailError);
    }
    
    alert(`✅ Persistent test notification created!\nCheck console for details.\n\nUser: ${currentUser.value.email}\nUID: ${currentUser.value.uid}\nType: ${userType || 'user'}`);
    
  } catch (error) {
    console.error('❌ Error debugging notifications:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    alert('❌ Error debugging notifications: ' + error.message);
  }
}

// Listen for notifications
onMounted(async () => {
  console.log('=== NOTIFICATION BELL MOUNTED ===');
  
  // Listen for authentication state changes
  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed:', user);
    
    if (!user) {
      console.log('❌ No user authenticated');
      notifications.value = [];
      return;
    }
    
    console.log('✅ User authenticated:', user.uid);
    console.log('User details:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    });
    
    // Check if user is a technician
    let isTechnician = false;
    try {
      const userType = localStorage.getItem('userType');
      isTechnician = userType === 'technician';
      console.log('User type from localStorage:', userType);
      console.log('Is technician:', isTechnician);
    } catch (error) {
      console.error('Error checking user type:', error);
    }
    
    // Build recipient IDs array - start with basic IDs
    const recipientIds = [user.uid, 'admin'];
    
    // Also add user's email to the query for fallback notifications
    if (user.email) {
      recipientIds.push(user.email);
      console.log('Added user email to recipient IDs:', user.email);
    }
    
    // If user is a technician, also add technician-specific queries
    if (isTechnician) {
      console.log('User is a technician, adding technician-specific queries...');
      
      // Try to find technician by email in technicians collection
      try {
        const techQuery = query(
          collection(db, 'technicians'),
          where('email', '==', user.email)
        );
        const techSnapshot = await getDocs(techQuery);
        if (!techSnapshot.empty) {
          const techDoc = techSnapshot.docs[0];
          const techData = techDoc.data();
          console.log('Found technician document:', techData);
          
          // Add technician document ID to recipient IDs
          recipientIds.push(techDoc.id);
          console.log('Added technician document ID to recipient IDs:', techDoc.id);
          
          // If technician has a uid field, add that too
          if (techData.uid && techData.uid !== user.uid) {
            recipientIds.push(techData.uid);
            console.log('Added technician UID to recipient IDs:', techData.uid);
          }
        }
      } catch (techError) {
        console.log('Error finding technician document:', techError);
      }
    }
    
    // Also check if user exists in users collection and add any additional IDs
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Found user document:', userData);
        
        // Add any additional user-specific IDs if they exist
        if (userData.userId && userData.userId !== user.uid) {
          recipientIds.push(userData.userId);
          console.log('Added user ID from document to recipient IDs:', userData.userId);
        }
      }
    } catch (userError) {
      console.log('Error checking user document:', userError);
    }
    
    console.log('Final recipient IDs for notification query:', recipientIds);
    
    try {
      // Use a simple, reliable approach: query for the most important recipient IDs
      const primaryRecipientIds = [user.uid, 'admin'];
      if (user.email) {
        primaryRecipientIds.push(user.email);
      }
      
      // If user is a technician, add their technician document ID
      if (isTechnician) {
        try {
          const techQuery = query(
            collection(db, 'technicians'),
            where('email', '==', user.email)
          );
          const techSnapshot = await getDocs(techQuery);
          if (!techSnapshot.empty) {
            const techDoc = techSnapshot.docs[0];
            primaryRecipientIds.push(techDoc.id);
            console.log('Added technician document ID to primary recipients:', techDoc.id);
          }
        } catch (techError) {
          console.log('Error finding technician document for notifications:', techError);
        }
      }
      
      console.log('Primary recipient IDs for notification query:', primaryRecipientIds);
      
      // Create the main notification query
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('recipientId', 'in', primaryRecipientIds),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      console.log('Notification query created successfully');
      
      const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        console.log('✅ Notification snapshot received:', snapshot.docs.length, 'notifications');
        const newNotifications = snapshot.docs.map(doc => ({
          id: doc.id, ...doc.data()
        }));
        
        // Remove duplicates based on notification ID
        const uniqueNotifications = newNotifications.filter((notification, index, self) => 
          index === self.findIndex(n => n.id === notification.id)
        );
        
        console.log('Unique notifications:', uniqueNotifications.length);
        
        // Debug: Log each notification's recipientId
        uniqueNotifications.forEach((notification, index) => {
          console.log(`Notification ${index + 1}:`, {
            id: notification.id,
            recipientId: notification.recipientId,
            type: notification.type,
            title: notification.title,
            message: notification.message
          });
        });
        
        notifications.value = uniqueNotifications;
      }, (error) => {
        console.error('❌ Error listening to notifications:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        
        // If index is still building, try a simpler query without orderBy
        if (error.code === 'failed-precondition' || error.message.includes('index')) {
          console.log('🔄 Index still building, trying fallback query...');
          const fallbackQuery = query(
            collection(db, 'notifications'),
            where('recipientId', 'in', primaryRecipientIds),
            limit(20)
          );
          
          const unsubscribeFallback = onSnapshot(fallbackQuery, (fallbackSnapshot) => {
            console.log('✅ Fallback notification snapshot received:', fallbackSnapshot.docs.length, 'notifications');
            const fallbackNotifications = fallbackSnapshot.docs.map(doc => ({
              id: doc.id, ...doc.data()
            }));
            
            // Remove duplicates and sort client-side
            const uniqueFallbackNotifications = fallbackNotifications.filter((notification, index, self) => 
              index === self.findIndex(n => n.id === notification.id)
            );
            
            uniqueFallbackNotifications.sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
              return dateB - dateA;
            });
            
            console.log('Fallback notifications data:', uniqueFallbackNotifications);
            notifications.value = uniqueFallbackNotifications;
          }, (fallbackError) => {
            console.error('❌ Fallback query also failed:', fallbackError);
          });
          
          return () => {
            unsubscribeFallback();
            unsubscribeAuth();
          };
        }
      });
      
      console.log('✅ Notification listener set up successfully');
      return () => {
        unsubscribeNotifications();
        unsubscribeAuth();
      };
    } catch (error) {
      console.error('❌ Error setting up notification listener:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    }
  });
  
  // Return cleanup function
  return () => {
    unsubscribeAuth();
  };
})
</script>

<style scoped>
.notification-container {
  position: relative;
  display: inline-block;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notification-bell:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  max-height: 400px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.notifications-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.mark-all-read {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
}

.mark-all-read:hover {
  color: #374151;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.notification-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
}

.notification-item.unread:hover {
  background-color: #dbeafe;
}

.notification-icon {
  margin-right: 12px;
  color: #6b7280;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-message {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  color: #9ca3af;
  font-size: 12px;
}

.notifications-footer {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.notifications-footer button {
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.notifications-footer button:hover {
  background: #4b5563;
}

.test-notification-btn {
  background: #dc2626; /* Red color for clear all */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px; /* Add some space between buttons */
}

.test-notification-btn:hover {
  background: #b91c1c;
}

.debug-notification-btn {
  background: #059669; /* A green color for debugging */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px; /* Add some space between buttons */
}

.debug-notification-btn:hover {
  background: #047857;
}
</style>