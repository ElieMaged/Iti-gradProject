<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="send-money-main">
      <div class="send-money-container">
        <h2 class="send-money-title">Payouts Management</h2>
        <div class="send-money-subtitle">Send Money</div>
        <div class="quick-actions-section">
          <div class="quick-actions">
            <div class="quick-action active">
              <i class="fas fa-paper-plane"></i>
              <span>Send Money</span>
            </div>
            <a href="/admin-wallet-details" class="quick-action">
              <i class="fas fa-wallet"></i>
              <span>Wallet Details</span>
            </a>
            <a href="/admin-payment" class="quick-action">
              <i class="fas fa-list"></i>
              <span>All transaction</span>
            </a>
          </div>
        </div>
        <div class="transfer-money-section">
          <h3 class="transfer-title">Transfer Money</h3>
          <form class="transfer-form" @submit.prevent="submitTransfer">
            <div class="form-row">
              <div class="form-group">
                <label>Account Number:</label>
                <input type="text" v-model="accountNumber" />
              </div>
              <div class="form-group">
                <label>Transfer to:</label>
                <input type="text" v-model="transferTo" />
              </div>
            </div>
            <div class="form-row balance-row">
              <span class="balance-label">Available Balance :</span>
              <span class="balance-value">19,200.00</span>
            </div>
            <div class="form-row">
              <div class="form-group transfer-amount-group">
                <label>Transfer Amount:</label>
                <input type="number" v-model="transferAmount" />
              </div>
            </div>
            <div class="form-row btn-row">
              <button type="submit" class="submit-btn">Submit</button>
              <button type="button" class="cancel-btn" @click="cancelTransfer">Cancel</button>
            </div>
          </form>
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
      accountNumber: '',
      transferTo: '',
      transferAmount: ''
    };
  },
  methods: {
    submitTransfer() {
      alert('Transfer submitted!');
    },
    cancelTransfer() {
      this.accountNumber = '';
      this.transferTo = '';
      this.transferAmount = '';
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

.send-money-main {
  flex: 1;
  padding: 2.5rem;
}

.send-money-container {
  max-width: 80rem;
  margin: 0 auto;
}

.send-money-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
}

.send-money-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c6bb0;
  margin-bottom: 2rem;
}

.quick-actions-section {
  margin-bottom: 2rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.quick-action {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  color: #333;
  min-width: 120px;
}

.quick-action i {
  font-size: 1.7rem;
  margin-bottom: 0.5rem;
}

.quick-action:hover {
  background: #7c6bb0;
  color: #fff;
}

.quick-action.active {
  background: #7c6bb0;
  color: #fff;
}

.transfer-money-section {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.transfer-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.transfer-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #7c6bb0;
}

.balance-row {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  justify-content: space-between;
}

.balance-label {
  font-weight: 600;
  color: #333;
}

.balance-value {
  font-weight: bold;
  color: #7c6bb0;
  font-size: 1.1rem;
}

.transfer-amount-group {
  max-width: 300px;
}

.btn-row {
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn {
  background: #7c6bb0;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background: #5a4a8c;
}

.cancel-btn {
  background: #f3f4f6;
  color: #333;
  padding: 0.75rem 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .send-money-main {
    padding: 1rem;
  }
  .quick-actions {
    flex-direction: column;
    align-items: center;
  }
  .quick-action {
    width: 100%;
    max-width: 200px;
  }
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  .transfer-amount-group {
    max-width: none;
  }
  .btn-row {
    flex-direction: column;
  }
}
</style>
