<template>
  <!-- Top Bar -->
  <div class="bg-primary text-white text-sm">
    <div class="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <span class="flex items-center"><i class="fas fa-phone mr-2"></i>{{ $t('phoneNumber') }}</span>
        <span class="flex items-center"><i class="fas fa-envelope mr-2"></i>{{ $t('emailAddress') }}</span>
        <span class="flex items-center"><i class="fas fa-map-marker-alt mr-2"></i>{{ $t('address') }}</span>
      </div>
      <div class="flex items-center space-x-3">
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-twitter"></i></a>
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-linkedin-in"></i></a>
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </div>
  <!-- Header -->
  <div class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <div class="text-3xl font-bold">
          <span class="text-primary">{{ $t('boltFix') }}</span>
        </div>
      </div>
      <nav class="flex items-center space-x-8">
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('home') }}</a>
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('aboutUs') }}</a>
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('services') }}</a>
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('contactUs') }}</a>
      </nav>
      <div class="flex items-center space-x-4">
        <i class="fas fa-bell text-xl text-secondary cursor-pointer"></i>
        <i class="fas fa-user text-xl text-secondary cursor-pointer"></i>
      </div>
    </div>
  </div>
  <!-- Main Container -->
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-sidebar flex flex-col items-center pt-10">
      <a href="profile-view" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-user text-xl"></i>
        <span>{{ $t('myProfile') }}</span>
      </a>
      <a href="profile-edit" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-cog text-xl"></i>
        <span>{{ $t('settings') }}</span>
      </a>
      <a href="previous-services" class="sidebar-item active w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium">
        <i class="fas fa-calendar-check text-xl"></i>
        <span>{{ $t('history') }}</span>
      </a>
      <a href="payment" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-credit-card text-xl"></i>
        <span>{{ $t('payment') }}</span>
      </a>
      <a href="#" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-sign-out-alt text-xl"></i>
        <span>{{ $t('logout') }}</span>
      </a>
    </div>
    <!-- Main Content -->
    <div class="flex-1 p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-text-main mb-2">{{ $t('previousServices') }}</h1>
          <p class="text-gray-600">{{ $t('reviewPastServices') }}</p>
        </div>
        <!-- Service Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="(service, idx) in paginatedServices" :key="service.id" class="service-card bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-text-main">{{ service.technician }}</h3>
                  <p class="text-sm text-gray-600">{{ service.phone }}</p>
                </div>
              </div>
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{{ $t('completed') }}</span>
            </div>
            <div class="space-y-3 mb-4">
              <div class="flex items-center space-x-2">
                <i class="fas fa-wrench text-secondary text-sm"></i>
                <span class="text-sm text-text-main">{{ service.type }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="fas fa-calendar text-secondary text-sm"></i>
                <span class="text-sm text-text-main">{{ service.time }}</span>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-star text-secondary text-sm mt-1"></i>
                <div>
                  <span class="text-sm font-medium text-text-main">{{ $t('review') }}:</span>
                  <p class="text-sm text-gray-600">{{ service.review }}</p>
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
        <!-- Pagination -->
        <div class="flex justify-center items-center space-x-2 mt-8">
          <button @click="goToPage(1)" class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <i class="fas fa-angle-double-left"></i>
          </button>
          <button @click="prevPage" class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <i class="fas fa-angle-left"></i>
          </button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="['px-3 py-2 text-sm font-medium rounded-lg', page === currentPage ? 'text-white bg-secondary border-secondary' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50']">
            {{ page }}
          </button>
          <button @click="nextPage" class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <i class="fas fa-angle-right"></i>
          </button>
          <button @click="goToPage(totalPages)" class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
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
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
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
</style> 