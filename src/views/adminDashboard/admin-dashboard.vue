<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div id="admin-container">
      <div id="admin-inner">
        <h2 id="admin-title">Admin Dashboard</h2>
        <div id="admin-controls">
          <button id="filter-btn">Filter</button>
          <button id="sort-btn">Sort by</button>
          <div id="admin-search-wrapper">
            <input v-model="searchQuery" type="text" placeholder="Search Field" id="admin-search" />
            <span id="admin-search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>
        <div id="admin-cards">
          <div class="admin-card">
            <div class="admin-card-top">
              <i class="fas fa-sun"></i>
              <span>{{ currentTime }}</span>
            </div>
            <div class="admin-card-sub">Realtime Insight</div>
            <button class="admin-card-btn">View All Bookings</button>
          </div>
          <div class="admin-card">
            <div class="admin-card-top">
              <i class="fas fa-users"></i>
              <span>{{ totalTechnicians }}</span>
            </div>
            <div class="admin-card-title">Total Technicians</div>
            <div class="admin-card-sub green">{{ newTechniciansText }}</div>
          </div>
          <div class="admin-card">
            <div class="admin-card-top">
              <i class="fas fa-user"></i>
              <span>{{ totalCustomers }}</span>
            </div>
            <div class="admin-card-title">Customers</div>
            <div class="admin-card-sub green">{{ customersChangeText }}</div>
          </div>
          <div class="admin-card">
            <div class="admin-card-top">
              <i class="fas fa-chart-line"></i>
              <span>{{ platformGrowth }}</span>
            </div>
            <div class="admin-card-title">Platform Growth</div>
            <div class="admin-card-sub pink">{{ platformGrowthText }}</div>
          </div>
        </div>
        <div id="admin-charts">
          <div id="admin-line-chart">
            <div id="line-chart-header">
              <div>Attendance Comparison Chart</div>
              <div class="line-chart-legend">
                <span class="legend-dot daily"></span> Daily
                <span class="legend-dot weekly"></span> Weekly
                <span class="legend-dot monthly"></span> Monthly
                <i class="fas fa-sliders-h chart-settings"></i>
              </div>
            </div>
            <!-- Line Chart SVG -->
            <svg viewBox="0 0 791 303" class="attendance-chart" preserveAspectRatio="none">
              <!-- Grid lines -->
              <g stroke="#ece9f6" stroke-width="1">
                <line x1="60" y1="40" x2="740" y2="40" />
                <line x1="60" y1="80" x2="740" y2="80" />
                <line x1="60" y1="120" x2="740" y2="120" />
                <line x1="60" y1="160" x2="740" y2="160" />
                <line x1="60" y1="200" x2="740" y2="200" />
                <line x1="60" y1="40" x2="60" y2="260" />
                <line x1="740" y1="40" x2="740" y2="260" />
              </g>
              <!-- Highlighted vertical bar for 07 Aug -->
              <rect x="{chartLeft + 4 * chartUsableWidth / (attendanceData.length - 1) - 20}" y="40" width="40" height="220" fill="#7c6bb0" fill-opacity="0.08" rx="8" />
              <!-- Polyline for data -->
              <polyline :points="points" fill="none" stroke="#7c6bb0" stroke-width="3" />
              <!-- Data points -->
              <circle v-for="(c, i) in circles" :key="i" :cx="c.x" :cy="c.y" :r="c.day === '07 Aug' ? 8 : 5" fill="#fff" stroke="#7c6bb0" :stroke-width="c.day === '07 Aug' ? 3 : 2" />
              <!-- 91% label above 07 Aug -->
              <text v-if="circles[4]" :x="circles[4].x" :y="circles[4].y - 18" font-size="18" fill="#7c6bb0" font-weight="bold" text-anchor="middle">{{ circles[4].value }}%</text>
              <!-- X axis labels (days) -->
              <g font-size="14" fill="#888">
                <text v-for="(c, i) in circles" :key="'x'+i" :x="c.x" y="285" text-anchor="middle">{{ c.day }}</text>
              </g>
              <!-- Y axis labels (percentages) -->
              <g font-size="14" fill="#888">
                <text x="60" y="260" text-anchor="end">0%</text>
                <text x="60" y="220" text-anchor="end">20%</text>
                <text x="60" y="180" text-anchor="end">40%</text>
                <text x="60" y="140" text-anchor="end">60%</text>
                <text x="60" y="100" text-anchor="end">80%</text>
                <text x="60" y="60" text-anchor="end">100%</text>
              </g>
            </svg>
          </div>
          <div id="admin-bar-chart">
            <div class="admin-card-title">Weekly Bookings <i class="fas fa-sliders-h chart-settings"></i></div>
            <!-- Bar Chart SVG -->
            <svg viewBox="0 0 260 220" class="weekly-bar-chart">
              <!-- Grid lines -->
              <g stroke="#ece9f6" stroke-width="1">
                <line x1="40" y1="40" x2="240" y2="40" />
                <line x1="40" y1="80" x2="240" y2="80" />
                <line x1="40" y1="120" x2="240" y2="120" />
                <line x1="40" y1="160" x2="240" y2="160" />
                <line x1="40" y1="200" x2="240" y2="200" />
                <line x1="40" y1="40" x2="40" y2="200" />
                <line x1="240" y1="40" x2="240" y2="200" />
              </g>
              <!-- Bars -->
              <rect x="52" y="120" width="24" height="80" rx="6" fill="#b8a4e3" fill-opacity="0.7" /> <!-- Sales -->
              <rect x="88" y="80" width="24" height="120" rx="6" fill="#b8a4e3" fill-opacity="0.7" /> <!-- IT -->
              <rect x="124" y="40" width="24" height="160" rx="6" fill="#7c6bb0" /> <!-- Marketing (highlighted) -->
              <rect x="160" y="80" width="24" height="120" rx="6" fill="#b8a4e3" fill-opacity="0.7" /> <!-- Legal -->
              <rect x="196" y="120" width="24" height="80" rx="6" fill="#b8a4e3" fill-opacity="0.7" /> <!-- API -->
              <!-- 86% label above Marketing -->
              <text x="136" y="30" font-size="18" fill="#7c6bb0" font-weight="bold" text-anchor="middle">86%</text>
              <!-- X axis labels (categories) -->
              <g font-size="14" fill="#888">
                <text x="64" y="215" text-anchor="middle">Sales</text>
                <text x="100" y="215" text-anchor="middle">IT</text>
                <text x="136" y="215" text-anchor="middle">Marketing</text>
                <text x="172" y="215" text-anchor="middle">Legal</text>
                <text x="208" y="215" text-anchor="middle">API</text>
              </g>
              <!-- Y axis labels (percentages) -->
              <g font-size="14" fill="#888">
                <text x="40" y="200" text-anchor="end">0%</text>
                <text x="40" y="160" text-anchor="end">20%</text>
                <text x="40" y="120" text-anchor="end">40%</text>
                <text x="40" y="80" text-anchor="end">60%</text>
                <text x="40" y="40" text-anchor="end">80%</text>
                <text x="40" y="20" text-anchor="end">100%</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminSidebar from '../../components/admin-sidebar.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const searchQuery = ref('');
