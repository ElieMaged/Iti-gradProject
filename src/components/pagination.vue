<template>
    <div class="pagination-wrapper">
      <nav class="pagination" aria-label="Pagination">
        <a
          href="#"
          class="page-btn"
          :class="{ disabled: currentPage === 1 }"
          @click.prevent="goToPage(currentPage - 1)"
        >
          &lt;
        </a>
  
        <a
          v-for="page in visiblePages"
          :key="page"
          href="#"
          class="page-btn"
          :class="{ active: currentPage === page, ellipsis: page === '...'}"
          @click.prevent="goToPage(page)"
        >
          {{ page }}
        </a>
  
        <a
          href="#"
          class="page-btn"
          :class="{ disabled: currentPage === totalPages }"
          @click.prevent="goToPage(currentPage + 1)"
        >
          &gt;
        </a>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  
  const props = defineProps({
    totalPages: {
      type: Number,
      default: 40
    },
    initialPage: {
      type: Number,
      default: 1
    }
  });
  
  const emit = defineEmits(['page-changed']);
  const currentPage = ref(props.initialPage);
  
  const goToPage = (page) => {
    if (page === '...' || page < 1 || page > props.totalPages) return;
    currentPage.value = page;
    emit('page-changed', page);
  };
  
  const visiblePages = computed(() => {
    const pages = [];
    if (props.totalPages <= 7) {
      for (let i = 1; i <= props.totalPages; i++) pages.push(i);
    } else {
      if (currentPage.value <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', props.totalPages);
      } else if (currentPage.value >= props.totalPages - 3) {
        pages.push(1, '...', props.totalPages - 4, props.totalPages - 3, props.totalPages - 2, props.totalPages - 1, props.totalPages);
      } else {
        pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', props.totalPages);
      }
    }
    return pages;
  });
  </script>
  
  <style scoped>
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  }

  .pagination {
    display: flex;
    gap: 6px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 rgba(124,107,176,0.08);
    padding: 6px 12px;
  }

  .page-btn {
    min-width: 36px;
    height: 36px;
    padding: 0 12px;
    border: none;
    border-radius: 10px;
    background: #f3f0fa;
    color: #6B5FA7;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-btn:hover:not(.active):not(.disabled):not(.ellipsis) {
    background: #e6e0f3;
    color: #4e3b7a;
    box-shadow: 0 1px 4px 0 rgba(124,107,176,0.10);
  }

  .page-btn.active {
    background: #7c6bb0;
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 8px 0 rgba(124,107,176,0.16);
  }

  .page-btn.disabled {
    pointer-events: none;
    opacity: 0.5;
    background: #f3f0fa;
    color: #b6a7e6;
  }

  .page-btn.ellipsis {
    cursor: default;
    pointer-events: none;
    background: transparent;
    color: #b6a7e6;
  }
  </style>
  