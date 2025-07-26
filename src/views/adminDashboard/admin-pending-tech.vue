<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="pending-tech-main">
      <div class="pending-tech-container">
        <h2 class="pending-tech-title">Technician Management</h2>
        <div class="subtitle-search-row">
          <div class="pending-tech-subtitle">Pending Technicians</div>
          <div class="search-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search" 
              class="search-input" 
            />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="pending-tech-table">
            <thead>
              <tr class="table-header">
                <th>No</th>
                <th>Technician</th>
                <th>ID Number</th>
                <th>Specialization</th>
                <th>Location</th>
                <th>Mail</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(technician, index) in paginatedTechnicians" 
                :key="technician.id" 
                class="table-row"
              >
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="technician-cell">
                  <img :src="technician.avatar" :alt="technician.name" class="technician-avatar">
                  {{ technician.name }}
                </td>
                <td>{{ technician.idNumber }}</td>
                <td>{{ technician.specialization }}</td>
                <td>{{ technician.location }}</td>
                <td>{{ technician.email }}</td>
                <td>{{ technician.contact }}</td>
                <td class="action-cell">
                  <a @click="viewTechnician(technician)" class="action-btn view-btn">
                    <i class="fas fa-eye"></i>
                  </a>
                  <button @click="deleteTechnician(technician)" class="action-btn delete-btn">
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
  components: { 
    AdminSidebar,
    Pagination
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      pendingTechnicians: [
        {
          id: 1,
          name: 'Ahmed Hassan',
          avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
          idNumber: '30303078800526',
          specialization: 'Carpentry',
          location: 'Giza',
          email: 'test123@gmail.com',
          contact: '82486 69086'
        },
        {
          id: 2,
          name: 'Mohamed Ali',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          idNumber: '30303078800527',
          specialization: 'Plumbing',
          location: 'Cairo',
          email: 'mohamed@gmail.com',
          contact: '82486 69087'
        },
        {
          id: 3,
          name: 'Omar Hassan',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          idNumber: '30303078800528',
          specialization: 'Electrical',
          location: 'Alexandria',
          email: 'omar@gmail.com',
          contact: '82486 69088'
        },
        {
          id: 4,
          name: 'Ahmed Ali',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          idNumber: '30303078800529',
          specialization: 'Carpentry',
          location: 'Giza',
          email: 'ahmed@gmail.com',
          contact: '82486 69089'
        },
        {
          id: 5,
          name: 'Mahmoud Hassan',
          avatar: 'https://randomuser.me/api/portraits/men/89.jpg',
          idNumber: '30303078800530',
          specialization: 'Plumbing',
          location: 'Cairo',
          email: 'mahmoud@gmail.com',
          contact: '82486 69090'
        },
        {
          id: 6,
          name: 'Karim Ali',
          avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
          idNumber: '30303078800531',
          specialization: 'Electrical',
          location: 'Alexandria',
          email: 'karim@gmail.com',
          contact: '82486 69091'
        },
        {
          id: 7,
          name: 'Samir Hassan',
          avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
          idNumber: '30303078800532',
          specialization: 'Carpentry',
          location: 'Giza',
          email: 'samir@gmail.com',
          contact: '82486 69092'
        },
        {
          id: 8,
          name: 'Youssef Ali',
          avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
          idNumber: '30303078800533',
          specialization: 'Plumbing',
          location: 'Cairo',
          email: 'youssef@gmail.com',
          contact: '82486 69093'
        }
      ]
    };
  },
  computed: {
    filteredTechnicians() {
      if (!this.searchQuery.trim()) return this.pendingTechnicians;
      const q = this.searchQuery.toLowerCase();
      return this.pendingTechnicians.filter(technician =>
        Object.values(technician).some(val => String(val).toLowerCase().includes(q))
      );
    },
    totalPages() {
      return Math.ceil(this.filteredTechnicians.length / this.itemsPerPage);
    },
    paginatedTechnicians() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTechnicians.slice(start, end);
    }
  },
  methods: {
    viewTechnician(technician) {
      this.$router.push(`/admin-pending-tech/pending-technician-profile/${technician.id}`);
    },
    deleteTechnician(technician) {
      if (confirm(`Are you sure you want to delete ${technician.name}?`)) {
        const index = this.pendingTechnicians.findIndex(t => t.id === technician.id);
        if (index > -1) {
          this.pendingTechnicians.splice(index, 1);
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

.pending-tech-main {
  flex: 1;
  padding: 2.5rem;
}

.pending-tech-container {
  max-width: 80rem;
  margin: 0 auto;
}

.pending-tech-title {
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

.pending-tech-subtitle {
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

.pending-tech-table {
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

.technician-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.technician-avatar {
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
  .pending-tech-main {
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
