<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="payment-main">
      <div class="payment-wrapper">
        <h2 class="payment-title">Payouts Management</h2>
        <div class="payment-header-row">
          <div class="payment-subtitle">All Transactions</div>
          <div class="filter-search-bar">
            <button class="filter-btn"><i class="fas fa-filter"></i> Filter</button>
            <div class="search-wrapper">
              <span class="search-icon"><i class="fas fa-search"></i></span>
              <input type="text" v-model="search" placeholder="Search Field" class="search-input" />
            </div>
          </div>
        </div>
        <div class="top-row">
          <div class="paypal-card-search-row">
            <!-- Right: Quick Actions -->
          <div class="payment-right">
            <div class="quick-actions">
              <a href="/admin-send-money" class="quick-action">
                <i class="fas fa-paper-plane"></i>
                <span>Send Money</span>
              </a>
              <a href="/admin-wallet-details" class="quick-action">
                <i class="fas fa-wallet"></i>
                <span>Wallet Details</span>
              </a>
              <a href="/admin-payment" class="quick-action active">
                <i class="fas fa-list"></i>
                <span>All transaction</span>
              </a>
            </div>
          </div>
            <div class="paypal-card">
              <div class="paypal-card-header">
                <span class="paypal-card-title">Pay<span class="bold">Pal</span> <span class="ml-2">Cash</span></span>
                <span class="paypal-card-type">debit</span>
              </div>
              <div class="paypal-card-icon">
                <i class="fab fa-cc-paypal"></i>
              </div>
              <div class="paypal-card-footer">
                <span class="paypal-card-admin">ADMIN BOLTFIX</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" class="paypal-card-logo" />
              </div>
            </div>
          </div>
        </div>
        <div class="payment-table-wrapper">
          <table class="payment-table">
            <thead>
              <tr>
                <th>Technicians</th>
                <th>Payout ID</th>
                <th>Payout Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in filteredRows" :key="i">
                <td><input type="checkbox" /> {{ row.technician }}</td>
                <td>{{ row.payoutId }}</td>
                <td>{{ row.payoutType }}</td>
                <td>{{ row.amount }}</td>
                <td>
                  <span :class="['status-badge', row.status.toLowerCase()]">{{ row.status }}</span>
                </td>
                <td>
                  <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
export default {
  components: { AdminSidebar },
  data() {
    return {
      search: '',
      rows: [
        { technician: 'Ahmed Hassan', payoutId: '1049014598', payoutType: 'Paypal', amount: 250, status: 'Pending' },
        { technician: 'Mahmoud Ali', payoutId: '1049014598', payoutType: 'Paypal', amount: 300, status: 'Rejected' },
        { technician: 'Selim Morad', payoutId: '1049014598', payoutType: 'Paypal', amount: 200, status: 'Pending' },
        { technician: 'Noah Hamdy', payoutId: '1049014598', payoutType: 'Paypal', amount: 300, status: 'Pending' },
        { technician: 'Romy Seyed', payoutId: '1049014598', payoutType: 'Paypal', amount: 500, status: 'Completed' },
        { technician: 'Ahmed Ali', payoutId: '1049014598', payoutType: 'Paypal', amount: 700, status: 'Pending' },
        { technician: 'Samir Lasheen', payoutId: '1049014598', payoutType: 'Paypal', amount: 120, status: 'Completed' },
        { technician: 'Maged Osama', payoutId: '1049014598', payoutType: 'Paypal', amount: 200, status: 'Rejected' },
        { technician: 'Karim Naguib', payoutId: '1049014598', payoutType: 'Paypal', amount: 230, status: 'Pending' },
      ]
    };
  },
  computed: {
    filteredRows() {
      if (!this.search.trim()) return this.rows;
      const q = this.search.toLowerCase();
      return this.rows.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(q))
      );
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
.payment-main {
  flex: 1;
  padding: 2rem;
  background: #f9fafb;
}
.payment-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}
.payment-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  margin-bottom: 0.5rem;
}
.payment-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
}
.payment-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  height: 100%;
}
.filter-search-bar {
    display: flex;
  width: 685px;
  height: 61px;
  justify-content: center;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  border-radius: 58px;
  background: #D3CFE2;
}
.filter-btn {
    display: flex;
    width: 97px;
    height: 39px;
    padding: 8px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 58px;
    border: 1px solid var(--border-border-primary, #C2C3C4);
    color: #C2C3C4;
    background: var(--surface-color-surface-primary, #FFF);
}
.filter-btn i {
  font-size: 1.1rem;
}
.filter-btn:hover {
  background: var(--sidebar-color);
  color: var(--primary-color);
}
.search-wrapper {
    display: flex;
    width: 439px;
    height: 39px;
    padding: 8px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 58px;
    border: 1px solid var(--border-border-primary, #C2C3C4);
    background: var(--surface-color-surface-primary, #FFF);
}
.search-icon {
  color: #b8a4e3;
  font-size: 1.1rem;
  margin-right: 0.7rem;
}
.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
}
.search-input::placeholder {
  color: #b8a4e3;
  opacity: 1;
}
.paypal-card {
  background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
  color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 1.5rem;
  min-width: 260px;
  max-width: 320px;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}
.paypal-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.paypal-card-title {
  font-size: 1.1rem;
  font-weight: 500;
}
.paypal-card-title .bold {
  font-weight: bold;
}
.paypal-card-type {
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 2px;
}
.paypal-card-icon {
  position: absolute;
  left: 1.2rem;
  top: 2.5rem;
  font-size: 2.5rem;
  opacity: 0.18;
}
.paypal-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.2rem;
}
.paypal-card-admin {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 2px;
}
.paypal-card-logo {
  width: 32px;
  height: 22px;
  object-fit: contain;
}
.payment-table-wrapper {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem;
  overflow-x: auto;
}
.payment-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 1rem;
}
.payment-table th, .payment-table td {
  padding: 1rem 1.2rem;
  text-align: left;
}
.payment-table th {
  background: #ede7f6;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}
.payment-table tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}
.payment-table tr:hover {
  background: #ede7f6;
}
.status-badge {
  display: inline-block;
  padding: 0.3rem 1.2rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
}
.status-badge.pending {
  background: #60a5fa;
}
.status-badge.completed {
  background: #22c55e;
}
.status-badge.rejected {
  background: #f472b6;
}
.delete-btn {
  background: none;
  border: none;
  color: #f44336;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}
.delete-btn:hover {
  color: #b71c1c;
}
.payment-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.quick-actions {
  display: flex;
  flex-direction: row;

}
.quick-action {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  margin: 20px;
  color: #333;

}
.quick-action a {
  font-size: 1.7rem;
}
.quick-action:hover {
  background: #7c6bb0;
  color: #fff;
}
.quick-action.active {
  background: #7c6bb0;
  color: #fff;
}
</style>
