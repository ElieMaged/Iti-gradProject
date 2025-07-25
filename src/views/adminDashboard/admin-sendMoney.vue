<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="send-money-main">
      <div class="send-money-wrapper">
        <h2 class="send-money-title">Payouts Management</h2>
        <div class="send-money-subtitle">Send Money</div>
        <div class="quick-actions-section">
          <div class="quick-actions">
            <div href="/admin-send-money" class="quick-action active">
              <i class="fas fa-paper-plane"></i>
              <span>Send Money</span>
            </div>
            <div href="/admin-wallet-details" class="quick-action" @click="goToWalletDetails">
              <i class="fas fa-wallet"></i>
              <span>Wallet Details</span>
            </div>
            <div href="/admin-payment" class="quick-action">
              <i class="fas fa-list"></i>
              <span>All transaction</span>
            </div>
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
    goToWalletDetails() {
      this.$router.push('/admin-wallet-details');
    },
    submitTransfer() {
      // Placeholder for submit logic
      alert('Transfer submitted!');
    },
    cancelTransfer() {
      // Placeholder for cancel logic
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
  padding: 2rem 0 0 0;
  background: #f9fafb;
}
.send-money-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 2.5rem 0 2.5rem;
}
.send-money-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0.2rem;
}
.send-money-subtitle {
  color: #7c6bb0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 2rem;
}
.transfer-money-section {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
}
.transfer-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #222;
}
.transfer-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-row {
  display: flex;
  gap: 2rem;
  align-items: start;
}
.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.form-group label {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #222;
}
.form-group input {
  border: 1px solid #c2c3c4;
  border-radius: 1.5rem;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  background: #faf8fd;
  outline: none;
  transition: border 0.2s;
}
.form-group input:focus {
  border: 1.5px solid #7c6bb0;
}
.balance-row {
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #c2c3c4;
  padding-bottom: 0.7rem;
  margin-bottom: 0.7rem;
}
.balance-label {
  font-size: 1.1rem;
  color: #222;
  font-weight: 500;
}
.balance-value {
  font-size: 1.5rem;
  color: #222;
  font-weight: bold;
  margin-left: 0.5rem;
}
.transfer-amount-group {
  flex: 1;
}
.btn-row {
  gap: 1.2rem;
  margin-top: 0.5rem;
}
.submit-btn {
  background: #7c6bb0;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #5a4a8c;
}
.cancel-btn {
  background: #fff;
  color: #7c6bb0;
  border: 1.5px solid #7c6bb0;
  border-radius: 1.5rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.cancel-btn:hover {
  background: #ede7f6;
  color: #5a4a8c;
}
.quick-actions-section {
  margin-top: 2.5rem;
}
.quick-actions {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
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
  font-size: 1.7rem;
  margin-bottom: 0.7rem;
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
