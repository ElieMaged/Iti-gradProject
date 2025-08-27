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
            <!-- Special handling for government/district interlinked filters -->
            <template v-if="cat.key === 'government'">
              <label v-for="option in cat.options" :key="option.value" class="dropdown-label">
                <input type="radio" :name="cat.key" v-model="tempFilters[cat.key]" :value="option.value" @change="onGovernmentFilterChange(option.value)" />
                {{ option.label }}
              </label>
            </template>
            <template v-else-if="cat.key === 'district'">
              <label v-for="option in cat.options" :key="option.value" class="dropdown-label" :class="{ 'disabled': !tempFilters.government }">
                <input type="radio" :name="cat.key" v-model="tempFilters[cat.key]" :value="option.value" @change="updateTempFilter(cat.key, option.value)" :disabled="!tempFilters.government" />
                {{ option.label }}
              </label>
            </template>
            <template v-else-if="cat.type === 'radio'">
              <label v-for="option in cat.options" :key="option.value" class="dropdown-label">
                <input type="radio" :name="cat.key" v-model="tempFilters[cat.key]" :value="option.value" @change="updateTempFilter(cat.key, option.value)" />
                {{ option.label }}
              </label>
            </template>
            <template v-else>
              <label v-for="option in cat.options" :key="option.value" class="dropdown-label">
                <input type="checkbox" v-model="tempFilters[cat.key]" :value="option.value" @change="updateTempFilter(cat.key, tempFilters[cat.key])" />
                {{ option.label }}
              </label>
            </template>
          </div>
        </div>
        <div class="filter-actions">
          <button class="apply-btn" @click="applyFilters">
            Apply
          </button>
        </div>
      </div>
    </div>
    <!-- Sort Dropdown -->
    <div class="searchbar-field sort-field">
      <button class="searchbar-btn" @click="onSortBtnClick" type="button">
        <span class="sort-label">{{ getSortLabel() === $t('sortby') ? 'Sort by' : getSortLabel() }}</span>
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
        placeholder="Find a Technician"
        class="searchbar-input"
        @input="emitSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getGovernmentNames, getDistrictsForGovernment, governmentNamesAr, districtsAr } from '../data/egyptianLocations';

const { t, locale } = useI18n();
const emit = defineEmits(['update:filter', 'update:sort', 'update:search', 'update:location', 'update:specialization']);

// Location dropdowns
const selectedGovernment = ref('');
const selectedDistrict = ref('');
const governmentOptions = getGovernmentNames();

const districtOptions = computed(() => {
  return selectedGovernment.value ? getDistrictsForGovernment(selectedGovernment.value) : [];
});

// Watch for location changes and emit updates
watch([selectedGovernment, selectedDistrict], ([gov, district]) => {
  emit('update:location', {
    government: gov,
    district: district
  });
});

function onGovernmentChange() {
  selectedDistrict.value = ''; // Reset district when government changes
}

function onDistrictChange() {
  // District change is handled by the watch above
}

