<template>
    <body class="bg-gray-50 font-sans">
    
        <div class="flex min-h-screen">
            <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
            
            />
            <!-- Main Content -->
            <div class="flex-1 p-8">
                <div class=" mr-20 p-4">
                    <h2 class="text-2xl font-bold text-primary mb-8">{{ $t('availabilityTitle') }}</h2>
                    
                    <!-- Success/Error Messages -->
                    <div v-if="message" :class="['message', messageType]" class="mb-4 p-4 rounded-lg">
                        {{ message }}
                    </div>
                    
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
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.saturday && availability.saturday.available">
                                            {{ availability.saturday.startTime }} - {{ availability.saturday.endTime }}
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.sunday && availability.sunday.available">
                                            {{ availability.sunday.startTime }} - {{ availability.sunday.endTime }}
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.monday && availability.monday.available">
                                            {{ availability.monday.startTime }} - {{ availability.monday.endTime }}
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.tuesday && availability.tuesday.available">
                                            {{ availability.tuesday.startTime }} - {{ availability.tuesday.endTime }}
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.wednesday && availability.wednesday.available">
                                            {{ availability.wednesday.startTime }} - {{ availability.wednesday.endTime }}
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.thursday && availability.thursday.available">
                                            {{ availability.thursday.startTime }} - {{ availability.thursday.endTime }}
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.friday && availability.friday.available">
                                            {{ availability.friday.startTime }} - {{ availability.friday.endTime }}
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Set Available Hours Form -->
                    <div class="bg-secondary bg-opacity-20 rounded-2xl p-8 max-w-4xl mx-auto">
                        <h3 class="text-xl font-bold text-text-main mb-6">{{ $t('availabilityDesc') }}</h3>
                        <form class="flex flex-col md:flex-row gap-4 items-center justify-between" @submit.prevent="updateAvailability">
                            <div class="flex flex-col w-full md:w-1/3">
                                <label class="text-sm font-medium text-text-main mb-1">{{ $t('day') }}</label>
                                <select v-model="form.day" class="input-field w-full px-4 py-2 rounded-lg text-sm" required>
                                    <option value="">{{ $t('selectDay') }}</option>
                                    <option value="monday">{{ $t('monday') }}</option>
                                    <option value="tuesday">{{ $t('tuesday') }}</option>
                                    <option value="wednesday">{{ $t('wednesday') }}</option>
                                    <option value="thursday">{{ $t('thursday') }}</option>
                                    <option value="friday">{{ $t('friday') }}</option>
                                    <option value="saturday">{{ $t('saturday') }}</option>
                                    <option value="sunday">{{ $t('sunday') }}</option>
                                </select>
                            </div>
                            <div class="flex flex-col w-full md:w-1/4">
                                <label class="text-sm font-medium text-text-main mb-1">{{ $t('from') }}</label>
                                <select v-model="form.startTime" class="input-field w-full px-4 py-2 rounded-lg text-sm" required>
                                    <option value="">{{ $t('selectTime') }}</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="01:00 PM">01:00 PM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                    <option value="05:00 PM">05:00 PM</option>
                                    <option value="06:00 PM">06:00 PM</option>
                                    <option value="07:00 PM">07:00 PM</option>
                                    <option value="08:00 PM">08:00 PM</option>
                                    <option value="09:00 PM">09:00 PM</option>
                                    <option value="10:00 PM">10:00 PM</option>
                                    <option value="11:00 PM">11:00 PM</option>
                                </select>
                            </div>
                            <div class="flex flex-col w-full md:w-1/4">
                                <label class="text-sm font-medium text-text-main mb-1">{{ $t('to') }}</label>
                                <select v-model="form.endTime" class="input-field w-full px-4 py-2 rounded-lg text-sm" required>
                                    <option value="">{{ $t('selectTime') }}</option>
                                    <option value="05:00 PM">05:00 PM</option>
                                    <option value="06:00 PM">06:00 PM</option>
                                    <option value="07:00 PM">07:00 PM</option>
                                    <option value="08:00 PM">08:00 PM</option>
                                    <option value="09:00 PM">09:00 PM</option>
                                    <option value="10:00 PM">10:00 PM</option>
                                    <option value="11:00 PM">11:00 PM</option>
                                </select>
                            </div>
                            <div class="flex items-end w-full md:w-auto gap-2">
                                <button type="submit" class="bg-secondary text-white px-8 py-2 rounded-lg text-base font-medium hover:bg-opacity-90 transition-colors mt-6 md:mt-0">
                                    {{ loading ? $t('updating') : $t('apply') }}
                                </button>
                                <button 
                                    v-if="form.day" 
                                    type="button" 
                                    @click="setUnavailable" 
                                    class="bg-red-500 text-white px-6 py-2 rounded-lg text-base font-medium hover:bg-red-600 transition-colors mt-6 md:mt-0"
                                >
                                    {{ $t('setUnavailable') }}
                                </button>
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
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default {
  components: {
    Sidebar
  },
  setup() {
    const activeMenu = ref('technicianavailbility');
    const loading = ref(false);
    const message = ref('');
    const messageType = ref('success');
    const technicianUid = ref(null);
    
    // Default availability structure
    const defaultAvailability = {
      monday: { available: false, startTime: '', endTime: '' },
      tuesday: { available: false, startTime: '', endTime: '' },
      wednesday: { available: false, startTime: '', endTime: '' },
      thursday: { available: false, startTime: '', endTime: '' },
      friday: { available: false, startTime: '', endTime: '' },
      saturday: { available: false, startTime: '', endTime: '' },
      sunday: { available: false, startTime: '', endTime: '' }
    };
    
    const availability = ref({ ...defaultAvailability });
    
    const form = ref({
      day: '',
      startTime: '',
      endTime: ''
    });

    const showMessage = (text, type = 'success') => {
      message.value = text;
      messageType.value = type;
      setTimeout(() => {
        message.value = '';
      }, 3000);
    };

    const fetchAvailability = async () => {
      try {
        if (!technicianUid.value) {
          console.log('No technician UID available for fetching availability');
          return;
        }
        
        console.log('Fetching availability for technician:', technicianUid.value);
        
        const availabilityRef = doc(db, 'technicianAvailability', technicianUid.value);
        const availabilitySnap = await getDoc(availabilityRef);
        
        console.log('Availability document exists:', availabilitySnap.exists());
        
        if (availabilitySnap.exists()) {
          const data = availabilitySnap.data();
          console.log('Fetched availability data:', data);
          availability.value = { ...defaultAvailability, ...data };
        } else {
          console.log('Creating new availability document with defaults');
          // Create default availability document
          await setDoc(availabilityRef, defaultAvailability);
          availability.value = { ...defaultAvailability };
        }
        
        console.log('Final availability state:', availability.value);
      } catch (error) {
        console.error('Error fetching availability:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        showMessage(`Error loading availability: ${error.message}`, 'error');
      }
    };

    const updateAvailability = async () => {
      try {
        loading.value = true;
        
        if (!technicianUid.value) {
          showMessage('Technician not authenticated', 'error');
          return;
        }
        
        if (!form.value.day || !form.value.startTime || !form.value.endTime) {
          showMessage('Please fill in all fields', 'error');
          return;
        }
        
        // Validate time logic
        const startTime = new Date(`2000-01-01 ${form.value.startTime}`);
        const endTime = new Date(`2000-01-01 ${form.value.endTime}`);
        
        if (startTime >= endTime) {
          showMessage('End time must be after start time', 'error');
          return;
        }
        
        console.log('Updating availability for technician:', technicianUid.value);
        console.log('Form data:', form.value);
        
        const availabilityRef = doc(db, 'technicianAvailability', technicianUid.value);
        
        // Check if document exists first
        const availabilitySnap = await getDoc(availabilityRef);
        console.log('Document exists:', availabilitySnap.exists());
        
        // Update the specific day
        const updateData = {
          [form.value.day]: {
            available: true,
            startTime: form.value.startTime,
            endTime: form.value.endTime
          }
        };
        
        console.log('Update data:', updateData);
        
        if (availabilitySnap.exists()) {
          // Document exists, use updateDoc
          console.log('Using updateDoc');
          await updateDoc(availabilityRef, updateData);
        } else {
          // Document doesn't exist, create it with default structure and merge
          console.log('Using setDoc to create new document');
          const fullData = { ...defaultAvailability, ...updateData };
          await setDoc(availabilityRef, fullData);
        }
        
        // Update local state
        availability.value[form.value.day] = {
          available: true,
          startTime: form.value.startTime,
          endTime: form.value.endTime
        };
        
        // Reset form
        form.value = {
          day: '',
          startTime: '',
          endTime: ''
        };
        
        showMessage('Availability updated successfully!');
      } catch (error) {
        console.error('Error updating availability:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        showMessage(`Error updating availability: ${error.message}`, 'error');
      } finally {
        loading.value = false;
      }
    };

    const setUnavailable = async () => {
      try {
        loading.value = true;
        
        if (!technicianUid.value || !form.value.day) {
          showMessage('Please select a day', 'error');
          return;
        }
        
        const availabilityRef = doc(db, 'technicianAvailability', technicianUid.value);
        
        // Check if document exists first
        const availabilitySnap = await getDoc(availabilityRef);
        
        const updateData = {
          [form.value.day]: {
            available: false,
            startTime: '',
            endTime: ''
          }
        };
        
        if (availabilitySnap.exists()) {
          // Document exists, use updateDoc
          await updateDoc(availabilityRef, updateData);
        } else {
          // Document doesn't exist, create it with default structure and merge
          const fullData = { ...defaultAvailability, ...updateData };
          await setDoc(availabilityRef, fullData);
        }
        
        // Update local state
        availability.value[form.value.day] = {
          available: false,
          startTime: '',
          endTime: ''
        };
        
        // Reset form
        form.value = {
          day: '',
          startTime: '',
          endTime: ''
        };
        
        showMessage('Day set as unavailable');
      } catch (error) {
        console.error('Error setting unavailable:', error);
        showMessage('Error updating availability', 'error');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('Technician authenticated:', user.uid);
          technicianUid.value = user.uid;
          fetchAvailability();
        } else {
          console.log('No technician authenticated');
          showMessage('Please log in to manage availability', 'error');
        }
      });
    });

    return {
      activeMenu,
      loading,
      message,
      messageType,
      availability,
      form,
      updateAvailability,
      setUnavailable,
      handleSidebarNavigate(route) {
        if (route === '/technicianavailbility') {
          this.activeMenu = 'technicianavailbility';
        } else if (route === '/technicianprofile') {
          this.activeMenu = 'technicianprofile';
        }
        this.$router.push(route);
      }
    };
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

.message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.message.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.message.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Title Styles */
.text-2xl.font-bold.text-primary {
  color: #7c6bb0 !important;
  margin: 1rem 0 !important;
  text-align: left !important;
}

.dark .text-2xl.font-bold.text-primary {
  color: var(--primary-color) !important;
}

/* Override text-primary to use CSS variable */
.text-primary {
  color: var(--primary-color) !important;
}

/* Responsive Design */
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

/* Enhanced Responsive Design */
@media (max-width: 1200px) {
  .max-w-5xl {
    max-width: 95% !important;
  }
  
  
  .max-w-4xl {
    max-width: 100% !important;
  }
  
  table.min-w-full {
    font-size: 0.875rem !important;
  }
  
  .px-6.py-3 {
    padding: 0.75rem 1rem !important;
  }
  
  .px-6.py-4 {
    padding: 1rem !important;
  }
}

@media (max-width: 1024px) {
  form {
    flex-direction: column !important;
    gap: 1rem !important;
  }
  
  .flex.flex-col {
    width: 100% !important;
  }
  
  .flex.items-end {
    width: 100% !important;
    justify-content: center !important;
  }
  
  .gap-2 {
    gap: 0.5rem !important;
  }
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
  
  /* Table Responsive */
  .overflow-x-auto {
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  table.min-w-full {
    min-width: 600px !important;
  }
  
  .px-6.py-3 {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.75rem !important;
  }
  
  .px-6.py-4 {
    padding: 0.75rem !important;
    font-size: 0.75rem !important;
  }
}

@media (max-width: 768px) {
  .flex-1.p-8 {
    padding: 1rem !important;
  }
  .mr-20 {
    margin-right: 0 !important;
  }
  .bg-secondary.bg-opacity-20.rounded-2xl.p-8.max-w-4xl.mx-auto {
    padding: 1rem !important;
  }
  
  .text-2xl {
    font-size: 1.25rem !important;
    text-align: left !important;
    margin: 1rem 0 !important;
  }
  
  .text-xl {
    font-size: 1.125rem !important;
  }
  
  .input-field {
    font-size: 0.875rem !important;
    padding: 0.75rem !important;
  }
  
  .px-8.py-2 {
    padding: 0.75rem 1.5rem !important;
    font-size: 0.875rem !important;
  }
  
  table.min-w-full {
    font-size: 0.75rem !important;
  }
  
  .px-6.py-3 {
    padding: 0.5rem !important;
    font-size: 0.7rem !important;
  }
  
  .px-6.py-4 {
    padding: 0.5rem !important;
    font-size: 0.7rem !important;
  }
  
  /* Form Layout */
  form {
    gap: 1.5rem !important;
  }
  
  .flex.flex-col {
    margin-bottom: 1rem !important;
  }
  
  .flex.items-end {
    flex-direction: row !important;
    justify-content: center !important;
    gap: 1rem !important;
  }
  
  .mt-6.md\\:mt-0 {
    margin-top: 0 !important;
  }
}

@media (max-width: 600px) {
  .flex-1.p-8 {
    padding: 0.75rem !important;
  }
  
  .bg-secondary.bg-opacity-20.rounded-2xl.p-8.max-w-4xl.mx-auto {
    padding: 0.75rem !important;
  }
  
  .text-2xl {
    font-size: 1.125rem !important;
    margin: 1rem 0 !important;
    text-align: left !important;
  }
  
  .text-xl {
    font-size: 1rem !important;
  }
  
  .input-field {
    font-size: 0.8125rem !important;
    padding: 0.625rem !important;
  }
  
  .px-8.py-2 {
    padding: 0.625rem 1.25rem !important;
    font-size: 0.8125rem !important;
  }
  
  table.min-w-full {
    font-size: 0.7rem !important;
  }
  
  .px-6.py-3 {
    padding: 0.375rem !important;
    font-size: 0.65rem !important;
  }
  
  .px-6.py-4 {
    padding: 0.375rem !important;
    font-size: 0.65rem !important;
  }
  
  /* Compact Form */
  form {
    gap: 1rem !important;
  }
  
  .flex.items-end {
    flex-direction: column !important;
    gap: 0.75rem !important;
  }
  
  .px-8.py-2,
  .px-6.py-2 {
    width: 100% !important;
    text-align: center !important;
  }
}

@media (max-width: 480px) {
  .flex-1.p-8 {
    padding: 0.5rem !important;
  }
  
  .bg-secondary.bg-opacity-20.rounded-2xl.p-8.max-w-4xl.mx-auto {
    padding: 0.5rem !important;
  }
  
  .text-2xl {
    font-size: 1rem !important;
    margin: 1rem 0 !important;
    text-align: left !important;
  }
  
  .text-xl {
    font-size: 0.875rem !important;
  }
  
  .input-field {
    font-size: 0.75rem !important;
    padding: 0.5rem !important;
  }
  
  .px-8.py-2 {
    padding: 0.5rem 1rem !important;
    font-size: 0.75rem !important;
  }
  
  /* Table Scroll */
  .overflow-x-auto {
    margin: 1rem 0 !important;
  }
  
  table.min-w-full {
    min-width: 500px !important;
    font-size: 0.65rem !important;
  }
  
  .px-6.py-3 {
    padding: 0.25rem !important;
    font-size: 0.6rem !important;
  }
  
  .px-6.py-4 {
    padding: 0.25rem !important;
    font-size: 0.6rem !important;
  }
  
  /* Form Stack */
  form {
    gap: 0.75rem !important;
  }
  
  .flex.items-end {
    gap: 0.5rem !important;
  }
  
  .px-8.py-2,
  .px-6.py-2 {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.7rem !important;
  }
}

@media (max-width: 360px) {
  .flex-1.p-8 {
    padding: 0.25rem !important;
  }
  
  .bg-secondary.bg-opacity-20.rounded-2xl.p-8.max-w-4xl.mx-auto {
    padding: 0.25rem !important;
  }
  
  .text-2xl {
    font-size: 0.875rem !important;
    margin: 1rem 0 !important;
    text-align: left !important;
  }
  
  .text-xl {
    font-size: 0.75rem !important;
  }
  
  .input-field {
    font-size: 0.6875rem !important;
    padding: 0.375rem !important;
  }
  
  .px-8.py-2 {
    padding: 0.375rem 0.75rem !important;
    font-size: 0.6875rem !important;
  }
  
  table.min-w-full {
    min-width: 450px !important;
    font-size: 0.6rem !important;
  }
  
  .px-6.py-3,
  .px-6.py-4 {
    padding: 0.125rem !important;
    font-size: 0.55rem !important;
  }
  
  .px-8.py-2,
  .px-6.py-2 {
    padding: 0.375rem 0.5rem !important;
    font-size: 0.65rem !important;
  }
}
</style>