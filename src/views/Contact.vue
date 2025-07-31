<script>

</script>

<template>
  <div class="flex flex-col lg:flex-row gap-5 m-20">
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
          <a href="mailto:boltfix@gmail.com">boltfix@gmail.com</a>
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

/* Responsive Design */
@media (max-width: 1200px) {
  .flex.flex-col.lg\:flex-row {
    gap: 2rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
  
  .text-large {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .flex.flex-col.lg\:flex-row {
    margin: 1rem;
    gap: 2rem;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .text-large {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .flex.flex-col.gap-2 {
    gap: 0.75rem;
  }
  
  .flex.flex-row.items-center.gap-2 {
    gap: 0.75rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  h3, h4 {
    font-size: 1rem;
  }
  
  p, a {
    font-size: 0.9rem;
  }
  
  .text-lg {
    font-size: 0.9rem;
  }
  
  form {
    gap: 1rem;
  }
  
  .mb-3 {
    margin-bottom: 1rem;
  }
  
  .block.mb-2 {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  input, textarea {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .flex.flex-col.lg\:flex-row {
    margin: 0.75rem;
    gap: 1.5rem;
  }
  
  .title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  .text-large {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    gap: 1.25rem;
  }
  
  .flex.flex-col.gap-2 {
    gap: 0.6rem;
  }
  
  .flex.flex-row.items-center.gap-2 {
    gap: 0.6rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  h3, h4 {
    font-size: 0.9rem;
  }
  
  p, a {
    font-size: 0.85rem;
  }
  
  .text-lg {
    font-size: 0.85rem;
  }
  
  form {
    gap: 0.75rem;
  }
  
  .mb-3 {
    margin-bottom: 0.75rem;
  }
  
  .block.mb-2 {
    margin-bottom: 0.4rem;
    font-size: 0.85rem;
  }
  
  input, textarea {
    padding: 0.6rem;
    font-size: 0.85rem;
  }
  
  button {
    padding: 0.6rem 1.25rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 360px) {
  .flex.flex-col.lg\:flex-row {
    margin: 0.5rem;
    gap: 1.25rem;
  }
  
  .title {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }
  
  .text-large {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    gap: 1rem;
  }
  
  .flex.flex-col.gap-2 {
    gap: 0.5rem;
  }
  
  .flex.flex-row.items-center.gap-2 {
    gap: 0.5rem;
  }
  
  .text-2xl {
    font-size: 1.1rem;
  }
  
  h3, h4 {
    font-size: 0.85rem;
  }
  
  p, a {
    font-size: 0.8rem;
  }
  
  .text-lg {
    font-size: 0.8rem;
  }
  
  form {
    gap: 0.6rem;
  }
  
  .mb-3 {
    margin-bottom: 0.6rem;
  }
  
  .block.mb-2 {
    margin-bottom: 0.3rem;
    font-size: 0.8rem;
  }
  
  input, textarea {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .flex.flex-col.lg\:flex-row {
    flex-direction: row;
    gap: 1.5rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  form {
    flex: 1;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  input, textarea {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
</style>