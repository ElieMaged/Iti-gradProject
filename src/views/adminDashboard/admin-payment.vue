<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="dashboard-main">
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h2 class="dashboard-title">Payment Management</h2>
          <div class="dashboard-actions">
            <NotificationBell />
          </div>
        </div>
        
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
              <i class="fas fa-coins stat-icon"></i>
              <span class="stat-number">{{ totalApprovedCredits }} EGP</span>
            </div>
            <div class="stat-title">Total Approved Credits</div>
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

        <!-- PayPal Payout Section -->
        <div class="payout-section">
          <div class="section-header">
            <h3>PayPal Payout to Technician</h3>
            <div class="available-credits">
              <i class="fas fa-coins"></i>
              <span>Available Credits: {{ totalApprovedCredits }} EGP</span>
            </div>
          </div>
          
          <div class="payout-form">
            <div class="form-row">
              <div class="form-group">
                <label for="technicianSelect">Select Technician</label>
                <select id="technicianSelect" v-model="selectedTechnician" @change="onTechnicianChange">
                  <option value="">{{ loading ? 'Loading technicians...' : 'Choose a technician...' }}</option>
                  <option v-if="!loading && technicians.length === 0" value="" disabled>No technicians found</option>
                  <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                    {{ tech.fullName || tech.name || 'Unknown Technician' }} ({{ tech.email || 'No email' }})
                  </option>
                </select>
                <div v-if="!loading && technicians.length === 0" class="error-message">
                  No technicians found in the database. Please check if technicians have been added.
                </div>
                <div v-if="!loading && technicians.length > 0" class="success-message">
                  Found {{ technicians.length }} technician(s) in the database.
                </div>
              </div>
              
              <div class="form-group">
                <label for="payoutAmount">Amount (EGP)</label>
                <input 
                  id="payoutAmount" 
                  type="number" 
                  v-model="payoutAmount" 
                  min="1" 
                  step="0.01"
                  placeholder="Enter amount in EGP"
                  @input="validatePayoutAmount"
                />
                <div v-if="amountError" class="error-message">{{ amountError }}</div>
              </div>
              
              <div class="form-group">
                <label for="payoutReason">Reason (Optional)</label>
                <input 
                  id="payoutReason" 
                  type="text" 
                  v-model="payoutReason" 
                  placeholder="e.g., Bonus, Commission, etc."
                />
              </div>
            </div>
            
            <div class="payout-summary" v-if="payoutAmount && selectedTechnician">
              <div class="summary-item">
                <span>Amount:</span>
                <span>{{ payoutAmount }} EGP</span>
              </div>
              <div class="summary-item">
                <span>PayPal Fee:</span>
                <span>{{ paypalFee }} EGP</span>
              </div>
              <div class="summary-item total">
                <span>Total Deduction:</span>
                <span>{{ totalDeduction }} EGP</span>
              </div>
              <div class="summary-item remaining">
                <span>Remaining Credits:</span>
                <span>{{ remainingCredits }} EGP</span>
              </div>
            </div>
            
            <div class="payout-actions">
              <button 
                class="payout-btn" 
                @click="initiatePayout"
                :disabled="!canPayout || payoutLoading"
                :class="{ 'loading': payoutLoading }"
              >
                <i v-if="!payoutLoading" class="fab fa-paypal"></i>
                <i v-else class="fas fa-spinner fa-spin"></i>
                {{ payoutLoading ? 'Processing...' : 'Send PayPal Payout' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Payment Splits Section -->
        <div class="payment-splits-section">
          <div class="section-header">
            <h3>Payment Splits</h3>
            <div class="split-stats">
              <span>Total Splits: {{ paymentSplits.length }}</span>
              <span>Pending: {{ pendingSplits.length }}</span>
              <span>Completed: {{ completedSplits.length }}</span>
            </div>
          </div>
          
          <div class="splits-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>PayPal Order ID</th>
                  <th>Total Amount</th>
                  <th>Platform Fee (25%)</th>
                  <th>Technician Payment (75%)</th>
                  <th>Platform Account</th>
                  <th>Technician Account</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="split in paymentSplits" :key="split.id">
                  <td>{{ formatDate(split.createdAt) }}</td>
                  <td class="order-id">{{ split.paypalOrderId }}</td>
                  <td>{{ split.totalAmountUSD }} USD</td>
                  <td>{{ split.platformFeeUSD }} USD</td>
                  <td>{{ split.technicianAmountUSD }} USD</td>
                  <td>{{ split.platformAccount }}</td>
                  <td>{{ split.technicianAccount }}</td>
                  <td>
                    <span class="status-badge" :class="getSplitStatusClass(split.status)">
                      {{ split.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons" v-if="split.status === 'pending'">
                      <button class="execute-btn" @click="executePayout(split.id)">
                        <i class="fas fa-play"></i> Execute
                      </button>
                      <button class="simulate-btn" @click="simulatePayPalPayout(split.id)">
                        <i class="fab fa-paypal"></i> Simulate PayPal
                      </button>
                    </div>
                    <div v-else class="action-info">
                      {{ split.status === 'completed' ? 'Completed' : 'Processing' }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
                  <td>{{ transaction.originalAmountEGP || (transaction.amount * 31).toFixed(2) }} EGP</td>
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
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy, where, addDoc, limit, getDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { useRouter } from 'vue-router'
import AdminSidebar from '../../components/admin-sidebar.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { ensureUserRole, fetchUserRole } from '../../utils/userRole'
import NotificationBell from '../../components/NotificationBell.vue'

const router = useRouter()
const transactions = ref([])
const adminCredits = ref([])
const technicians = ref([])
const paymentSplits = ref([]) // New: payment splits data
const currentFilter = ref('all')
const loading = ref(true)

// Payout variables
const selectedTechnician = ref('')
const payoutAmount = ref('')
const payoutReason = ref('')
const payoutLoading = ref(false)
const amountError = ref('')

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

// Payment splits computed properties
const pendingSplits = computed(() => 
  paymentSplits.value.filter(s => s.status === 'pending')
)

const completedSplits = computed(() => 
  paymentSplits.value.filter(s => s.status === 'completed')
)

const totalAmount = computed(() => {
  return approvedTransactions.value
    .reduce((sum, t) => {
      // Use originalAmountEGP if available, otherwise convert USD to EGP
      const amountInEGP = t.originalAmountEGP || (parseFloat(t.amount) * 31);
      return sum + amountInEGP;
    }, 0)
    .toFixed(2)
})

const totalApprovedCredits = computed(() => {
  return adminCredits.value
    .filter(credit => credit.status === 'approved')
    .reduce((sum, credit) => sum + parseFloat(credit.credits || credit.amount), 0)
    .toFixed(2)
})

// Payout computed properties
const paypalFee = computed(() => {
  if (!payoutAmount.value) return 0
  const amount = parseFloat(payoutAmount.value)
  // PayPal fee: 2.9% + 0.30 USD, converted to EGP
  const feeUSD = (amount * 0.029) + 0.30
  return (feeUSD * 31).toFixed(2) // Convert to EGP
})

const totalDeduction = computed(() => {
  if (!payoutAmount.value) return 0
  const amount = parseFloat(payoutAmount.value)
  const fee = parseFloat(paypalFee.value)
  return (amount + fee).toFixed(2)
})

const remainingCredits = computed(() => {
  const currentCredits = parseFloat(totalApprovedCredits.value)
  const deduction = parseFloat(totalDeduction.value)
  return Math.max(0, currentCredits - deduction).toFixed(2)
})

const canPayout = computed(() => {
  return selectedTechnician.value && 
         payoutAmount.value && 
         parseFloat(payoutAmount.value) > 0 && 
         !amountError.value &&
         parseFloat(totalDeduction.value) <= parseFloat(totalApprovedCredits.value)
})

// Methods
async function fetchTransactions() {
  try {
    loading.value = true
    
    console.log('Starting to fetch data...')
    console.log('Current user:', auth.currentUser)
    console.log('User authenticated:', !!auth.currentUser)
    console.log('User email:', auth.currentUser?.email)
    
    // Check if user is admin using Firestore roles
    let isAdmin = false
    try {
      // First ensure user role is set up
      await ensureUserRole(auth.currentUser)
      const userRole = await fetchUserRole(auth.currentUser)
      
      console.log('User role from Firestore:', userRole)
      console.log('User email:', auth.currentUser.email)
      
      // Check if user is admin based on email or role
      isAdmin = userRole === 'admin' || 
                auth.currentUser.email === 'elie1400674@gmail.com' || 
                auth.currentUser.email === 'tasneemmostafa200110@gmail.com'
      
      console.log('Is admin:', isAdmin)
    } catch (roleError) {
      console.error('Error checking user role:', roleError)
    }
    
    // Temporarily allow non-admin users to test technician fetching
    // if (!isAdmin) {
    //   console.error('❌ User is not an admin')
    //   throw new Error('User does not have admin privileges')
    // }
    
    console.log('✅ Proceeding with data fetch (admin check temporarily disabled)')
    
    // Fetch payment transactions
    const q = query(collection(db, 'paymentTransactions'), orderBy('paymentDate', 'desc'))
    const snapshot = await getDocs(q)
    transactions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log('Payment transactions fetched:', transactions.value.length)
    
    // Fetch admin credits
    const creditsQuery = query(collection(db, 'adminCredits'), orderBy('createdAt', 'desc'))
    const creditsSnapshot = await getDocs(creditsQuery)
    adminCredits.value = creditsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log('Admin credits fetched:', adminCredits.value.length)
    
    // Fetch payment splits
    const splitsQuery = query(collection(db, 'paymentSplits'), orderBy('createdAt', 'desc'))
    const splitsSnapshot = await getDocs(splitsQuery)
    paymentSplits.value = splitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log('Payment splits fetched:', paymentSplits.value.length)
    
    // Test: Try to access any collection first
    console.log('Testing Firebase access...')
    try {
      const testQuery = query(collection(db, 'bookings'))
      const testSnapshot = await getDocs(testQuery)
      console.log('✅ Firebase access test successful - bookings collection has', testSnapshot.size, 'documents')
    } catch (testError) {
      console.error('❌ Firebase access test failed:', testError)
    }
    
    // Fetch technicians - try multiple approaches
    console.log('Fetching technicians...')
    try {
      // Approach 1: Direct query
      const techniciansQuery = query(collection(db, 'technicians'))
      console.log('Technicians query created')
      
      const techniciansSnapshot = await getDocs(techniciansQuery)
      console.log('Technicians snapshot received:', techniciansSnapshot)
      console.log('Technicians snapshot empty:', techniciansSnapshot.empty)
      console.log('Technicians snapshot size:', techniciansSnapshot.size)
      
      const approvedTechnicians = techniciansSnapshot.docs.map(doc => {
        const data = doc.data()
        console.log('Processing technician doc:', doc.id, data)
        return {
          id: doc.id,
          fullName: data.fullName || 'Unknown Technician',
          name: data.name || data.fullName || 'Unknown Technician',
          email: data.email || 'No email',
          specialization: data.specialization || 'N/A',
          basePrice: data.basePrice || 0,
          ...data // Include all other fields
        }
      })
      
      console.log('Approved technicians fetched:', approvedTechnicians.length)
      console.log('Technicians data:', approvedTechnicians)
      
      // Fetch pending technicians
      console.log('Fetching pending technicians...')
      const pendingTechniciansQuery = query(collection(db, 'pendingTechnicians'))
      const pendingTechniciansSnapshot = await getDocs(pendingTechniciansQuery)
      
      const pendingTechnicians = pendingTechniciansSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          fullName: data.fullName || 'Unknown Technician',
          name: data.name || data.fullName || 'Unknown Technician',
          email: data.email || 'No email',
          specialization: data.specialization || 'N/A',
          basePrice: data.basePrice || 0,
          ...data // Include all other fields
        }
      })
      
      console.log('Pending technicians fetched:', pendingTechnicians.length)
      console.log('Pending technicians data:', pendingTechnicians)
      
      // Combine all technicians
      technicians.value = [...approvedTechnicians, ...pendingTechnicians]
      
      console.log('Total technicians combined:', technicians.value.length)
      console.log('Final technicians array:', technicians.value)
      
    } catch (techError) {
      console.error('Error fetching technicians:', techError)
      console.error('Technician error details:', techError.message)
      console.error('Technician error code:', techError.code)
      
      // Fallback: Try to fetch with different approach
      console.log('Trying fallback approach...')
      try {
        const fallbackQuery = query(collection(db, 'technicians'), limit(10))
        const fallbackSnapshot = await getDocs(fallbackQuery)
        console.log('Fallback query successful, found:', fallbackSnapshot.size, 'technicians')
        
        const fallbackTechnicians = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          fullName: doc.data().fullName || 'Unknown Technician',
          name: doc.data().name || doc.data().fullName || 'Unknown Technician',
          email: doc.data().email || 'No email',
          specialization: doc.data().specialization || 'N/A',
          basePrice: doc.data().basePrice || 0,
          ...doc.data()
        }))
        
        technicians.value = fallbackTechnicians
        console.log('Fallback technicians loaded:', technicians.value.length)
      } catch (fallbackError) {
        console.error('Fallback approach also failed:', fallbackError)
        technicians.value = []
      }
    }
    
  } catch (error) {
    console.error('Error fetching data:', error)
    console.error('Error details:', error.message)
    console.error('Error code:', error.code)
  } finally {
    loading.value = false
  }
}

