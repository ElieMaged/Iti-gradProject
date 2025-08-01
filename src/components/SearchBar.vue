<template>
  <div class="searchbar-row">
    <!-- Filter Dropdown -->
    <div class="searchbar-field filter-field">
      <button class="searchbar-btn" @click="onFilterBtnClick" type="button">
        <span class="filter-label">{{ $t('filter') }}</span>
        <i class="fa-solid fa-filter filter-icon"></i>
      </button>
      <div v-if="showFilterDropdown" class="filter-dropdown" ref="filterDropdownRef" @click="onDropdownClick">
        <div v-for="cat in filterCategories" :key="cat.key" class="filter-category">
          <button class="category-btn" @click.stop="toggleCategory(cat.key)">
            {{ cat.label }}
            <i class="fa" :class="openCategory === cat.key ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
          <div v-if="openCategory === cat.key" class="category-options">
            <template v-if="cat.type === 'radio'">
              <label v-for="option in cat.options" :key="option.value" class="dropdown-label">
                <input type="radio" :name="cat.key" v-model="selectedFilters[cat.key]" :value="option.value" />
                {{ option.label }}
              </label>
            </template>
            <template v-else>
              <label v-for="option in cat.options" :key="option.value" class="dropdown-label">
                <input type="checkbox" v-model="selectedFilters[cat.key]" :value="option.value" />
                {{ option.label }}
              </label>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- Sort Dropdown -->
    <div class="searchbar-field sort-field">
      <button class="searchbar-btn" @click="onSortBtnClick" type="button">
        <span class="sort-label">{{ getSortLabel() }}</span>
        <i class="fa-solid fa-chevron-down sort-icon"></i>
      </button>
      <div v-if="showSortDropdown" class="sort-dropdown" ref="sortDropdownRef" @click="onSortDropdownClick">
        <div v-for="option in sortOptions" :key="option.value" class="sort-option">
          <button class="sort-option-btn" @click.stop="selectSortOption(option.value)">
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
    <!-- Search Field -->
    <div class="searchbar-field searchbar-search">
      <i class="fa-solid fa-magnifying-glass searchbar-search-icon"></i>
      <input
        v-model="searchQuery"
        :placeholder="Search"
        class="searchbar-input"
        @input="emitSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const emit = defineEmits(['update:filter', 'update:sort', 'update:search']);

// Filter categories and options
const filterCategories = [
  {
    key: 'price',
    label: t('filterPrice'),
    options: [
      { value: '50-100', label: t('filterPrice50to100') },
      { value: '100-150', label: t('filterPrice100to150') },
      { value: '150-200', label: t('filterPrice150to200') },
    ],
    type: 'radio'
  },
  {
    key: 'area',
    label: t('filterArea'),
    options: [
      { value: 'Maadi', label: t('filterAreaMaadi') },
      { value: 'Mokattam', label: t('filterAreaMokattam') },
      { value: 'Shoubra', label: t('filterAreaShoubra') },
      { value: 'Embaba', label: t('filterAreaEmbaba') },
    ],
    type: 'radio'
  },
  {
    key: 'rating',
    label: t('filterRating'),
    options: [
      { value: '2-3', label: t('filterRating2to3') },
      { value: '3-4', label: t('filterRating3to4') },
      { value: '4-5', label: t('filterRating4to5') },
    ],
    type: 'radio'
  },
  {
    key: 'years',
    label: t('filterYears'),
    options: [
      { value: '0-1', label: t('filterYears0to1') },
      { value: '1-2', label: t('filterYears1to2') },
      { value: '2-3', label: t('filterYears2to3') },
      { value: '3-5', label: t('filterYears3to5') },
    ],
    type: 'checkbox'
  }
];

const selectedFilters = ref({
  price: '',
  area: '',
  rating: '',
  years: []
});

watch(selectedFilters, (val) => {
  emit('update:filter', val);
}, { deep: true });

const sortOptions = [
  { value: '', label: t('sortby') },
  { value: 'relevance', label: t('sortRelevance') },
  { value: 'priceLow', label: t('sortPriceLow') },
  { value: 'priceHigh', label: t('sortPriceHigh') },
  { value: 'rating', label: t('sortRating') }
];
const selectedSort = ref('');
watch(selectedSort, (val) => {
  emit('update:sort', val);
});
const searchQuery = ref('');
function emitSearch() {
  emit('update:search', searchQuery.value);
}

// Dropdown logic
const showFilterDropdown = ref(false);
const showSortDropdown = ref(false);
const openCategory = ref('');
const filterDropdownRef = ref(null);
const sortDropdownRef = ref(null);

