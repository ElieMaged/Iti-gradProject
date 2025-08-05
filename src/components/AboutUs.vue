<template>
  <section class="about-us">
    <div class="about-container custom-container">
      <div class="about-content">
        <div class="about-text">
          <h2 class="aboutus-title">{{ $t("aboutUsSectionTitle") }}</h2>
          <p class="about-description">
            {{ $t("aboutUsSectionDesc") }}
          </p>

          <div class="about-features">
            <div class="feature-item">
              <div class="feature-icon">
                <img
                  src="/images/About-Us images/Frame 18596.png"
                  alt="Qualified team"
                />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ $t("aboutFeature1Title") }}</h3>
                <p class="feature-description">{{ $t("aboutFeature1Desc") }}</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <img
                  src="../../public/images/About-Us images/Frame 18596.png"
                  alt="Qualified team"
                />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ $t("aboutFeature2Title") }}</h3>
                <p class="feature-description">{{ $t("aboutFeature2Desc") }}</p>
              </div>
            </div>
          </div>

          <button class="about-btn" @click="$router.push('/about')">
            {{ $t("aboutMoreBtn") }}
          </button>
        </div>
      </div>

      <div class="image-container">
        <img src="../assets/home/about.png" alt="About Us" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AboutUs",
};
</script>

<style scoped>
.about-us {
  background: #f3d361;
  padding: 40px 0;

  width: 100%;
  position: relative;
}

.about-container {
  display: flex;
  align-items: center;
  gap: 60px;
  margin: 0 80px;
}

.about-content {
  flex: 1;
}

.about-text {
  max-width: 500px;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  margin-bottom: 24px;
  font-family: Outfit, sans-serif;
}

.about-description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 32px;
  font-family: Outfit, sans-serif;
}

.about-features {
  display: flex;
  flex-direction: row;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.feature-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.feature-icon i {
  color: #fff;
  font-size: 0.8rem;
}
.dark .feature-icon {
  color: var(--opacity-gray);
}
.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}

.feature-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  font-family: Outfit, sans-serif;
}

.about-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: Outfit, sans-serif;
}

.about-btn:hover {
  background: #4e3b7a;
}

.image-container {
  position: relative;
  width: 517px;
  height: 649px;
}

.circular-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dark .about-us {
  background-color: var(--secondary);
}
@media (max-width: 1000px) {
  .about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.about-container {
  display: flex;
  align-items: center;
  gap: 60px;
}

.about-content {
  flex: 1;
}

.about-text {
  max-width: 500px;
}

.about-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  margin-bottom: 24px;
  font-family: Outfit, sans-serif;
}
.dark .about-title {
  color: var(--primary-text);
}

.about-description {
  font-size: 1.5rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 32px;
  font-family: Outfit, sans-serif;
}
.dark .about-description {
  color: var(--primary-text);
}
.about-features {
  display: flex;
  flex-direction: row;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.feature-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.feature-icon i {
  color: #fff;
  font-size: 0.8rem;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}

.feature-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  font-family: Outfit, sans-serif;
}
.dark .feature-title {
  color: var(--primary-text);
}
.dark .feature-description {
  color: var(--primary-text);
}

.about-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: Outfit, sans-serif;
}
.dark .about-btn {
  background: var(--primary-color);
}

.about-btn:hover {
  background: #4e3b7a;
}

/* Responsive design */
@media (max-width: 1160px) {
  .about-container {
    flex-direction: column;
    gap: 40px;
  }
  .about-images {
    height: 350px;
    order: 2;
  }
}
@media (max-width: 1024px) {
  .about-container {
    gap: 40px;
  }

  .about-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .about-title {
    font-size: 2rem;
  }

  .about-description {
    font-size: 1rem;
  }

  .about-content {
    order: 1; /* Move content above images */
  }
  .image-container {
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 480px) {
  .about-us {
    padding: 60px 0;
  }

  .about-container {
    gap: 30px;
  }

  .about-title {
    font-size: 1.8rem;
    text-align: center;
  }

  .about-description {
    font-size: 0.9rem;
    text-align: center;
  }

  .about-text {
    text-align: center;
  }

  .about-features {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .feature-item {
    text-align: center;
  }

  .feature-content {
    text-align: center;
  }
}
</style>