async function approveTransaction(transactionId) {
  try {
    const transactionRef = doc(db, 'paymentTransactions', transactionId)
    const transaction = transactions.value.find(t => t.id === transactionId)
    
    if (!transaction) {
      console.error('Transaction not found')
      return
    }
    
    // Update payment transaction
    await updateDoc(transactionRef, {
      status: 'approved',
      adminAction: 'approved',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin'
    })
    
    // Update corresponding credit record
    const creditsQuery = query(
      collection(db, 'adminCredits'),
      where('paypalOrderId', '==', transaction.paypalOrderId)
    )
    const creditsSnapshot = await getDocs(creditsQuery)
    
    if (!creditsSnapshot.empty) {
      const creditDoc = creditsSnapshot.docs[0]
      await updateDoc(doc(db, 'adminCredits', creditDoc.id), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.email || 'Admin'
      })
    }
    
    // Update the local state
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
    const transaction = transactions.value.find(t => t.id === transactionId)
    
    if (!transaction) {
      console.error('Transaction not found')
      return
    }
    
    // Update payment transaction
    await updateDoc(transactionRef, {
      status: 'rejected',
      adminAction: 'rejected',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin'
    })
    
    // Update corresponding credit record
    const creditsQuery = query(
      collection(db, 'adminCredits'),
      where('paypalOrderId', '==', transaction.paypalOrderId)
    )
    const creditsSnapshot = await getDocs(creditsQuery)
    
    if (!creditsSnapshot.empty) {
      const creditDoc = creditsSnapshot.docs[0]
      await updateDoc(doc(db, 'adminCredits', creditDoc.id), {
        status: 'rejected',
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.email || 'Admin'
      })
    }
    
    // Update the local state
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

// Payout methods
function validatePayoutAmount() {
  const amount = parseFloat(payoutAmount.value)
  const availableCredits = parseFloat(totalApprovedCredits.value)
  
  if (!amount || amount <= 0) {
    amountError.value = 'Please enter a valid amount'
    return
  }
  
  if (amount > availableCredits) {
    amountError.value = `Amount exceeds available credits (${availableCredits} EGP)`
    return
  }
  
  if (parseFloat(totalDeduction.value) > availableCredits) {
    amountError.value = `Total deduction (including fees) exceeds available credits`
    return
  }
  
  amountError.value = ''
}

function onTechnicianChange() {
  // Reset amount when technician changes
  payoutAmount.value = ''
  amountError.value = ''
}

async function initiatePayout() {
  if (!canPayout.value) {
    return
  }
  
  try {
    payoutLoading.value = true
    
    const technician = technicians.value.find(t => t.id === selectedTechnician.value)
    if (!technician) {
      throw new Error('Technician not found')
    }
    
    // Create payout record
    const payoutRecord = {
      technicianId: selectedTechnician.value,
      technicianName: technician.fullName || technician.name || 'Unknown Technician',
      technicianEmail: technician.email || 'No email',
      amount: parseFloat(payoutAmount.value),
      currency: 'EGP',
      paypalFee: parseFloat(paypalFee.value),
      totalDeduction: parseFloat(totalDeduction.value),
      reason: payoutReason.value || 'Admin payout',
      status: 'pending',
      adminActionBy: auth.currentUser?.email || 'Admin',
      createdAt: serverTimestamp(),
      transactionType: 'payout_sent'
    }
    
    // Save payout record
    const payoutRef = await addDoc(collection(db, 'adminPayouts'), payoutRecord)
    
    // Create credit deduction record
    const creditDeduction = {
      payoutId: payoutRef.id,
      amount: parseFloat(totalDeduction.value),
      currency: 'EGP',
      credits: parseFloat(totalDeduction.value),
      status: 'pending',
      reason: `PayPal payout to ${technician.fullName || technician.name || 'Unknown Technician'}`,
      technicianId: selectedTechnician.value,
      technicianName: technician.fullName || technician.name || 'Unknown Technician',
      adminActionBy: auth.currentUser?.email || 'Admin',
      createdAt: serverTimestamp(),
      transactionType: 'credit_deduction'
    }
    
    await addDoc(collection(db, 'adminCredits'), creditDeduction)
    
    // Show success message
    alert(`Payout of ${payoutAmount.value} EGP initiated for ${technician.fullName || technician.name || 'Unknown Technician'}`)
    
    // Reset form
    selectedTechnician.value = ''
    payoutAmount.value = ''
    payoutReason.value = ''
    amountError.value = ''
    
    // Refresh data
    await fetchTransactions()
    
  } catch (error) {
    console.error('Error initiating payout:', error)
    alert('Failed to initiate payout. Please try again.')
  } finally {
    payoutLoading.value = false
  }
}

async function executePayout(splitId) {
  try {
    const splitRef = doc(db, 'paymentSplits', splitId)
    const split = paymentSplits.value.find(s => s.id === splitId)

    if (!split) {
      alert('Payment split not found.')
      return
    }

    if (split.status !== 'pending') {
      alert('This payment split is not in a pending state.')
      return
    }

    // Convert USD amounts to EGP
    const platformFeeEGP = parseFloat(split.platformFeeUSD) * 31;
    const technicianAmountEGP = parseFloat(split.technicianAmountUSD) * 31;

    // Create platform fee transaction record
    const platformTransaction = {
      paymentDate: serverTimestamp(),
      technicianId: 'platform',
      technicianName: 'Platform Fee',
      userName: 'System',
      amount: platformFeeEGP,
      originalAmountEGP: platformFeeEGP,
      paypalOrderId: split.paypalOrderId,
      status: 'approved',
      adminAction: 'platform_fee_collected',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin',
      transactionType: 'platform_fee',
      recipientAccount: split.platformAccount,
      splitId: splitId
    };

    // Create technician payment transaction record
    const technicianTransaction = {
      paymentDate: serverTimestamp(),
      technicianId: split.technicianAccount,
      technicianName: 'Technician Payment',
      userName: 'System',
      amount: technicianAmountEGP,
      originalAmountEGP: technicianAmountEGP,
      paypalOrderId: split.paypalOrderId,
      status: 'approved',
      adminAction: 'technician_payment_sent',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin',
      transactionType: 'technician_payment',
      recipientAccount: split.technicianAccount,
      splitId: splitId
    };

    // Add both transactions to Firebase
    await addDoc(collection(db, 'paymentTransactions'), platformTransaction);
    await addDoc(collection(db, 'paymentTransactions'), technicianTransaction);

    // Update the payment split status to completed
    await updateDoc(splitRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      completedBy: auth.currentUser?.email || 'Admin',
      platformFeeEGP: platformFeeEGP,
      technicianAmountEGP: technicianAmountEGP
    });

    alert(`Payment split executed successfully!\nPlatform Fee: ${platformFeeEGP.toFixed(2)} EGP\nTechnician Payment: ${technicianAmountEGP.toFixed(2)} EGP`);
    await fetchTransactions(); // Refresh transactions to show new payouts
  } catch (error) {
    console.error('Error executing payout:', error);
    alert('Failed to execute payout. Please try again.');
  }
}

