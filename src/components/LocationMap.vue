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
        <p v-if="detectionError" class="location-error">
          <i class="fas fa-exclamation-triangle"></i>
          {{ detectionError }}
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

// Emits
const emit = defineEmits(['locationDetected', 'updateCity', 'updateArea', 'updateStreet', 'updateBuilding'])

// Reactive state
const isDetecting = ref(false)
const mapContainer = ref(null)
const map = ref(null)
const userMarker = ref(null)
const addressMarker = ref(null)
const locationDetected = ref(false)
const detectionError = ref('')
const leafletLoaded = ref(false)

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
  if (!mapContainer.value || !leafletLoaded.value) return

  try {
    // Initialize map centered on Egypt
    map.value = L.map(mapContainer.value).setView([26.8206, 30.8025], 6)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map.value)

    // Add scale control
    L.control.scale().addTo(map.value)
    
    console.log('Map initialized successfully')
  } catch (error) {
    console.error('Error initializing map:', error)
    detectionError.value = 'Failed to initialize map'
  }
}

const reverseGeocode = async (latitude, longitude) => {
  try {
    // Use Nominatim (OpenStreetMap's geocoding service) - free and no API key required
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BoltFix-App/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Reverse geocoding result:', data)
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    // Extract address components
    const address = data.address || {}
    const addressDetails = {
      city: address.city || address.town || address.village || address.county || '',
      area: address.suburb || address.neighbourhood || address.district || '',
      street: address.road || address.street || '',
      building: address.house_number || address.building || ''
    }
    
    return addressDetails
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    // Return empty address details if geocoding fails
    return {
      city: '',
      area: '',
      street: '',
      building: ''
    }
  }
}

const detectUserLocation = async () => {
  if (!navigator.geolocation) {
    detectionError.value = 'Geolocation is not supported by this browser.'
    return
  }

  isDetecting.value = true
  detectionError.value = ''

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      })
    })

    const { latitude, longitude } = position.coords
    
    console.log('Location detected:', { latitude, longitude, accuracy: position.coords.accuracy })
    
    // Update map to user location
    updateUserLocation(latitude, longitude)
    
    // Perform reverse geocoding to get address details
    const addressDetails = await reverseGeocode(latitude, longitude)
    
    // Emit the detected coordinates and address details to parent component
    const locationData = {
      latitude,
      longitude,
      accuracy: position.coords.accuracy,
      addressDetails
    }
    
    emit('locationDetected', locationData)
    
    // Auto-fill form fields if address details are available
    if (addressDetails.city) emit('updateCity', addressDetails.city)
    if (addressDetails.area) emit('updateArea', addressDetails.area)
    if (addressDetails.street) emit('updateStreet', addressDetails.street)
    if (addressDetails.building) emit('updateBuilding', addressDetails.building)
    
    locationDetected.value = true
    console.log('Location detection completed successfully')
    
  } catch (error) {
    console.error('Error detecting location:', error)
    
    // Handle specific geolocation errors
    let errorMessage = 'Failed to detect location'
    if (error.code === 1) {
      errorMessage = 'Location permission denied. Please allow location access in your browser settings.'
    } else if (error.code === 2) {
      errorMessage = 'Location unavailable. Please check your device location settings.'
    } else if (error.code === 3) {
      errorMessage = 'Location detection timed out. Please try again.'
    } else {
      errorMessage = `Location detection failed: ${error.message}`
    }
    
    detectionError.value = errorMessage
  } finally {
    isDetecting.value = false
  }
}

const updateUserLocation = (lat, lng) => {
  if (!map.value) return

  try {
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
    
    console.log('User location updated on map')
  } catch (error) {
    console.error('Error updating user location on map:', error)
  }
}

const centerOnAddress = async () => {
  if (!hasAddress.value || !map.value) return

  try {
    const address = formattedAddress.value
    
    // Use Nominatim for forward geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=eg&limit=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BoltFix-App/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const result = data[0]
      const lat = parseFloat(result.lat)
      const lon = parseFloat(result.lon)
      
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
      
      console.log('Address centered successfully:', { lat, lon, address })
    } else {
      // Fallback to Cairo if geocoding fails
      const cairoCoords = [30.0444, 31.2357]
      
      if (addressMarker.value) {
        map.value.removeLayer(addressMarker.value)
      }

      addressMarker.value = L.marker(cairoCoords, {
        icon: L.divIcon({
          className: 'address-marker',
          html: '<i class="fas fa-map-marker-alt" style="color: #dc3545; font-size: 20px;"></i>',
          iconSize: [20, 20],
          iconAnchor: [10, 20]
        })
      }).addTo(map.value)

      map.value.setView(cairoCoords, 12)
      addressMarker.value.bindPopup(`Address: ${address} (showing Cairo area)`).openPopup()
      
      console.log('Geocoding failed, showing Cairo area')
    }
    
  } catch (error) {
    console.error('Error centering on address:', error)
    // Fallback: try to center on a default location (Cairo)
    if (map.value) {
      const cairoCoords = [30.0444, 31.2357]
      map.value.setView(cairoCoords, 10)
    }
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
onMounted(async () => {
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
      leafletLoaded.value = true
      initMap()
      // Auto-detect location after a short delay to ensure map is ready
      setTimeout(() => {
        detectUserLocation()
      }, 1000)
    }
    document.head.appendChild(script)
  } else {
    leafletLoaded.value = true
    initMap()
    // Auto-detect location after a short delay to ensure map is ready
    setTimeout(() => {
      detectUserLocation()
    }, 1000)
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
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

.location-error {
  color: #dc3545;
  font-weight: 500;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-success i,
.location-error i {
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