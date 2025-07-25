<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <main id="main-content">
      <section id="user-management">
        <h2 id="user-management-title">User Management</h2>
        <div class="subtitle-search-row">
          <div id="user-management-subtitle">All Users</div>
          <div id="user-search-wrapper">
            <input id="user-search-input" type="text" placeholder="Search" />
            <span id="user-search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>
  
        <div id="user-table-wrapper">
          <table id="user-table">
            <thead>
              <tr id="user-table-header">
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
              <tr class="user-row">
                <td>01</td>
                <td>Ahmed Hassan</td>
                <td>Carpentry</td>
                <td>Giza</td>
                <td>test123@gmail.com</td>
                <td>82486 69086</td>
                <td>
                  <a href="admin-user-profile.html" class="user-action-view"><i class="fas fa-eye"></i></a>
                  <button class="user-action-delete"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
              <!-- Repeat rows as needed -->
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
  <pagination />
</template>
  
<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';

export default {
    name: 'MainContent',
    components: {
    AdminSidebar,
    Pagination
    }
}
</script>

<style scoped>
.admin-dashboard-layout {
    display: flex;
    min-height: 100vh;
    font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
    background: #faf8fd;
    width: 100%;
    margin-right: 0px;
}

#main-content {
  padding: 40px 40px 40px 40px;
  background: transparent;
  min-height: 100vh;
  width: 100%;
  margin-right: 0px;
}

#user-management-title {
  width: 299px;
  color: var(--text-color-text-brand, #625397);
  font-family: Outfit, 'Segoe UI', Arial, sans-serif;
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 36px;
  margin-bottom: 8px;
}

.subtitle-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

#user-management-subtitle {
  color: var(--text-color-text-brand, #625397);
  font-family: Outfit, 'Segoe UI', Arial, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px;
  width: 94.68px;
  flex-shrink: 0;
  margin-bottom: 24px;
}

#user-search-wrapper {
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

#user-search-input {
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
#user-search-input:focus {
  border: 1.5px solid #6B5FA7;
}

#user-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #b6a7e6;
  font-size: 1.1rem;
}

#user-table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(107,95,167,0.06);
  background: #fff;
}

#user-table {
  width: 100%;
  background: #fff;
  border-radius: 16px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1rem;
}

#user-table-header th {
  background: #e6e0f3;
  color: #6B5FA7;
  font-weight: 600;
  font-size: 1rem;
  padding: 16px 18px;
  border-bottom: 2px solid #d1c4e9;
}

#user-table th,
#user-table td {
  padding: 16px 18px;
  text-align: left;
  border-bottom: 1px solid #f3f0fa;
}

.user-row:hover {
  background: #f3f0fa;
}

.user-action-view,
.user-action-delete {
  margin: 0 8px;
  color: #6B5FA7;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.2rem;
  transition: color 0.2s;
}
.user-action-view:hover {
  color: var(--primary-color);
}
.user-action-delete {
  color: #f44336;
}
.user-action-delete:hover {
  color: #b71c1c;
}

</style>