const chartType = ref('daily');
const currentTime = ref('');
const totalTechnicians = ref(0);
const totalCustomers = ref(0);
const platformGrowth = ref(0);
const newTechniciansText = ref('');
const customersChangeText = ref('');
const platformGrowthText = ref('');

// Dynamic attendance data (percentage for each day)
const attendanceData = ref([
  { day: '01 Aug', value: 60 },
  { day: '02 Aug', value: 70 },
  { day: '03 Aug', value: 80 },
  { day: '04 Aug', value: 90 },
  { day: '07 Aug', value: 91 },
  { day: '08 Aug', value: 60 },
  { day: '09 Aug', value: 40 },
  { day: '10 Aug', value: 60 },
  { day: '11 Aug', value: 80 },
  { day: '14 Aug', value: 70 },
  { day: '15 Aug', value: 60 },
  { day: '16 Aug', value: 50 },
  { day: '17 Aug', value: 70 },
]);

const chartWidth = 791;
const chartHeight = 303;
const chartLeft = 60;
const chartRight = 740;
const chartTop = 40;
const chartBottom = 260;
const chartUsableWidth = chartRight - chartLeft;
const chartUsableHeight = chartBottom - chartTop;

const points = computed(() => {
  const n = attendanceData.value.length;
  return attendanceData.value.map((d, i) => {
    const x = chartLeft + (i * chartUsableWidth) / (n - 1);
    const y = chartBottom - (d.value / 100) * chartUsableHeight;
    return `${x},${y}`;
  }).join(' ');
});

