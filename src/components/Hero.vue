<template>
  <section
    class="bg-cover bg-no-repeat p-10 flex items-center umg-fluid imgy">
    <div class=" w-full max-w-xl mx-15" :class="{ 'text-right': isRTL }">
        
        <h1 class=" font-extrabold text-gray-900 leading-tight">
          {{ $t('heroTitle') }}
        </h1>
        <p class="text-gray-600 mt-4">
          {{ $t('heroDescription') }}
        </p>
        <div class="mt-6 flex gap-4">
        <button id="service-btn" class="bg-purple-200 text-purple-900 px-4 py-2 rounded-full">
            {{ $t('heroShowServicesBtn') }} →
        </button>
    </div>
        <div class="hero-vector-container" >
      <!-- First SVG Vector (Background) -->
      <div class="hero-vector hero-vector-bg" :class="{ 'hero-vector-container-rtl': isRTL }">
        <svg xmlns="http://www.w3.org/2000/svg" width="609" height="503" viewBox="0 0 609 503" >
          <path fill-rule="evenodd" clip-rule="evenodd" d="M318.394 0.447192C361.166 2.04486 386.262 47.1144 426.173 61.4899C476.075 79.464 542.611 58.9912 579.916 94.6439C616.199 129.321 608.733 186.558 607.625 234.906C606.534 282.529 596.235 329.037 573.566 371.763C549.891 416.388 521.99 463.097 474.427 485.963C427.354 508.593 370.142 505.087 318.394 494.439C272.144 484.922 241.32 446.291 197.745 429.029C146.306 408.652 77.3346 422.911 40.0671 384.181C3.16009 345.826 -10.467 282.348 10.9522 234.906C33.1151 185.817 108.169 181.569 148.582 143.831C175.585 118.616 177.159 77.1695 205.491 53.2467C237.21 26.4639 275.564 -1.15264 318.394 0.447192Z" fill="url(#heroImage)"/>
          <defs>
            <pattern id="heroImage" patternUnits="objectBoundingBox" width="1" height="1">
              <image href="/images/hero-image.png" width="609" height="503" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
          </defs>
          
        </svg>  
      </div>
      <div class="hero-vector hero-vector-group" :class="{ 'hero-vector-container-rtl': isRTL }">
        <svg xmlns="http://www.w3.org/2000/svg" width="609" height="503" viewBox="0 0 609 503" >
          <path fill-rule="evenodd" clip-rule="evenodd" d="M318.394 0.447192C361.166 2.04486 386.262 47.1144 426.173 61.4899C476.075 79.464 542.611 58.9912 579.916 94.6439C616.199 129.321 608.733 186.558 607.625 234.906C606.534 282.529 596.235 329.037 573.566 371.763C549.891 416.388 521.99 463.097 474.427 485.963C427.354 508.593 370.142 505.087 318.394 494.439C272.144 484.922 241.32 446.291 197.745 429.029C146.306 408.652 77.3346 422.911 40.0671 384.181C3.16009 345.826 -10.467 282.348 10.9522 234.906C33.1151 185.817 108.169 181.569 148.582 143.831C175.585 118.616 177.159 77.1695 205.491 53.2467C237.21 26.4639 275.564 -1.15264 318.394 0.447192Z" fill="#7B6FA8"/>
        </svg>
      </div>
      
      <!-- Second SVG Vector (Foreground) -->
      <div class="hero-vector hero-vector-fg" :class="{ 'hero-vector-container-rtl': isRTL }">
        <svg xmlns="http://www.w3.org/2000/svg" width="452" height="445" viewBox="0 0 452 445" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M200.573 70.1423C235.114 80.6944 269.847 81.4924 304.241 92.4509C355.434 108.762 439.562 100.364 450.162 149.665C461.331 201.613 372.021 222.673 341.912 267.661C322.548 296.593 333.712 338.025 307.899 362.227C280.281 388.121 238.268 390.05 200.573 400.176C145.199 415.052 84.907 463.794 36.1508 435.229C-11.6802 407.207 2.38322 337.088 3.23628 284.563C3.86495 245.854 36.3511 215.174 40.3506 176.639C46.2671 119.635 -18.3229 42.55 31.8135 9.22525C82.1255 -24.2163 141.805 52.1887 200.573 70.1423Z" fill="#433867"/>
        </svg>
      </div>
    </div>
    </div>
    
  </section>
