<script setup lang="ts">
// No script logic needed for static footer
</script>

<template>
  <footer class="footer">
    <div class="footer__main">
      <!-- Quick Info -->
      <div class="footer__col footer__col--desc">
        <div class="footer__logo-row">
          <img class="footer__logo" src="../assets/Logo.png" alt="BoltFix logo">
        </div>
        <p class="footer__desc">{{ $t('footerQuickInfo') }}</p>
        <div class="footer__social-label">{{ $t('footerSocialLinks') }}</div>
        <div class="footer__social-row">
          <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook" class="footer__social-icon"><i
              class="fa-brands fa-facebook-f"></i></a>
          <a href="https://twitter.com/" target="_blank" aria-label="X" class="footer__social-icon"><i
              class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn" class="footer__social-icon"><i
              class="fa-brands fa-linkedin-in"></i></a>
          <a href="https://www.youtube.com/" target="_blank" aria-label="YouTube" class="footer__social-icon"><i
              class="fa-brands fa-youtube"></i></a>
        </div>
      </div>
      <!-- Quick Links -->
      <div class="footer__col">
        <div class="footer__col-title">{{ $t('footerQuickLink') }}</div>
        <ul class="footer__list">
          <li><router-link to="/">{{ $t('footerHome') }}</router-link></li>
          <li><router-link to="/about">{{ $t('footerAboutUs') }}</router-link></li>
          <li><router-link to="/services">{{ $t('footerServices') }}</router-link></li>
          <li><router-link to="/contact">{{ $t('footerContactUs') }}</router-link></li>
          <li><router-link to="/faqs">{{ $t('footerFaqs') }}</router-link></li>
        </ul>
      </div>
      <!-- Services -->
      <div class="footer__col">
        <div class="footer__col-title">{{ $t('footerService') }}</div>
        <ul class="footer__list">
          <li><router-link to="/plumbing">{{ $t('footerPlumbing') }}</router-link></li>
          <li><router-link to="/aircondition">{{ $t('footerAirConditioner') }}</router-link></li>
          <li><router-link to="/electricity">{{ $t('footerElectricity') }}</router-link></li>
          <li><router-link to="/wallfinishing">{{ $t('footerWallFinishing') }}</router-link></li>
          <li><router-link to="/carpentry">{{ $t('footerCarpentry') }}</router-link></li>
        </ul>
      </div>
      <!-- Contact Us -->
      <div class="footer__col footer__col--contact">
        <div class="footer__col-title">{{ $t('footerContactUs') }}</div>
        <ul class="footer__contact-list">
          <li><i class="fa-solid fa-phone footer__contact-icon"></i><span>{{ $t('footerPhone') }}</span></li>
          <li><i class="fa-solid fa-envelope footer__contact-icon"></i><span>boltfix@gmail.com</span></li>
          <li><i class="fa-solid fa-location-dot footer__contact-icon"></i><span>{{ $t('footerAddress') }}</span></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <hr class="footer__divider" />
      <div class="footer__bottom-row">
        <span>{{ $t('footerCopyright') }}</span>
        <div class="footer__bottom-links">
          <a href="#">{{ $t('footerPrivacyPolicy') }}</a>
          <span class="footer__bottom-sep">|</span>
          <a href="#">{{ $t('footerTermsOfService') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: #6B5FA7;
  color: #fff;
  border-radius: 20px 20px 0 0;
  font-family: 'Nunito', Arial, sans-serif;
  padding: 0;

  &__main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 3rem 2rem 2rem 2rem;
    gap: 2rem;
  }

  &__col {
    flex: 1 1 180px;
    min-width: 180px;
    max-width: 260px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__col--desc {
    max-width: 300px;
  }

  &__logo-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  &__logo {
    width: 100px;
    height: 36px;
    object-fit: contain;
  }

  &__brand {
    font-size: 1.3rem;
    font-weight: 700;
    margin-left: 0.2rem;
    letter-spacing: 1px;
  }

  &__brand--bolt {
    color: #fff;
  }

  &__brand--fix {
    color: #FFD230;
  }

  &__desc {
    font-size: 1rem;
    margin-bottom: 1.2rem;
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  &__social-label {
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  &__social-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    color: #6B5FA7;
    font-size: 1.3rem;
    transition: background 0.2s, color 0.2s;
    border: none;
    text-decoration: none;
  }

  &__social-icon:hover {
    background: #FFD230;
    color: #6B5FA7;
  }

  &__col-title {
    font-weight: 700;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__list li a {
    color: #fff;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.2s;
  }

  &__list li a:hover {
    color: #FFD230;
  }

  &__col--contact {
    min-width: 220px;
    max-width: 260px;
  }

  &__contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 1rem;
  }

  &__contact-icon {
    margin-right: 0.7rem;
    font-size: 1.1rem;
    color: #FFD230;
    width: 20px;
    text-align: center;
  }

  &__bottom {
    padding: 0 2rem 1rem 2rem;
  }

  &__divider {
    border: none;
    border-top: 1px solid #a89fd6;
    margin: 0 0 1rem 0;
  }

  &__bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    font-size: 0.95rem;
  }

  &__bottom-links {
    display: flex;
    gap: 1.2rem;
    align-items: center;
  }

  &__bottom-links a {
    color: #fff;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }

  &__bottom-links a:hover {
    color: #FFD230;
  }

  &__bottom-sep {
    color: #fff;
    opacity: 0.5;
    font-size: 1.1rem;
  }
}

@media (max-width: 900px) {
  .footer__main {
    flex-direction: column;
    align-items: flex-start;
    gap: 2.5rem;
  }

  .footer__bottom {
    padding: 0 1rem 1rem 1rem;
  }

  .footer__bottom-row {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer__bottom-links {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 1rem 1rem 1rem;
  }

  .footer__main {
    gap: 2rem;
  }

  .footer__col-title {
    font-size: 1.1rem;
  }

  .footer__list li a {
    font-size: 0.9rem;
  }

  .footer__contact-list {
    font-size: 0.9rem;
  }

  .footer__contact-icon {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 2rem 0.5rem 1rem 0.5rem;
  }

  .footer__main {
    gap: 1.5rem;
  }

  .footer__col-title {
    font-size: 1rem;
  }

  .footer__list li a {
    font-size: 0.85rem;
  }

  .footer__contact-list {
    font-size: 0.85rem;
  }

  .footer__bottom-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer__bottom-links a {
    font-size: 0.9rem;
  }
}
</style>
