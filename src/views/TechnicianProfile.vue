<template>
  <div v-if="technician">
    <div class="profile-header">
      <img :src="technician.image" alt="Technician" class="profile-img" />
      <div>
        <h2>{{ technician.name }}</h2>
        <p>{{ technician.description }}</p>
        <p><strong>Price:</strong> {{ technician.price }} EGP</p>
        <div class="rating">
          <i class="fa-solid fa-star" v-for="n in technician.rating || 5" :key="n"></i>
        </div>
        <button @click="showBooking = true" class="book-btn">Book</button>
      </div>
    </div>
    <div v-if="showBooking" class="booking-modal">
      <h3>Book {{ technician.name }}</h3>
      <form @submit.prevent="bookTechnician">
        <input v-model="bookingDetails.name" placeholder="Your Name" required />
        <input v-model="bookingDetails.phone" placeholder="Phone" required />
        <button type="submit">Confirm Booking</button>
        <button type="button" @click="showBooking = false">Cancel</button>
      </form>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const technician = ref(null)
const showBooking = ref(false)
const bookingDetails = ref({ name: '', phone: '' })

onMounted(async () => {
  const id = route.params.id
  const docRef = doc(db, 'technicians', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    technician.value = docSnap.data()
  }
})

async function bookTechnician() {
  await addDoc(collection(db, 'bookings'), {
    technicianId: route.params.id,
    ...bookingDetails.value,
    timestamp: new Date()
  })
  alert('Booking confirmed!')
  showBooking.value = false
  bookingDetails.value = { name: '', phone: '' }
}
</script>

<style scoped>
.profile-header { display: flex; gap: 2rem; align-items: center; }
.profile-img { width: 200px; height: 200px; object-fit: cover; border-radius: 12px; }
.rating i { color: #FFC230; }
.book-btn { background: var(--primary-color); color: #fff; border: none; padding: 0.5rem 1.5rem; border-radius: 20px; cursor: pointer; }
.booking-modal { background: #fff; border: 1px solid #ccc; padding: 2rem; border-radius: 12px; margin-top: 2rem; }
</style> 