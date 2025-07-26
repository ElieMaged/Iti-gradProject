<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="dashboard-main">
      <div class="dashboard-container">
        <div class="title-search-row">
          <h2 class="dashboard-title">Admin Dashboard</h2>
          <div class="filter-search-bar">
            <button class="filter-btn"><i class="fas fa-filter"></i> Filter</button>
            <div class="search-wrapper">
              <span class="search-icon"><i class="fas fa-search"></i></span>
              <input 
                type="text" 
                placeholder="Search Field" 
                class="search-input"
                v-model="searchQuery"
              />
            </div>
          </div>
        </div>
        
        <!-- Top Cards -->
        <div class="stats-grid">
          <!-- Realtime Insight -->
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-sun stat-icon"></i>
              <span class="stat-time">{{ currentTime }}</span>
            </div>
            <div class="stat-subtitle">Realtime Insight</div>
            <button class="stat-action-btn">View All Bookings</button>
          </div>
          
          <!-- Total Technicians -->
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-users stat-icon"></i>
              <span class="stat-number">{{ dashboardStats.totalTechnicians }}</span>
            </div>
            <div class="stat-title">Total Technicians</div>
            <div class="stat-change positive">{{ dashboardStats.newTechnicians }} new employees added!</div>
          </div>
          
          <!-- Customers -->
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-user stat-icon"></i>
              <span class="stat-number">{{ dashboardStats.totalCustomers }}</span>
            </div>
            <div class="stat-title">Customers</div>
            <div class="stat-change positive">{{ dashboardStats.customerChange }}</div>
          </div>
          
          <!-- Platform Growth -->
          <div class="stat-card">
            <div class="stat-header">
              <i class="fas fa-chart-line stat-icon"></i>
              <span class="stat-number">{{ dashboardStats.platformGrowth }}</span>
            </div>
            <div class="stat-title">Platform Growth</div>
            <div class="stat-change growth">{{ dashboardStats.growthChange }}</div>
          </div>
        </div>
        
        <!-- Charts Row -->
        <div class="charts-grid">
          <!-- Attendance Comparison Chart -->
          <div class="chart-card attendance-chart">
            <div class="chart-header">
              <div class="chart-title">Attendance Comparison Chart</div>
              <div class="chart-controls">
                <button 
                  v-for="period in chartPeriods" 
                  :key="period"
                  class="chart-period-btn"
                  :class="{ active: selectedPeriod === period }"
                  @click="selectedPeriod = period"
                >
                  {{ period }}
                </button>
              </div>
            </div>
            <!-- Enhanced Chart -->
            <div class="chart-wrapper">
              <div class="chart-y-labels">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
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
                  <span v-for="(label, index) in attendanceLabels" :key="index">{{ label }}</span>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-dot"></div>
                <span>Current Week</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot previous"></div>
                <span>Previous Week</span>
              </div>
            </div>
          </div>
          
          <!-- Weekly Bookings Chart -->
          <div class="chart-card bookings-chart">
            <div class="chart-title">Weekly Bookings</div>
            <div class="chart-wrapper">
              <div class="chart-y-labels">
                <span>120</span>
                <span>90</span>
                <span>60</span>
                <span>30</span>
                <span>0</span>
              </div>
              <div class="chart-main">
                <div class="chart-grid">
                  <div class="grid-line" v-for="i in 4" :key="i"></div>
                </div>
                <div class="bars-container">
                  <div 
                    v-for="(bar, index) in bookingsData" 
                    :key="index"
                    class="bar-group"
                    @mouseenter="showBarTooltip($event, bar)"
                    @mouseleave="hideTooltip"
                  >
                    <div class="bar-wrapper">
                      <div 
                        class="bar current-bar" 
                        :style="{ height: bar.current + '%' }"
                        :data-value="bar.current"
                      ></div>
                      <div 
                        class="bar previous-bar" 
                        :style="{ height: bar.previous + '%' }"
                        :data-value="bar.previous"
                      ></div>
                    </div>
                    <div class="bar-label">{{ bar.day }}</div>
                  </div>
                </div>
                <div class="chart-x-labels">
                  <span v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']" :key="day">{{ day }}</span>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-bar current"></div>
                <span>This Week</span>
              </div>
              <div class="legend-item">
                <div class="legend-bar previous"></div>
                <span>Last Week</span>
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