</template>

<script>
import "../style.css"
    export default {
          data() {
            return {
              isRTL: false
            }
          },
          methods:{
            goToServices(){
              return this.$router.push('/plumbing')
            },
            toggleLanguage() {
              this.isRTL = !this.isRTL;
              this.$emit('language-changed', this.isRTL);
            }
          },
          watch: {
            '$i18n.locale': {
              handler(newLocale) {
                this.isRTL = newLocale === 'ar' || newLocale === 'he' || newLocale === 'fa';
              },
              immediate: true
            }
          }
    }
</script>

<style scoped>
section {
    height:  550px;
    width: 100%;
    position: relative;
    background-color: #F4F3F8;
}
.dark section {
  background-color: #87838D;
}
.hero-vector-container {
  margin-right: 100px;
}

.hero-vector {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    flex-shrink: 0;
    z-index: 1;
}
.hero-vector-container-rtl {
    left: 60px !important;
    right: auto !important;
}

.hero-vector-bg {
    width: 608.23px;
    height: 502.37px;
    z-index: 3;
    right: 90px;
}

.hero-vector-fg {
    width: 450.461px;
    height: 443.182px;
    z-index: 1;
    right: 90px;
}

.hero-vector-group {
    width: 450.461px;
    height: 443.182px;
    z-index: 2;
    right: 90px;
}
.hero-vector svg {
    width: 100%;
    height: 100%;
}

.hero-vector-bg svg {
    fill: var(--color-brand-400, #7B6FA8);
}
.hero-vector-group svg {
    fill: var(--color-brand-400, #7B6FA8);
}
.hero-vector-fg svg {
    fill: var(--color-brand-700, #433867);
}


h1{
  width: 641px;
  color: var(--text-color-text-primary, #1F2021);

/* Display Large/Semibold */
font-family: Outfit, sans-serif;
font-size: 70px;
font-style: normal;
font-weight: 600;
line-height: 96px; /* 120% */
}
.dark h1{
  color: var(--primary-text) !important;
}
p {
  color: var(--text-color-text-primary, #1F2021);

/* 20/Regular */
font-family: Outfit, sans-serif;
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: 28px; /* 140% */
}
.dark p{
  color: var(--primary-text) !important;
} 
#service-btn {
  border-radius: 58px;
    border: 1px solid var(--border-border-brand, #625397);
    background: var(--surface-color-surface-brand, #625397);
    color: white;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    font-family: Outfit, sans-serif;
    font-style: normal;
    padding: 10px 20px;
    position: relative;
    z-index: 4;
}
.dark #service-btn {
  background: var(--primary);
  color: var(--primary-text-dark);
}
.dark #service-btn:hover {
  background: var(--primary);
  color: var(--primary-text-dark);
}

/* Responsive styles for tablet and mobile only */
@media (max-width: 900px) {
  section {
    height: 380px;
    padding: 24px 0;
  }
  .hero-vector-bg {
    width: 400px;
    height: 330px;
  }
  .hero-vector-fg {
    width: 300px;
    height: 295px;
    right: 15px;
  }
  .hero-image {
    width: 280px;
    height: 280px;
    right: 30px;
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
  .hero-vector-bg {
    position: relative;
    width: 250px;
    height: 206px;
    margin: 20px auto 10px;
    transform: none;
  }
  .hero-vector-fg {
    position: relative;
    width: 200px;
    height: 197px;
    margin: 0 auto;
    transform: none;
    right: auto;
  }
  .hero-image {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 20px auto;
    transform: none;
    right: auto;
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
.imgy {
  background-size: cover;
}
</style>