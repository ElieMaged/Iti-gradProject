<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="users-main">
      <div class="users-container">
        <h2 class="users-title">User Management</h2>
                 <div class="subtitle-search-row">
           <div class="users-subtitle">All Regular Users</div>
          <div class="search-wrapper">
            <input 
              type="text" 
              placeholder="Search" 
              v-model="searchQuery"
              class="search-input"
            />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading users...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchAllUsers" class="retry-btn">Retry</button>
        </div>

        <!-- Users Table -->
        <div v-else-if="users.length > 0" class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr class="table-header">
                <th>No</th>
                <th>User</th>
                <th>Role</th>
                <th>Specialization</th>
                <th>Location</th>
                <th>Mail</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(user, index) in paginatedUsers" 
                :key="user.id" 
                class="table-row"
              >
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="user-cell">
                  <img :src="user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'" :alt="user.name" class="user-avatar">
                  {{ user.name }}
                </td>
                <td>
                  <span class="role-badge" :class="user.role">
                    {{ user.role }}
                  </span>
                </td>
                <td>{{ user.specialization || 'N/A' }}</td>
                <td>{{ user.location || 'N/A' }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.contact || 'N/A' }}</td>
                <td class="action-cell">
                  <a @click="viewUser(user)" class="action-btn view-btn">
                    <i class="fas fa-eye"></i>
                  </a>
                  <button @click="deleteUser(user)" class="action-btn delete-btn" :disabled="user.role === 'admin'">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

                 <!-- Empty State -->
         <div v-else class="empty-state">
           <p>No regular users found in the database.</p>
           <p class="debug-info">Debug: Check console for more information</p>
         </div>
        
        <pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev-page="prevPage"
          @next-page="nextPage"
        />
        
      </div>
    </div>
  </div>
</template>
  
<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { deleteUser as deleteAuthUser } from 'firebase/auth';
import { auth } from '../../firebase';

export default {
    name: 'AdminUsers',
    components: {
      AdminSidebar,
      Pagination
    },
    data() {
      return {
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 5,
        users: [],
        loading: true,
        error: null
      };
    },
    computed: {
      filteredUsers() {
        if (!this.searchQuery.trim()) return this.users;
        const q = this.searchQuery.toLowerCase();
        return this.users.filter(user =>
          Object.values(user).some(val => 
            val && String(val).toLowerCase().includes(q)
          )
        );
      },
      totalPages() {
        return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
      },
      paginatedUsers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredUsers.slice(start, end);
      }
    },
    async mounted() {
      await this.fetchAllUsers();
    },
    methods: {
             async fetchAllUsers() {
         try {
           this.loading = true;
           this.error = null;
           
           console.log('🔍 Starting to fetch users...');
           
           // Fetch regular users only (no technicians)
           const usersCollection = collection(db, 'users');
           console.log('📁 Fetching from users collection...');
           const usersSnapshot = await getDocs(usersCollection);
           console.log('👥 Users found:', usersSnapshot.docs.length);
           
           const regularUsers = usersSnapshot.docs.map(doc => {
             const data = doc.data();
             console.log('📄 User data:', { id: doc.id, ...data });
             
             // Determine the correct role
             let role = data.role || 'user';
             
             // Only elie1400674@gmail.com should be admin
             if (data.email === 'elie1400674@gmail.com') {
               role = 'admin';
             } else {
               // Ensure other users are not admin
               role = data.role === 'admin' ? 'user' : (data.role || 'user');
             }
             
             return {
               id: doc.id,
               ...data,
               name: data.email || 'Unknown User',
               avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
               role: role,
               specialization: 'N/A',
               location: 'N/A',
               contact: 'N/A'
             };
           });

           // Only show regular users (no technicians)
           this.users = regularUsers;
           console.log('✅ Total users loaded:', this.users.length);
           console.log('📋 Final users array:', this.users);
          
        } catch (error) {
          console.error('❌ Error fetching users:', error);
          this.error = 'Failed to fetch users';
        } finally {
          this.loading = false;
        }
      },
      
      viewUser(user) {
        this.$router.push(`/admin-user-profile/${user.id}`);
      },
      
             async deleteUser(user) {
         if (user.role === 'admin') {
           alert('Cannot delete admin users');
           return;
         }

         if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
           return;
         }

         try {
           console.log('🗑️ Deleting user:', user.name, 'with ID:', user.id);
           
           // Remove from users collection
           const userDoc = doc(db, 'users', user.id);
           await deleteDoc(userDoc);
           console.log('✅ User document deleted from Firestore');

           // Remove from local array immediately for UI update
           const index = this.users.findIndex(u => u.id === user.id);
           if (index > -1) {
             this.users.splice(index, 1);
             console.log('✅ User removed from local array');
           }

           // Show success message
           alert(`User ${user.name} has been deleted successfully from the database!`);
           
         } catch (error) {
           console.error('❌ Error deleting user:', error);
           alert('Failed to delete user. Please try again.');
         }
       },
      
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      }
    },
    watch: {
      searchQuery() {
        this.currentPage = 1;
      }
    }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}

.users-main {
  flex: 1;
  padding: 2.5rem;
}

.users-container {
  max-width: 80rem;
  margin: 0 auto;
}

.users-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
}

.subtitle-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.users-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c6bb0;
}

.search-wrapper {
  display: flex;
  align-items: center;
  width: 411px;
  height: 50px;
  padding: 10px;
  gap: 8px;
  flex-shrink: 0;
  margin-bottom: 16px;
  position: relative;
}

.search-input {
  width: 100%;
  height: 100%;
  border-radius: 48px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  background: var(--grey-50, #EAEAEA);
  font-size: 1rem;
  color: #6B5FA7;
  outline: none;
  padding: 0 16px 0 40px;
  transition: border 0.2s;
}

.search-input:focus {
  border: 1.5px solid #6B5FA7;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #b6a7e6;
  font-size: 1.1rem;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.75rem;
}

.table-header {
  background: rgba(124, 107, 176, 0.2);
  color: #333;
}

.table-header th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #ede7f6;
}

.table-row td {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #fee2e2;
  color: #dc2626;
}

.role-badge.technician {
  background: #dbeafe;
  color: #2563eb;
}

.role-badge.user {
  background: #f3e8ff;
  color: #7c3aed;
}

.action-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
  font-size: 1rem;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.view-btn {
  color: #3b82f6;
}

.view-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover:not(:disabled) {
  background: #fee2e2;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  background: #5a4a8c;
}

.debug-info {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .users-main {
    padding: 1rem;
  }
  .subtitle-search-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .search-wrapper {
    width: 100%;
    max-width: none;
  }
  .table-wrapper {
    font-size: 0.8rem;
  }
  .table-header th,
  .table-row td {
    padding: 0.5rem 0.5rem;
  }
}
</style>