export default {
  name: 'AdminDashboard',
  components: { AdminSidebar },
  data() {
    return {
      searchQuery: '',
      selectedPeriod: 'Daily',
      currentTime: '8:02:09 AM',
      chartPeriods: ['Daily', 'Weekly', 'Monthly'],
      dashboardStats: {
        totalTechnicians: 452,
        newTechnicians: 2,
        totalCustomers: 360,
        customerChange: '+10% Less than yesterday',
        platformGrowth: 30,
        growthChange: '+3% Increase than yesterday'
      },
      attendanceData: [
        { x: 50, y: 180, value: 91 },
        { x: 150, y: 120, value: 85 },
        { x: 250, y: 140, value: 88 },
        { x: 350, y: 80, value: 95 },
        { x: 450, y: 120, value: 85 },
        { x: 550, y: 140, value: 88 }
      ],
      attendanceLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      bookingsData: [
        { day: 'Mon', current: 25, previous: 20 },
        { day: 'Tue', current: 42, previous: 35 },
        { day: 'Wed', current: 67, previous: 50 },
        { day: 'Thu', current: 33, previous: 28 },
        { day: 'Fri', current: 17, previous: 15 }
      ],
      hoveredPoint: null,
      tooltip: null
    };
  },
  computed: {
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
      
      return `M ${firstPoint.x},200 L ${points.join(' L ')} L ${lastPoint.x},200 Z`;
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.animateCharts();
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
      this.tooltip = this.createTooltip(event, `${point.value}%`);
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

.dashboard-main {
  flex: 1;
  padding: 2.5rem;
}

.dashboard-container {
  max-width: 80rem;
  margin: 0 auto;
}

.title-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
}

.filter-search-bar {
  display: flex;
  width: 685px;
  height: 61px;
  justify-content: center;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  border-radius: 58px;
  background: #D3CFE2;
}

.filter-btn {
  display: flex;
  width: 97px;
  height: 39px;
  padding: 8px;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 58px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  color: #C2C3C4;
  background: var(--surface-color-surface-primary, #FFF);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn i {
  font-size: 1.1rem;
}

.filter-btn:hover {
  background: var(--sidebar-color);
  color: var(--primary-color);
}

.search-wrapper {
  display: flex;
  width: 439px;
  height: 39px;
  padding: 8px;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 58px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  background: var(--surface-color-surface-primary, #FFF);
}

.search-icon {
  color: #b8a4e3;
  font-size: 1.1rem;
  margin-right: 0.7rem;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  width: 100%;
}

.search-input::placeholder {
  color: #b8a4e3;
  opacity: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
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
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.stat-icon {
  font-size: 1.5rem;
  color: #7c6bb0;
  margin-right: 0.5rem;
}

.stat-time {
  font-size: 1.125rem;
  font-weight: 600;
}

.stat-number {
  font-size: 1.875rem;
  font-weight: bold;
}

.stat-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.stat-subtitle {
  font-size: 0.875rem;
  color: #aaaaaa;
  margin-bottom: 1rem;
}

.stat-change {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.stat-change.positive {
  color: #22c55e;
}

.stat-change.growth {
  color: #ec4899;
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
}

.stat-action-btn:hover {
  background: #5a4a8c;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .charts-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.chart-card {
  border-radius: 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.chart-controls {
  display: flex;
  gap: 1rem;
}

.chart-period-btn {
  color: #7c6bb0;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.chart-period-btn.active {
  color: #7c6bb0;
}

.chart-period-btn:not(.active) {
  color: #aaaaaa;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 15rem;
  background: #ede7f6;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
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
  font-size: 0.75rem;
  color: #7c6bb0;
  font-weight: 600;
  z-index: 2;
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

.chart-area {
  fill: url(#areaGradient);
  opacity: 0.3;
  transform: translateY(100%);
  transition: transform 0.8s ease-out;
  animation: area-fill 1s ease-out 0.5s forwards;
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
  font-size: 0.75rem;
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
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #7c6bb0;
  font-weight: 500;
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
  width: 2.5rem;
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
  font-size: 0.75rem;
  color: #7c6bb0;
  font-weight: 600;
  text-align: center;
  transition: color 0.2s ease;
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

@media (max-width: 768px) {
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
  }
  
  .search-wrapper {
    width: 100%;
  }
}
</style>
