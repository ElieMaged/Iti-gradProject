<template>  
  <div class="flex min-h-screen">
    <userSidebar :activeTab="activeTab" />
    <div class="flex-1 p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-text-main dark:text-white">{{ $t('previousServicesTitle') }}</h1>
          <p class="text-gray-600 dark:text-gray-300">{{ $t('previousServicesDescription') }}</p>
        </div>
        <!-- Service Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="(service, idx) in paginatedServices" :key="service.id" class="service-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-text-main dark:text-white">{{ service.technician }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ service.phone }}</p>
                </div>
              </div>
              <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded">{{ $t('completed') }}</span>
            </div>
            <div class="space-y-3 mb-4">
              <div class="flex items-center space-x-2">
                <i class="fas fa-wrench text-secondary text-sm"></i>
                <span class="text-sm text-text-main dark:text-white">{{ service.type }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="fas fa-calendar text-secondary text-sm"></i>
                <span class="text-sm text-text-main dark:text-white">{{ service.time }}</span>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-star text-secondary text-sm mt-1"></i>
                <div>
                  <span class="text-sm font-medium text-text-main dark:text-white">{{ $t('review') }}:</span>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ service.review }}</p>
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-secondary">{{ $t('price') }}: {{ service.price }} EGP</span>
              <button class="book-again-btn bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium" @click="bookAgain(service)">
                {{ $t('bookAgain') }}
              </button>
            </div>
          </div>
        </div>
        <!-- Pagination Component -->
        <Pagination 
          :total-pages="totalPages" 
          :initial-page="currentPage"
          @page-changed="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import userSidebar from '../components/userSidebar.vue';
import Pagination from '../components/pagination.vue';

const activeTab = ref('history');
const services = ref([
  { id: 1, technician: 'Samir Mohamed', phone: '+20 111 555 2365', type: 'Electricity', time: '10:00AM, Friday, July 23', review: 'Super professional and friendly', price: 250 },
  { id: 2, technician: 'Mohsen Ali', phone: '+20 111 555 2365', type: 'Plumbing', time: '2:30PM, Wednesday, July 20', review: 'Mohsen fixed our kitchen plumbing without making a mess.', price: 400 },
  { id: 3, technician: 'Gamal Saad', phone: '+20 111 555 2365', type: 'Carpentry', time: '9:00AM, Monday, July 18', review: "The technician didn't have the right tools", price: 300 },
  { id: 4, technician: 'Ahmed Hassan', phone: '+20 111 555 2365', type: 'Air Conditioning', time: '11:00AM, Saturday, July 15', review: 'Excellent service, very knowledgeable technician', price: 500 },
  { id: 5, technician: 'Mahmoud Omar', phone: '+20 111 555 2365', type: 'Electrical Wiring', time: '3:00PM, Thursday, July 12', review: 'Professional work, clean installation', price: 350 },
  { id: 6, technician: 'Karim Mostafa', phone: '+20 111 555 2365', type: 'Appliance Repair', time: '1:00PM, Tuesday, July 10', review: 'Fixed my washing machine quickly and efficiently', price: 280 },
]);
const currentPage = ref(1);
const pageSize = 4;
const totalPages = computed(() => Math.ceil(services.value.length / pageSize));
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return services.value.slice(start, start + pageSize);
});

function handlePageChange(page) {
  currentPage.value = page;
}

function bookAgain(service) {
  alert($t('bookingAlert', { type: service.type, technician: service.technician }));
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
.service-card {
  transition: all 0.2s ease;
}
.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.book-again-btn {
  transition: all 0.2s ease;
  border-radius: 25px;
}
.book-again-btn:hover {
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

/* Dark mode styling similar to Payment.vue */
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
.dark .service-card {
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

/* Dark mode transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Dark mode specific styling */
.dark .service-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .book-again-btn:hover {
  background-color: var(--primary-color) !important;
}

/* Dark mode background support */
.dark {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}


.dark .text-gray-600 {
  color: var(--text-muted);
}

.dark .text-gray-500 {
  color: var(--text-muted);
}

.dark .border-gray-300 {
  border-color: var(--border-color);
}

.dark .hover\:bg-gray-50:hover {
  background-color: var(--hover-bg);
}
</style> 