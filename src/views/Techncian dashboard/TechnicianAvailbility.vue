<template>
    <body class="bg-gray-50 font-sans layout-container">
    
        <div class="flex min-h-screen">
            <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
            
            />
            <!-- Main Content -->
            <div class="flex-1 main-layout">
                <div class=" mx-12 p-4">
                    <TopBar :title="$t('availabilityTitle')" />
                    
                    <!-- Success/Error Messages -->
                    <div v-if="message" :class="['message', messageType]" class="mb-4 p-4 rounded-lg">
                        {{ message }}
                    </div>
                    
                    <!-- Availability Table -->
                    <div class="overflow-x-auto mb-12">
                        <table class="min-w-full border border-gray-300 rounded-lg">
                            <thead>
                                <tr class="">
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
                                            <div v-if="availability.saturday.bookedSlots && availability.saturday.bookedSlots.length > 0" class="booked-slots">
                                                <div class="booked-slots-title">Booked:</div>
                                                <div v-for="slot in availability.saturday.bookedSlots" :key="slot" class="booked-slot">
                                                    {{ slot }}
                                                </div>
                                            </div>
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.sunday && availability.sunday.available">
                                            {{ availability.sunday.startTime }} - {{ availability.sunday.endTime }}
                                            <div v-if="availability.sunday.bookedSlots && availability.sunday.bookedSlots.length > 0" class="booked-slots">
                                                <div class="booked-slots-title">Booked:</div>
                                                <div v-for="slot in availability.sunday.bookedSlots" :key="slot" class="booked-slot">
                                                    {{ slot }}
                                                </div>
                                            </div>
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.monday && availability.monday.available">
                                            {{ availability.monday.startTime }} - {{ availability.monday.endTime }}
                                            <div v-if="availability.monday.bookedSlots && availability.monday.bookedSlots.length > 0" class="booked-slots">
                                                <div class="booked-slots-title">Booked:</div>
                                                <div v-for="slot in availability.monday.bookedSlots" :key="slot" class="booked-slot">
                                                    {{ slot }}
                                                </div>
                                            </div>
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.tuesday && availability.tuesday.available">
                                            {{ availability.tuesday.startTime }} - {{ availability.tuesday.endTime }}
                                            <div v-if="availability.tuesday.bookedSlots && availability.tuesday.bookedSlots.length > 0" class="booked-slots">
                                                <div class="booked-slots-title">Booked:</div>
                                                <div v-for="slot in availability.tuesday.bookedSlots" :key="slot" class="booked-slot">
                                                    {{ slot }}
                                                </div>
                                            </div>
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.wednesday && availability.wednesday.available">
                                            {{ availability.wednesday.startTime }} - {{ availability.wednesday.endTime }}
                                            <div v-if="availability.wednesday.bookedSlots && availability.wednesday.bookedSlots.length > 0" class="booked-slots">
                                                <div class="booked-slots-title">Booked:</div>
                                                <div v-for="slot in availability.wednesday.bookedSlots" :key="slot" class="booked-slot">
                                                    {{ slot }}
                                                </div>
                                            </div>
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.thursday && availability.thursday.available">
                                            {{ availability.thursday.startTime }} - {{ availability.thursday.endTime }}
                                            <div v-if="availability.thursday.bookedSlots && availability.thursday.bookedSlots.length > 0" class="booked-slots">
                                                <div class="booked-slots-title">Booked:</div>
                                                <div v-for="slot in availability.thursday.bookedSlots" :key="slot" class="booked-slot">
                                                    {{ slot }}
                                                </div>
                                            </div>
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                    <td class="px-6 py-4 border border-gray-300">
                                        <span v-if="availability.friday && availability.friday.available">
                                            {{ availability.friday.startTime }} - {{ availability.friday.endTime }}
                                            <div v-if="availability.friday.bookedSlots && availability.friday.bookedSlots.length > 0" class="booked-slots">
                                                <div class="booked-slots-title">Booked:</div>
                                                <div v-for="slot in availability.friday.bookedSlots" :key="slot" class="booked-slot">
                                                    {{ slot }}
                                                </div>
                                            </div>
                                        </span>
                                        <span v-else class="text-gray-400">Unavailable</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Set Available Hours Form -->
                    <div class="availability-form-container">
                        <h3 class="form-title">{{ $t('availabilityDesc') }}</h3>
                        <form class="availability-form" @submit.prevent="updateAvailability">
                            <div class="form-row">
                                <div class="form-field">
                                    <label class="form-label">{{ $t('day') }}</label>
                                    <select v-model="form.day" class="form-select" required>
                                        <option value="">{{ $t('selectDay') }}</option>
                                        <option v-for="dayOption in weekDays" :key="dayOption.value" :value="dayOption.value">
                                            {{ dayOption.label }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-field">
                                    <label class="form-label">{{ $t('from') }}</label>
                                    <select v-model="form.startTime" class="form-select" required>
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
                                <div class="form-field">
                                    <label class="form-label">{{ $t('to') }}</label>
                                    <select v-model="form.endTime" class="form-select" required>
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
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary">
                                    {{ loading ? $t('updating') : $t('apply') }}
                                </button>
                                <button 
                                    v-if="form.day" 
                                    type="button" 
                                    @click="setUnavailable" 
                                    class="btn-secondary"
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
import Sidebar from '../../components/Sidebar.vue';
import TopBar from '../../components/TopBar.vue';

import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default {
  components: {
    Sidebar,
    TopBar
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

    // Generate week days with dates starting from tomorrow
    const generateWeekDays = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Start from tomorrow
      
      const weekDays = [];
      const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(tomorrow);
        date.setDate(tomorrow.getDate() + i);
        
        const dayName = dayNames[i];
        const formattedDate = date.toLocaleDateString('en-US', { 
          month: 'numeric', 
          day: 'numeric' 
        });
        
        weekDays.push({
          value: dayName,
          label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${formattedDate}`
        });
      }
      
      return weekDays;
    };

    const weekDays = ref(generateWeekDays());

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
      weekDays,
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
.main-layout{
  margin-left: 14rem;
  background-color: #faf8fd;
}
.body{
  background-color: var(--primary-bg);
}
 .page-title {
   color: var(--primary-color);
   font-size: 2rem;
   font-weight: 700;
   margin-bottom: 2rem;
   font-family: Outfit, sans-serif;
 }

.dark .page-title {
  color: var(--primary-color);
}
.dark thead{
  background-color: var(--text-muted);
  color: var(--primary-text);
}
.dark tbody{
  background-color: var(--input-bg);
  color: var(--primary-text-dark);
}
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
.dark-mode thead {
  background-color: var(--text-muted);
  color: var(--primary-text);
}

/* Center align table header text */
thead th {
  text-align: center;
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



/* Override text-primary to use CSS variable */
.text-primary {
  color: var(--primary-color) !important;
}

/* Enhanced Form Styles */
.availability-form-container {
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
  position: relative;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}





.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: left;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}



.availability-form {
  width: 100%;
  position: relative;
  z-index: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.form-select {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #333;
  transition: border-color 0.2s;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.form-select::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.form-select:hover::before {
  left: 100%;
}

.form-select:focus {
  border-color: #7c6bb0;
  outline: none;
}

.form-select:hover {
  border-color: #7c6bb0;
}

.form-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
}

.btn-primary {
  background: #7c6bb0;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.75rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}



.btn-primary:hover {
  background: #5a4e99;
}

.btn-secondary {
  background: #7c6bb0;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.75rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}



.btn-secondary:hover {
  background: #5a4e99;
}

/* Dark Mode Form Styles */
.dark .availability-form-container {
  background: var(--grey-bg);
  border-color: var(--border-color);
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
}

/* Dark Mode Table Styles */
.dark table.min-w-full td {
  background-color: var(--input-bg);
}

/* Booked Slots Styling */
.booked-slots {
  margin-top: 0.5rem;
  padding: 0.25rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  border-left: 3px solid #ef4444;
}

.booked-slots-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.booked-slot {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.125rem 0.25rem;
  background-color: #e5e7eb;
  border-radius: 0.125rem;
  margin: 0.125rem 0;
  text-decoration: line-through;
  opacity: 0.7;
}

/* Dark Mode Booked Slots */
.dark .booked-slots {
  background-color: var(--grey-bg);
  border-left-color: #f87171;
}

.dark .booked-slots-title {
  color: #f87171;
}

.dark .booked-slot {
  background-color: var(--input-bg);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.dark .form-title {
  color: var(--primary-color);
}

.dark .form-label {
  color: var(--primary-text);
}

.dark .form-select {
  background: var(--input-bg);
  color: var(--text-muted);
  border-color: var(--border-color);
}

.dark .form-select:focus {
  border-color: var(--secondary);
  outline: none;
}

.dark .form-select:hover {
  border-color: var(--secondary);
}

.dark .btn-primary,
.dark .btn-secondary {
  background: var(--primary);
  color: var(--primary-text);
}

.dark .btn-primary:hover,
.dark .btn-secondary:hover {
  background: var(--primary);
  color: var(--primary-text);
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
  .form-row {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
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
  
  .availability-form-container {
    padding: 1.5rem !important;
  }
  
  .form-title {
    font-size: 1.25rem !important;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  .availability-form-container {
    padding: 1rem !important;
  }
  
  .form-title {
    font-size: 1.125rem !important;
    margin-bottom: 1.5rem !important;
  }
  
  .form-select {
    padding: 0.75rem !important;
    font-size: 0.875rem !important;
  }
  
  .btn-primary,
  .btn-secondary {
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
}

@media (max-width: 600px) {
  .flex-1.p-8 {
    padding: 0.75rem !important;
  }
  
  .availability-form-container {
    padding: 0.75rem !important;
  }
  
  .form-title {
    font-size: 1rem !important;
    margin-bottom: 1.25rem !important;
  }
  
  .form-select {
    padding: 0.625rem !important;
    font-size: 0.8125rem !important;
  }
  
  .btn-primary,
  .btn-secondary {
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
}

@media (max-width: 480px) {
  .flex-1.p-8 {
    padding: 0.5rem !important;
  }
  
  .availability-form-container {
    padding: 0.5rem !important;
  }
  
  .form-title {
    font-size: 0.875rem !important;
    margin-bottom: 1rem !important;
  }
  
  .form-select {
    padding: 0.5rem !important;
    font-size: 0.75rem !important;
  }
  
  .btn-primary,
  .btn-secondary {
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
}

@media (max-width: 360px) {
  .flex-1.p-8 {
    padding: 0.25rem !important;
  }
  
  .availability-form-container {
    padding: 0.25rem !important;
  }
  
  .form-title {
    font-size: 0.75rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  .form-select {
    padding: 0.375rem !important;
    font-size: 0.6875rem !important;
  }
  
  .btn-primary,
  .btn-secondary {
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
}
</style>