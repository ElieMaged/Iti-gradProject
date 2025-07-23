<template>
  <form v-if="technician" @submit.prevent="updateProfile">
    <input v-model="technician.name" placeholder="Name" required />
    <input v-model="technician.price" placeholder="Price" type="number" required />
    <input v-model="technician.description" placeholder="Description" required />
    <input type="file" @change="onFileChange" />
    <button type="submit">Save</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const technician = ref(null)
let imageFile = null

onMounted(async () => {
  const docRef = doc(db, 'technicians', route.params.id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    technician.value = docSnap.data()
  }
})

function onFileChange(e) {
  imageFile = e.target.files[0]
}

async function updateProfile() {
  let imageUrl = technician.value.image
  if (imageFile) {
    imageUrl = await toBase64(imageFile)
  }
  await updateDoc(doc(db, 'technicians', route.params.id), {
    ...technician.value,
    image: imageUrl
  })
  alert('Profile updated!')
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
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
.input-field {
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #333333;
  transition: all 0.2s ease;
}
.input-field:focus {
  outline: none;
  border-color: #7c6bb0;
  box-shadow: 0 0 0 2px rgba(124, 107, 176, 0.2);
}
.input-field:disabled {
  background-color: #f5f5f5;
  color: #666666;
  cursor: not-allowed;
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