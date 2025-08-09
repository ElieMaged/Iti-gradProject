<template>
  <div class="admin-dashboard-layout">
    <AdminSidebar />
    <div class="dashboard-main p-4 mx-12">
      <TopBar :title="$t('paymentManagement')" />
      <div class="dashboard-container">
        
        
                 <!-- Payment Summary Cards -->
         <div class="stats-grid">
           <div class="stat-card">
             <div class="stat-header">
               <i class="fas fa-coins stat-icon"></i>
               <span class="stat-number">{{ totalApprovedCredits }} EGP</span>
             </div>
             <div class="stat-title">{{ $t('totalApprovedCredits') }}</div>
           </div>
           
           <div class="stat-card">
             <div class="stat-header">
               <i class="fas fa-clock stat-icon"></i>
               <span class="stat-number">{{ pendingTransactions.length }}</span>
             </div>
             <div class="stat-title">{{ $t('pendingTransactions') }}</div>
           </div>
           
           <div class="stat-card">
             <div class="stat-header">
               <i class="fas fa-check-circle stat-icon"></i>
               <span class="stat-number">{{ approvedTransactions.length }}</span>
             </div>
             <div class="stat-title">{{ $t('approvedTransactions') }}</div>
           </div>
           
           <div class="stat-card">
             <div class="stat-header">
               <i class="fas fa-times-circle stat-icon"></i>
               <span class="stat-number">{{ rejectedTransactions.length }}</span>
             </div>
             <div class="stat-title">{{ $t('rejectedTransactions') }}</div>
           </div>
         </div>

        <!-- Bank Account Transfer Section -->
        <div class="payout-section">
          <div class="section-header">
            <h3>{{ $t('bankAccountTransferToTechnician') }}</h3>
                      <div class="available-credits">
            <i class="fas fa-coins"></i>
            <span>{{ $t('availableCredits') }}: {{ availableCredits }} EGP</span>
          </div>
          </div>
          
          <div class="payout-form">
            <div class="form-row">
              <div class="form-group">
                <label for="technicianSelect">{{ $t('selectTechnician') }}</label>
                <select id="technicianSelect" v-model="selectedTechnician" @change="onTechnicianChange">
                  <option value="">{{ loading ? $t('loadingTechnicians') : $t('chooseTechnician') }}</option>
                  <option v-if="!loading && technicians.length === 0" value="" disabled>{{ $t('noTechniciansFound') }}</option>
                  <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                    {{ tech.fullName || tech.name || $t('unknownTechnician') }} ({{ tech.email || $t('noEmail') }})
                  </option>
                </select>
                <div v-if="!loading && technicians.length === 0" class="error-message">
                  {{ $t('noTechniciansInDatabase') }}
                </div>
                <div v-if="!loading && technicians.length > 0" class="success-message">
                  {{ $t('foundTechniciansInDatabase', { count: technicians.length }) }}
                </div>
              </div>
              
              <div class="form-group">
                <label for="payoutAmount">{{ $t('amount') }} (EGP)</label>
                <input 
                  id="payoutAmount" 
                  type="number" 
                  v-model="payoutAmount" 
                  min="1" 
                  step="0.01"
                  :placeholder="$t('enterAmountInEGP')"
                  @input="validatePayoutAmount"
                  @blur="validatePayoutAmount"
                />
                <div v-if="amountError" class="error-message">{{ amountError }}</div>
                <div v-if="payoutAmount && parseFloat(payoutAmount) > 0" class="credit-info">
                  <span class="remaining-credits">
                    {{ $t('remainingCredits') }}: {{ remainingCredits }} EGP
                  </span>
                  <span v-if="parseFloat(remainingCredits) < 0" class="insufficient-credits">
                    {{ $t('insufficientCredits') }}
                  </span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="payoutReason">Bank Account Number</label>
                <input 
                  id="payoutReason" 
                  type="text" 
                  v-model="payoutReason" 
                  :placeholder="$t('reasonPlaceholder')"
                />
              </div>
            </div>
            
            <div class="payout-summary" v-if="payoutAmount && selectedTechnician && parseFloat(payoutAmount) > 0">
              <div class="summary-item">
                <span>{{ $t('amount') }}:</span>
                <span>{{ payoutAmount }} EGP</span>
              </div>
              <div class="summary-item total">
                <span>{{ $t('totalDeduction') }}:</span>
                <span>{{ totalDeduction }} EGP</span>
              </div>
              <div class="summary-item remaining">
                <span>{{ $t('remainingCredits') }}:</span>
                <span :class="{ 'insufficient-credits': parseFloat(remainingCredits) < 0 }">
                  {{ remainingCredits }} EGP
                  <i v-if="parseFloat(remainingCredits) < 0" class="fas fa-exclamation-triangle" title="Insufficient credits"></i>
                </span>
              </div>
            </div>
            
            <div class="payout-actions">
              <button 
                class="payout-btn" 
                @click="initiatePayout"
                :disabled="!canPayout || payoutLoading"
                :class="{ 'loading': payoutLoading }"
              >
                <i v-if="payoutLoading" class="fas fa-spinner fa-spin"></i>
                {{ payoutLoading ? $t('processing') : $t('sendToBankAccount') }}
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
                  <th>Order ID</th>
                  <th>Total Amount (EGP)</th>
                  <th>Platform Fee (25%) (EGP)</th>
                  <th>Technician Payment (75%) (EGP)</th>
                  <th>Platform Account</th>
                  <th>Technician Account</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="split in paginatedPaymentSplits" :key="split.id">
                  <td>{{ formatDate(split.createdAt) }}</td>
                  <td class="order-id">{{ split.paypalOrderId || split.bookingId }}</td>
                  <td>{{ split.totalAmountEGP ? parseFloat(split.totalAmountEGP).toFixed(2) : (split.totalAmount ? parseFloat(split.totalAmount).toFixed(2) : '0.00') }} EGP</td>
                  <td>{{ split.platformFeeEGP ? parseFloat(split.platformFeeEGP).toFixed(2) : (split.adminAmount ? parseFloat(split.adminAmount).toFixed(2) : '0.00') }} EGP</td>
                  <td>{{ split.technicianAmountEGP ? parseFloat(split.technicianAmountEGP).toFixed(2) : (split.technicianAmount ? parseFloat(split.technicianAmount).toFixed(2) : '0.00') }} EGP</td>
                  <td>{{ split.platformAccount || 'Platform' }}</td>
                  <td>{{ split.technicianAccount || split.technicianName || 'Unknown' }}</td>
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
                      <button class="simulate-btn" @click="simulateBankTransfer(split.id)">
                        <i class="fas fa-exchange-alt"></i> Simulate Transfer
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
          
          <!-- Pagination for Payment Splits -->
          <div v-if="splitsTotalPages > 1" class="pagination-container">
            <div class="pagination-info">
              Showing {{ (splitsCurrentPage - 1) * splitsItemsPerPage + 1 }} - 
              {{ Math.min(splitsCurrentPage * splitsItemsPerPage, paymentSplits.length) }} 
              of {{ paymentSplits.length }} payment splits
            </div>
            <Pagination 
              :total-pages="splitsTotalPages"
              :initial-page="splitsCurrentPage"
              @page-changed="handleSplitsPageChange"
            />
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="transactions-table">
          <div class="table-header">
            <h3>{{ $t('paymentTransactions') }}</h3>
            <div class="filter-buttons">
              <button class="filter-btn" @click="filterByStatus('all')" :class="{ active: currentFilter === 'all' }">{{ $t('all') }}</button>
              <button class="filter-btn" @click="filterByStatus('pending')" :class="{ active: currentFilter === 'pending' }">{{ $t('pending') }}</button>
              <button class="filter-btn" @click="filterByStatus('approved')" :class="{ active: currentFilter === 'approved' }">{{ $t('approved') }}</button>
              <button class="filter-btn" @click="filterByStatus('rejected')" :class="{ active: currentFilter === 'rejected' }">{{ $t('rejected') }}</button>
            </div>
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>{{ $t('date') }}</th>
                  <th>{{ $t('technician') }}</th>
                  <th>{{ $t('customer') }}</th>
                  <th>{{ $t('amount') }}</th>
                  <th>{{ $t('paypalOrderId') }}</th>
                  <th>{{ $t('status') }}</th>
                  <th>{{ $t('actions') }}</th>
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
                        <i class="fas fa-check"></i> {{ $t('approve') }}
                      </button>
                      <button class="reject-btn" @click="rejectTransaction(transaction.id)">
                        <i class="fas fa-times"></i> {{ $t('reject') }}
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
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy, where, addDoc, limit } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { useRouter } from 'vue-router'
import AdminSidebar from '../../components/admin-sidebar.vue'
import TopBar from '../../components/TopBar.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { ensureUserRole, fetchUserRole } from '../../utils/userRole'
<<<<<<< Updated upstream
=======
import NotificationBell from '../../components/NotificationBell.vue'
import Pagination from '../../components/pagination.vue'
>>>>>>> Stashed changes

