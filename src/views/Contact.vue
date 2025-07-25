<script>

</script>

<template>
  <div class="flex flex-col lg:flex-row gap-5 py-10 px-3">
    <div class="flex flex-col gap-5">
      <div>
        <h2 class="title">{{ $t('contactUs') }}</h2>
        <p class="text-large">{{ $t('contactIntro') }}</p>
      </div>

      <div class="flex flex-col md:grid md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row items-center gap-2">
            <i class="fas fa-phone text-2xl text-[#625397]"></i>
            <h4>{{ $t('phone') }}</h4>
          </div>
          <p>+20 112 345 5565</p>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-row items-center gap-2">
            <i class="fab fa-whatsapp text-2xl text-[#625397]"></i>
            <h3>{{ $t('whatsapp') }}</h3>
          </div>
          <p>+20 112 345 5565</p>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-row items-center gap-2">
            <i class="fas fa-envelope text-2xl text-[#625397]"></i>
            <h4>{{ $t('email') }}</h4>
          </div>
          <p>boltfix@gmail.com</p>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-row items-center gap-2">
            <i class="fab fa-facebook text-2xl text-[#625397]"></i>
            <h4>{{ $t('facebook') }}</h4>
          </div>
          <p class="text-lg">facebook/link</p>
        </div>
      </div>
    </div>

    <form class="flex flex-col">
      <h2 class="title">{{ $t('getInTouch') }}</h2>
      <div class="mb-3">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">{{ $t('name') }}</label>
        <input type="name" id="name"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="$t('name')" required />
      </div>
      <div class="mb-3">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">{{ $t('yourEmail') }}</label>
        <input type="email" id="email"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="$t('yourEmail')" required />
      </div>
      <div class="mb-3">
        <label for="Subject" class="block mb-2 text-sm font-medium text-gray-900 ">{{ $t('yourSubject') }}</label>
        <input type="Subject" id="Subject"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="$t('yourSubject')" required />
      </div>
      <div class="mb-3">
        <label for="complaint" class="block mb-2 text-sm font-medium text-gray-900">{{ $t('yourComplaint') }}</label>
        <textarea type="text" id="complaint"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="$t('myComplaintIs')" required></textarea>
      </div>

      <button type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{
          $t('submit') }}</button>
    </form>
  </div>

</template>

<style scoped>
.title {
  color: #625397;
}

input,
textarea {
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

.dark input,
textarea {
  background-color: var(--secondary-bg) !important;
  color: var(--primary-text) !important;
}
</style>