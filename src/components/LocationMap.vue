<template>
  <div class="location-map-container">
    <div class="location-info">
      <h4>{{ $t('locationDetails') || 'Location Details' }}</h4>
      <div class="location-display">
        <p v-if="city || area || street || building">
          <strong>{{ $t('address') || 'Address' }}:</strong>
          {{ formattedAddress }}
        </p>
        <p v-else class="no-location">
          {{ $t('noLocationSelected') || 'No location selected' }}
        </p>
        <p v-if="locationDetected" class="location-success">
          <i class="fas fa-check-circle"></i>
          {{ $t('locationDetectedSuccess') || 'Location detected and form auto-filled!' }}
        </p>
      </div>
    </div>
    
    <!-- Real Map Container -->
    <div class="map-container">
      <div id="map" ref="mapContainer" class="map"></div>
      <div class="map-controls">
        <button 
          @click="detectUserLocation" 
          class="detect-location-btn"
          :disabled="isDetecting"
        >
          <i class="fas fa-crosshairs"></i>
          {{ isDetecting ? ($t('detecting') || 'Detecting...') : ($t('detectMyLocation') || 'Detect My Location') }}
        </button>
        <button 
          @click="centerOnAddress" 
          class="center-address-btn"
          :disabled="!hasAddress"
        >
          <i class="fas fa-map-marker-alt"></i>
          {{ $t('centerOnAddress') || 'Center on Address' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  city: {
    type: String,
    default: ''
  },
  area: {
    type: String,
    default: ''
  },
  street: {
    type: String,
    default: ''
  },
  building: {
    type: String,
    default: ''
  }
})

// Reactive state
const isDetecting = ref(false)
const mapContainer = ref(null)
const map = ref(null)
const userMarker = ref(null)
const addressMarker = ref(null)
const locationDetected = ref(false)

// Computed properties
const formattedAddress = computed(() => {
  const parts = [props.building, props.street, props.area, props.city].filter(Boolean)
  return parts.join(', ')
})

const hasAddress = computed(() => {
  return !!(props.city || props.area || props.street || props.building)
})

// Methods
const initMap = () => {
  if (!mapContainer.value) return

  // Initialize map centered on Egypt
  map.value = L.map(mapContainer.value).setView([26.8206, 30.8025], 6)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map.value)

  // Add scale control
  L.control.scale().addTo(map.value)
}

const detectUserLocation = async () => {
  if (!navigator.geolocation) {
    alert(t('geolocationNotSupported') || 'Geolocation is not supported by this browser.')
    return
  }

  isDetecting.value = true

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })

    const { latitude, longitude } = position.coords
    
    // Update map to user location
    updateUserLocation(latitude, longitude)
    
    // Emit the detected coordinates to parent component
    emit('locationDetected', {
      latitude,
      longitude,
      accuracy: position.coords.accuracy
    })

    console.log('Location detected:', { latitude, longitude })
    
  } catch (error) {
    console.error('Error detecting location:', error)
    alert(t('locationDetectionFailed') || 'Failed to detect your location. Please check your browser permissions.')
  } finally {
    isDetecting.value = false
  }
}

