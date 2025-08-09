<template>
  <div class="title-search-row">
    <h2 class="dashboard-title">{{ title }}</h2>
    <div class="filter-search-bar">
      <div class="topbar-actions">
        <LanguageToggle />
        <button 
          class="icon-btn darkmode-btn"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          type="button"
          @click="toggleDarkMode"
        >
          <i :class="iconClass + ' navbar-icon'"></i>
        </button>
        <NotificationBell />
      </div>
    </div>
  </div>
</template>

<script>
import LanguageToggle from './LanguageToggle.vue';
import NotificationBell from './NotificationBell.vue';

export default {
  name: 'TopBar',
  components: { LanguageToggle, NotificationBell },
  props: {
    title: { type: String, required: true }
  },
  data() {
    return {
      isDark: false
    };
  },
  computed: {
    iconClass() {
      return this.isDark ? 'fa fa-sun' : 'fa fa-moon';
    }
  },
  mounted() {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark = saved ? saved === 'dark' : !!prefersDark;
      this.applyTheme();
    } catch (e) {
      // noop
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDark = !this.isDark;
      try {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      } catch (e) { /* ignore */ }
      this.applyTheme();
    },
    applyTheme() {
      const root = document.documentElement;
      if (this.isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
};
</script>

<style scoped>
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
}

.filter-search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: end;
  border-radius: 58px;
  padding: 0.5rem;
  min-width: 300px;
  flex-wrap: wrap;
}

.dark .filter-search-bar {
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

.filter-btn i {
  font-size: 1.1rem;
}

.dark .filter-btn {
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

/* Actions (language, theme, notifications) */
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.25rem;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.navbar-icon {
  font-size: 1.2rem;
  width: 20px;
  height: 20px;
}

.icon-btn:hover {
  color: var(--gray-500);
}

.darkmode-btn:hover .navbar-icon {
  transform: scale(1.1);
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
    min-width: auto;
  }

  .search-wrapper {
    width: 100%;
    min-width: auto;
  }
  .topbar-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
