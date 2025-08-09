<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="dashboard-main mx-12 p-4">
      <div class="dashboard-container">
        <TopBar :title="$t('adminDashboard')" />

        <!-- Top Cards -->
        <div class="stats-grid">
          <!-- Realtime Insight -->
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-sun stat-icon"></i>
              <span class="stat-time">{{ currentTime }}</span>
            </div>
            <div class="stat-subtitle">{{ $t('realtimeInsight') }}</div>
            <button class="stat-action-btn">{{ $t('viewAllBookings') }}</button>
          </div>
          
          <!-- Total Technicians -->
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-users stat-icon"></i>
              <span class="stat-number">{{ dashboardStats.totalTechnicians }}</span>
            </div>
            <div class="stat-title">{{ $t('totalTechnicians') }}</div>
          </div>
          
          <!-- Customers -->
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-user stat-icon"></i>
              <span class="stat-number">{{ dashboardStats.totalCustomers }}</span>
            </div>
            <div class="stat-title">{{ $t('customers') }}</div>
          </div>
        </div>
        
        <!-- Charts Row -->
        <div class="charts-grid">
          <!-- User Activity Comparison Chart -->
          <div class="chart-card attendance-chart">
            <div class="chart-header">
              <div class="chart-title">{{ $t('weeklyBookingsComparison') }}</div>
            </div>
            <!-- Enhanced Chart -->
            <div class="chart-wrapper">
              <div class="chart-y-labels">
                <span>{{ maxUsers }}</span>
                <span>{{ Math.round(maxUsers * 0.8) }}</span>
                <span>{{ Math.round(maxUsers * 0.6) }}</span>
                <span>{{ Math.round(maxUsers * 0.4) }}</span>
                <span>{{ Math.round(maxUsers * 0.2) }}</span>
                <span>0</span>
              </div>
              <div class="chart-main">
                <div class="chart-grid">
                  <div class="grid-line" v-for="i in 5" :key="i"></div>
                </div>
                <svg class="chart-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#7c6bb0;stop-opacity:0.8" />
                      <stop offset="100%" style="stop-color:#7c6bb0;stop-opacity:0.1" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <!-- Area fill -->
                  <path 
                    :d="areaPath" 
                    fill="url(#areaGradient)" 
                    class="chart-area"
                  />
                  <!-- Main line -->
                  <path 
                    :d="linePath" 
                    fill="none" 
                    stroke="#7c6bb0" 
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="chart-line"
                    filter="url(#glow)"
                  />
                  <!-- Data points -->
                  <circle 
                    v-for="(point, index) in attendanceData" 
                    :key="index"
                    :cx="point.x" 
                    :cy="point.y" 
                    r="6" 
                    fill="#7c6bb0"
                    stroke="#fff"
                    stroke-width="2"
                    class="data-point"
                    @mouseenter="showPointTooltip($event, point)"
                    @mouseleave="hideTooltip"
                  />
                  <!-- Hover effect circle -->
                  <circle 
                    v-if="hoveredPoint"
                    :cx="hoveredPoint.x" 
                    :cy="hoveredPoint.y" 
                    r="12" 
                    fill="rgba(124, 107, 176, 0.2)"
                    class="hover-circle"
                  />
                </svg>
                <div class="chart-x-labels">
                  <span v-for="(point, index) in attendanceData" :key="index">{{ point.day }}</span>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-dot"></div>
                <span>{{ $t('currentWeek') }}</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot previous"></div>
                <span>{{ $t('previousWeek') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import AdminRoleManager from '../../components/AdminRoleManager.vue';
import TopBar from '../../components/TopBar.vue';

import { useI18n } from 'vue-i18n';
import { auth } from '../../firebase'; // Added import for auth


export default {
  name: 'AdminDashboard',
  components: { AdminSidebar, AdminRoleManager, TopBar },

  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      selectedPeriod: 'daily',
      currentTime: '8:02:09 AM',
      attendanceData: [],
      attendanceLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      hoveredPoint: null,
      tooltip: null,
      // Add new data properties for dynamic stats
      totalTechnicians: 0,
      totalUsers: 0,
      newTechnicians: 0,
      customerChange: '0%',
      // User activity data
      currentWeekUsers: [],
      previousWeekUsers: [],
      maxUsers: 0
    };
  },
  computed: {
    dashboardStats() {
      return {
        totalTechnicians: this.totalTechnicians,
        newTechnicians: this.newTechnicians,
        totalCustomers: this.totalUsers
      };
    },
    linePath() {
      if (this.attendanceData.length === 0) return '';
      
      const points = this.attendanceData.map(point => `${point.x},${point.y}`);
      return `M ${points.join(' L ')}`;
    },
    areaPath() {
      if (this.attendanceData.length === 0) return '';
      
      const points = this.attendanceData.map(point => `${point.x},${point.y}`);
      const lastPoint = this.attendanceData[this.attendanceData.length - 1];
      const firstPoint = this.attendanceData[0];
      
      return `M ${firstPoint.x},180 L ${points.join(' L ')} L ${lastPoint.x},180 Z`;
    }
  },
  mounted() {
    // Add authentication check and debugging
    console.log('Admin Dashboard mounted');
    console.log('Current user:', auth.currentUser);
    console.log('User type from localStorage:', localStorage.getItem('userType'));
    
    // Check if user is authenticated and is admin
    const userType = localStorage.getItem('userType');
    if (!auth.currentUser) {
      console.log('No authenticated user, redirecting to login');
      this.$router.push('/userlogin');
      return;
    }
    
    if (userType !== 'admin') {
      console.log('User is not admin, redirecting to home');
      this.$router.push('/');
      return;
    }
    
    console.log('User is authenticated as admin, proceeding with dashboard');
    
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.animateCharts();
    this.fetchWeeklyBookings();
    // Add calls to fetch dynamic stats
    this.fetchTechniciansCount();
    this.fetchUsersCount();
    // Refresh stats every 5 minutes
    setInterval(() => {
      this.fetchTechniciansCount();
      this.fetchUsersCount();
      this.fetchWeeklyBookings(); // Refresh chart data
    }, 5 * 60 * 1000);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    animateCharts() {
      // Animate line chart
      setTimeout(() => {
        const lineChart = document.querySelector('.chart-line');
        if (lineChart) {
          lineChart.style.strokeDasharray = lineChart.getTotalLength();
          lineChart.style.strokeDashoffset = lineChart.getTotalLength();
          
          setTimeout(() => {
            lineChart.style.strokeDashoffset = 0;
          }, 100);
        }
      }, 500);
    },
    showPointTooltip(event, point) {
      this.hoveredPoint = point;
      this.tooltip = this.createTooltip(event, `${point.value} bookings`);
    },
    showBarTooltip(event, bar) {
      this.tooltip = this.createTooltip(event, `${bar.current} bookings`);
    },
    createTooltip(event, text) {
      const tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      tooltip.textContent = text;
      tooltip.style.left = event.pageX + 10 + 'px';
      tooltip.style.top = event.pageY - 30 + 'px';
      
      document.body.appendChild(tooltip);
      
      setTimeout(() => {
        tooltip.classList.add('show');
      }, 10);
      return tooltip;
    },
    hideTooltip() {
      if (this.tooltip) {
        this.tooltip.classList.remove('show');
        setTimeout(() => {
          if (this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
          }
          this.tooltip = null;
        }, 200);
      }
    },
    
    async fetchWeeklyBookings() {
      try {
        const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore');
        const { db } = await import('../../firebase');
        
        // Get current week (Monday to Sunday)
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Adjust for Monday start
        const monday = new Date(now);
        monday.setDate(now.getDate() - daysFromMonday);
        monday.setHours(0, 0, 0, 0);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        
        // Get previous week
        const previousMonday = new Date(monday);
        previousMonday.setDate(monday.getDate() - 7);
        
        const previousSunday = new Date(sunday);
        previousSunday.setDate(sunday.getDate() - 7);
        
        console.log('Week boundaries:', {
          currentMonday: monday.toDateString(),
          currentSunday: sunday.toDateString(),
          previousMonday: previousMonday.toDateString(),
          previousSunday: previousSunday.toDateString()
        });
        
        // Fetch current week bookings
        const currentWeekQuery = query(
          collection(db, 'bookings'),
          where('createdAt', '>=', monday),
          where('createdAt', '<=', sunday),
          orderBy('createdAt', 'desc')
        );
        
        const currentWeekSnapshot = await getDocs(currentWeekQuery);
        const currentWeekBookings = currentWeekSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch previous week bookings
        const previousWeekQuery = query(
          collection(db, 'bookings'),
          where('createdAt', '>=', previousMonday),
          where('createdAt', '<=', previousSunday),
          orderBy('createdAt', 'desc')
        );
        
        const previousWeekSnapshot = await getDocs(previousWeekQuery);
        const previousWeekBookings = previousWeekSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Bookings found:', {
          currentWeek: currentWeekBookings.length,
          previousWeek: previousWeekBookings.length
        });
        
        // Create arrays for each day of the week (Monday to Sunday)
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Initialize counters for each day
        const currentWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
        const previousWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
        
        // Count current week bookings by day
        currentWeekBookings.forEach(booking => {
          const bookingDate = booking.createdAt?.toDate ? booking.createdAt.toDate() : new Date(booking.createdAt);
          const dayOfWeek = bookingDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          
          // Convert to Monday-based index (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
          const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          currentWeekCounts[dayIndex]++;
        });
        
        // Count previous week bookings by day
        previousWeekBookings.forEach(booking => {
          const bookingDate = booking.createdAt?.toDate ? booking.createdAt.toDate() : new Date(booking.createdAt);
          const dayOfWeek = bookingDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          
          // Convert to Monday-based index (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
          const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          previousWeekCounts[dayIndex]++;
        });
        
        console.log('Day counts:', {
          currentWeek: currentWeekCounts,
          previousWeek: previousWeekCounts
        });
        
        // Find the maximum value for scaling
        const maxCurrentWeek = Math.max(...currentWeekCounts);
        const maxPreviousWeek = Math.max(...previousWeekCounts);
        const maxValue = Math.max(maxCurrentWeek, maxPreviousWeek, 1); // Ensure at least 1 for scaling
        
        // Update maxUsers for chart scaling
        this.maxUsers = maxValue;
        
        // Generate attendance data for the chart
        this.attendanceData = currentWeekCounts.map((count, index) => {
          const x = (index / (weekDays.length - 1)) * 500; // Scale x to 0-500
          const y = count === 0 ? 180 : 180 - ((count / maxValue) * 160 * 0.7); // Scale y to 20-180 (inverted for SVG) and reduce by 30%
          return {
            x: x,
            y: y,
            value: count,
            day: weekDays[index]
          };
        });
        
        // Store the data for comparison
        this.currentWeekUsers = currentWeekCounts;
        this.previousWeekUsers = previousWeekCounts;
        
        console.log('Generated attendance data:', this.attendanceData);
        
      } catch (error) {
        console.error('Error fetching weekly bookings:', error);
        // Fallback to static data if there's an error
        this.attendanceData = [
          { x: 0, y: 162.67, value: 20, day: 'Mon' },
          { x: 83.33, y: 145.33, value: 40, day: 'Tue' },
          { x: 166.67, y: 128, value: 60, day: 'Wed' },
          { x: 250, y: 164, value: 30, day: 'Thu' },
          { x: 333.33, y: 181.33, value: 10, day: 'Fri' },
          { x: 416.67, y: 162.67, value: 20, day: 'Sat' },
          { x: 500, y: 164, value: 30, day: 'Sun' }
        ];
        this.maxUsers = 60;
      }
    },
    // Add new methods for fetching dynamic stats
    async fetchTechniciansCount() {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../firebase');
        
        console.log('🔍 Fetching technicians count...');
        
        // Fetch from technicians collection
        const techniciansCollection = collection(db, 'technicians');
        const techniciansSnapshot = await getDocs(techniciansCollection);
        const techniciansCount = techniciansSnapshot.size;
        
        // Fetch from pendingTechnicians collection (approved ones)
        const pendingTechniciansCollection = collection(db, 'pendingTechnicians');
        const pendingSnapshot = await getDocs(pendingTechniciansCollection);
        const pendingTechniciansCount = pendingSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.status === 'approved' || data.status === 'active' || !data.status;
        }).length;
        
        // Total technicians
        this.totalTechnicians = techniciansCount + pendingTechniciansCount;
        
        // Calculate new technicians (added in the last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const newTechniciansCount = techniciansSnapshot.docs.filter(doc => {
          const data = doc.data();
          if (!data.createdAt) return false;
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          return createdAt >= oneWeekAgo;
        }).length;
        
        const newPendingTechniciansCount = pendingSnapshot.docs.filter(doc => {
          const data = doc.data();
          if (!data.createdAt) return false;
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          return (data.status === 'approved' || data.status === 'active' || !data.status) && createdAt >= oneWeekAgo;
        }).length;
        
        this.newTechnicians = newTechniciansCount + newPendingTechniciansCount;
        
        console.log('✅ Technicians stats loaded:', {
          total: this.totalTechnicians,
          new: this.newTechnicians
        });
        
      } catch (error) {
        console.error('❌ Error fetching technicians count:', error);
        this.totalTechnicians = 0;
        this.newTechnicians = 0;
      }
    },
    
    async fetchUsersCount() {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../firebase');
        
        console.log('🔍 Fetching users count...');
        
        // Fetch from users collection
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        // Count only regular users (not technicians or admins)
        const regularUsers = usersSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.role === 'user' || !data.role; // Include users without role or with 'user' role
        }).length;
        
        this.totalUsers = regularUsers;
        
        console.log('✅ Users stats loaded:', {
          total: this.totalUsers
        });
        
      } catch (error) {
        console.error('❌ Error fetching users count:', error);
        this.totalUsers = 0;
        this.customerChange = '0%';
      }
    }
  }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #f9fafb;
}

