<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="wallet-main mr-20 p-4">
      <div class="wallet-container">
        <h2 class="wallet-title">{{ $t('payoutsManagement') }}</h2>
        <div class="wallet-subtitle">{{ $t('walletDetails') }}</div>
        <div class="quick-actions-section">
          <div class="quick-actions">
            <a href="/admin-send-money" class="quick-action">
              <i class="fas fa-paper-plane"></i>
              <span>{{ $t('sendMoney') }}</span>
            </a>
            <div class="quick-action active">
              <i class="fas fa-wallet"></i>
              <span>{{ $t('walletDetails') }}</span>
            </div>
            <a href="/admin-payment" class="quick-action">
              <i class="fas fa-list"></i>
              <span>{{ $t('allTransactions') }}</span>
            </a>
          </div>
        </div>
        <div class="wallet-cards-section">
          <div class="wallet-cards">
            <div class="wallet-card">
              <span class="wallet-card-label">{{ $t('walletBalance') }}</span>
              <span class="wallet-card-value">${{ formatCurrency(walletData.balance) }}</span>
            </div>
            <div class="wallet-card">
              <span class="wallet-card-label">{{ $t('pending') }}</span>
              <span class="wallet-card-value">${{ formatCurrency(walletData.pending) }}</span>
            </div>
            <div class="wallet-card add-balance" @click="showAddBalanceModal">
              <i class="fas fa-plus add-balance-icon"></i>
              <span class="add-balance-label">{{ $t('addBalance') }}</span>
            </div>
          </div>
        </div>

        <!-- Add Balance Modal -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">{{ $t('addBalanceTitle') }}</h3>
              <button class="modal-close" @click="closeModal">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>{{ $t('amountToAdd') }}</label>
                <input 
                  type="number" 
                  v-model="addAmount" 
                  :placeholder="$t('enterAmount')"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>{{ $t('paymentMethod') }}</label>
                <select v-model="paymentMethod" class="form-select">
                  <option value="credit-card">{{ $t('creditCard') }}</option>
                  <option value="bank-transfer">{{ $t('bankTransfer') }}</option>
                  <option value="paypal">{{ $t('paypal') }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="closeModal">{{ $t('cancel') }}</button>
              <button class="btn-submit" @click="addBalance">{{ $t('addBalanceButton') }}</button>
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
        alert(this.$t('pleaseEnterValidAmount'));
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
        alert(`${this.$t('successfullyAdded')} $${this.formatCurrency(amount)} ${this.$t('toYourWallet')}`);
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
  overflow-x: hidden;
}

.wallet-main {
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  min-height: 100vh;
}

.wallet-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.wallet-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
  word-wrap: break-word;
}

.wallet-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c6bb0;
  margin-bottom: 2rem;
  word-wrap: break-word;
}

.quick-actions-section {
  margin-bottom: 2rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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
  text-align: center;
  word-wrap: break-word;
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
  width: 100%;
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
  min-height: 120px;
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
  max-height: 90vh;
  overflow-y: auto;
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

/* Responsive Design */
@media (min-width: 1200px) {
  .wallet-container {
    max-width: 90rem;
  }
  
  .wallet-cards {
    flex-direction: row;
    gap: 2.5rem;
  }
  
  .wallet-card {
    padding: 3rem 2rem;
  }
  
  .quick-actions {
    gap: 1.5rem;
  }
  
  .quick-action {
    min-width: 150px;
    padding: 1.25rem 2rem;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .wallet-cards {
    flex-direction: row;
    gap: 1.5rem;
  }
  
  .wallet-card {
    padding: 2.5rem 1.5rem;
  }
  
  .quick-actions {
    gap: 1.25rem;
  }
  
  .quick-action {
    min-width: 130px;
    padding: 1.1rem 1.75rem;
  }
}

@media (max-width: 767px) {
  .admin-dashboard-layout {
    min-height: 10vh;
    flex-direction: column;
  }
  
  .wallet-main {
    padding: 1rem;
    margin-right: 0;
  }
  
  .wallet-container {
    max-width: 100%;
  }
  
  .wallet-title {
    font-size: 1.75rem;
    text-align: center;
  }
  
  .wallet-subtitle {
    font-size: 1.1rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .quick-action {
    width: 100%;
    max-width: 280px;
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
  
  .quick-action i {
    font-size: 1.5rem;
  }
  
  .wallet-cards {
    gap: 1rem;
  }
  
  .wallet-card {
    padding: 2rem 1rem;
  }
  
  .wallet-card-label {
    font-size: 1rem;
  }
  
  .wallet-card-value {
    font-size: 1.75rem;
  }
  
  .add-balance-icon {
    font-size: 1.5rem;
  }
  
  .add-balance-label {
    font-size: 1rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .wallet-main {
    padding: 0.75rem;
  }
  
  .wallet-title {
    font-size: 1.5rem;
  }
  
  .wallet-subtitle {
    font-size: 1rem;
  }
  
  .quick-action {
    max-width: 250px;
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
  
  .quick-action i {
    font-size: 1.25rem;
  }
  
  .wallet-card {
    padding: 1.5rem 0.75rem;
  }
  
  .wallet-card-label {
    font-size: 0.95rem;
  }
  
  .wallet-card-value {
    font-size: 1.5rem;
  }
  
  .add-balance-icon {
    font-size: 1.25rem;
  }
  
  .add-balance-label {
    font-size: 0.95rem;
  }
  
  .modal-content {
    width: 98%;
    margin: 0.5rem;
    padding: 1.25rem;
  }
  
  .modal-title {
    font-size: 1.125rem;
  }
  
  .form-input,
  .form-select {
    padding: 0.625rem 0.875rem;
    font-size: 0.95rem;
  }
  
  .btn-cancel,
  .btn-submit {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
  }
}

/* Landscape orientation for mobile */
@media (max-width: 767px) and (orientation: landscape) {
  .wallet-main {
    padding: 0.5rem;
  }
  
  .wallet-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  .wallet-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .quick-actions {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .quick-action {
    max-width: 150px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
  
  .wallet-cards {
    flex-direction: row;
    gap: 0.75rem;
  }
  
  .wallet-card {
    padding: 1.25rem 0.75rem;
  }
  
  .wallet-card-label {
    font-size: 0.85rem;
  }
  
  .wallet-card-value {
    font-size: 1.25rem;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .wallet-card {
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  
  .quick-action {
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .quick-action,
  .add-balance,
  .btn-cancel,
  .btn-submit,
  .modal-close {
    transition: none;
  }
}
</style>
