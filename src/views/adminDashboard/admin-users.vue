<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="users-main">
      <div class="users-container">
        <h2 class="users-title">User Management</h2>
        <div class="subtitle-search-row">
          <div class="users-subtitle">All Users</div>
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
  
        <div class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr class="table-header">
                <th>No</th>
                <th>User</th>
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
                  <img :src="user.avatar" :alt="user.name" class="user-avatar">
                  {{ user.name }}
                </td>
                <td>{{ user.specialization }}</td>
                <td>{{ user.location }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.contact }}</td>
                <td class="action-cell">
                  <a @click="viewUser(user)" class="action-btn view-btn">
                    <i class="fas fa-eye"></i>
                  </a>
                  <button @click="deleteUser(user)" class="action-btn delete-btn">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
        users: [
          {
            id: 1,
            name: 'Ahmed Hassan',
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            specialization: 'Carpentry',
            location: 'Giza',
            email: 'test123@gmail.com',
            contact: '82486 69086'
          },
          {
            id: 2,
            name: 'Mohamed Ali',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            specialization: 'Plumbing',
            location: 'Cairo',
            email: 'mohamed@gmail.com',
            contact: '82486 69087'
          },
          {
            id: 3,
            name: 'Omar Hassan',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            specialization: 'Electrical',
            location: 'Alexandria',
            email: 'omar@gmail.com',
            contact: '82486 69088'
          },
          {
            id: 4,
            name: 'Ahmed Ali',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
            specialization: 'Carpentry',
            location: 'Giza',
            email: 'ahmed@gmail.com',
            contact: '82486 69089'
          },
          {
            id: 5,
            name: 'Mahmoud Hassan',
            avatar: 'https://randomuser.me/api/portraits/men/89.jpg',
            specialization: 'Plumbing',
            location: 'Cairo',
            email: 'mahmoud@gmail.com',
            contact: '82486 69090'
          },
          {
            id: 6,
            name: 'Karim Ali',
            avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
            specialization: 'Electrical',
            location: 'Alexandria',
            email: 'karim@gmail.com',
            contact: '82486 69091'
          },
          {
            id: 7,
            name: 'Samir Hassan',
            avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
            specialization: 'Carpentry',
            location: 'Giza',
            email: 'samir@gmail.com',
            contact: '82486 69092'
          },
          {
            id: 8,
            name: 'Youssef Ali',
            avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
            specialization: 'Plumbing',
            location: 'Cairo',
            email: 'youssef@gmail.com',
            contact: '82486 69093'
          }
        ]
      };
    },
    computed: {
      filteredUsers() {
        if (!this.searchQuery.trim()) return this.users;
        const q = this.searchQuery.toLowerCase();
        return this.users.filter(user =>
          Object.values(user).some(val => String(val).toLowerCase().includes(q))
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
    methods: {
      viewUser(user) {
        this.$router.push(`/admin-user-profile/${user.id}`);
      },
      deleteUser(user) {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index > -1) {
            this.users.splice(index, 1);
          }
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

.view-btn {
  color: #3b82f6;
}

.view-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #fee2e2;
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