// Simulate PayPal payout (for testing without Firebase Functions)
async function simulatePayPalPayout(splitId) {
  try {
    const split = paymentSplits.value.find(s => s.id === splitId);
    
    if (!split) {
      alert('Payment split not found.');
      return;
    }

    // Simulate PayPal API call
    console.log('Simulating PayPal payout...');
    console.log('Platform payout:', split.platformFeeUSD, 'USD to', split.platformAccount);
    console.log('Technician payout:', split.technicianAmountUSD, 'USD to', split.technicianAccount);
    
    // In a real implementation, you would call PayPal's Payouts API here
    // For now, we'll just mark it as completed
    
    const splitRef = doc(db, 'paymentSplits', splitId);
    await updateDoc(splitRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      completedBy: auth.currentUser?.email || 'Admin',
      payoutMethod: 'simulated'
    });
    
    alert('PayPal payout simulation completed successfully!');
    await fetchTransactions(); // Refresh data
    
  } catch (error) {
    console.error('Error simulating PayPal payout:', error);
    alert('Failed to simulate payout. Please try again.');
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

function getSplitStatusClass(status) {
  return {
    'badge-pending': status === 'pending',
    'badge-completed': status === 'completed',
    'badge-failed': status === 'failed'
  }
}

function formatDate(date) {
  if (!date) return '-'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

onMounted(() => {
  // Wait for authentication state to be ready
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✅ User authenticated:', user.email)
      fetchTransactions()
    } else {
      console.log('❌ No user authenticated, redirecting to login')
      router.push('/userlogin')
    }
  })
  
  // Cleanup subscription when component unmounts
  return () => unsubscribe()
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

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin: 0;
}

