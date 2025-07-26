<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="wallet-main">
      <div class="wallet-container">
        <h2 class="wallet-title">Payouts Management</h2>
        <div class="wallet-subtitle">Wallet Details</div>
        <div class="quick-actions-section">
          <div class="quick-actions">
            <a href="/admin-send-money" class="quick-action">
              <i class="fas fa-paper-plane"></i>
              <span>Send Money</span>
            </a>
            <div class="quick-action active">
              <i class="fas fa-wallet"></i>
              <span>Wallet Details</span>
            </div>
            <a href="/admin-payment" class="quick-action">
              <i class="fas fa-list"></i>
              <span>All transaction</span>
            </a>
          </div>
        </div>
        <div class="wallet-cards-section">
          <div class="wallet-cards">
            <div class="wallet-card">
              <span class="wallet-card-label">Wallet Balance</span>
              <span class="wallet-card-value">${{ formatCurrency(walletData.balance) }}</span>
            </div>
            <div class="wallet-card">
              <span class="wallet-card-label">Pending</span>
              <span class="wallet-card-value">${{ formatCurrency(walletData.pending) }}</span>
            </div>
            <div class="wallet-card add-balance" @click="showAddBalanceModal">
              <i class="fas fa-plus add-balance-icon"></i>
              <span class="add-balance-label">Add Balance</span>
            </div>
          </div>
        </div>

        <!-- Add Balance Modal -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">Add Balance</h3>
              <button class="modal-close" @click="closeModal">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Amount to Add:</label>
                <input 
                  type="number" 
                  v-model="addAmount" 
                  placeholder="Enter amount"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>Payment Method:</label>
                <select v-model="paymentMethod" class="form-select">
                  <option value="credit-card">Credit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="closeModal">Cancel</button>
              <button class="btn-submit" @click="addBalance">Add Balance</button>
            </div>
          </div>
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
      walletData: {
        balance: 299000.00,
        pending: 299.00,
        transactions: [
          { id: 1, type: 'credit', amount: 50000.00, date: '2024-01-15', status: 'completed' },
          { id: 2, type: 'debit', amount: 25000.00, date: '2024-01-10', status: 'completed' },
          { id: 3, type: 'credit', amount: 75000.00, date: '2024-01-05', status: 'pending' },
          { id: 4, type: 'debit', amount: 15000.00, date: '2024-01-01', status: 'completed' }
        ]
      },
      showModal: false,
      addAmount: '',
      paymentMethod: 'credit-card'
    };
  },
  computed: {
    totalBalance() {
      return this.walletData.balance + this.walletData.pending;
    },
    recentTransactions() {
      return this.walletData.transactions.slice(0, 5);
    },
    pendingTransactions() {
      return this.walletData.transactions.filter(t => t.status === 'pending');
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },
    showAddBalanceModal() {
      this.showModal = true;
      this.addAmount = '';
      this.paymentMethod = 'credit-card';
    },
    closeModal() {
      this.showModal = false;
    },
    addBalance() {
      if (!this.addAmount || this.addAmount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      const amount = parseFloat(this.addAmount);
      
      // Simulate API call
      setTimeout(() => {
        this.walletData.balance += amount;
        
        // Add transaction record
        this.walletData.transactions.unshift({
          id: Date.now(),
          type: 'credit',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        });

        this.closeModal();
        alert(`Successfully added $${this.formatCurrency(amount)} to your wallet!`);
      }, 1000);
    },
    getTransactionStatus(status) {
      return status === 'completed' ? 'Completed' : 'Pending';
    },
    getTransactionType(type) {
      return type === 'credit' ? 'Credit' : 'Debit';
    }
  },
  mounted() {
    // Simulate loading wallet data from API
    console.log('Wallet data loaded:', this.walletData);
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

.wallet-main {
  flex: 1;
  padding: 2.5rem;
}

.wallet-container {
  max-width: 80rem;
  margin: 0 auto;
}

.wallet-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
}

.wallet-subtitle {
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

.wallet-cards-section {
  margin-bottom: 3rem;
}

.wallet-cards {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.wallet-card {
  flex: 1;
  border-radius: 1rem;
  background: #7c6bb0;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.wallet-card-label {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.wallet-card-value {
  font-size: 2.25rem;
  font-weight: bold;
  letter-spacing: 0.05em;
}

.add-balance {
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-balance:hover {
  opacity: 0.9;
}

.add-balance-icon {
  font-size: 1.875rem;
  margin-bottom: 0.5rem;
}

.add-balance-label {
  font-size: 1.125rem;
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  border-color: #7c6bb0;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  background: #f3f4f6;
  color: #333;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #7c6bb0;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background: #5a4a8c;
}

@media (min-width: 768px) {
  .wallet-cards {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .wallet-main {
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
  .wallet-cards {
    gap: 1rem;
  }
  .wallet-card {
    padding: 2rem 1rem;
  }
  .wallet-card-value {
    font-size: 1.875rem;
  }
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>