const updateUserLocation = (lat, lng) => {
  if (!map.value) return

  // Remove existing user marker
  if (userMarker.value) {
    map.value.removeLayer(userMarker.value)
  }

  // Add new user marker
  userMarker.value = L.marker([lat, lng], {
    icon: L.divIcon({
      className: 'user-marker',
      html: '<i class="fas fa-crosshairs" style="color: #007bff; font-size: 20px;"></i>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }).addTo(map.value)

  // Center map on user location
  map.value.setView([lat, lng], 15)

  // Add popup to user marker
  userMarker.value.bindPopup('Your current location').openPopup()
  
  // Set location detected flag
  locationDetected.value = true
}

const centerOnAddress = async () => {
  if (!hasAddress.value || !map.value) return

  try {
    const address = formattedAddress.value
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=eg&limit=1`)
    const data = await response.json()

    if (data && data.length > 0) {
      const { lat, lon } = data[0]
      
      // Remove existing address marker
      if (addressMarker.value) {
        map.value.removeLayer(addressMarker.value)
      }

      // Add address marker
      addressMarker.value = L.marker([lat, lon], {
        icon: L.divIcon({
          className: 'address-marker',
          html: '<i class="fas fa-map-marker-alt" style="color: #dc3545; font-size: 20px;"></i>',
          iconSize: [20, 20],
          iconAnchor: [10, 20]
        })
      }).addTo(map.value)

      // Center map on address
      map.value.setView([lat, lon], 15)

      // Add popup to address marker
      addressMarker.value.bindPopup(`Address: ${address}`).openPopup()
    } else {
      alert(t('addressNotFound') || 'Address not found on map.')
    }
  } catch (error) {
    console.error('Error geocoding address:', error)
    alert(t('addressGeocodingFailed') || 'Failed to locate address on map.')
  }
}

// Handle location detection from map
const onLocationDetected = async (locationData) => {
  console.log('Location detected:', locationData)
  
  try {
    // Use reverse geocoding to get address from coordinates
    const { latitude, longitude } = locationData
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&countrycodes=eg&zoom=18`
    )
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed')
    }
    
    const data = await response.json()
    console.log('Reverse geocoding result:', data)
    
    if (data && data.address) {
      const address = data.address
      
      // Extract location details from the reverse geocoding result
      const locationDetails = {
        city: address.city || address.state || address.county || '',
        area: address.suburb || address.district || address.neighbourhood || '',
        street: address.road || address.street || '',
        building: address.house_number || address.building || ''
      }
      
      console.log('Extracted location details:', locationDetails)
      
      // Emit the location details to parent component
      emit('locationDetected', {
        ...locationData,
        addressDetails: locationDetails
      })
      
      // Also emit individual events for each field
      emit('updateCity', locationDetails.city)
      emit('updateArea', locationDetails.area)
      emit('updateStreet', locationDetails.street)
      emit('updateBuilding', locationDetails.building)
      
    } else {
      console.warn('No address details found in reverse geocoding result')
      // Still emit the coordinates even if address details are not available
      emit('locationDetected', locationData)
    }
    
  } catch (error) {
    console.error('Error in reverse geocoding:', error)
    // Fallback: just emit the coordinates
    emit('locationDetected', locationData)
  }
}

// Watch for address changes
watch(() => [props.city, props.area, props.street, props.building], () => {
  if (hasAddress.value && map.value) {
    // Optionally auto-center on address when it changes
    // centerOnAddress()
  }
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  // Load Leaflet CSS if not already loaded
  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)
  }

  // Load Leaflet JS if not already loaded
  if (typeof L === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => {
      initMap()
      // Auto-detect location on mount
      detectUserLocation()
    }
    document.head.appendChild(script)
  } else {
    initMap()
    // Auto-detect location on mount
    detectUserLocation()
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

// Emit events
const emit = defineEmits(['locationDetected', 'updateCity', 'updateArea', 'updateStreet', 'updateBuilding'])
</script>

<style scoped>
.location-map-container {
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.location-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.location-info h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.location-display {
  font-size: 14px;
}

.location-display p {
  margin: 5px 0;
  color: #555;
}

.no-location {
  color: #999;
  font-style: italic;
}

.location-success {
  color: #28a745;
  font-weight: 500;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-success i {
  font-size: 14px;
}

.map-container {
  position: relative;
  background-color: #f5f5f5;
}

.map {
  height: 300px;
  width: 100%;
  z-index: 1;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detect-location-btn,
.center-address-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.detect-location-btn:hover,
.center-address-btn:hover {
  background-color: #0056b3;
}

.detect-location-btn:disabled,
.center-address-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.center-address-btn {
  background-color: #28a745;
}

.center-address-btn:hover {
  background-color: #218838;
}

.detect-location-btn i,
.center-address-btn i {
  font-size: 10px;
}

/* Leaflet map styles */
:deep(.leaflet-container) {
  border-radius: 0 0 8px 8px;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 6px;
}

:deep(.leaflet-popup-content) {
  margin: 8px 12px;
  font-size: 12px;
}

/* Responsive design */
@media (max-width: 768px) {
  .location-map-container {
    margin-top: 15px;
  }
  
  .map {
    height: 250px;
  }
  
  .map-controls {
    top: 5px;
    right: 5px;
  }
  
  .detect-location-btn,
  .center-address-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style> 