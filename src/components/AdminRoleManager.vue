<template>
  <div class="admin-role-manager">
    <h3>Admin Role Manager</h3>
    
    <div class="admin-actions">
      <button @click="checkAdminRole" class="btn btn-primary">
        Check Admin Role for elie1400674@gmail.com
      </button>
      
      <button @click="fixAdminRole" class="btn btn-success">
        Fix Admin Role
      </button>
      
      <button @click="fixAllAdminRoles" class="btn btn-warning">
        Fix All Incorrect Admin Roles
      </button>
    </div>
    
    <div v-if="status" class="status-message">
      <pre>{{ status }}</pre>
    </div>
  </div>
</template>

<script>
import { debugUserRole, fixAllIncorrectAdminRoles } from '../utils/userRole.js';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

export default {
  name: 'AdminRoleManager',
  data() {
    return {
      status: ''
    };
  },
  methods: {
    async checkAdminRole() {
      try {
        this.status = 'Checking admin role for elie1400674@gmail.com...\n';
        
        const result = await debugUserRole('elie1400674@gmail.com');
        
        if (result) {
          this.status += `Current role: ${result.currentRole}\n`;
          this.status += `Correct role: ${result.correctRole}\n`;
          this.status += `Mismatch: ${result.isMismatch}\n`;
          this.status += `User ID: ${result.userId}\n`;
        } else {
          this.status += 'User not found in database\n';
        }
        
      } catch (error) {
        this.status += `Error: ${error.message}\n`;
      }
    },
    
    async fixAdminRole() {
      try {
        this.status = 'Fixing admin role for elie1400674@gmail.com...\n';
        
        const targetEmail = 'elie1400674@gmail.com';
        
        // Find the user by email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', targetEmail));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          this.status += 'User not found. Creating new admin user...\n';
          
          // Create new admin user
          const newUserId = 'admin_' + Date.now();
          const userRef = doc(db, 'users', newUserId);
          
          await setDoc(userRef, {
            email: targetEmail,
            role: 'admin',
            createdAt: new Date(),
            isAdmin: true
          });
          
          this.status += `✅ Created new admin user with ID: ${newUserId}\n`;
        } else {
          // Update existing user
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const userId = userDoc.id;
          
          this.status += `Found user with ID: ${userId}\n`;
          this.status += `Current role: ${userData.role}\n`;
          
          if (userData.role !== 'admin') {
            await setDoc(doc(db, 'users', userId), {
              ...userData,
              role: 'admin',
              isAdmin: true,
              updatedAt: new Date()
            });
            
            this.status += '✅ Successfully updated user to admin role\n';
          } else {
            this.status += '✅ User already has admin role\n';
          }
        }
        
      } catch (error) {
        this.status += `Error: ${error.message}\n`;
      }
    },
    
    async fixAllAdminRoles() {
      try {
        this.status = 'Fixing all incorrect admin roles...\n';
        await fixAllIncorrectAdminRoles();
        this.status += '✅ Fix complete\n';
      } catch (error) {
        this.status += `Error: ${error.message}\n`;
      }
    }
  }
};
</script>

<style scoped>
.admin-role-manager {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px;
}

.admin-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.status-message {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  white-space: pre-wrap;
  font-family: monospace;
  max-height: 300px;
  overflow-y: auto;
}
</style> 