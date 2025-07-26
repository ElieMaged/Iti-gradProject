<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="dashboard-main">
      <div class="dashboard-container">
        <h2 class="dashboard-title">Payment Management</h2>
        
        <!-- Payment Summary Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-wallet stat-icon"></i>
              <span class="stat-number">{{ totalAmount }} EGP</span>
            </div>
            <div class="stat-title">Total Revenue</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-clock stat-icon"></i>
              <span class="stat-number">{{ pendingTransactions.length }}</span>
            </div>
            <div class="stat-title">Pending Transactions</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-check-circle stat-icon"></i>
              <span class="stat-number">{{ approvedTransactions.length }}</span>
            </div>
            <div class="stat-title">Approved Transactions</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-times-circle stat-icon"></i>
              <span class="stat-number">{{ rejectedTransactions.length }}</span>
            </div>
            <div class="stat-title">Rejected Transactions</div>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="transactions-table">
          <div class="table-header">
            <h3>Payment Transactions</h3>
            <div class="filter-buttons">
              <button class="filter-btn" @click="filterByStatus('all')" :class="{ active: currentFilter === 'all' }">All</button>
              <button class="filter-btn" @click="filterByStatus('pending')" :class="{ active: currentFilter === 'pending' }">Pending</button>
              <button class="filter-btn" @click="filterByStatus('approved')" :class="{ active: currentFilter === 'approved' }">Approved</button>
              <button class="filter-btn" @click="filterByStatus('rejected')" :class="{ active: currentFilter === 'rejected' }">Rejected</button>
            </div>
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Technician</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>PayPal Order ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                  <td>{{ formatDate(transaction.paymentDate) }}</td>
                  <td>{{ transaction.technicianName }}</td>
                  <td>{{ transaction.userName }}</td>
                  <td>{{ transaction.amount }} {{ transaction.currency }}</td>
                  <td class="order-id">{{ transaction.paypalOrderId }}</td>
                  <td>
                    <span class="status-badge" :class="getStatusBadgeClass(transaction.status)">
                      {{ transaction.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons" v-if="transaction.status === 'pending'">
                      <button class="approve-btn" @click="approveTransaction(transaction.id)">
                        <i class="fas fa-check"></i> Approve
                      </button>
                      <button class="reject-btn" @click="rejectTransaction(transaction.id)">
                        <i class="fas fa-times"></i> Reject
                      </button>
                    </div>
                    <div v-else class="action-info">
                      {{ transaction.adminAction }} by {{ transaction.adminActionBy }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import AdminSidebar from '../../components/admin-sidebar.vue'

const transactions = ref([])
const currentFilter = ref('all')
const loading = ref(true)

// Computed properties
const filteredTransactions = computed(() => {
  if (currentFilter.value === 'all') {
    return transactions.value
  }
  return transactions.value.filter(t => t.status === currentFilter.value)
})

const pendingTransactions = computed(() => 
  transactions.value.filter(t => t.status === 'pending')
)

const approvedTransactions = computed(() => 
  transactions.value.filter(t => t.status === 'approved')
)

const rejectedTransactions = computed(() => 
  transactions.value.filter(t => t.status === 'rejected')
)

const totalAmount = computed(() => {
  return approvedTransactions.value
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    .toFixed(2)
})

// Methods
async function fetchTransactions() {
  try {
    loading.value = true
    const q = query(collection(db, 'paymentTransactions'), orderBy('paymentDate', 'desc'))
    const snapshot = await getDocs(q)
    transactions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching transactions:', error)
  } finally {
    loading.value = false
  }
}

async function approveTransaction(transactionId) {
  try {
    const transactionRef = doc(db, 'paymentTransactions', transactionId)
    await updateDoc(transactionRef, {
      status: 'approved',
      adminAction: 'approved',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin'
    })
    
    // Update the local state
    const transaction = transactions.value.find(t => t.id === transactionId)
    if (transaction) {
      transaction.status = 'approved'
      transaction.adminAction = 'approved'
      transaction.adminActionDate = new Date()
      transaction.adminActionBy = auth.currentUser?.email || 'Admin'
    }
  } catch (error) {
    console.error('Error approving transaction:', error)
  }
}

async function rejectTransaction(transactionId) {
  try {
    const transactionRef = doc(db, 'paymentTransactions', transactionId)
    await updateDoc(transactionRef, {
      status: 'rejected',
      adminAction: 'rejected',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin'
    })
    
    // Update the local state
    const transaction = transactions.value.find(t => t.id === transactionId)
    if (transaction) {
      transaction.status = 'rejected'
      transaction.adminAction = 'rejected'
      transaction.adminActionDate = new Date()
      transaction.adminActionBy = auth.currentUser?.email || 'Admin'
    }
  } catch (error) {
    console.error('Error rejecting transaction:', error)
  }
}

function filterByStatus(status) {
  currentFilter.value = status
}

function getStatusBadgeClass(status) {
  return {
    'badge-pending': status === 'pending',
    'badge-approved': status === 'approved',
    'badge-rejected': status === 'rejected'
  }
}

function formatDate(date) {
  if (!date) return '-'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #f9fafb;
}

.dashboard-main {
  flex: 1;
  padding: 2.5rem;
}

.dashboard-container {
  max-width: 80rem;
  margin: 0 auto;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.stat-icon {
  font-size: 1.5rem;
  color: #7c6bb0;
  margin-right: 0.5rem;
}

.stat-number {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-title {
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
}

.transactions-table {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #7c6bb0;
  color: white;
  border-color: #7c6bb0;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-pending {
  background: #fef3c7;
  color: #92400e;
}

.badge-approved {
  background: #d1fae5;
  color: #065f46;
}

.badge-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.approve-btn, .reject-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.approve-btn {
  background: #22c55e;
  color: white;
}

.approve-btn:hover {
  background: #16a34a;
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover {
  background: #dc2626;
}

.action-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-id {
  font-family: monospace;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