const router = useRouter()

// State
const transactions = ref([])
const adminCredits = ref([])
const technicians = ref([])
const paymentSplits = ref([])
const currentFilter = ref('all')
const loading = ref(true)

// Payout state
const selectedTechnician = ref('')
const payoutAmount = ref('')
const payoutReason = ref('')
const payoutLoading = ref(false)
const amountError = ref('')

<<<<<<< Updated upstream
// Computed
=======
// Pagination variables for payment splits
const splitsCurrentPage = ref(1)
const splitsItemsPerPage = ref(10)

// Computed properties
>>>>>>> Stashed changes
const filteredTransactions = computed(() => {
  if (currentFilter.value === 'all') return transactions.value
  return transactions.value.filter(t => t.status === currentFilter.value)
})

const pendingTransactions = computed(() => transactions.value.filter(t => t.status === 'pending'))
const approvedTransactions = computed(() => transactions.value.filter(t => t.status === 'approved'))
const rejectedTransactions = computed(() => transactions.value.filter(t => t.status === 'rejected'))

<<<<<<< Updated upstream
const pendingSplits = computed(() => paymentSplits.value.filter(s => s.status === 'pending'))
const completedSplits = computed(() => paymentSplits.value.filter(s => s.status === 'completed'))
=======
// Pagination computed properties for payment splits
const splitsTotalPages = computed(() => 
  Math.ceil(paymentSplits.value.length / splitsItemsPerPage.value)
)

