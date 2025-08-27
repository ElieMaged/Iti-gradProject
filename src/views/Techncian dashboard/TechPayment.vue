<template>
  <div class="main-content layout-container">
    <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
        />
    <div class="payment-content p-4">
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
       pendingBalance: 0,
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
          this.loading = false;
          return;
        }
        
        const technicianId = auth.currentUser.uid;
        console.log('Fetching completed bookings for technician:', technicianId);
        
        // Clear existing transactions
        this.recentTransactions = [];
        
        // Fetch only completed bookings
        const completedBookingsQuery = query(
          collection(db, 'bookings'),
          where('technicianId', '==', technicianId),
          where('status', '==', 'complete')
        );
        
        // Realtime completed bookings
        this.completedBookings = [];
        const unsubBookings = onSnapshot(completedBookingsQuery, (snapshot) => {
          this.completedBookings = [];
          const newTransactions = [];
          let totalEarnings = 0;
          
          snapshot.forEach(doc => {
            const booking = { id: doc.id, ...doc.data() };
            this.completedBookings.push(booking);
            
            // Calculate 75% of each completed booking
            const amount = parseFloat(booking.price) || 0;
            const earnings = amount * 0.75;
            totalEarnings += earnings;
            
            // Add to transactions
            newTransactions.push({
              id: booking.id,
              type: 'completed_booking',
              amount: earnings.toFixed(2),
              description: `Completed Booking: ${booking.serviceType || 'Service'}`,
              createdAt: booking.completedAt || booking.createdAt,
              status: 'completed'
            });
          });
          
          // Update transactions with sorted list
          this.recentTransactions = newTransactions
            .sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
              return dateB - dateA;
            })
            .slice(0, 10);
          
          // Update the current balance with the total earnings from completed bookings
          this.currentBalance = totalEarnings;
          this.creditBreakdown = {
            completedBookings: totalEarnings
          };
          
          this.loading = false;
        }, (error) => {
          console.error('Error fetching bookings:', error);
          this.loading = false;
        });
        
        // Cleanup function
        return () => {
          if (unsubBookings) {
            unsubBookings();
          }
        };
      } catch (error) {
        console.error('Error in fetchTechnicianCredits:', error);
        this.loading = false;
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
      const labels = {
        'booking': 'Booking Payment',
        'admin_transfer': 'Admin Transfer',
        'withdrawal': 'Withdrawal',
        'completed_booking': 'Completed Booking'
      };
      return labels[type] || type;
    },
    
    refreshData() {
      this.fetchTechnicianCredits();
    }
  },
  
  mounted() {
    this.fetchTechnicianCredits();
  }
}
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  margin-left: 14rem;
  background-color: #faf8fd;
}

.layout-container {
  background-color: #faf8fd;
}

.dark .layout-container {
  background-color: var(--primary-bg);
}

.dark .main-content {
  background-color: var(--primary-bg);
}

.payment-content {
  flex: 1;
  width: auto;
  margin: 0 38.5px;
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
  .main-content {
    margin-left: 0 !important;
    padding-bottom: 60px; /* Space for bottom navigation */
  }
  
  .payment-content {
    padding: 0.75rem;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
  }
  
  .page-header {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .refresh-btn {
    width: 100%;
    max-width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
  }
  
  .transactions-section {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .transactions-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
  
  .transaction-item {
    padding: 0.875rem;
    margin-bottom: 0.75rem;
    border-radius: 6px;
    background: #f8f9fa;
  }
  
  .transaction-type {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .transaction-description {
    font-size: 0.85rem;
    color: #6c757d;
    margin: 0.25rem 0;
  }
  
  .transaction-date {
    font-size: 0.75rem;
    color: #adb5bd;
  }
  
  .amount-positive {
    color: #28a745;
    font-weight: 600;
  }
  
  .amount-negative {
    color: #dc3545;
    font-weight: 600;
  }
  
  /* Balance card styles */
  .payment-balance-card {
    padding: 1rem;
    margin-bottom: 1.25rem;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .balance-labels,
  .balance-amounts {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .current-balance-label,
  .pending-label {
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  /* Credit breakdown and payment info */
  .credit-breakdown,
  .payment-split-info {
    padding: 0.875rem;
    margin: 1rem 0;
    border-radius: 8px;
    background: #f8f9fa;
  }
  
  .breakdown-title,
  .split-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-color);
  }
  
  .breakdown-item,
  .split-item {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0;
    font-size: 0.875rem;
  }
  
  .breakdown-label,
  .split-label {
    color: #6c757d;
  }
  
  .breakdown-amount,
  .split-amount {
    font-weight: 500;
  }
  
  .technician-amount {
    color: #28a745;
  }
  
  .admin-amount {
    color: #dc3545;
  }

@media (max-width: 600px) {
  .page-title {
    font-size: 1.35rem;
  }
  
  .payment-balance-card {
    padding: 0.875rem;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 1.1rem;
  }
  
  .transaction-item {
    padding: 0.75rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .transaction-info {
    flex: 1;
    min-width: 0;
  }
  
  .transaction-amount {
    margin-left: 0.75rem;
    text-align: right;
  }
  
  .transaction-type {
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .transaction-description {
    font-size: 0.8rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .credit-breakdown,
  .payment-split-info {
    padding: 0.75rem;
  }
  
  .breakdown-item,
  .split-item {
    font-size: 0.825rem;
    padding: 0.35rem 0;
  }

@media (max-width: 480px) {
  .payment-content {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .payment-balance-card {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .current-balance-label,
  .pending-label {
    font-size: 0.85rem;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 1.1rem;
  }
  
  .transaction-item {
    padding: 0.625rem;
  }
  
  .transaction-type {
    font-size: 0.85rem;
  }
  
  .transaction-description {
    font-size: 0.775rem;
  }
  
  .transaction-date {
    font-size: 0.7rem;
  }
  
  .credit-breakdown,
  .payment-split-info {
    padding: 0.625rem;
  }
  
  .breakdown-item,
  .split-item {
    font-size: 0.8rem;
    padding: 0.3rem 0;
  }

@media (max-width: 360px) {
  .payment-content {
    padding: 0.4rem;
  }
  
  .page-title {
    font-size: 1.15rem;
  }
  
  .payment-balance-card {
    padding: 0.625rem;
    border-radius: 8px;
  }
  
  .current-balance-label,
  .pending-label {
    font-size: 0.8rem;
  }
  
  .current-balance-amount,
  .pending-amount {
    font-size: 1rem;
  }
  
  .transaction-item {
    padding: 0.5rem;
  }
  
  .transaction-type {
    font-size: 0.8rem;
  }
  
  .transaction-description {
    font-size: 0.75rem;
  }
  
  .credit-breakdown,
  .payment-split-info {
    padding: 0.5rem;
  }
  
  .breakdown-item,
  .split-item {
    font-size: 0.775rem;
  }
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
}
}
}
</style> 