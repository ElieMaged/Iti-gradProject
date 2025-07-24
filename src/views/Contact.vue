<script>

</script>

<template>
    <div class="flex flex-col md:grid md:grid-cols-12 m-3 container">

  
    <div class="col-span-5 ">
     <h2 class="title">{{ $t('contactUs') }}</h2>
     <p class="text-2xl">{{ $t('contactIntro') }}</p>

     <div class="flex flex-row">
     <div class="flex flex-col m-5">
         <img class="w-20" src="/src/assets/Icons/phone.svg" alt="">
         <h2>{{ $t('phone') }}</h2>
         <p>+20 112 345  5565</p>
     </div>
   <div class="flex flex-col m-5">
         <img class="w-20" src="/src/assets/Icons/whatsapp.svg" alt="">
         <h2>{{ $t('whatsapp') }}</h2>
         <p>+20 112 345  5565</p>
     </div>
  </div>

       <div class="flex flex-row">
     <div class="flex flex-col m-5">
         <img class="w-20" src="/src/assets/Icons/email.svg" alt="">
         <h2>{{ $t('phone') }}</h2>
         <p>boltfix@gmail.com</p>
     </div>
   <div class="flex flex-col m-5">
         <img class="w-20" src="/src/assets/Icons/facebook.svg" alt="">
         <h2>{{ $t('facebook') }}</h2>
         <p class="text-lg">facebook/link</p>
     </div>
     



     
    </div>
</div>

<form class="max-w-sm mx-auto col-span-5">
    <h2 class="title">{{ $t('getInTouch') }}</h2>
  <div class="mb-3">
    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">{{ $t('name') }}</label>
    <input type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('name')" required />
  </div>
  <div class="mb-3">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">{{ $t('yourEmail') }}</label>
    <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('yourEmail')" required />
  </div>
    <div class="mb-3">
    <label for="Subject" class="block mb-2 text-sm font-medium text-gray-900 ">{{ $t('yourSubject') }}</label>
    <input type="Subject" id="Subject" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('yourSubject')" required />
  </div>
  <div class="mb-3">
    <label for="complaint" class="block mb-2 text-sm font-medium text-gray-900">{{ $t('yourComplaint') }}</label>
    <textarea type="text" id="complaint" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('myComplaintIs')" required></textarea>
  </div>

  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ $t('submit') }}</button>
</form>
</div>

</template>

<style scoped>
.title {
    color:#625397;
}
input, textarea {
    background-color: #EAEAEA;
    border-radius: 5rem;
}

button {
 background-color: #625397; 
 border-radius: 3rem;
}

button:hover {
background-color: #7563b7;
}
button:active {
    background-color: #433867;
}
.dark .title {
    color: var(--primary-text) !important;
}
.dark input, textarea {
    background-color: var(--secondary-bg) !important;
    color: var(--primary-text) !important;
}

</style>