// Filter categories and options
const filterCategories = computed(() => [
  {
    key: 'government',
    label: t('government'),
    options: [
      { value: '', label: t('allGovernments') },
      ...governmentOptions.map(gov => ({ 
        value: gov, 
        label: locale.value === 'ar' ? governmentNamesAr[gov] || gov : gov 
      })),
    ],
    type: 'radio'
  },
  {
    key: 'district',
    label: t('districtArea'),
    options: [
      { value: '', label: t('allDistricts') },
      ...(tempFilters.value.government ? getDistrictsForGovernment(tempFilters.value.government) : []).map(district => ({ 
        value: district, 
        label: locale.value === 'ar' ? (districtsAr[tempFilters.value.government]?.[district] || district) : district 
      })),
    ],
    type: 'radio'
  },
  
  {
    key: 'price',
    label: t('filterPrice'),
    options: [
      { value: '50-100', label: t('filterPrice50to100') },
      { value: '100-150', label: t('filterPrice100to150') },
      { value: '150+', label: t('filterPrice150to200') },
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
  }
]);

const selectedFilters = ref({
  government: '',
  district: '',
  price: '',
  rating: ''
});

const tempFilters = ref({
  government: '',
  district: '',
  price: '',
  rating: ''
});

// Remove the automatic watch and add apply function
function applyFilters() {
  selectedFilters.value = { ...tempFilters.value };
  emit('update:filter', selectedFilters.value);
  emit('update:location', {
    government: tempFilters.value.government,
    district: tempFilters.value.district
  });
  // Specialization filter removed
  showFilterDropdown.value = false;
  openCategory.value = '';
}

const sortOptions = [
  { value: '', label: t('sortby') },
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

function updateTempFilter(key, value) {
  tempFilters.value[key] = value;
}
function closeAllDropdowns() {
  showFilterDropdown.value = false;
  showSortDropdown.value = false;
  openCategory.value = '';
}
function onFilterBtnClick(e) {
  e.stopPropagation();
  showFilterDropdown.value = !showFilterDropdown.value;
  if (showFilterDropdown.value) {
    // Initialize temp filters with current selected filters
    tempFilters.value = { ...selectedFilters.value };
  } else {
    openCategory.value = '';
  }
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

function onGovernmentFilterChange(value) {
  tempFilters.value.government = value;
  tempFilters.value.district = ''; // Reset district when government changes
  selectedGovernment.value = value;
  selectedDistrict.value = '';
}
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

.location-field {
  min-width: 140px;
  max-width: 160px;
  height: 44px;
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
  justify-content: space-between;
  padding: 0 0.5px 0 0;
}
.filter-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  z-index: 10;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  min-width: 150px;
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
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.category-options::-webkit-scrollbar {
  width: 6px;
}

.category-options::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.category-options::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.category-options::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
.dropdown-label {
  font-size: 0.98rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-label.disabled input {
  cursor: not-allowed;
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

.location-select {
  cursor: pointer;
  font-weight: 500;
}

.location-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  margin-left: 6px;
  color: #aaa;
  font-size: 1rem;
}
.filter-icon {
  color: #aaa;
  margin-left: 1.5rem;
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
  margin-left: 1.5rem;
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
  min-width: 150px;
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
  font-weight: 600;
  color: #625397;
  font-size: 1rem;
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

.filter-actions {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
  text-align: center;
}

.apply-btn {
  background: #625397;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn:hover {
  background: #4a3d7a;
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
    min-width: 150px;
  }
  
  .sort-dropdown {
    min-width: 150px;
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
    min-width: 150px;
    padding: 0.4rem 0.6rem;
  }
  
  .sort-dropdown {
    min-width: 150px;
    padding: 0.4rem 0.6rem;
  }
  
  .category-btn {
    font-size: 0.9rem;
    padding: 0.2rem 0;
  }
  
  .dropdown-label {
    font-size: 0.9rem;
  }
  
  .sort-option-btn {
    font-size: 0.9rem;
    padding: 0.2rem 0;
  }
  
  .apply-btn {
    font-size: 0.85rem;
    padding: 0.4rem 1.2rem;
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
    margin-left: 0.75rem;
    margin-right: 0;
    font-size: 0.85rem;
  }
  
  .sort-icon {
    color: #aaa;
    margin-left: 0.75rem;
    margin-right: 0;
    font-size: 0.85rem;
  }
  
  .sort-arrow {
    font-size: 0.85rem;
    margin-left: 0.25rem;
  }
  
  .searchbar-search-icon {
    font-size: 0.85rem;
    margin-left: 5px;
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
    margin-left: 0.6rem;
    margin-right: 0;
  }
  
  .sort-icon {
    font-size: 0.8rem;
    margin-left: 0.6rem;
    margin-right: 0;
  }
  
  .sort-arrow {
    font-size: 0.8rem;
  }
  
  .searchbar-search-icon {
    font-size: 0.8rem;
    margin-left: 5px;
  }
  
  .category-btn {
    font-size: 0.8rem;
  }
  
  .dropdown-label {
    font-size: 0.8rem;
  }
  
  .sort-option-btn {
    font-size: 0.8rem;
  }
  
  .apply-btn {
    font-size: 0.8rem;
    padding: 0.35rem 1rem;
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
    margin-left: 0.45rem;
    margin-right: 0;
  }
  
  .sort-icon {
    font-size: 0.75rem;
    margin-left: 0.45rem;
    margin-right: 0;
  }
  
  .sort-arrow {
    font-size: 0.75rem;
    margin-left: 0.15rem;
  }
  
  .searchbar-search-icon {
    font-size: 0.75rem;
    margin-left: 5px;
  }
  
  .category-btn {
    font-size: 0.75rem;
  }
  
  .dropdown-label {
    font-size: 0.75rem;
  }
  
  .sort-option-btn {
    font-size: 0.75rem;
  }
  
  .apply-btn {
    font-size: 0.75rem;
    padding: 0.3rem 0.8rem;
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