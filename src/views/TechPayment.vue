<template>
  <div class="main-content layout-container">
    <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
        />
        <div class="container">
    <div class="payment-content p-4 mr-20">
      <h1 class="page-title lg:ml-15">{{ $t('payment') }}</h1>  
      <div class="payment-balance-card">

        <div class="balance-labels">
          <span class="current-balance-label">{{ $t('currentBalance') }}</span>
          <span class="pending-label">{{ $t('pending') }}</span>
        </div>
        <div class="balance-amounts">
          <span class="current-balance-amount">{{ currentBalance }} EGP</span>
          <span class="pending-amount">{{ pendingBalance }} EGP</span>
        </div>
      </div>

      <div class="withdraw-card">
        <div class="withdraw-title">{{ $t('withdrawFunds') }}</div>
        <form class="withdraw-form">
                     <div class="withdraw-fields">
             <div class="withdraw-field">
               <label>{{ $t('amount') }}</label>
               <input type="number" :placeholder="$t('enterAmount')" v-model="withdrawAmount" />
             </div>
                           <div class="withdraw-field">
                <label>{{ $t('bankName') }}</label>
                <input type="text" :placeholder="$t('enterBankName')" v-model="bankName" />
              </div>
              <div class="withdraw-field">
                <label>{{ $t('accountNumber') }}</label>
                <input type="text" :placeholder="$t('enterAccountNumber')" v-model="accountNumber" />
              </div>
           </div>
          <button class="withdraw-btn" type="submit" @click.prevent="handleWithdraw">{{ $t('withdraw') }}</button>
        </form>
      </div>
    </div>
      <!-- Recent Transactions -->
      <div class="transactions-section" v-if="recentTransactions.length > 0">
        <h3 class="transactions-title">{{ $t('recentTransactions') || 'Recent Transactions' }}</h3>
        <div class="transactions-list">
          <div v-for="transaction in recentTransactions" :key="transaction.id" class="transaction-item">
            <div class="transaction-info">
              <div class="transaction-type">{{ transaction.type === 'booking_payment' ? 'Booking Payment' : transaction.type }}</div>
              <div class="transaction-description">{{ transaction.description }}</div>
              <div class="transaction-date">{{ formatDate(transaction.createdAt) }}</div>
            </div>
            <div class="transaction-amount">
              <span class="amount-positive">+{{ transaction.amount }} EGP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import { ref, onMounted, computed } from 'vue';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      activeMenu: 'payment',
      currentBalance: 0,
      pendingBalance: 0,
      technicianEmail: '',
      withdrawAmount: '',
      bankName: '',
      accountNumber: '',
      recentTransactions: [],
      loading: true
    }
  },
  methods: {
    handleSidebarNavigate(path) {
      this.$router.push(path);
    },
    
    async fetchTechnicianCredits() {
      try {
        this.loading = true;
        
        if (!auth.currentUser) {
          console.error('No authenticated user');
          return;
        }
        
        const technicianId = auth.currentUser.uid;
        console.log('Fetching credits for technician:', technicianId);
        
        // Fetch approved credits (current balance)
        const approvedCreditsQuery = query(
          collection(db, 'technicianCredits'),
          where('technicianId', '==', technicianId),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        );
        
        const approvedSnapshot = await getDocs(approvedCreditsQuery);
        const approvedCredits = approvedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch pending credits
        const pendingCreditsQuery = query(
          collection(db, 'technicianCredits'),
          where('technicianId', '==', technicianId),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        
        const pendingSnapshot = await getDocs(pendingCreditsQuery);
        const pendingCredits = pendingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Calculate balances
        this.currentBalance = approvedCredits.reduce((sum, credit) => sum + parseFloat(credit.amount || credit.credits || 0), 0);
        this.pendingBalance = pendingCredits.reduce((sum, credit) => sum + parseFloat(credit.amount || credit.credits || 0), 0);
        
        // Get recent transactions (last 10)
        this.recentTransactions = approvedCredits.slice(0, 10);
        
        console.log('Technician credits fetched:', {
          currentBalance: this.currentBalance,
          pendingBalance: this.pendingBalance,
          recentTransactions: this.recentTransactions.length
        });
        
      } catch (error) {
        console.error('Error fetching technician credits:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchTechnicianProfile() {
      try {
        if (!auth.currentUser) return;
        
        const technicianId = auth.currentUser.uid;
        
        // Try to get technician data from technicians collection
        const technicianQuery = query(
          collection(db, 'technicians'),
          where('uid', '==', technicianId)
        );
        
        const technicianSnapshot = await getDocs(technicianQuery);
        if (!technicianSnapshot.empty) {
          const technicianData = technicianSnapshot.docs[0].data();
          this.technicianEmail = technicianData.paypalEmail || technicianData.email || '';
        }
        
      } catch (error) {
        console.error('Error fetching technician profile:', error);
      }
    },
    
    formatDate(timestamp) {
      if (!timestamp) return '';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    async handleWithdraw() {
      if (!this.withdrawAmount || !this.bankName || !this.accountNumber) {
        alert('Please enter amount, bank name, and account number');
        return;
      }
      
      const amount = parseFloat(this.withdrawAmount);
      if (amount > this.currentBalance) {
        alert('Withdrawal amount cannot exceed current balance');
        return;
      }
      
      if (amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      // Here you would implement the withdrawal logic
      console.log('Processing withdrawal:', {
        amount: amount,
        bankName: this.bankName,
        accountNumber: this.accountNumber,
        currentBalance: this.currentBalance
      });
      
      alert('Withdrawal request submitted successfully');
      this.withdrawAmount = '';
      this.bankName = '';
      this.accountNumber = '';
    }
  },
  
  async mounted() {
    await this.fetchTechnicianCredits();
    await this.fetchTechnicianProfile();
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  min-height: 100vh;
}

.payment-content {
  flex: 1;
  padding: 32px 0 0 0;
}
.payment-page {
  background: #f5f5f7;
  min-height: 100vh;
  padding: 32px 0 0 0;
}
.dark .payment-page {
  background: var(--primary-bg);
}
.page-title {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  font-family: Outfit, sans-serif;
}

.dark .page-title {
  color: var(--primary-color);
}
.payment-balance-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 40px 24px 40px;
  margin: 0 0 32px 48px;
  max-width: 900px;
}
.dark .payment-balance-card {
  background: var(--secondary-bg);
  color: var(--primary-text) !important;
}
.balance-labels {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.dark .balance-labels {
  color: var(--primary-text) !important;
}
.current-balance-label {
  color: #625397;
  font-size: 2rem;
  font-weight: bold;
  padding-right: 20px;
}
.dark .current-balance-label {
  color: var(--primary-text) !important;
}
.pending-label {
  color: #222;
  font-size: 2rem;
  font-weight: bold;
  padding-right: 20px;
}
.dark .pending-label {
  color: var(--primary-text) !important;
}
.balance-amounts {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.dark .balance-amounts {
  color: var(--primary-text) !important;
}
.current-balance-amount {
  font-size: 2rem;
  font-weight: bold;
}
.dark .current-balance-amount {
  color: var(--primary-text) !important;
}
.pending-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: grey;
  align-self: center;
  padding-right: 20px;
}
.dark .pending-amount {
  color: var(--primary-text) !important;
}

.withdraw-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 28px 40px 24px 40px;
  margin: 0 0 32px 48px;
  max-width: 900px;
}
.dark .withdraw-card {
  background: var(--secondary-bg);
  color: var(--primary-text) !important;
}
.withdraw-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
}
.dark .withdraw-title {
  color: var(--primary-text) !important;
}
.withdraw-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.dark .withdraw-form {
  color: var(--primary-text) !important;
}
.withdraw-fields {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 18px;
  margin-bottom: 10px;
}
.dark .withdraw-fields {
  color: var(--primary-text) !important;
}
.withdraw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.dark .withdraw-field {
  color: var(--primary-text) !important;
}
.withdraw-field label {
  font-size: 1rem;
  color: #222;
  font-weight: 500;
}
.dark .withdraw-field label {
  color: var(--primary-text) !important;
}
.withdraw-field input {
  border: none;
  background: #ececec;
  border-radius: 25px;
  padding: 10px 18px;
  font-size: 1rem;
  color: #222;
  outline: none;
}
.dark .withdraw-field input {
  color: var(--primary-text) !important;
}
.withdraw-btn {
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 38px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s;
}
.dark .withdraw-btn {
  background: var(--primary-color) !important;
}
.withdraw-btn:hover {
  background: var(--primary-color);
  opacity: 0.9;
}
.dark .withdraw-btn:hover {
  background: var(--primary-color) !important;
  opacity: 0.9;
}


@media (max-width: 1024px) {
  .payment-content {
    padding: 1.5rem 0 0 0;
  }

  
  .payment-balance-card,
  .withdraw-card {
    padding: 1.5rem;
    margin: 0 0 1.5rem 0;
  }
  
  .withdraw-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100% !important;
    max-height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem 0 !important;
    margin-bottom: 1rem;
  }
  
  .payment-content {
    padding: 16px 0 0 0;
  }
  
  .payment-balance-card,
  .withdraw-card {
    margin: 0 0 24px 0;
    max-width: 100%;
    padding: 24px 16px 18px 16px;
  }
  
  .payment-title {
    margin-left: 0;
    text-align: center;
  }
  
  .balance-labels {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .balance-amounts {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .payment-content {
    padding: 1rem 0 0 0;
  }
  
  .payment-title {
    margin-left: 0;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    text-align: left;
  }
  
  .payment-balance-card,
  .withdraw-card {
    padding: 12px 6px 10px 6px;
    border-radius: 12px;
  }
  
  .withdraw-btn {
    padding: 8px 18px;
    font-size: 1rem;
    width: 100%;
  }
  

  
  .current-balance-label,
  .pending-label {
    font-size: 1.1rem;
    padding-right: 8px;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 1.1rem;
    padding-right: 8px;
  }
  

}

@media (max-width: 600px) {
  .payment-content {
    padding: 8px 0 0 0;
  }
  
  .payment-title {
    font-size: 1rem;
    margin-left: 0;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .payment-balance-card,
  .withdraw-card {
    padding: 8px 2px 6px 2px;
    border-radius: 10px;
  }
  
  .withdraw-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  

  
  .current-balance-label,
  .pending-label {
    font-size: 1rem;
    padding-right: 4px;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 1rem;
    padding-right: 4px;
  }
}

/* Transactions Section Styles */
.transactions-section {
  margin-top: 2rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 40px 24px 40px;
  margin: 32px 0 32px 48px;
  max-width: 900px;
}

.dark .transactions-section {
  background: var(--secondary-bg);
  color: var(--primary-text) !important;
}

.transactions-title {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-family: Outfit, sans-serif;
}

.dark .transactions-title {
  color: var(--primary-color);
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.dark .transaction-item {
  background: var(--primary-bg);
  border-color: var(--border-color);
}

.transaction-item:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dark .transaction-item:hover {
  background: var(--secondary-bg);
}

.transaction-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.transaction-type {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.dark .transaction-type {
  color: var(--primary-text);
}

.transaction-description {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}

.dark .transaction-description {
  color: var(--secondary-text);
}

.transaction-date {
  color: #9ca3af;
  font-size: 0.8rem;
}

.dark .transaction-date {
  color: var(--tertiary-text);
}

.transaction-amount {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.amount-positive {
  color: #059669;
  font-weight: 600;
  font-size: 1.1rem;
}

.dark .amount-positive {
  color: #10b981;
}

.amount-negative {
  color: #dc2626;
  font-weight: 600;
  font-size: 1.1rem;
}

.dark .amount-negative {
  color: #ef4444;
}

/* Responsive styles for transactions */
@media (max-width: 1024px) {
  .transactions-section {
    margin: 24px 0 24px 0;
    max-width: 100%;
    padding: 24px 16px 18px 16px;
  }
}

@media (max-width: 768px) {
  .transactions-section {
    margin: 16px 0 16px 0;
    padding: 16px 12px 12px 12px;
  }
  
  .transactions-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  
  .transaction-item {
    padding: 0.75rem;
  }
  
  .transaction-type {
    font-size: 0.95rem;
  }
  
  .transaction-description {
    font-size: 0.85rem;
  }
  
  .amount-positive,
  .amount-negative {
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .transactions-section {
    margin: 12px 0 12px 0;
    padding: 12px 8px 8px 8px;
  }
  
  .transactions-title {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .transaction-item {
    padding: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .transaction-amount {
    align-self: flex-end;
  }
  
  .transaction-type {
    font-size: 0.9rem;
  }
  
  .transaction-description {
    font-size: 0.8rem;
  }
  
  .amount-positive,
  .amount-negative {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .payment-content {
    padding: 0.5rem 0 0 0;
  }
  
  .payment-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .payment-balance-card,
  .withdraw-card {
    padding: 6px 1px 4px 1px;
    border-radius: 8px;
  }
  
  .withdraw-btn {
    padding: 4px 8px;
    font-size: 0.85rem;
  }
  

  
  .current-balance-label,
  .pending-label {
    font-size: 0.9rem;
    padding-right: 2px;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 0.9rem;
    padding-right: 2px;
  }
  
    .withdraw-title {
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .payment-content {
    padding: 0.25rem 0 0 0;
  }
  
  .payment-title {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
  
  .payment-balance-card,
  .withdraw-card {
    padding: 4px 0.5px 2px 0.5px;
    border-radius: 6px;
  }
  
  .withdraw-btn {
    padding: 3px 6px;
    font-size: 0.8rem;
  }
  

  
  .current-balance-label,
  .pending-label {
    font-size: 0.8rem;
    padding-right: 1px;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 0.8rem;
    padding-right: 1px;
  }
  
    .withdraw-title {
    font-size: 0.9rem;
  }
}
.payment-balance-card,
.withdraw-card {
  transition: box-shadow 0.2s, border 0.2s;
  border: 1.5px solid #ececec;
}
.payment-balance-card:hover,
.withdraw-card:hover {
  box-shadow: 0 4px 16px rgba(98,83,151,0.10);
  border: 1.5px solid #948AB8;
}
.payment-balance-card:not(:last-child),
.withdraw-card:not(:last-child) {
  border-bottom: 1px solid #ececec;
}
.withdraw-field input:focus {
  border: 1.5px solid #948AB8;
  background: #f5f5fa;
}
.withdraw-btn:focus {
  outline: 2px solid #948AB8;
}
</style> 