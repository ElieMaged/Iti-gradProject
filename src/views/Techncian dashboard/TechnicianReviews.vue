<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="error">
    <p>{{ error }}</p>
  </div>
  <div v-else class="admin-dashboard-layout">
    <!-- Sidebar -->
    <Sidebar :activeMenu="activeMenu" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
    <div id="admin-profile-container" class="p-4 mr-20">
      <TopBar :title="$t('myReviews')" />
      <div id="admin-profile-wrapper">
        <div id="admin-profile-card">
          
          <!-- Reviews Summary -->
          <div class="reviews-summary">
            <div class="summary-card">
              <div class="summary-item">
                <span class="summary-label">{{ $t('totalReviews') }}</span>
                <span class="summary-value">{{ totalReviews }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ $t('averageRating') }}</span>
                <span class="summary-value">{{ averageRating.toFixed(1) }} ⭐</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ $t('fiveStarReviews') }}</span>
                <span class="summary-value">{{ fiveStarCount }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews List -->
          <div class="reviews-container">
            <div v-if="reviews.length === 0" class="no-reviews">
              <i class="fas fa-star" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
              <p>{{ $t('noReviewsYet') }}</p>
            </div>
            
            <div v-else class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-card">
                <div class="review-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar">
                      <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                      <h4 class="reviewer-name">{{ review.customerName || $t('anonymousCustomer') }}</h4>
                      <div class="review-rating">
                        <span v-for="star in 5" :key="star" class="star">
                          <i :class="star <= review.rating ? 'fas fa-star filled' : 'far fa-star'"></i>
                        </span>
                        <span class="rating-text">{{ review.rating }}/5</span>
                      </div>
                    </div>
                  </div>
                  <div class="review-date">
                    {{ formatDate(review.createdAt) }}
                  </div>
                </div>
                
                <div class="review-content">
                  <p class="review-text">{{ review.comment }}</p>
                </div>
                
                <div class="review-footer">
                  <div class="service-info">
                    <span class="service-label">{{ $t('service') }}:</span>
                    <span class="service-name">{{ review.serviceType }}</span>
                  </div>
                  <div class="booking-info">
                    <span class="booking-label">{{ $t('bookingDate') }}:</span>
                    <span class="booking-date">{{ formatDate(review.bookingDate) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="reviews.length > 0" class="pagination-container">
            <button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              class="pagination-btn"
              :class="{ disabled: currentPage === 1 }">
              <i class="fas fa-chevron-left"></i>
              {{ $t('previous') }}
            </button>
            
            <span class="page-info">
              {{ $t('page') }} {{ currentPage }} {{ $t('of') }} {{ totalPages }}
            </span>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="pagination-btn"
              :class="{ disabled: currentPage === totalPages }">
              {{ $t('next') }}
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../../components/Sidebar.vue';
import TopBar from '../../components/TopBar.vue';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';

export default {
  components: { Sidebar, TopBar },
  data() {
    return {
      activeMenu: 'reviews',
      loading: true,
      error: '',
      reviews: [],
      currentPage: 1,
      pageSize: 10,
      totalReviews: 0,
      averageRating: 0,
      fiveStarCount: 0,
      lastDoc: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalReviews / this.pageSize);
    }
  },
  async mounted() {
    try {
      const user = auth.currentUser;
      if (!user) {
        this.error = 'Not logged in.';
        this.loading = false;
        return;
      }
      
      await this.loadReviews();
      await this.loadReviewStats();
    } catch (e) {
      this.error = 'Error loading reviews.';
      console.error('Error loading reviews:', e);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleSidebarNavigate(route) {
      this.$router.push(route);
    },
    
    async loadReviews() {
      try {
        const user = auth.currentUser;
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('technicianId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(this.pageSize)
        );
        
        const snapshot = await getDocs(reviewsQuery);
        this.reviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
      } catch (error) {
        console.error('Error loading reviews:', error);
        this.error = 'Error loading reviews.';
      }
    },
    
    async loadReviewStats() {
      try {
        const user = auth.currentUser;
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('technicianId', '==', user.uid)
        );
        
        const snapshot = await getDocs(reviewsQuery);
        const allReviews = snapshot.docs.map(doc => doc.data());
        
        this.totalReviews = allReviews.length;
        
        if (this.totalReviews > 0) {
          const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
          this.averageRating = totalRating / this.totalReviews;
          this.fiveStarCount = allReviews.filter(review => review.rating === 5).length;
        }
      } catch (error) {
        console.error('Error loading review stats:', error);
      }
    },
    
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.loadNextPage();
      }
    },
    
    async previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.loadPreviousPage();
      }
    },
    
    async loadNextPage() {
      try {
        const user = auth.currentUser;
        const reviewsQuery = query(
      collection(db, 'reviews'),
          where('technicianId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          startAfter(this.lastDoc),
          limit(this.pageSize)
        );
        
        const snapshot = await getDocs(reviewsQuery);
        this.reviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
      } catch (error) {
        console.error('Error loading next page:', error);
      }
    },
    
    async loadPreviousPage() {
      // For simplicity, we'll reload all reviews and paginate client-side
      // In a production app, you'd want to implement proper pagination
      await this.loadReviews();
    },
    
    formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}