.dark .admin-dashboard-layout {
  background: var(--primary-bg);
  color: var(--primary-text);
}

.dashboard-main {
  flex: 1;
}

.dark .dashboard-main {
  color: var(--primary-text);
}

.title-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.dashboard-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0;
  flex-shrink: 0;
}

.dark .dashboard-title {
  color: var(--primary-color);
}

.filter-search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  border-radius: 58px;
  background: #D3CFE2;
  padding: 0.5rem;
  min-width: 300px;
  flex-wrap: wrap;
}

.dark .filter-search-bar {
  background: var(--input-bg);
  color: var(--primary-text);
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 58px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  color: #C2C3C4;
  background: var(--surface-color-surface-primary, #FFF);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dark .filter-btn {
  background: var(--grey-bg);
  color: var(--primary-text);
} 

.filter-btn i {
  font-size: 1.1rem;
}

.dark .filter-btn:hover {
  background: var(--grey-bg);
  color: var(--primary-text);
}

.filter-btn:hover {
  background: var(--sidebar-color);
  color: var(--primary-color);
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 58px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  background: var(--surface-color-surface-primary, #FFF);
  padding: 0.5rem 1rem;
  flex: 1;
  min-width: 200px;
}

.dark .search-wrapper {
  background: var(--grey-bg);
}

.search-icon {
  color: #b8a4e3;
  font-size: 1.1rem;
}

.dark .search-icon {
  color: var(--primary-text);
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  width: 100%;
  min-width: 0;
}

.dark .search-input {
  color: var(--primary-text);
}

.search-input::placeholder {
  color: #b8a4e3;
  opacity: 1;
}

.dark .search-input::placeholder {
  color: var(--primary-text);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  border-radius: 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  min-height: 150px;
}

.dark .stat-card {
  background: var(--grey-bg);
  color: var(--primary-text);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dark .stat-header {
  color: var(--primary-text);
}

.stat-icon {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  color: #7c6bb0;
}

.dark .stat-icon {
  color: var(--primary-text);
}

.stat-time {
  font-size: clamp(0.875rem, 2.5vw, 1.125rem);
  font-weight: 600;
}

.dark .stat-time {
  color: var(--primary-text);
}

.stat-number {
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  font-weight: bold;
}

.stat-title {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 600;
  color: #333;
}

.dark .stat-title {
  color: var(--primary-text);
}

.stat-subtitle {
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #aaaaaa;
  margin-bottom: 1rem;
}

.dark .stat-subtitle {
  color: var(--primary-text);
}

.stat-change {
  font-size: clamp(0.625rem, 2vw, 0.75rem);
  margin-top: 0.25rem;
}

.stat-change.positive {
  color: #22c55e;
}

.dark .stat-change.positive {
  color: var(--primary-text);
}

.stat-change.growth {
  color: #ec4899;
}

.dark .stat-change.growth {
  color: var(--primary-text);
}

.stat-action-btn {
  background: #7c6bb0;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
}

.dark .stat-action-btn {
  background: var(--grey-bg);
  color: var(--primary-text);
}

.stat-action-btn:hover {
  background: #5a4a8c;
}

.dark .stat-action-btn:hover {
  background: var(--grey-bg);
  color: var(--primary-text);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.chart-card {
  border-radius: 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-height: 400px;
}

.dark .chart-card {
  background: var(--grey-bg);
  color: var(--primary-text);
} 

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dark .chart-header {
  color: var(--primary-text);
}

.chart-title {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 600;
  color: #333;
}

.dark .chart-title {
  color: var(--primary-text);
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: clamp(140px, 28vh, 210px);
  background: #ede7f6;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.dark .chart-wrapper {
  background: var(--grey-bg);
  color: var(--primary-text);
}

.chart-y-labels {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding-right: 0.5rem;
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  color: #7c6bb0;
  font-weight: 600;
  z-index: 2;
}

.dark .chart-y-labels {
  color: var(--primary-text);
} 

.chart-main {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-left: 2rem;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  width: 100%;
  height: 1px;
  background: rgba(124, 107, 176, 0.2);
  opacity: 0.6;
}

.dark .grid-line {
  background: var(--icon-color);
}

.grid-line:nth-child(1) { top: 20%; }
.grid-line:nth-child(2) { top: 40%; }
.grid-line:nth-child(3) { top: 60%; }
.grid-line:nth-child(4) { top: 80%; }
.grid-line:nth-child(5) { top: 100%; }

.chart-svg {
  width: 100%;
  height: 100%;
  position: relative;
}

.dark .chart-area {
  fill: var(--icon-color);
}

.chart-area {
  fill: url(#areaGradient);
  opacity: 0.3;
  transform: translateY(100%);
  transition: transform 0.8s ease-out;
  animation: area-fill 1s ease-out 0.5s forwards;
}

.dark .chart-area {
  fill: var(--icon-color);
} 

@keyframes area-fill {
  to {
    transform: translateY(0);
  }
}

.chart-line {
  fill: none;
  stroke: #7c6bb0;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: url(#glow);
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 1.5s ease-out 0.3s forwards;
}

.dark .chart-line {
  stroke: var(--primary-color);
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

.data-point {
  fill: #7c6bb0;
  stroke: #fff;
  stroke-width: 2;
  transition: all 0.3s ease;
  cursor: pointer;
}

.dark .data-point {
  fill: var(--primary-color);
  stroke: var(--primary-text-dark);
}

.data-point:hover {
  transform: scale(1.3);
  fill: #5a4a8c;
  stroke-width: 3;
}

.hover-circle {
  fill: rgba(124, 107, 176, 0.2);
  transition: all 0.3s ease;
  pointer-events: none;
}

.chart-x-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding-bottom: 0.5rem;
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  color: #7c6bb0;
  font-weight: 600;
}

.chart-tooltip {
  position: absolute;
  background: rgba(51, 51, 51, 0.95);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.2s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
}

.chart-tooltip.show {
  opacity: 1;
}

.chart-legend {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #7c6bb0;
  font-weight: 500;
}

.dark .legend-item {
  color: var(--primary-text);
}

.legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #7c6bb0;
  transition: transform 0.2s ease;
}

.legend-dot:hover {
  transform: scale(1.2);
}

.legend-dot.previous {
  background: #b8a4e3;
}

.legend-bar {
  width: 1rem;
  height: 0.75rem;
  border-radius: 0.25rem;
  transition: transform 0.2s ease;
}

.legend-bar:hover {
  transform: scale(1.1);
}

.legend-bar.current {
  background: #7c6bb0;
}

.legend-bar.previous {
  background: #b8a4e3;
}

.bars-container {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 100%;
  background: transparent;
  border-radius: 0.75rem;
  padding: 0.5rem;
  gap: 0.5rem;
  position: relative;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: clamp(1.5rem, 4vw, 2.5rem);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.bar-group:hover {
  transform: translateY(-2px);
}

.bar-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 0.125rem;
}

.bar {
  width: 100%;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  animation: bar-rise 0.6s ease-out forwards;
  position: relative;
  overflow: hidden;
}

.bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.bar:hover::after {
  left: 100%;
}

.bar.current-bar {
  background: linear-gradient(to top, #7c6bb0, #8b7bc0);
  box-shadow: 0 2px 8px rgba(124, 107, 176, 0.3);
}

.bar.previous-bar {
  background: linear-gradient(to top, #b8a4e3, #c5b7e6);
  box-shadow: 0 2px 6px rgba(184, 164, 227, 0.3);
}

.bar-label {
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  color: #7c6bb0;
  font-weight: 600;
  text-align: center;
  transition: color 0.2s ease;
}

.dark .bar-label {
  color: var(--primary-text);
}

.bar-group:hover .bar-label {
  color: #5a4a8c;
}

@keyframes bar-rise {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

.bookings-chart {
  display: flex;
  flex-direction: column;
}

.bookings-chart .chart-title {
  margin-bottom: 1rem;
}

.bookings-chart .bars-container {
  flex: 1;
  position: relative;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .layout{
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
  }
  
  .dashboard-main {
    margin-right: 0;
    padding: 0.5rem;
    margin-top: 30px; /* Space for horizontal sidebar */
  }
  
  .title-search-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filter-search-bar {
    width: 100%;
    flex-direction: column;
    height: auto;
    padding: 1rem;
    min-width: auto;
  }
  
  .search-wrapper {
    width: 100%;
    min-width: auto;
  }
  
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem;
    min-height: auto;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .chart-wrapper {
    height: 250px;
    padding: 0.75rem;
  }
  
  .chart-main {
    margin-left: 1.5rem;
  }
  
  .chart-legend {
    gap: 1rem;
    justify-content: flex-start;
  }
  
  .bars-container {
    gap: 0.25rem;
  }
  
  .bar-group {
    width: clamp(1rem, 3vw, 1.5rem);
  }
}

@media (max-width: 480px) {
  .layout{
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
    
  }
  
  .dashboard-main {
    padding: 0.5rem;
  }
  
  .dashboard-container {
    padding: 0;
    width: 100%;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .stat-card {
    padding: 0.75rem;
    min-height: auto;
  }
  
  .chart-card {
    padding: 1rem;
    min-height: auto;
  }
  
  .chart-wrapper {
    height: 200px;
    padding: 0.5rem;
  }
  
  .chart-main {
    margin-left: 1rem;
  }
  
  .chart-y-labels {
    font-size: 0.625rem;
    padding-right: 0.25rem;
  }
  
  .chart-x-labels {
    font-size: 0.625rem;
  }
  
  .bars-container {
    gap: 0.125rem;
  }
  
  .bar-group {
    width: 1rem;
  }
  
  .bar-label {
    font-size: 0.5rem;
  }
  
  .chart-legend {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

@media (max-width: 360px) {
  .layout{
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
  }
  
  .dashboard-main {
    padding: 0.5rem;
    margin: 20px;
  }
  
  .dashboard-title {
    font-size: 1.25rem;
  }
  
  
  .stat-card {
    padding: 0.5rem;
    min-height: auto;
  }
  
  .chart-card {
    padding: 0.75rem;
    min-height: auto;
  }
  
  .chart-wrapper {
    height: 180px;
  }
  
  .bars-container {
    gap: 0.1rem;
  }
  
  .bar-group {
    width: 0.75rem;
  }
  
  .bar-label {
    font-size: 0.5rem;
  }
}

/* Landscape orientation adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .dashboard-main {
    padding: 0.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
    min-height: 100px;
  }
  
  .chart-card {
    min-height: 250px;
  }
  
  .chart-wrapper {
    height: 180px;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .chart-line {
    stroke-width: 2;
  }
  
  .data-point {
    stroke-width: 1;
  }
  
  .grid-line {
    height: 0.5px;
  }
}

/* Print styles */
@media print {
  .admin-dashboard-layout {
    background: white;
  }
  
  .stat-card,
  .chart-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  .chart-wrapper {
    background: white;
  }
}
</style>
