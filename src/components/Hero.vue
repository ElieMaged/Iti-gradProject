<template>
  <section
    class="bg-cover bg-no-repeat p-10 flex items-center umg-fluid"
    style="background-image: url('/images/7fc6779f3c036fdfd70e0846072d5fced1bbd2c6.png')" >
    <div class="text-left w-full max-w-xl mx-15">
        
        <h1 class=" font-extrabold text-gray-900 leading-tight">
        Specialized Efficient Solutions
        </h1>
        <p class="text-gray-600 mt-4">
        Our expert technicians tackle every project with innovation and expertise.
        From simple repairs to complex installations, we’re the trusted partner you need.
        </p>
        <div class="mt-6 flex gap-4">
        <button id="book-btn" class="bg-purple-700 text-white px-4 py-2 rounded-full">
            Book an Appointment →
        </button>
        <button id="service-btn" class="bg-purple-200 text-purple-900 px-4 py-2 rounded-full">
            Show all services →
        </button>
    </div>
    </div>
  </section>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>
section {
    height:  550px;
    width: 100%;
}
h1{
    color: var(--text-color-text-primary, #1F2021);
    font-family: Outfit;
    font-style: normal;
/* Display Large/Semibold */
    font-size: 70px;
    font-weight: 600;
    line-height: 96px; /* 120% */
}
p {
    color: var(--text-color-text-secondary, #8C8E90);
    font-size: 20px;
    font-weight: 400;
    line-height: 30px; /* 150% */
    font-family: Outfit;
    font-style: normal;
}
#book-btn {
    border-radius: 58px;
    border: 1px solid var(--border-border-brand, #625397);
    background: var(--surface-color-surface-brand, #625397);
}
#service-btn {
    border-radius: 58px;
    border: 1px solid var(--border-border-brand, #625397);
    background: var(--surface-color-surface-clicked, #948AB8);
    color: white;
}

/* Responsive styles for tablet and mobile only */
@media (max-width: 900px) {
  section {
    height: 380px;
    padding: 24px 0;
  }
  h1 {
    font-size: 38px;
    line-height: 48px;
  }
  p {
    font-size: 16px;
    line-height: 24px;
  }
}
@media (max-width: 600px) {
  section {
    height: auto;
    min-height: 180px;
    padding: 12px 0;
    flex-direction: column !important;
  }
  .text-left {
    text-align: center !important;
    margin: 0 auto !important;
    padding: 0 6px;
  }
  h1 {
    font-size: 22px;
    line-height: 30px;
  }
  p {
    font-size: 13px;
    line-height: 18px;
  }
  .flex {
    flex-direction: column !important;
    gap: 0.7rem !important;
    align-items: center !important;
  }
  #book-btn, #service-btn {
    width: 100%;
    font-size: 0.98rem;
    padding: 10px 0;
  }
}
</style>