const paginatedPaymentSplits = computed(() => {
  const startIndex = (splitsCurrentPage.value - 1) * splitsItemsPerPage.value
  const endIndex = startIndex + splitsItemsPerPage.value
  return paymentSplits.value.slice(startIndex, endIndex)
})

>>>>>>> Stashed changes

const totalAmount = computed(() => {
  return approvedTransactions.value
    .reduce((sum, t) => {
      const amountInEGP = t.originalAmountEGP || (parseFloat(t.amount) * 31)
      return sum + amountInEGP
    }, 0)
    .toFixed(2)
})

const totalApprovedCredits = computed(() => {
  return adminCredits.value
    .filter(credit => credit.status === 'completed' || credit.status === 'approved')
    .reduce((sum, credit) => {
      const amount = parseFloat(credit.credits || credit.amount)
      return sum + amount // This will handle negative amounts (deductions) correctly
    }, 0)
    .toFixed(2)
})

const paypalFee = computed(() => {
  if (!payoutAmount.value) return 0
  const amount = parseFloat(payoutAmount.value)
  const feeUSD = (amount * 0.029) + 0.30
  return (feeUSD * 31).toFixed(2)
})

const totalDeduction = computed(() => {
  if (!payoutAmount.value) return 0
  const amount = parseFloat(payoutAmount.value)
  return amount.toFixed(2)
})