const circles = computed(() => {
  const n = attendanceData.value.length;
  return attendanceData.value.map((d, i) => {
    const x = chartLeft + (i * chartUsableWidth) / (n - 1);
    const y = chartBottom - (d.value / 100) * chartUsableHeight;
    return { x, y, value: d.value, day: d.day };
  });
});

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString();
}

onMounted(async () => {
  updateTime();
  setInterval(updateTime, 1000);

  // Fetch technicians
  const techSnap = await getDocs(collection(db, 'technicians'));
  totalTechnicians.value = techSnap.size;
  newTechniciansText.value = '2 new employees added!'; // Replace with real logic if available

  // Fetch customers
  const customerSnap = await getDocs(collection(db, 'customers'));
  totalCustomers.value = customerSnap.size;
  customersChangeText.value = '+10% Less than yesterday'; // Replace with real logic if available

  // Fetch platform growth (dummy for now)
  platformGrowth.value = 30;
  platformGrowthText.value = '+3% Increase than yesterday'; // Replace with real logic if available
});
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}
#admin-container {
  background-color: #f9fafb;
  min-height: 100vh;
  flex: 1;
}
#admin-inner {
  padding: 40px 22px;
  max-width: 1120px;
  margin: 0 auto;
}
#admin-title {
  font-size: 28px;
  font-weight: 600;
  color: #7c6bb0;
  margin-bottom: 18px;
}
#admin-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  margin-bottom: 32px;
}
#admin-search-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-left: auto;
}
#admin-search {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border-radius: 9999px;
  background-color: #ede7f6;
  color: #333;
  border: none;
}
#admin-search-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #7c6bb0;
  font-size: 18px;
}
#filter-btn,
#sort-btn {
  background-color: #ede7f6;
  color: #7c6bb0;
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
#admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}
.admin-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 28px 24px 24px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.admin-card-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 22px;
  color: #7c6bb0;
}
.admin-card-title {
    display: flex;
    justify-content: center;
    align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
.admin-card-sub {
  font-size: 13px;
  margin-top: 4px;
}
.admin-card-sub.green {
  color: #22c55e;
}
.admin-card-sub.pink {
  color: #f472b6;
}
.admin-card-btn {
  background-color: #7c6bb0;
  color: white;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
#admin-charts {
  display: grid;
  gap: 24px;
  grid-template-columns: 2fr 1fr;
}
#line-chart-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-weight: 600;
}
.line-chart-buttons button {
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  font-weight: 600;
  font-size: 15px;
  margin-left: 8px;
}
.line-chart-buttons .active {
  color: #7c6bb0;
  text-decoration: underline;
}
#admin-line-chart {
  background: #fff;
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(124,107,176,0.10);
  margin-bottom: 24px;
  filter: drop-shadow(0 2px 24px rgba(0, 0, 0, 0.10));
  width: 791.318px;
  flex-shrink: 0;
}
.line-chart-legend {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 15px;
  color: #7c6bb0;
  font-weight: 500;
}
.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 4px;
}
.legend-dot.daily { background: #7c6bb0; }
.legend-dot.weekly { border: 2px solid #7c6bb0; background: #fff; }
.legend-dot.monthly { border: 2px solid #7c6bb0; background: #fff; opacity: 0.5; }
.chart-settings {
  margin-left: 16px;
  color: #b8a4e3;
  font-size: 18px;
  cursor: pointer;
}
#admin-bar-chart {
  background: #fff;
  padding: 10px 10px;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(124,107,176,0.10);
  margin-bottom: 24px;
}
.weekly-bar-chart {
  width: 100%;
  height: auto;
  margin-top: 8px;
}
.chart-settings {
  margin-left: 8px;
  color: #b8a4e3;
  font-size: 18px;
  cursor: pointer;
}
.attendance-chart {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
  