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
    
    // Check if it's a permission error and provide more specific guidance
    if (error.code === 'permission-denied') {
      console.log('Permission denied - checking notification recipientIds...');
      
      // Log the recipientIds of notifications to debug
      notifications.value.forEach((notification, index) => {
        console.log(`Notification ${index + 1}:`, {
          id: notification.id,
          recipientId: notification.recipientId,
          recipientType: notification.recipientType,
          userUID: currentUser.value.uid
        });
      });
      
      alert('❌ Permission denied: You can only delete your own notifications.\n\nThis might happen if some notifications were created with a different recipientId. Check console for details.');
    } else {
      alert('❌ Error deleting notifications: ' + error.message);
    }
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
    
    try {
      // Query for notifications based on user type
      let notificationsQuery;
      
      // Check if user is an admin
      if (user.email === 'elie1400674@gmail.com' || user.email === 'tasneemmostafa200110@gmail.com') {
        // Admin users see admin notifications
        console.log('User is admin, querying admin notifications');
        notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', 'admin'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      } else {
        // Regular users see only their own notifications
        console.log('User is regular user, querying user notifications');
        notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      }
      
      console.log('Notification query created for user UID:', user.uid);
      
      const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        console.log('✅ Notification snapshot received:', snapshot.docs.length, 'notifications');
        const userNotifications = snapshot.docs.map(doc => ({
          id: doc.id, ...doc.data()
        }));
        
        console.log('Total notifications:', userNotifications.length);
        
        // Debug: Log each notification
        userNotifications.forEach((notification, index) => {
          console.log(`Notification ${index + 1}:`, {
            id: notification.id,
            recipientId: notification.recipientId,
            type: notification.type,
            title: notification.title,
            message: notification.message
          });
        });
        
        notifications.value = userNotifications;
        
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
          
          let fallbackQuery;
          if (user.email === 'elie1400674@gmail.com' || user.email === 'tasneemmostafa200110@gmail.com') {
            fallbackQuery = query(
              collection(db, 'notifications'),
              where('recipientId', '==', 'admin'),
              limit(20)
            );
          } else {
            fallbackQuery = query(
              collection(db, 'notifications'),
              where('recipientId', '==', user.uid),
              limit(20)
            );
          }
          
          const unsubscribeFallback = onSnapshot(fallbackQuery, (fallbackSnapshot) => {
            console.log('✅ Fallback notification snapshot received:', fallbackSnapshot.docs.length, 'notifications');
            const fallbackNotifications = fallbackSnapshot.docs.map(doc => ({
              id: doc.id, ...doc.data()
            }));
            
            // Sort client-side
            fallbackNotifications.sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
              return dateB - dateA;
            });
            
            console.log('Fallback notifications data:', fallbackNotifications);
            notifications.value = fallbackNotifications;
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
</style>