const remainingCredits = computed(() => {
  const currentCredits = parseFloat(totalApprovedCredits.value)
  const deduction = parseFloat(totalDeduction.value)
  return Math.max(0, currentCredits - deduction).toFixed(2)
})

const availableCredits = computed(() => {
  return parseFloat(totalApprovedCredits.value).toFixed(2)
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

    // Ensure role is loaded (non-blocking if fails)
    try {
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

    // Transactions
    const q = query(collection(db, 'paymentTransactions'), orderBy('paymentDate', 'desc'))
    const snapshot = await getDocs(q)
    transactions.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))

    // Admin credits
    const creditsQuery = query(collection(db, 'adminCredits'), orderBy('createdAt', 'desc'))
    const creditsSnapshot = await getDocs(creditsQuery)
    adminCredits.value = creditsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))

    // Payment splits
    const splitsQuery = query(collection(db, 'paymentSplits'), orderBy('createdAt', 'desc'))
    const splitsSnapshot = await getDocs(splitsQuery)
    paymentSplits.value = splitsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))

    // Technicians (approved + pending)
    try {
      const techSnap = await getDocs(query(collection(db, 'technicians')))
      const approved = techSnap.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          fullName: data.fullName || 'Unknown Technician',
          name: data.name || data.fullName || 'Unknown Technician',
          email: data.email || 'No email',
          specialization: data.specialization || 'N/A',
          basePrice: data.basePrice || 0,
          ...data,
        }
      })

      const pendingSnap = await getDocs(query(collection(db, 'pendingTechnicians')))
      const pending = pendingSnap.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          fullName: data.fullName || 'Unknown Technician',
          name: data.name || data.fullName || 'Unknown Technician',
          email: data.email || 'No email',
          specialization: data.specialization || 'N/A',
          basePrice: data.basePrice || 0,
          ...data,
        }
      })

      technicians.value = [...approved, ...pending]
    } catch {
      technicians.value = []
    }
  } catch (e) {
    console.error('Error fetching data:', e)
  } finally {
    loading.value = false
  }
}

async function approveTransaction(transactionId) {
  try {
    const transactionRef = doc(db, 'paymentTransactions', transactionId)
    const transaction = transactions.value.find(t => t.id === transactionId)
    if (!transaction) return

    await updateDoc(transactionRef, {
      status: 'approved',
      adminAction: 'approved',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin',
    })

    const creditsQuery = query(collection(db, 'adminCredits'), where('paypalOrderId', '==', transaction.paypalOrderId))
    const creditsSnapshot = await getDocs(creditsQuery)
    if (!creditsSnapshot.empty) {
      const creditDoc = creditsSnapshot.docs[0]
      await updateDoc(doc(db, 'adminCredits', creditDoc.id), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.email || 'Admin',
      })
    }

    transaction.status = 'approved'
    transaction.adminAction = 'approved'
    transaction.adminActionDate = new Date()
    transaction.adminActionBy = auth.currentUser?.email || 'Admin'
  } catch (e) {
    console.error('Error approving transaction:', e)
  }
}

