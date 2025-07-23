<template>
  <form @submit.prevent="register">
    <input v-model="form.name" placeholder="Name" required />
    <input v-model="form.price" placeholder="Price" type="number" required />
    <input v-model="form.description" placeholder="Description" required />
    <input type="file" @change="onFileChange" required />
    <button type="submit">Register</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

const form = ref({ name: '', price: '', description: '', image: '', rating: 5 })
let imageFile = null

function onFileChange(e) {
  imageFile = e.target.files[0]
}

async function register() {
  let imageUrl = ''
  if (imageFile) {
    // For demo: use base64
    imageUrl = await toBase64(imageFile)
  }
  await addDoc(collection(db, 'technicians'), {
    ...form.value,
    image: imageUrl
  })
  alert('Technician registered!')
  form.value = { name: '', price: '', description: '', image: '', rating: 5 }
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
.tech-register-bg {
  background-color: #d3cfe2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-register-card {
  width: 100%;
  max-width: 72rem;
  background-color: white;
  border-radius: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
}

@media (min-width: 768px) {
  .tech-register-card {
    padding: 4rem;
  }
}

.input-field {
  background-color: #EAEAEA;
  border: 1px solid #d1d5db;
  color: #111827;
  font-size: 0.875rem;
  border-radius: 2rem;
  display: block;
  width: 100%;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #6B4FA1;
  box-shadow: 0 0 0 3px rgba(107, 79, 161, 0.1);
}

.upload-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #9ca3af;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  min-height: 120px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.upload-area:hover {
  border-color: #6B4FA1;
}

.preview-img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 0.75rem;
  margin: 0 auto;
  display: block;
  object-fit: cover;
  border: 2px solid #6B4FA1;
}

.register-btn {
  width: 15rem;
  padding: 0.75rem 0;
  border-radius: 9999px;
  background-color: #6B4FA1;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
}

.register-btn:hover:not(:disabled) {
  background-color: #5a3e8b;
}

.register-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

/* Grid layout */
.grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Utility classes */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.text-center { text-align: center; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-8 { gap: 2rem; }
.w-full { width: 100%; }
.h-12 { height: 3rem; }
.text-3xl { font-size: 1.875rem; }
.text-lg { font-size: 1.125rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.text-gray-500 { color: #6b7280; }
.text-gray-700 { color: #374151; }
.text-red-500 { color: #ef4444; }
.text-green-500 { color: #10b981; }
.cursor-pointer { cursor: pointer; }
.hover\:underline:hover { text-decoration: underline; }
.hidden { display: none; }
</style> 