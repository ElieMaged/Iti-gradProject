<template>
  <div class="main-content layout-container">
    <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
        />
    <div class="payment-content p-4 mx-12">
      <div class="page-header">
        <h1 class="page-title">{{ $t('payment') }}</h1>
        <button class="refresh-btn" @click="refreshData" :disabled="loading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
      <div class="payment-balance-card">

        <div class="balance-labels">
          <span class="current-balance-label">{{ $t('currentBalance') }}</span>
        </div>
        <div class="balance-amounts">
          <span class="current-balance-amount">{{ currentBalance }} EGP</span>
        </div>
        
        <!-- Credit Breakdown -->
        <div class="credit-breakdown" v-if="creditBreakdown">
          <div class="breakdown-title">Credit Sources</div>
          <div class="breakdown-items">
            <div class="breakdown-item" v-if="creditBreakdown.bookingCredits > 0">
              <span class="breakdown-label">Booking Payments (75% of total):</span>
              <span class="breakdown-amount">+{{ creditBreakdown.bookingCredits }} EGP</span>
            </div>
            <div class="breakdown-item" v-if="creditBreakdown.adminTransfers > 0">
              <span class="breakdown-label">Admin Transfers:</span>
              <span class="breakdown-amount">+{{ creditBreakdown.adminTransfers }} EGP</span>
            </div>
          </div>
        </div>
        
        <!-- Payment Split Information -->
        <div class="payment-split-info">
          <div class="split-title">Payment Split Information</div>
          <div class="split-description">
            When customers book your services, the payment is automatically split:
          </div>
          <div class="split-breakdown">
            <div class="split-item">
              <span class="split-label">Platform Fee (25%):</span>
              <span class="split-amount admin-amount">25% of booking amount</span>
            </div>
            <div class="split-item">
              <span class="split-label">Your Payment (75%):</span>
              <span class="split-amount technician-amount">75% of booking amount</span>
            </div>
          </div>
          <div class="split-note">
            Your 75% share is automatically added to your balance when a booking is confirmed.
          </div>
        </div>
             </div>
      
      <!-- Recent Transactions -->
      <div class="transactions-section" v-if="recentTransactions.length > 0">
        <h3 class="transactions-title">{{ $t('recentTransactions') || 'Recent Transactions' }}</h3>
        <div class="transactions-list">
          <div v-for="transaction in recentTransactions" :key="transaction.id" class="transaction-item">
            <div class="transaction-info">
              <div class="transaction-type">
                {{ getTransactionTypeLabel(transaction.type) }}
              </div>
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
import Sidebar from '../../components/Sidebar.vue';
import TopBar from '../../components/TopBar.vue';
import { ref, onMounted, computed } from 'vue';
import { collection, query, where, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore'; 
import { db, auth } from '../../firebase';

export default {
  components: {
    Sidebar,
    TopBar
  },
     data() {
     return {
       activeMenu: 'payment',
       currentBalance: 0,
       technicianEmail: '',
       recentTransactions: [],
       loading: true,
       creditBreakdown: null
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
        
        // Fetch approved credits (current balance) - including admin transfers
        const approvedCreditsQuery = query(
          collection(db, 'technicianCredits'),
          where('technicianId', '==', technicianId),
          where('status', '==', 'approved')
        );
        
        // Realtime approved credits
        const approvedCredits = []
        const unsubApproved = onSnapshot(approvedCreditsQuery, (snapshot) => {
          approvedCredits.length = 0
          snapshot.forEach(d => approvedCredits.push({ id: d.id, ...d.data() }))
          recompute()
        })
        
        // Pending credits removed from UI and calculations as requested
        
        // Also fetch admin payouts to ensure they're included
        const adminPayoutsQuery = query(
          collection(db, 'adminPayouts'),
          where('technicianId', '==', technicianId),
          where('status', '==', 'completed')
        );
        
        // Realtime admin payouts
        const adminPayouts = []
        const unsubPayouts = onSnapshot(adminPayoutsQuery, (snapshot) => {
          adminPayouts.length = 0
          snapshot.forEach(d => adminPayouts.push({ id: d.id, ...d.data() }))
          recompute()
        })
        
        const recompute = () => {
          // If both sources are temporarily empty (e.g., during a realtime refresh),
          // keep the last known balance to avoid flickering back to zero.
          if (approvedCredits.length === 0 && adminPayouts.length === 0) {
            return;
          }
          // Calculate balances - include admin transfers
          const totalCurrentBalance = approvedCredits.reduce((sum, credit) => {
            const amount = parseFloat(credit.amount || credit.credits || 0);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);
          const adminTransfersTotal = adminPayouts.reduce((sum, payout) => {
            const amount = parseFloat(payout.amount || 0);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);
          this.currentBalance = totalCurrentBalance + adminTransfersTotal;
          this.creditBreakdown = {
            bookingCredits: totalCurrentBalance,
            adminTransfers: adminTransfersTotal
          };
          const allTransactions = [
            ...approvedCredits,
            ...adminPayouts.map(payout => ({
              id: payout.id,
              type: 'admin_transfer',
              amount: payout.amount,
              description: `Admin Transfer: ${payout.reason || 'Credit Transfer'}`,
              createdAt: payout.createdAt,
              status: 'approved'
            }))
          ];
          this.recentTransactions = allTransactions
            .sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
              return dateB - dateA;
            })
            .slice(0, 10);

          // Helpful debug log (kept inside recompute to avoid scope issues)
          console.log('Technician credits recomputed:', {
            bookingCredits: totalCurrentBalance,
            adminTransfers: adminTransfersTotal,
            currentBalance: this.currentBalance,
            transactions: this.recentTransactions.length
          });
        }
        
        console.log('Technician credits listeners attached.');
        
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
    
    getTransactionTypeLabel(type) {
      switch (type) {
        case 'booking_payment':
          return 'Booking Payment';
        case 'admin_transfer':
          return 'Admin Transfer';
        case 'credit_addition':
          return 'Credit Addition';
        case 'payout_sent':
          return 'Payout Sent';
        default:
          return type || 'Transaction';
      }
         },
    
    async refreshData() {
      await this.fetchTechnicianCredits();
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
  min-height: 100vh;
  margin-left: 14rem;
  background-color: #faf8fd;
}
.layout-container{
  background-color: #faf8fd;
}
.dark .layout-container{
  background-color: var(--primary-bg);
}
.dark .main-content {
  background-color: var(--primary-bg);
}
.payment-content {
  flex: 1;
  width: auto;
}
.payment-page {
  background: #f5f5f7;
  min-height: 100vh;
  padding: 32px 0 0 0;
}
.dark .payment-page {
  background: var(--primary-bg);
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  font-family: Outfit, sans-serif;
  margin: 0;
}

.refresh-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--primary-color-dark, #4a3f8c);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn i {
  font-size: 1rem;
}

.dark .page-title {
  color: var(--primary-color);
}

/* Credit Breakdown Styles */
.credit-breakdown {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.dark .credit-breakdown {
  border-top-color: #444;
}

.breakdown-title {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 1rem;
}

.dark .breakdown-title {
  color: #ccc;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.breakdown-label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.dark .breakdown-label {
  color: #bbb;
}

.breakdown-amount {
  font-size: 0.9rem;
  font-weight: 600;
  color: #28a745;
}

 .dark .breakdown-amount {
   color: #4ade80;
 }

 /* Payment Split Information Styles */
 .payment-split-info {
   margin-top: 1.5rem;
   padding-top: 1.5rem;
   border-top: 1px solid #e0e0e0;
 }

 .dark .payment-split-info {
   border-top-color: #444;
 }

 .split-title {
   font-size: 1rem;
   font-weight: 600;
   color: #666;
   margin-bottom: 0.75rem;
 }

 .dark .split-title {
   color: #ccc;
 }

 .split-description {
   font-size: 0.9rem;
   color: #555;
   margin-bottom: 1rem;
   line-height: 1.4;
 }

 .dark .split-description {
   color: #bbb;
 }

 .split-breakdown {
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
   margin-bottom: 1rem;
 }

 .split-item {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0.5rem 0;
 }

 .split-label {
   font-size: 0.9rem;
   color: #555;
   font-weight: 500;
 }

 .dark .split-label {
   color: #bbb;
 }

 .split-amount {
   font-size: 0.9rem;
   font-weight: 600;
 }

 .admin-amount {
   color: #dc2626;
 }

 .dark .admin-amount {
   color: #ef4444;
 }

 .technician-amount {
   color: #059669;
 }

 .dark .technician-amount {
   color: #10b981;
 }

 .split-note {
   font-size: 0.8rem;
   color: #666;
   font-style: italic;
   line-height: 1.4;
 }

 .dark .split-note {
   color: #999;
 }

.payment-balance-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 40px 24px 40px;
  margin-bottom: 20px;
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


@media (max-width: 1024px) {
  .payment-content {
    padding: 1.5rem 0 0 0;
  }

  
     .payment-balance-card {
     padding: 1.5rem;
     margin: 0 0 1.5rem 0;
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
  
     .payment-balance-card {
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
  
  .page-header {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    margin-top: 2rem;
  }
  
  .refresh-btn {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .payment-title {
    margin-left: 0;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    text-align: left;
  }
  
     .payment-balance-card {
     padding: 12px 6px 10px 6px;
     border-radius: 12px;
   }
  
  .credit-breakdown {
    margin-top: 1rem;
    padding-top: 1rem;
  }
  
  .breakdown-title {
    font-size: 0.9rem;
  }
  
  .breakdown-item {
    padding: 0.4rem 0;
  }
  
  .breakdown-label,
  .breakdown-amount {
    font-size: 0.8rem;
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
  
  .page-header {
    gap: 0.75rem;
  }
  
  .refresh-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .payment-title {
    font-size: 1rem;
    margin-left: 0;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
     .payment-balance-card {
     padding: 8px 2px 6px 2px;
     border-radius: 10px;
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
  .main-content{
    margin-left: 0 !important;
  }
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
  
     .payment-balance-card {
     padding: 6px 1px 4px 1px;
     border-radius: 8px;
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
  
    
}

@media (max-width: 360px) {
  .layout-container{
    flex-direction: row;

  }
  .payment-content {
    padding: 0.25rem 0 0 0;
  }
  
  .payment-title {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
  
     .payment-balance-card {
     padding: 4px 0.5px 2px 0.5px;
     border-radius: 6px;
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
  
    
}
 .payment-balance-card {
   transition: box-shadow 0.2s, border 0.2s;
   border: 1.5px solid #ececec;
 }
 .payment-balance-card:hover {
   box-shadow: 0 4px 16px rgba(98,83,151,0.10);
   border: 1.5px solid #948AB8;
 }
</style> 