async function rejectTransaction(transactionId) {
  try {
    const transactionRef = doc(db, 'paymentTransactions', transactionId)
    const transaction = transactions.value.find(t => t.id === transactionId)
    if (!transaction) return

    await updateDoc(transactionRef, {
      status: 'rejected',
      adminAction: 'rejected',
      adminActionDate: serverTimestamp(),
      adminActionBy: auth.currentUser?.email || 'Admin',
    })

    const creditsQuery = query(collection(db, 'adminCredits'), where('paypalOrderId', '==', transaction.paypalOrderId))
    const creditsSnapshot = await getDocs(creditsQuery)
    if (!creditsSnapshot.empty) {
      const creditDoc = creditsSnapshot.docs[0]
      await updateDoc(doc(db, 'adminCredits', creditDoc.id), {
        status: 'rejected',
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.email || 'Admin',
      })
    }

    transaction.status = 'rejected'
    transaction.adminAction = 'rejected'
    transaction.adminActionDate = new Date()
    transaction.adminActionBy = auth.currentUser?.email || 'Admin'
  } catch (e) {
    console.error('Error rejecting transaction:', e)
  }
}

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
    amountError.value = 'Total deduction (including fees) exceeds available credits'
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
  if (!canPayout.value) return
  try {
    payoutLoading.value = true
    const technician = technicians.value.find(t => t.id === selectedTechnician.value)
<<<<<<< Updated upstream
    if (!technician) throw new Error('Technician not found')

=======
    if (!technician) {
      throw new Error('Technician not found')
    }
    
    // Ensure we have a valid email for the technician
    if (!technician.email) {
      throw new Error('Technician email not found. Cannot send credits.')
    }
    
    // Check if admin has sufficient credits
    const currentAdminCredits = parseFloat(totalApprovedCredits.value)
    const transferAmount = parseFloat(payoutAmount.value)
    
    if (currentAdminCredits < transferAmount) {
      throw new Error(`Insufficient credits. Available: ${currentAdminCredits} EGP, Required: ${transferAmount} EGP`)
    }
    
>>>>>>> Stashed changes
    // Create payout record
    const payoutRecord = {
      technicianId: selectedTechnician.value,
      technicianName: technician.fullName || technician.name || 'Unknown Technician',
      technicianEmail: technician.email || 'No email',
      amount: transferAmount,
      currency: 'EGP',
      totalDeduction: transferAmount,
      reason: payoutReason.value || 'Admin payout',
      status: 'completed', // Mark as completed since admin is directly transferring
      adminActionBy: auth.currentUser?.email || 'Admin',
      createdAt: serverTimestamp(),
      completedAt: serverTimestamp(),
      transactionType: 'payout_sent'
    }
    
    // Save payout record
    const payoutRef = await addDoc(collection(db, 'adminPayouts'), payoutRecord)
<<<<<<< Updated upstream

    // Create credit deduction record
=======
    
    // Create credit deduction record for admin
>>>>>>> Stashed changes
    const creditDeduction = {
      payoutId: payoutRef.id,
      amount: -transferAmount, // Negative amount to indicate deduction
      currency: 'EGP',
      credits: -transferAmount, // Negative credits to indicate deduction
      status: 'completed',
      reason: `Credit transfer to ${technician.fullName || technician.name || 'Unknown Technician'}`,
      technicianId: selectedTechnician.value,
      technicianName: technician.fullName || technician.name || 'Unknown Technician',
      adminActionBy: auth.currentUser?.email || 'Admin',
      createdAt: serverTimestamp(),
      completedAt: serverTimestamp(),
      transactionType: 'credit_deduction',
      description: `Admin transferred ${transferAmount} EGP to technician`
    }
    
    await addDoc(collection(db, 'adminCredits'), creditDeduction)
<<<<<<< Updated upstream

=======
    
    // Add credits to technician's account
    const technicianCredit = {
      technicianId: selectedTechnician.value,
      technicianEmail: technician.email,
      amount: transferAmount,
      credits: transferAmount,
      currency: 'EGP',
      status: 'approved', // Automatically approved since admin is sending
      type: 'admin_transfer',
      description: `Bank transfer from admin: ${payoutReason.value || 'Admin payout'}`,
      reason: payoutReason.value || 'Admin payout',
      adminActionBy: auth.currentUser?.email || 'Admin',
      payoutId: payoutRef.id,
      createdAt: serverTimestamp(),
      approvedAt: serverTimestamp(),
      transactionType: 'credit_addition'
    }
    
    await addDoc(collection(db, 'technicianCredits'), technicianCredit)
    
>>>>>>> Stashed changes
    // Show success message
    alert(`Successfully transferred ${transferAmount} EGP to ${technician.fullName || technician.name || 'Unknown Technician'}. Credits have been deducted from your account and added to theirs.`)
    
    // Reset form
    selectedTechnician.value = ''
    payoutAmount.value = ''
    payoutReason.value = ''
    amountError.value = ''
    
    // Refresh data to show updated credit balance
    await fetchTransactions()
<<<<<<< Updated upstream
  } catch (e) {
    console.error('Error initiating payout:', e)
    alert('Failed to initiate payout. Please try again.')
=======
    
    // Also refresh admin credits specifically to show updated balance
    const creditsQuery = query(collection(db, 'adminCredits'), orderBy('createdAt', 'desc'))
    const creditsSnapshot = await getDocs(creditsQuery)
    adminCredits.value = creditsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
  } catch (error) {
    console.error('Error initiating payout:', error)
    alert(`Failed to initiate payout: ${error.message}`)
>>>>>>> Stashed changes
  } finally {
    payoutLoading.value = false
  }
}

