<template>      
  <!-- Main Container -->
  <div class="flex min-h-screen">
    <userSidebar :activeTab="activeTab" />
    <!-- Main Content -->
    <div class="flex-1 p-20">
      <div class="max-w-7xl mx-auto">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-text-main">{{ $t('payment') }}</h1>
        </div>
        <!-- Grid Container with 12 columns and 20px gutter -->
        <div class="grid grid-cols-12 gap-5">
          <!-- Your Last Transactions Section -->
          <div class="col-span-12">
            <h2 class="text-2xl font-bold text-text-main mb-6">{{ $t('yourLastTransactions') }}</h2>
          </div>
          <div v-for="(transaction, idx) in transactions" :key="transaction.id" class="col-span-12 lg:col-span-6">
            <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <div class="space-y-3">
                    <div class="flex items-center space-x-3"><i class="fas fa-user text-secondary text-sm"></i><span class="text-sm font-medium text-text-main">{{ transaction.technician }}</span></div>
                    <div class="flex items-center space-x-3"><i class="fas fa-phone text-secondary text-sm"></i><span class="text-sm text-gray-600">{{ transaction.phone }}</span></div>
                    <div class="flex items-center space-x-3"><i :class="transaction.icon" class="text-secondary text-sm"></i><span class="text-sm text-text-main">{{ transaction.type }}</span></div>
                    <div class="flex items-center space-x-3"><i class="fas fa-calendar text-secondary text-sm"></i><span class="text-sm text-gray-600">{{ transaction.time }}</span></div>
                    <div class="flex items-center space-x-3"><span class="text-lg font-bold text-secondary">{{ $t('price') }}: {{ transaction.price }} EGP</span></div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-green-600 text-sm font-medium mb-2">{{ $t('successful') }}</div>
                  <div class="text-text-main text-sm font-medium">{{ $t('paypal') }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- Your Payment Method Section -->
          <div class="col-span-12 mt-8">
            <h2 class="text-2xl font-bold text-text-main mb-6">{{ $t('yourPaymentMethod') }}</h2>
          </div>
          <!-- Payment Method Card -->
          <div class="col-span-12 lg:col-span-6">
            <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative">
              <button v-if="!editingPaypal" @click="editingPaypal = true" class="edit-btn absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-lg text-xs font-medium">{{ $t('edit') }}</button>
              <div v-if="!editingPaypal" class="space-y-4">
                <div class="flex items-center space-x-3"><i class="fab fa-paypal text-secondary text-xl"></i><span class="text-lg font-medium text-text-main">{{ $t('paypal') }}</span></div>
                <div class="flex items-center space-x-3"><i class="fas fa-envelope text-secondary text-sm"></i><span class="text-sm text-gray-600">{{ paypalEmail }}</span></div>
              </div>
              <div v-else class="space-y-4">
                <div class="flex items-center space-x-3"><i class="fab fa-paypal text-secondary text-xl"></i><span class="text-lg font-medium text-text-main">{{ $t('paypal') }}</span></div>
                <div class="space-y-3">
                  <label class="block text-sm font-bold text-text-main">{{ $t('paypalEmail') }}</label>
                  <input v-model="paypalEmailInput" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent">
                </div>
                <div class="flex space-x-2">
                  <button @click="savePaypal" class="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700">{{ $t('save') }}</button>
                  <button @click="cancelPaypal" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-600">{{ $t('cancel') }}</button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-6"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import userSidebar from '../components/userSidebar.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const activeTab = ref('payment');

const transactions = ref([
  { id: 1, technician: t('technicianMohsenAli'), phone: '+20 111 555 2365', type: t('plumbing'), icon: 'fas fa-wrench', time: '10:00AM, Friday, July 23', price: 400 },
  { id: 2, technician: t('technicianSamirMohamed'), phone: '+20 111 555 2365', type: t('electricity'), icon: 'fas fa-lightbulb', time: '2:30PM, Wednesday, July 20', price: 250 },
  { id: 3, technician: t('technicianAhmedHassan'), phone: '+20 111 555 2365', type: t('airConditioning'), icon: 'fas fa-snowflake', time: '11:00AM, Saturday, July 15', price: 500 },
  { id: 4, technician: t('technicianMahmoudOmar'), phone: '+20 111 555 2365', type: t('electricalWiring'), icon: 'fas fa-bolt', time: '3:00PM, Thursday, July 12', price: 350 },
]);

const paypalEmail = ref('exampletech@gmail.com');
const paypalEmailInput = ref(paypalEmail.value);
const editingPaypal = ref(false);

function savePaypal() {
  if (paypalEmailInput.value && paypalEmailInput.value.includes('@')) {
    paypalEmail.value = paypalEmailInput.value;
    editingPaypal.value = false;
    alert(t('paypalUpdated'));
  } else {
    alert(t('invalidEmail'));
  }
}

function cancelPaypal() {
  paypalEmailInput.value = paypalEmail.value;
  editingPaypal.value = false;
}
</script>
<style scoped>
.sidebar-item {
  transition: all 0.2s ease;
}
.sidebar-item:hover {
  background-color: #c5b7e6;
  color: white;
}
.sidebar-item.active {
  background-color: #7c6bb0;
  color: white;
}
.transaction-card {
  transition: all 0.2s ease;
}
.transaction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.edit-btn {
  transition: all 0.2s ease;
}
.edit-btn:hover {
  background-color: #5e4b8b;
  transform: scale(1.05);
}
.bg-primary {
  background-color: #ffd54f;
}
.bg-secondary {
  background-color: #7c6bb0;
}
.bg-sidebar {
  background-color: #ede7f6;
}
.text-primary {
  color: #ffd54f;
}
.text-secondary {
  color: #7c6bb0;
}
.text-text-main {
  color: #333333;
}
.text-muted {
  color: #aaaaaa;
}
.dark .bg-primary {
  background-color: var(--primary-color) !important;
}
.dark .bg-secondary {
  background-color: var(--sidebar) !important;
}
.dark .bg-sidebar {
  background-color: var(--sidebar) !important;
}
.dark .text-primary {
  color: var(--primary-color) !important;
}
.dark .text-secondary {
  color: var(--sidebar) !important;
}
.dark .text-text-main {
  color: var(--primary-text) !important;
}
.dark .text-muted {
  color: var(--primary-text) !important;
}
.dark .transaction-card {
  background-color: var(--secondary-bg) !important;
}

.dark .sidebar-item {
  background-color: var(--sidebar) !important;
}
.dark .sidebar-item:hover {
  background-color: var(--primary-color) !important;
}
.dark .sidebar-item.active {
  background-color: var(--primary-color) !important;
}

</style> 