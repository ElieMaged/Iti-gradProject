<template>
    <div class="end-card" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="end-content">
            <h2 class="end-title">{{ $t('endCardTitle') }} <!-- We're Here to Help You. --></h2>
            <p class="end-description">{{ $t('endCardDescription') }} <!-- We're here to help you achieve your goals... --></p>
            <button class="end-button">
                {{ $t('endCardBookBtn') }} <!-- Book an Appointment --> <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import endImage from '../assets/Contact/end.jpg'

const backgroundImage = endImage
</script>

<style scoped>
.end-card {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 400px;
    border-radius: 20px;
    margin: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    position: relative;
}

.end-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    z-index: 1;
}

.end-content {
    position: relative;
    z-index: 2;
    max-width: 600px;
    padding: 2rem;
}

.end-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.end-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    opacity: 0.9;
}

.end-button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.end-button:hover {
    background-color: #4a3f7a;
}

.end-button i {
    transition: transform 0.3s ease;
}

.end-button:hover i {
    transform: translateX(5px);
}
</style>