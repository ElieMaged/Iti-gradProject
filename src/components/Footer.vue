<script setup lang="ts">

</script>

<template>
    <footer class="flex flex-col justify-between bg-[#625397] p-6 mt-1 rounded text-white">
        <div class="flex justify-between">
            <!-- quick info -->
            <div class="flex flex-col">
                <img class="w-20 pb-2" src="../assets/Logo.png">
                <p class="text-left w-60">BoltFix exists to simplify home maintenance for every household in Egypt by
                    connecting users with skilled, verified technicians.</p>

                <p class="text-2xl font-bold">Social Links</p>
                <div class="flex gap-3">
                    <a href="https://www.facebook.com/" target="_blank"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://twitter.com/" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                    <a href="https://www.instagram.com/" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
            </div>

            <!-- quick links -->
            <div class="flex flex-col">
                <p class="text-2xl font-bold">Quick Link</p>
                <router-link to="/">Home</router-link>
                <router-link to="/about">About Us</router-link>
                <router-link to="/services">Services</router-link>
                <router-link to="/contact">Contact Us</router-link>
                <router-link to="/faqs">FAQS</router-link>
            </div>

            <!-- services -->
            <div class="flex flex-col">
                <p class="text-2xl font-bold">Service</p>
                <p class="text-[#e6e3f8]">Plumbing</p>
                <p class="text-[#e6e3f8]">Air Conditioner technicians</p>
                <p class="text-[#e6e3f8]">Electricity</p>
                <p class="text-[#e6e3f8]">Wall finishing</p>
                <p class="text-[#e6e3f8]">Carpentry</p>
            </div>

            <!-- contact us -->
            <div class="flex flex-col gap-2">
                <p class="text-2xl font-bold">Contact Us</p>
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
        <hr class="border-t-4 border-[#bbb]">

        <!-- copyright -->
        <div class="flex justify-between">
            <p class="text-base font-sans font-light">© 2025 Design and Developed by ITI students</p>
            <div class="flex gap-4 text-base font-sans font-light">
                <a href="">Privacy Policy</a>
                <a href="">Terms of Service</a>
            </div>
        </div>
    </footer>
</template>


<style lang="scss" scoped >
// .footer {
//     display: flex;
//     flex-direction: column;
//     margin: 0px;
//     &__one {
//         display: flex;
//         flex-direction: column;
//         justify-content: space-between;
//        background-color: rgb(255, 255, 255);
//        margin: 0;
//        &__row {
//         display: flex;
//         flex-direction: row;
//         justify-content:space-around;
//         margin: 1rem;
//         &__news {
//             display: flex;
//             flex-direction: column;
//             flex-wrap: wrap;
//         }
//        }
       
//     }
// &__two {
//         display: flex;
//         flex-direction: row;
//     }
//     &__two > ul {
//         list-style: none
//     }
// }


// @media (max-width: 700px) {
//   .footer {
//     &__one__row {
//     display: flex;
//     flex-direction: column;
//     }
//     &__second {
//       display: flex;
//     flex-direction: column;
//    justify-content: space-around;
      
//     }
//     &__two {
//     display: flex;
//     flex-direction: column;
//    justify-content: space-around;
//     }
// ul > li {
//      text-align:center;
// }
//   }

// }
// .footer {
//   &__one--input {
//     &__:focus {
//         border:none;
//         border-color: transparent;
//     }
//   border: none;
//   border-color: transparent;
//   border-bottom:1px solid #444;
//   padding-left: 1rem;
//   padding-left: 1rem;
//   width:100%;
//   }
// &__one--button {
//   border: none !important;
//   border-color: transparent !important;
//   background-color: black;
//   color: white;
//   padding-top: .5rem;
//   padding-bottom: .5rem;
//   width:50%;
//   cursor: pointer;
//   box-shadow: 5px 10px;
// }
// &__one__row--email {
// display: flex;
// flex-direction: column;
// margin: 1rem;
// }
// &__second {
//     text-align: right;
//     display:flex;
//     flex-direction: col;
//     justify-content: space-around;
//      background-color: #625397;
//  text-align: center;
//  &--address {
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     text-align:end;
//     margin-right: 1rem;
//     margin-bottom: 1rem;
//  }
// }
// }

// ul > li {
//     text-align:left;
//     margin-top: 1rem;
// }









</style>