.dark .admin-dashboard-layout {
  background-color: var(--primary-bg);
}

#admin-profile-container {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
  flex: 1;
}

.dark #admin-profile-container {
  background-color: var(--primary-bg);
}


#admin-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.dark #admin-profile-card {
  background-color: var(--grey-bg);
}

.page-title {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  font-family: Outfit, sans-serif;
}

.dark .page-title {
  color: var(--primary-color);
}

/* Reviews Summary */
.reviews-summary {
  margin-bottom: 2rem;
}

.summary-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.dark .summary-card {
  background: var(--input-bg);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .summary-label {
  color: var(--text-muted);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
}

.dark .summary-value {
  color: var(--secondary-bg);
}

/* Reviews Container */
.reviews-container {
  margin-bottom: 2rem;
}

.no-reviews {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.dark .no-reviews {
  color: var(--text-muted);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.dark .review-card {
  background: var(--input-bg);
  border-color: var(--border-color);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reviewer-avatar {
  width: 3rem;
  height: 3rem;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.dark .reviewer-avatar {
  background: var(--primary-bg);
  color: var(--text-muted);
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reviewer-name {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.dark .reviewer-name {
  color: var(--white);
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star {
  color: #fbbf24;
}

.star .filled {
  color: #fbbf24;
}

.rating-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.dark .rating-text {
  color: var(--text-muted);
}

.review-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .review-date {
  color: var(--text-muted);
}

.review-content {
  margin-bottom: 1rem;
}

.review-text {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.dark .review-text {
  color: var(--primary-text-dark);
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .review-footer {
  color: var(--text-muted);
}

.service-info, .booking-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-label, .booking-label {
  font-weight: 500;
}

.service-name, .booking-date {
  color: #7c6bb0;
}

.dark .service-name, .dark .booking-date {
  color: var(--secondary);
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #7c6bb0;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination-btn:hover:not(.disabled) {
  background: #5a4e99;
}

.pagination-btn.disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.dark .pagination-btn.disabled {
  background: var(--text-muted);
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.dark .page-info {
  color: var(--text-muted);
}

/* Responsive Design */
@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .review-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .summary-card {
    grid-template-columns: 1fr;
  }
}

/* Enhanced Responsive Design */
@media (max-width: 1200px) {
  #admin-profile-wrapper {
    max-width: 95%;
  }
  
  #admin-profile-title {
    font-size: 1.375rem;
  }
  
  .summary-card {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 1024px) {
  #admin-profile-card {
    padding: 1.5rem;
  }
  
  #admin-profile-title {
    font-size: 1.25rem;
  }
  
  .summary-card {
    padding: 1.25rem;
  }
  
  .summary-value {
    font-size: 1.25rem;
  }
  
  .review-card {
    padding: 1.25rem;
  }
}

@media (max-width: 900px) {
  .admin-dashboard-layout {
    flex-direction: column;
  }
  
  #admin-profile-container {
    margin-right: 0;
    padding: 0.75rem;
  }
  
  #admin-profile-card {
    padding: 1rem;
  }
  
  #admin-profile-title {
    text-align: left;
    width: 100%;
  }
  
  .summary-card {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .reviews-summary {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  #admin-profile-container {
    padding: 0.5rem;
  }
  
  #admin-profile-card {
    padding: 0.75rem;
  }
  
  #admin-profile-title {
    font-size: 1rem;
    text-align: left;
  }
  
  .summary-card {
    padding: 0.75rem;
  }
  
  .summary-item {
    gap: 0.25rem;
  }
  
  .summary-label {
    font-size: 0.75rem;
  }
  
  .summary-value {
    font-size: 1.125rem;
  }
  
  .review-card {
    padding: 0.75rem;
  }
  
  .reviewer-info {
    gap: 0.75rem;
  }
  
  .reviewer-avatar {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .reviewer-name {
    font-size: 0.875rem;
  }
  
  .review-rating {
    gap: 0.25rem;
  }
  
  .rating-text {
    font-size: 0.75rem;
  }
  
  .review-date {
    font-size: 0.75rem;
  }
  
  .review-text {
    font-size: 0.875rem;
  }
  
  .review-footer {
    font-size: 0.75rem;
  }
  
  .pagination-container {
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .pagination-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .page-info {
    font-size: 0.75rem;
  }
}

@media (max-width: 600px) {
  #admin-profile-container {
    padding: 0.375rem;
  }
  
  #admin-profile-card {
    padding: 0.5rem;
  }
  
  #admin-profile-title {
    margin-bottom: 1rem;
  }
  
  .reviews-summary {
    margin-bottom: 1rem;
  }
  
  .summary-card {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .summary-label {
    font-size: 0.6875rem;
  }
  
  .summary-value {
    font-size: 1rem;
  }
  
  .reviews-container {
    margin-bottom: 1rem;
  }
  
  .reviews-list {
    gap: 1rem;
  }
  
  .review-card {
    padding: 0.5rem;
  }
  
  .review-header {
    gap: 0.75rem;
  }
  
  .reviewer-info {
    gap: 0.5rem;
  }
  
  .reviewer-avatar {
    width: 2rem;
    height: 2rem;
  }
  
  .reviewer-name {
    font-size: 0.8125rem;
  }
  
  .review-rating {
    gap: 0.125rem;
  }
  
  .rating-text {
    font-size: 0.6875rem;
  }
  
  .review-date {
    font-size: 0.6875rem;
  }
  
  .review-text {
    font-size: 0.8125rem;
  }
  
  .review-footer {
    font-size: 0.6875rem;
    gap: 0.25rem;
  }
  
  .pagination-container {
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .pagination-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
  }
  
  .page-info {
    font-size: 0.6875rem;
  }
  
  .no-reviews {
    padding: 2rem 0.5rem;
  }
}

@media (max-width: 480px) {
  #admin-profile-container {
    padding: 0.25rem;
  }
  
  #admin-profile-card {
    padding: 0.375rem;
  }
  
  #admin-profile-title {
    font-size: 0.8125rem;
    margin-bottom: 0.75rem;
  }
  
  .summary-card {
    padding: 0.375rem;
    gap: 0.375rem;
  }
  
  .summary-label {
    font-size: 0.625rem;
  }
  
  .summary-value {
    font-size: 0.875rem;
  }
  
  .review-card {
    padding: 0.375rem;
  }
  
  .review-header {
    gap: 0.5rem;
  }
  
  .reviewer-info {
    gap: 0.375rem;
  }
  
  .reviewer-avatar {
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .reviewer-name {
    font-size: 0.75rem;
  }
  
  .rating-text {
    font-size: 0.625rem;
  }
  
  .review-date {
    font-size: 0.625rem;
  }
  
  .review-text {
    font-size: 0.75rem;
  }
  
  .review-footer {
    font-size: 0.625rem;
    gap: 0.125rem;
  }
  
  .pagination-container {
    gap: 0.375rem;
    margin-top: 0.75rem;
  }
  
  .pagination-btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.625rem;
  }
  
  .page-info {
    font-size: 0.625rem;
  }
  
  .no-reviews {
    padding: 1.5rem 0.375rem;
  }
  
  .no-reviews i {
    font-size: 2rem !important;
  }
}

