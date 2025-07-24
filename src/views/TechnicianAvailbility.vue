<template>
    <body class="bg-gray-50 font-sans">
    
        <div class="flex min-h-screen">
            <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
            
            />
            <!-- Main Content -->
            <div class="flex-1 p-8">
                <div class="max-w-5xl mx-auto">
                    <h2 class="text-2xl font-bold text-secondary mb-8">Availability</h2>
                    <!-- Availability Table -->
                    <div class="overflow-x-auto mb-12">
                        <table class="min-w-full border border-gray-300 rounded-lg">
                            <thead>
                                <tr class="bg-gray-100 text-text-main">
                                    <th class="px-6 py-3 border border-gray-300">Saturday</th>
                                    <th class="px-6 py-3 border border-gray-300">Sunday</th>
                                    <th class="px-6 py-3 border border-gray-300">Monday</th>
                                    <th class="px-6 py-3 border border-gray-300">Tuesday</th>
                                    <th class="px-6 py-3 border border-gray-300">Wednesday</th>
                                    <th class="px-6 py-3 border border-gray-300">Thursday</th>
                                    <th class="px-6 py-3 border border-gray-300">Friday</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center">
                                    <td class="px-6 py-4 border border-gray-300">09:00 AM - 05:00 PM</td>
                                    <td class="px-6 py-4 border border-gray-300">12:00 PM - 09:00 PM</td>
                                    <td class="px-6 py-4 border border-gray-300 text-gray-400">Unavailable</td>
                                    <td class="px-6 py-4 border border-gray-300">12:00 PM - 09:00 PM</td>
                                    <td class="px-6 py-4 border border-gray-300 text-gray-400">Unavailable</td>
                                    <td class="px-6 py-4 border border-gray-300">12:00 PM - 09:00 PM</td>
                                    <td class="px-6 py-4 border border-gray-300">01:00 PM - 11:00 PM</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Set Available Hours Form -->
                    <div class="bg-secondary bg-opacity-20 rounded-2xl p-8 max-w-4xl mx-auto">
                        <h3 class="text-xl font-bold text-text-main mb-6">Set Your Available Hours For Each Day Of The Week</h3>
                        <form class="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div class="flex flex-col w-full md:w-1/3">
                                <label class="text-sm font-medium text-text-main mb-1">Day</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                    <option>Saturday</option>
                                    <option>Sunday</option>
                                </select>
                            </div>
                            <div class="flex flex-col w-full md:w-1/4">
                                <label class="text-sm font-medium text-text-main mb-1">From</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>09:00 AM</option>
                                    <option>10:00 AM</option>
                                    <option>11:00 AM</option>
                                    <option>12:00 PM</option>
                                    <option>01:00 PM</option>
                                    <option>02:00 PM</option>
                                    <option>03:00 PM</option>
                                    <option>04:00 PM</option>
                                    <option>05:00 PM</option>
                                    <option>06:00 PM</option>
                                    <option>07:00 PM</option>
                                    <option>08:00 PM</option>
                                    <option>09:00 PM</option>
                                    <option>10:00 PM</option>
                                    <option>11:00 PM</option>
                                </select>
                            </div>
                            <div class="flex flex-col w-full md:w-1/4">
                                <label class="text-sm font-medium text-text-main mb-1">To</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>05:00 PM</option>
                                    <option>06:00 PM</option>
                                    <option>07:00 PM</option>
                                    <option>08:00 PM</option>
                                    <option>09:00 PM</option>
                                    <option>10:00 PM</option>
                                    <option>11:00 PM</option>
                                </select>
                            </div>
                            <div class="flex items-end w-full md:w-auto">
                                <button type="submit" class="bg-secondary text-white px-8 py-2 rounded-lg text-base font-medium hover:bg-opacity-90 transition-colors mt-6 md:mt-0">Apply</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
</body>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      activeMenu: 'technicianavailbility',
    };
  },
  methods: {
    handleSidebarNavigate(route) {
      // Determine which menu is active based on the route
      if (route === '/technicianavailbility') {
        this.activeMenu = 'technicianavailbility';
      } else if (route === '/technicianprofile') {
        this.activeMenu = 'technicianprofile';
      }
      this.$router.push(route);
    }
  }
};
</script>

<style lang="scss" scoped>
.input-field {
    background-color: white;
    border: 1px solid #e0e0e0;
    color: #333333;
    transition: all 0.2s ease;
}
.dark-mode .input-field {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}
.input-field:focus {
    outline: none;
    border-color: #7c6bb0;
    box-shadow: 0 0 0 2px rgba(124, 107, 176, 0.2);
}
.dark-mode .input-field:focus {
  border-color: var(--primary-color);
}
.input-field:disabled {
    background-color: #f5f5f5;
    color: #666666;
    cursor: not-allowed;
}
.dark-mode .input-field:disabled {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}
.bg-gray-100 {
  background-color: var(--primary-bg);
}
.dark-mode .bg-gray-100 {
  background-color: var(--secondary-bg);
}

@media (max-width: 900px) {
  .flex {
    flex-direction: column !important;
  }
  .sidebar {
    width: 100% !important;
    max-height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem 0 !important;
    margin-bottom: 1rem;
  }
  .flex-1.p-8 {
    padding: 1.5rem !important;
  }
  .max-w-5xl.mx-auto {
    max-width: 100% !important;
    margin: 0 !important;
  }
  .bg-secondary.bg-opacity-20.rounded-2xl.p-8.max-w-4xl.mx-auto {
    padding: 1.5rem !important;
  }
}
@media (max-width: 768px) {
  .flex-1.p-8 {
    padding: 1rem !important;
  }
  .bg-secondary.bg-opacity-20.rounded-2xl.p-8.max-w-4xl.mx-auto {
    padding: 1rem !important;
  }
  .text-2xl {
    font-size: 1.2rem !important;
  }
  .text-lg {
    font-size: 1rem !important;
  }
  .input-field {
    font-size: 0.95rem !important;
    padding: 0.5rem 0.75rem !important;
  }
  .px-8.py-2 {
    padding: 0.5rem 1.2rem !important;
    font-size: 1rem !important;
  }
  table.min-w-full {
    font-size: 0.95rem !important;
  }
  .p-8 {
    padding: 1rem !important;
  }
}
@media (max-width: 600px) {
  .flex-1.p-8 {
    padding: 0.5rem !important;
  }
  .bg-secondary.bg-opacity-20.rounded-2xl.p-8.max-w-4xl.mx-auto {
    padding: 0.5rem !important;
  }
  
  .text-2xl {
    font-size: 1rem !important;
  }
  .text-lg {
    font-size: 0.9rem !important;
  }
  .input-field {
    font-size: 0.9rem !important;
    padding: 0.4rem 0.5rem !important;
  }
  .px-8.py-2 {
    padding: 0.4rem 0.8rem !important;
    font-size: 0.95rem !important;
  }
  table.min-w-full {
    font-size: 0.9rem !important;
  }
  .p-8 {
    padding: 0.5rem !important;
  }
}
</style>