async function executePayout(splitId) {
  try {
    const splitRef = doc(db, 'paymentSplits', splitId)
    const split = paymentSplits.value.find(s => s.id === splitId)
    if (!split) { alert('Payment split not found.'); return }
    if (split.status !== 'pending') { alert('This payment split is not in a pending state.'); return }

    const platformFeeEGP = parseFloat(split.platformFeeUSD) * 31
    const technicianAmountEGP = parseFloat(split.technicianAmountUSD) * 31

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
      splitId,
    }

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
      splitId,
    }

    await addDoc(collection(db, 'paymentTransactions'), platformTransaction)
    await addDoc(collection(db, 'paymentTransactions'), technicianTransaction)

    await updateDoc(splitRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      completedBy: auth.currentUser?.email || 'Admin',
      platformFeeEGP,
      technicianAmountEGP,
    })

    alert(`Payment split executed successfully!\nPlatform Fee: ${platformFeeEGP.toFixed(2)} EGP\nTechnician Payment: ${technicianAmountEGP.toFixed(2)} EGP`)
    await fetchTransactions()
  } catch (e) {
    console.error('Error executing payout:', e)
    alert('Failed to execute payout. Please try again.')
  }
}

async function simulatePayPalPayout(splitId) {
  try {
    const split = paymentSplits.value.find(s => s.id === splitId)
    if (!split) { alert('Payment split not found.'); return }
    const splitRef = doc(db, 'paymentSplits', splitId)
    await updateDoc(splitRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      completedBy: auth.currentUser?.email || 'Admin',
      payoutMethod: 'simulated',
    })
    alert('PayPal payout simulation completed successfully!')
    await fetchTransactions()
  } catch (e) {
    console.error('Error simulating PayPal payout:', e)
    alert('Failed to simulate payout. Please try again.')
  }
}

function filterByStatus(status) { currentFilter.value = status }
function getStatusBadgeClass(status) {
  return { 'badge-pending': status === 'pending', 'badge-approved': status === 'approved', 'badge-rejected': status === 'rejected' }
}
function getSplitStatusClass(status) {
  return { 'badge-pending': status === 'pending', 'badge-completed': status === 'completed', 'badge-failed': status === 'failed' }
}
function formatDate(date) {
  if (!date) return '-'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

// Pagination handlers
function handleSplitsPageChange(page) {
  splitsCurrentPage.value = page
}

// Helper function to find technician by email
function findTechnicianByEmail(email) {
  return technicians.value.find(t => t.email === email)
}

onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) fetchTransactions()
    else router.push('/userlogin')
  })
  // no explicit cleanup needed in <script setup>
})
</script>

<style scoped>
.layout{
  min-height: auto;
}
.admin-dashboard-layout {
  display: flex;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #f9fafb;
}
.dark .admin-dashboard-layout {
  background-color: var(--primary-bg);
}