function toggleCategory(key) {
  openCategory.value = openCategory.value === key ? '' : key;
}
function closeAllDropdowns() {
  showFilterDropdown.value = false;
  showSortDropdown.value = false;
  openCategory.value = '';
}
function onFilterBtnClick(e) {
  e.stopPropagation();
  showFilterDropdown.value = !showFilterDropdown.value;
  if (!showFilterDropdown.value) openCategory.value = '';
  showSortDropdown.value = false;
}
function onSortBtnClick(e) {
  e.stopPropagation();
  showSortDropdown.value = !showSortDropdown.value;
  showFilterDropdown.value = false;
  openCategory.value = '';
}
function onDropdownClick(e) {
  e.stopPropagation();
}
function onSortDropdownClick(e) {
  e.stopPropagation();
}
function selectSortOption(value) {
  selectedSort.value = value;
  showSortDropdown.value = false;
}
function getSortLabel() {
  const selectedOption = sortOptions.find(option => option.value === selectedSort.value);
  return selectedOption ? selectedOption.label : t('sortby');
}
function handleClickOutside(event) {
  if (filterDropdownRef.value && !filterDropdownRef.value.contains(event.target)) {
    showFilterDropdown.value = false;
    openCategory.value = '';
  }
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(event.target)) {
    showSortDropdown.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.searchbar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  background: transparent;
  justify-content: flex-start;
  align-items: center;
}
.searchbar-field {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  min-width: 120px;
  flex: 0 0 auto;
  position: relative;
}
.filter-field {
  min-width: 80px;
  max-width: 100px;
  width: 100px;
  height: 44px;
}
.searchbar-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  justify-content: flex-start;
  padding: 0;
}
.filter-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  z-index: 10;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  min-width: 220px;
  padding: 0.5rem 0.75rem;
}
.filter-category {
  margin-bottom: 0.5rem;
}
.category-btn {
  background: none;
  border: none;
  font-weight: 600;
  color: #625397;
  font-size: 1rem;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.25rem 0;
}
.category-options {
  padding-left: 1rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dropdown-label {
  font-size: 0.98rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.searchbar-select {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  outline: none;
  padding: 0.25rem 0;
}
.searchbar-input {
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  outline: none;
  width: 32ch;
  /* double the default width for a long placeholder */
  padding-left: 1.5rem;
  transition: width 0.2s;
}
.searchbar-search {
  position: relative;
  min-width: 320px;
  flex: 2 1 320px;
  height: 44px;
}
.searchbar-search-icon {
  position: absolute;
  left: 0.5rem;
  color: #aaa;
  font-size: 1rem;
}
.filter-icon {
  color: #aaa;
  margin-left: 1rem;
  margin-right: 0;
}
@media (max-width: 600px) {
  .filter-icon {
  color: #aaa;
  margin-left: 0.5rem;
  margin-right: 0;
}
}
.filter-label {
  margin-right: 0;
}
.sort-field {
  min-width: 80px;
  max-width: 100px;
  width: 100px;
  height: 44px;
  position: relative;
}
.sort-label {
  margin-right: 0;
}
.sort-icon {
  color: #aaa;
  margin-left: 1rem;
  margin-right: 0;
}
.sort-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  z-index: 10;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  min-width: 180px;
  padding: 0.5rem 0.75rem;
}
.sort-option {
  margin-bottom: 0.25rem;
}
.sort-option:last-child {
  margin-bottom: 0;
}
.sort-option-btn {
  background: none;
  border: none;
  font-size: 0.98rem;
  color: #333;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.2s;
}
.sort-option-btn:hover {
  color: #625397;
}
@media (max-width: 900px) {
  .searchbar-row {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .searchbar-field {
    min-width: 100px;
    padding: 0.5rem 0.5rem;
  }
  .filter-field {
    min-width: 70px;
    max-width: 90px;
    width: 90px;
    height: 40px;
  }
  .sort-field {
    min-width: 70px;
    max-width: 90px;
    width: 90px;
    height: 40px;
  }
  .searchbar-search {
    min-width: 200px;
    flex: 2 1 200px;
    height: 40px;
  }
  .searchbar-input {
    width: 20ch;
  }
}

/* Enhanced Responsive Design */
@media (max-width: 1200px) {
  .searchbar-row {
    gap: 0.75rem;
  }
  
  .searchbar-field {
    min-width: 110px;
    padding: 0.6rem 0.75rem;
  }
  
  .filter-field {
    min-width: 80px;
    max-width: 100px;
    width: 100px;
    height: 44px;
  }
  
  .sort-field {
    min-width: 80px;
    max-width: 100px;
    width: 100px;
    height: 44px;
  }
  
  .searchbar-search {
    min-width: 280px;
    flex: 2 1 280px;
    height: 44px;
  }
  
  .searchbar-input {
    width: 28ch;
  }
  
  .filter-dropdown {
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .searchbar-row {
    gap: 0.6rem;
  }
  
  .searchbar-field {
    min-width: 100px;
    padding: 0.5rem 0.6rem;
  }
  
  .filter-field {
    min-width: 70px;
    max-width: 90px;
    width: 90px;
    height: 40px;
  }
  
  .sort-field {
    min-width: 70px;
    max-width: 90px;
    width: 90px;
    height: 40px;
  }
  
  .searchbar-search {
    min-width: 240px;
    flex: 2 1 240px;
    height: 40px;
  }
  
  .searchbar-input {
    width: 24ch;
  }
  
  .searchbar-btn,
  .searchbar-select,
  .searchbar-input {
    font-size: 0.9rem;
  }
  
  .filter-dropdown {
    min-width: 180px;
    padding: 0.4rem 0.6rem;
  }
  
  .category-btn {
    font-size: 0.9rem;
    padding: 0.2rem 0;
  }
  
  .dropdown-label {
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .searchbar-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .filter-field {
    flex: 0 0 auto;
    width: calc(50% - 0.25rem);
    min-width: 60px;
    max-width: 80px;
    height: 38px;
  }
  
  .sort-field {
    flex: 0 0 auto;
    width: calc(50% - 0.25rem);
    min-width: 60px;
    max-width: 80px;
    height: 38px;
  }
  
  .searchbar-search {
    flex: 1 1 100%;
    width: 100%;
    margin-top: 0.5rem;
    height: 38px;
  }
  
  .searchbar-field {
    padding: 0.5rem 0.75rem;
    height: auto;
    line-height: normal;
  }
  
  .searchbar-btn,
  .searchbar-select,
  .searchbar-input {
    font-size: 0.85rem;
    height: auto;
    line-height: normal;
    padding: 0.25rem 0;
  }
  
  .filter-label {
    font-size: 0.85rem;
  }
  
  .filter-icon {
    color: #aaa;
    margin-left: 0.5rem;
    margin-right: 0;
    font-size: 0.85rem;
  }
  
  .sort-icon {
    color: #aaa;
    margin-left: 0.5rem;
    margin-right: 0;
    font-size: 0.85rem;
  }
  
  .sort-arrow {
    font-size: 0.85rem;
    margin-left: 0.25rem;
  }
  
  .searchbar-search-icon {
    font-size: 0.85rem;
  }
  
  .filter-dropdown {
    min-width: 100%;
    left: 0;
    right: 0;
  }
}

@media (max-width: 480px) {
  .searchbar-row {
    gap: 0.4rem;
  }
  
  .searchbar-field {
    padding: 0.4rem 0.6rem;
  }
  
  .searchbar-btn,
  .searchbar-select,
  .searchbar-input {
    font-size: 0.8rem;
  }
  
  .filter-label {
    font-size: 0.8rem;
  }
  
  .filter-icon {
    font-size: 0.8rem;
    margin-left: 0.4rem;
  }
  
  .sort-icon {
    font-size: 0.8rem;
    margin-left: 0.4rem;
  }
  
  .sort-arrow {
    font-size: 0.8rem;
  }
  
  .searchbar-search-icon {
    font-size: 0.8rem;
  }
  
  .category-btn {
    font-size: 0.8rem;
  }
  
  .dropdown-label {
    font-size: 0.8rem;
  }
  
  .filter-dropdown {
    padding: 0.3rem 0.5rem;
  }
}

@media (max-width: 360px) {
  .searchbar-row {
    gap: 0.3rem;
  }
  
  .searchbar-field {
    padding: 0.3rem 0.5rem;
  }
  
  .searchbar-btn,
  .searchbar-select,
  .searchbar-input {
    font-size: 0.75rem;
  }
  
  .filter-label {
    font-size: 0.75rem;
  }
  
  .filter-icon {
    font-size: 0.75rem;
    margin-left: 0.3rem;
  }
  
  .sort-icon {
    font-size: 0.75rem;
    margin-left: 0.3rem;
  }
  
  .sort-arrow {
    font-size: 0.75rem;
    margin-left: 0.15rem;
  }
  
  .searchbar-search-icon {
    font-size: 0.75rem;
  }
  
  .category-btn {
    font-size: 0.75rem;
  }
  
  .dropdown-label {
    font-size: 0.75rem;
  }
  
  .filter-dropdown {
    padding: 0.25rem 0.4rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .searchbar-row {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .searchbar-field {
    width: auto;
    min-width: 120px;
  }
  
  .searchbar-search {
    flex: 2 1 200px;
  }
  
  .searchbar-input {
    width: 20ch;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .searchbar-field {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .searchbar-input {
    transition: none;
  }
  
  .searchbar-btn,
  .category-btn {
    transition: none;
  }
}
</style> 