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
      <div class="sort-select-wrapper">
        <select v-model="selectedSort" class="searchbar-select sort-select">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <span class="sort-arrow"><i class="fa fa-chevron-down"></i></span>
      </div>
    </div>
    <!-- Search Field -->
    <div class="searchbar-field searchbar-search">
      <i class="fa-solid fa-magnifying-glass searchbar-search-icon"></i>
      <input
        v-model="searchQuery"
        :placeholder="$t('searchPlaceholder')"
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
const openCategory = ref('');
const filterDropdownRef = ref(null);

function toggleCategory(key) {
  openCategory.value = openCategory.value === key ? '' : key;
}
function closeAllDropdowns() {
  showFilterDropdown.value = false;
  openCategory.value = '';
}
function onFilterBtnClick(e) {
  e.stopPropagation();
  showFilterDropdown.value = !showFilterDropdown.value;
  if (!showFilterDropdown.value) openCategory.value = '';
}
function onDropdownClick(e) {
  e.stopPropagation();
}
function handleClickOutside(event) {
  if (filterDropdownRef.value && !filterDropdownRef.value.contains(event.target)) {
    closeAllDropdowns();
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
  gap: 1rem;
  background: transparent;
  justify-content: space-between;
}
.searchbar-field {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  min-width: 160px;
  flex: 1 1 160px;
  position: relative;
}
.filter-field {
  min-width: 200px;
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
}
.searchbar-search-icon {
  position: absolute;
  left: 0.5rem;
  color: #aaa;
  font-size: 1rem;
}
.filter-icon {
  color: #aaa;
  margin-left: 6em;
  margin-right: 0;
}
@media (max-width: 600px) {
  .filter-icon {
  color: #aaa;
  margin-left: 3em;
  margin-right: 0;
}
}
.filter-label {
  margin-right: 0;
}
.sort-field {
  position: relative;
}
.sort-select-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}
.sort-select {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  outline: none;
  padding: 0.25rem 0 0.25rem 0.25rem;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  margin-right: 0.5em;
}
.sort-arrow {
  color: #aaa;
  font-size: 1rem;
  pointer-events: none;
  flex-shrink: 0;
  margin-left: 0.5em;
  margin-right: 0;
}
@media (max-width: 900px) {
  .searchbar-row {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .searchbar-field {
    min-width: 120px;
    padding: 0.5rem 0.5rem;
  }
  .searchbar-search {
    min-width: 200px;
    flex: 2 1 200px;
  }
  .searchbar-input {
    width: 20ch;
  }
}
@media (max-width: 600px) {
  .searchbar-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  .searchbar-field {
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0 0.2rem;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  .searchbar-btn,
  .sort-select {
    font-size: 0.7rem;
    height: 100%;
    line-height: 28px;
    padding: 0 0.1rem;
    box-sizing: border-box;
  }
  .filter-label {
    font-size: 0.7rem;
  }
  .filter-icon {
    color: #aaa;
    margin-left: 3em;
    margin-right: 0;
    font-size: 0.7rem;
  }
  .sort-arrow {
    font-size: 0.7rem;
  }
}
</style> 