.dashboard-main {
  flex: 1;
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
  color: var(--primary-color);
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
.dark .stat-card {
  background-color: var(--grey-bg) !important;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.stat-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-right: 0.5rem;
}
.dark .stat-icon {
  color: var(--icon-color);
}

.stat-number {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
}
.dark .stat-number {
  color: var(--primary-text);
}

.stat-title {
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
}
.dark .stat-title {
  color: var(--primary-text);
}

.transactions-table {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.dark .transactions-table {
  background-color: var(--grey-bg) !important;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.dark .table-header {
  background-color: var(--grey-bg) !important;
}

.table-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}
.dark .table-header {
  background-color: var(--grey-bg) !important;
}
.dark .table-header h3 {
  color: var(--primary-text);
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
.dark .filter-btn {
  background-color: var(--input-bg) !important;
  color: var(--text-muted);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
.dark .filter-btn.active {
  background-color: var(--primary-color) !important;
  color: var(--primary-text);
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
.dark th, .dark td {
  background-color: var(--input-bg) !important;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}
.dark th {
  background-color: var(--input-bg) !important;
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
  background: var(--primary-color); /* A darker blue for simulation */
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
.dark  .simulate-btn {
  background-color: var(--primary-color) !important;
}
.dark #technicianSelect {
  background-color: var(--input-bg) !important;
  color: var(--text-muted);

}
.dark #technicianSelect option {
  background-color: var(--input-bg) !important;
  color: var(--text-muted);
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
.dark .payment-splits-section {
  background-color: var(--input-bg) !important;
  color: var(--text-muted);
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

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.dark .pagination-container {
  background: var(--input-bg);
  border-top-color: var(--border-color);
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .pagination-info {
  color: var(--text-muted);
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
  background: var(--primary-color);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dark .section-header {
  background-color: var(--grey-bg) !important;
}

.section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}
.dark .section-header h3 {
  color: var(--primary-text);
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

.dark .payout-form {
  background-color: var(--input-bg) !important;
  color: var(--text-muted);
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
.dark .form-group label {
  color: var(--text-muted);
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}
.dark .form-group input,
.dark .form-group select {
  background-color: var(--input-bg) !important;
  color: var(--text-muted);
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
  background: var(--primary-color);
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
  .admin-dashboard-layout {
    flex-direction: column;
    min-height: auto;
  }
  .dashboard-main {
    margin-right: 0;
    padding: 0.5rem;
    margin-top: 30px;
  }
  /* Rest of the code remains the same */
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
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    min-height: auto;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .table-container {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .approve-btn, .reject-btn, .execute-btn, .simulate-btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .admin-dashboard-layout {
    flex-direction: column;
    min-height: auto;
  }
  
  .dashboard-main {
    padding: 0.25rem;
    margin-top: 70px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-title {
    font-size: 0.875rem;
  }
  
  .dashboard-title {
    font-size: 1.25rem;
  }
  
  .payout-form {
    padding: 1rem;
  }
  
  .section-header {
    padding: 1rem;
  }
  
  .section-header h3 {
    font-size: 1rem;
  }
  
  .payout-summary {
    padding: 1rem;
  }
  
  .summary-item {
    font-size: 0.875rem;
  }
  
  .payout-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    min-width: 150px;
  }
}

/* Credit Info Styles */
.credit-info {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.remaining-credits {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.dark .remaining-credits {
  color: #ccc;
}

.insufficient-credits {
  font-size: 0.875rem;
  color: #dc3545;
  font-weight: 600;
}

.dark .insufficient-credits {
  color: #ff6b6b;
}

/* Summary item insufficient credits */
.payout-summary .summary-item.remaining .insufficient-credits {
  color: #dc3545;
  font-weight: 700;
}

.dark .payout-summary .summary-item.remaining .insufficient-credits {
  color: #ff6b6b;
}

.payout-summary .summary-item.remaining .insufficient-credits i {
  margin-left: 0.5rem;
  color: #dc3545;
}

.dark .payout-summary .summary-item.remaining .insufficient-credits i {
  color: #ff6b6b;
}
</style>
