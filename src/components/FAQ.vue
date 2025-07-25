<template>
  <section class="faq">
    <!-- FAQ Content at the top -->
    <div class="faq-content">
      <div class="faq-header">
        <div class="faq-title-box">
          <h2 class="faq-title">{{ $t('faqTitle') }}</h2>
        </div>
        <div class="faq-intro">
          <p>{{ $t('faqIntro') }}</p>
        </div>
      </div>
    </div>
    <!-- Image and Accordion below -->
    <div class="faq-container flex flex-col md:flex-row align-items-center justify-center">
      <div class="faq-image">
        <img src="/images/questions image.png" alt="Plumbers working in kitchen" class="plumbers-photo" />
      </div>
      <!-- Left Side - FAQ Accordion -->
      <div class="faq-accordion">
        <div 
          v-for="(item, index) in faqItems" 
          :key="index" 
          class="faq-item"
          :class="{ 'active': item.isExpanded }"
          @click="toggleFAQ(index)"
        >
          <div class="faq-question">
            <h3 class="question-text">{{ $t(item.question) }}</h3>
            <div class="faq-icon">
              <i :class="item.isExpanded ? 'fas fa-minus' : 'fas fa-plus'"></i>
            </div>
          </div>
          <div class="faq-answer" v-show="item.isExpanded">
            <p>{{ $t(item.answer) }}</p>
          </div>
        </div>
      </div>
      <!-- Right Side - Image -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'FAQ',
  data() {
    return {
      faqItems: [
        {
          question: 'faqQ1',
          answer: 'faqA1',
          isExpanded: true
        },
        {
          question: 'faqQ2',
          answer: 'faqA2',
          isExpanded: false
        },
        {
          question: 'faqQ3',
          answer: 'faqA3',
          isExpanded: false
        },
        {
          question: 'faqQ4',
          answer: 'faqA4',
          isExpanded: false
        },
        {
          question: 'faqQ5',
          answer: 'faqA5',
          isExpanded: false
        }
      ]
    };
  },
  methods: {
    toggleFAQ(index) {
      // Close all other items
      this.faqItems.forEach((item, i) => {
        if (i !== index) {
          item.isExpanded = false;
        }
      });
      // Toggle the clicked item
      this.faqItems[index].isExpanded = !this.faqItems[index].isExpanded;
    }
  }
};
</script>

<style scoped>
.faq {
  background: #F4F4F5;
  padding: 80px 0;
  width: 100%;
}
.dark .faq {
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.faq-content {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 40px auto;
}

.faq-header {
  display: flex;
  flex-direction: row;
  gap: 150px;
  align-items: flex-start;
  justify-content: space-between;
}

.faq-title-box {
  padding: 20px 30px;
  display: inline-block;
  max-width: 300px;
  flex: 0 1 auto;
}
.dark .faq-title-box {
  color: var(--primary-text);
}
.faq-intro {
  margin-left: auto;
  border-radius: 8px;
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.faq-intro p {
  color: #8C8E90;
  padding: 20px 30px;
  font-family: Outfit, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px; 
}
.dark .faq-intro p {
  color: var(--text-muted);
}
.faq-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 40px auto;
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
}

.faq-image {
  order: 1;
  flex: 1;
  min-width: 250px;
  max-width: 500px;
  min-height: 500px;
  display: flex;
  align-items: flex-start;
}

.plumbers-photo {
  width: 100%;
  height: 600px;
  object-fit: cover;
  border-radius: 16px;
  display: block;
}

.faq-accordion {
  order: 2;
  flex: 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dark .faq-item {
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.faq-item.active {
  background: #625397;
}
.dark .faq-item.active {
  background: var(--primary-color);
  color: var(--primary-text);
}
.faq-item.active .question-text {
  color: #fff;
}
.dark .faq-item.active .question-text {
  color: var(--primary-text);
}
.faq-item.active .faq-icon {
  background: var(--primary-color);
  color: white;
  border: 1px solid white;
}
.dark .faq-item.active .faq-icon {
  background: var(--primary-color);
  color: var(--primary-text);
  border: 1px solid var(--primary-text);
}
.faq-question {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.dark .faq-question {
  color: var(--primary-text);
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  font-family: Outfit, sans-serif;
  flex: 1;
}
.dark .question-text {
  color: var(--primary-text);
}
.dark .faq-answer {
  color: var(--text-muted);
}
.faq-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.faq-icon i {
  font-size: 0.9rem;
}

.faq-answer {
  padding: 0 24px 24px 24px;
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.6;
  font-family: Outfit, sans-serif;
}
.dark .faq-item:not(.active) .faq-answer {
  color: var(--text-muted);
}
.faq-item:not(.active) .faq-answer {
  color: var(--primary-color);
}
.dark .faq-item:not(.active) .faq-answer {
  color: var(--primary-text);
}
/* Responsive design */
@media (min-width: 769px) {
  .faq-container {
    flex-direction: row;
  }
  .faq-content {
    order: 1;
  }
  .faq-image {
    order: 2;
  }
}

@media (max-width: 1024px) {
  .faq-header {
    gap: 60px;
  }
  
  .faq-intro p {
    width: 40%;
  }
}

@media (max-width: 900px) {
  .faq-container {
    flex-direction: column;
    gap: 32px;
  }
  .faq-image, .faq-accordion {
    max-width: 100%;
  }
  .plumbers-photo {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .faq {
    padding: 60px 0;
  }
  
  .faq-container {
    flex-direction: column;
    gap: 40px;
  }
  
  .faq-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .faq-title-box, .faq-intro {
    max-width: 100%;
    width: 100%;
    padding: 16px 10px;
  }
  
  .faq-intro p {
    width: 100%;
    font-size: 0.9rem;
  }
  
  .plumbers-photo {
    height: 300px;
  }
  
  .faq-title {
    font-size: 1.5rem;
  }
  
  .faq-question {
    padding: 20px;
  }
  
  .faq-answer {
    padding: 0 20px 20px 20px;
  }
  
  .faq-content {
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  .faq {
    padding: 40px 0;
  }
  
  .faq-content {
    margin-bottom: 20px;
  }
  
  .faq-container {
    gap: 30px;
  }
  
  .faq-title {
    font-size: 1.3rem;
  }
  
  .faq-intro p {
    font-size: 0.85rem;
  }
  
  .plumbers-photo {
    height: 250px;
  }
  
  .faq-question {
    padding: 16px;
  }
  
  .faq-answer {
    padding: 0 16px 16px 16px;
    font-size: 0.9rem;
  }
  
  .question-text {
    font-size: 1rem;
  }
}
</style> 