.dashboard-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.badge-completed {
  background: #d1fae5;
  color: #065f46;
}

.badge-failed {
  background: #fef2f2;
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.approve-btn, .reject-btn, .execute-btn, .simulate-btn {
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

.execute-btn {
  background: #3b82f6;
  color: white;
}

.execute-btn:hover {
  background: #2563eb;
}

.simulate-btn {
  background: #4f46e5; /* A darker blue for simulation */
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.simulate-btn:hover {
  background: #4338ca;
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

/* Payment Splits Section Styles */
.payment-splits-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.split-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.split-stats span {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
}

.splits-table {
  overflow-x: auto;
}

.splits-table table {
  width: 100%;
  border-collapse: collapse;
}

.splits-table th,
.splits-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.splits-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

/* Payout Section Styles */
.payout-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.section-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.available-credits {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.payout-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.success-message {
  color: #059669;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.payout-summary {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item.total {
  font-weight: 600;
  color: #374151;
  font-size: 1.1rem;
}

.summary-item.remaining {
  font-weight: 600;
  color: #059669;
  font-size: 1.1rem;
}

.payout-actions {
  display: flex;
  justify-content: center;
}

.payout-btn {
  background: linear-gradient(135deg, #0070ba 0%, #1546a0 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 200px;
  justify-content: center;
}

.payout-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 112, 186, 0.3);
}

.payout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.payout-btn.loading {
  background: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .available-credits {
    font-size: 0.8rem;
  }
}
</style>