@media (max-width: 360px) {
  #admin-profile-container {
    padding: 0.125rem;
  }
  
  #admin-profile-card {
    padding: 0.25rem;
  }
  
  #admin-profile-title {
    margin-bottom: 0.5rem;
  }
  
  .summary-card {
    padding: 0.25rem;
    gap: 0.25rem;
  }
  
  .summary-label {
    font-size: 0.5625rem;
  }
  
  .summary-value {
    font-size: 0.8125rem;
  }
  
  .review-card {
    padding: 0.25rem;
  }
  
  .review-header {
    gap: 0.375rem;
  }
  
  .reviewer-info {
    gap: 0.25rem;
  }
  
  .reviewer-avatar {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .reviewer-name {
    font-size: 0.6875rem;
  }
  
  .rating-text {
    font-size: 0.5625rem;
  }
  
  .review-date {
    font-size: 0.5625rem;
  }
  
  .review-text {
    font-size: 0.6875rem;
  }
  
  .review-footer {
    font-size: 0.5625rem;
    gap: 0.125rem;
  }
  
  .pagination-container {
    gap: 0.25rem;
    margin-top: 0.5rem;
  }
  
  .pagination-btn {
    padding: 0.15rem 0.3rem;
    font-size: 0.5625rem;
  }
  
  .page-info {
    font-size: 0.5625rem;
  }
  
  .no-reviews {
    padding: 1rem 0.25rem;
  }
  
  .no-reviews i {
    font-size: 1.5rem !important;
  }
}
</style> 