<script setup lang="ts">
// No script logic needed for static footer
</script>

<template>
    <footer class="flex flex-col justify-between bg-[#625397] p-6 mt-1 rounded text-white">
        <div class="flex flex-col md:flex-row justify-between gap-8">
            <!-- quick info -->
            <div class="flex flex-col mb-6 md:mb-0">
                <img class="w-20 pb-2" src="../assets/Logo.png" alt="BoltFix logo">
                <p class="text-left w-60">BoltFix exists to simplify home maintenance for every household in Egypt by
                    connecting users with skilled, verified technicians.</p>
                <p class="text-2xl font-bold mt-4">Social Links</p>
                <div class="flex gap-3 mt-2">
                    <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://twitter.com/" target="_blank" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                    <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
            </div>

            <!-- quick links -->
            <div class="flex flex-col mb-6 md:mb-0">
                <p class="text-2xl font-bold mb-2">Quick Link</p>
                <router-link to="/">Home</router-link>
                <router-link to="/about">About Us</router-link>
                <router-link to="/services">Services</router-link>
                <router-link to="/contact">Contact Us</router-link>
                <router-link to="/faqs">FAQS</router-link>
            </div>

            <!-- services -->
            <div class="flex flex-col mb-6 md:mb-0">
                <p class="text-2xl font-bold mb-2">Service</p>
                <router-link class="text-[#e6e3f8]" to="/plumbing">Plumbing</router-link>
                <router-link class="text-[#e6e3f8]" to="/aircondition">Air Conditioner technicians</router-link>
                <router-link class="text-[#e6e3f8]" to="/electricity">Electricity</router-link>
                <router-link class="text-[#e6e3f8]" to="/wallfinishing">Wall finishing</router-link>
                <router-link class="text-[#e6e3f8]" to="/carpentry">Carpentry</router-link>
            </div>

            <!-- contact us -->
            <div class="flex flex-col gap-2">
                <p class="text-2xl font-bold mb-2">Contact Us</p>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-phone text-[#c3b0f4] text-base text-center"></i>
                    <span class="text-[#e6e3f8]">925-465-3762</span>
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-envelope text-[#c3b0f4] text-base text-center"></i>
                    <span class="text-[#e6e3f8]">boltfix@gmail.com</span>
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-location-dot text-[#c3b0f4] text-base text-center"></i>
                    <span class="text-[#e6e3f8]">4096 Modesto,<br>CA 95350, USA</span>
                </div>
            </div>
        </div>

        <!-- divider -->
        <hr class="border-t-4 border-[#bbb] my-4">

        <!-- copyright -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-2">
            <p class="text-base font-sans font-light">© 2025 Design and Developed by ITI students</p>
            <div class="flex gap-4 text-base font-sans font-light">
                <a href="#">Privacy Policy</a>
                <span class="hidden md:inline">|</span>
                <a href="#">Terms of Service</a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
/* No additional styles needed; Tailwind handles layout and colors. */
</style>

