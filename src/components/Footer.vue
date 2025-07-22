<script setup lang="ts">
// No script logic needed for static footer
</script>

<template>
    <footer class="flex flex-col justify-between bg-[#625397] p-6 mt-1 rounded text-white">
        <div class="flex flex-col md:flex-row justify-between gap-8">
            <!-- quick info -->
            <div class="flex flex-col mb-6 md:mb-0">
                <img class="w-20 pb-2" src="../assets/Logo.png" alt="BoltFix logo">
                <p class="text-left w-60">{{ $t('footerQuickInfo') }}</p>
                <p class="text-2xl font-bold mt-4">{{ $t('footerSocialLinks') }}</p>
                <div class="flex gap-3 mt-2">
                    <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://twitter.com/" target="_blank" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                    <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
            </div>

            <!-- quick links -->
            <div class="flex flex-col mb-6 md:mb-0">
                <p class="text-2xl font-bold mb-2">{{ $t('footerQuickLink') }}</p>
                <router-link to="/">{{ $t('footerHome') }}</router-link>
                <router-link to="/about">{{ $t('footerAboutUs') }}</router-link>
                <router-link to="/services">{{ $t('footerServices') }}</router-link>
                <router-link to="/contact">{{ $t('footerContactUs') }}</router-link>
                <router-link to="/faqs">{{ $t('footerFaqs') }}</router-link>
            </div>

            <!-- services -->
            <div class="flex flex-col mb-6 md:mb-0">
                <p class="text-2xl font-bold mb-2">{{ $t('footerService') }}</p>
                <router-link class="text-[#e6e3f8]" to="/plumbing">{{ $t('footerPlumbing') }}</router-link>
                <router-link class="text-[#e6e3f8]" to="/aircondition">{{ $t('footerAirConditioner') }}</router-link>
                <router-link class="text-[#e6e3f8]" to="/electricity">{{ $t('footerElectricity') }}</router-link>
                <router-link class="text-[#e6e3f8]" to="/wallfinishing">{{ $t('footerWallFinishing') }}</router-link>
                <router-link class="text-[#e6e3f8]" to="/carpentry">{{ $t('footerCarpentry') }}</router-link>
            </div>

            <!-- contact us -->
            <div class="flex flex-col gap-2">
                <p class="text-2xl font-bold mb-2">{{ $t('footerContactUs') }}</p>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-phone text-[#c3b0f4] text-base text-center"></i>
                    <span class="text-[#e6e3f8]">{{ $t('footerPhone') }}</span>
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-envelope text-[#c3b0f4] text-base text-center"></i>
                    <span class="text-[#e6e3f8]">{{ $t('footerEmail') }}</span>
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-location-dot text-[#c3b0f4] text-base text-center"></i>
                    <span class="text-[#e6e3f8]">{{ $t('footerAddress') }}</span>
                </div>
            </div>
        </div>

        <!-- divider -->
        <hr class="border-t-4 border-[#bbb] my-4">

        <!-- copyright -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-2">
            <p class="text-base font-sans font-light">{{ $t('footerCopyright') }}</p>
            <div class="flex gap-4 text-base font-sans font-light">
                <a href="#">{{ $t('footerPrivacyPolicy') }}</a>
                <span class="hidden md:inline">|</span>
                <a href="#">{{ $t('footerTermsOfService') }}</a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
/* No additional styles needed; Tailwind handles layout and colors. */
</style>

