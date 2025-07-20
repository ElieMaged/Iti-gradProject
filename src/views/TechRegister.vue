<template>
  <div class="tech-register-bg min-h-screen flex items-center justify-center">
    <div class="tech-register-card w-full max-w-6xl bg-white rounded-3xl shadow-lg p-10 md:p-16">
      <div class="flex flex-col items-center mb-8">
        <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="BoltFix Logo" class="h-12 mb-2" />
        <h2 class="text-3xl md:text-4xl font-bold text-center text-[#6B4FA1] mb-1">Technician Registration</h2>
        <p class="text-lg text-gray-500 text-center">Create an Account</p>
      </div>
      <form class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Personal Information -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">Personal Information</h3>
          <input type="text" placeholder="Full Name" class="input-field" />
          <input type="email" placeholder="Email Address" class="input-field" />
          <input type="password" placeholder="Password" class="input-field" />
          <input type="password" placeholder="Confirm Password" class="input-field" />
        </div>
        <!-- Professional Details -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">Professional Details</h3>
          <select class="input-field">
            <option disabled selected>Specialization</option>
            <option>Plumbing</option>
            <option>Electricity</option>
            <option>Carpentry</option>
            <option>Wall Finishing</option>
            <option>Air Conditioning</option>
          </select>
          <select class="input-field">
            <option disabled selected>Years of Experience</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
          <input type="text" placeholder="Brief Description / Bio" class="input-field" />
          <input type="text" placeholder="Base Visit Price" class="input-field" />
        </div>
        <!-- Location -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">Location</h3>
          <select class="input-field">
            <option disabled selected>Government</option>
            <option>Cairo</option>
            <option>Giza</option>
            <option>Alexandria</option>
          </select>
          <select class="input-field">
            <option disabled selected>District / Area</option>
            <option>Nasr City</option>
            <option>Maadi</option>
            <option>Dokki</option>
          </select>
          <div class="flex items-center gap-4 mt-2">
            <span class="text-gray-700">Willing to Travel ?</span>
            <label class="flex items-center gap-1">
              <input type="radio" name="travel" value="yes" checked />
              <span>Yes</span>
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" name="travel" value="no" />
              <span>No</span>
            </label>
          </div>
        </div>
        <!-- ID Upload & Checkboxes -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">Please Upload Your ID</h3>
          <div class="flex-1 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl bg-gray-50 min-h-[120px] mb-2">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-2" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              <span class="text-gray-500">Drag & drop files or <span class="font-bold text-black cursor-pointer">Browse</span></span>
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="accent-[#6B4FA1]" />
              <span class="text-gray-700 text-sm">i confirm that the information provided is accurate</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" class="accent-[#6B4FA1]" />
              <span class="text-gray-700 text-sm">I agree to the Terms & Conditions and Privacy policy</span>
            </label>
          </div>
        </div>
      </form>
      <div class="flex flex-col items-center mt-8">
        <button class="w-60 py-3 rounded-full bg-[#6B4FA1] text-white font-semibold text-lg shadow-md hover:bg-[#5a3e8b] transition">Register</button>
        <p class="mt-4 text-gray-700">Have an account? <a href="/userlogin" class="text-[#6B4FA1] font-semibold hover:underline">Sign In</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic for now, just UI
</script>

<style scoped>
.tech-register-bg {
  background-color: #d3cfe2;
}
.tech-register-card {
  border-radius: 2rem;
}
.input-field {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#6B4FA1] focus:border-[#6B4FA1] block w-full p-3;
  background-color: #EAEAEA;
  border-radius: 2rem;
}
</style> 