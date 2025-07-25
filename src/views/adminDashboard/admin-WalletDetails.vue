<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="wallet-main">
      <div class="wallet-wrapper">
        <h2 class="wallet-title">Payouts Managment</h2>
        <div class="wallet-subtitle">Wallet Details</div>
        <div class="quick-actions-section">
          <div class="quick-actions">
            <div href="/admin-send-money" class="quick-action">
              <i class="fas fa-paper-plane"></i>
              <span>Send Money</span>
            </div>
            <div href="/admin-wallet-details" class="quick-action active">
              <i class="fas fa-wallet"></i>
              <span>Wallet Details</span>
            </div>
            <a href="/admin-payment" class="quick-action">
              <i class="fas fa-list"></i>
              <span>All transaction</span>
            </a>
          </div>
        </div>
        <div class="wallet-cards-row">
          <div class="wallet-card">
            <span class="wallet-card-label">Wallet Balance</span>
            <span class="wallet-card-value">$299000.00</span>
          </div>
          <div class="wallet-card">
            <span class="wallet-card-label">Pending</span>
            <span class="wallet-card-value">$299.00</span>
          </div>
          <div class="wallet-card add-balance">
            <span class="add-balance-icon"><i class="fas fa-plus-circle"></i></span>
            <span class="add-balance-label">Add Balance</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
export default {
  components: { AdminSidebar }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}
.wallet-main {
  flex: 1;
  padding: 2rem 0 0 0;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wallet-wrapper {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2.5rem 0 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.wallet-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0.2rem;
}
.wallet-subtitle {
  color: #7c6bb0;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 2.2rem;
}
.wallet-cards-row {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  width: 100%;
  justify-content: flex-start;
}
.wallet-card {
  background: #7c6bb0;
  color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 300px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 1.1rem;
  position: relative;
}
.wallet-card-label {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
  color: #ede7f6;
}
.wallet-card-value {
  font-size: 2.3rem;
  font-weight: bold;
  color: #fff;
}
.add-balance {
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex-direction: row;
}
.add-balance-icon {
  font-size: 2.5rem;
  margin-bottom: 0.7rem;
  display: block;
  align-items: center;
}
.add-balance-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}
.quick-actions-section {
  width: 100%;
  margin-top: 1.5rem;
}
.quick-actions {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: flex-start;
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
.quick-action i {
  font-size: 2rem;
  margin-bottom: 0.7rem;
}
.quick-action span {
  font-size: 1.1rem;
  font-weight: 600;
}
.quick-action:hover {
  background: #7c6bb0;
  color: #fff;
}
.quick-action.active {
  background: #7c6bb0;
  color: #fff;
}
@media (max-width: 1100px) {
  .wallet-wrapper {
    padding: 1rem 0.5rem 0 0.5rem;
  }
  .wallet-cards-row {
    gap: 1rem;
  }
}
@media (max-width: 900px) {
  .wallet-cards-row {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }
}
@media (max-width: 600px) {
  .quick-actions {
    flex-direction: column;
    gap: 0.7rem;
  }
  .wallet-title {
    font-size: 1.2rem;
  }
  .wallet-card-value {
    font-size: 1.2rem;
  }
}
</style>
