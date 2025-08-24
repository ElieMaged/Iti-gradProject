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
          @click.stop.prevent="onCenterAddressClick" 
          class="center-address-btn"
          :disabled="!hasAddress || isDetecting"
          type="button"
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
const emit = defineEmits(['locationDetected', 'update:city', 'update:area', 'update:street', 'update:building'])

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

const loadLeaflet = () => {
  return new Promise((resolve, reject) => {
    // Check if Leaflet is already loaded
    if (typeof L !== 'undefined') {
      leafletLoaded.value = true
      resolve()
      return
    }

    // Load Leaflet CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
      link.crossOrigin = ''
      link.onload = () => {
        // Load Leaflet JS after CSS is loaded
        loadLeafletJS().then(resolve).catch(reject)
      }
      link.onerror = (error) => {
        console.error('Failed to load Leaflet CSS:', error)
        reject(new Error('Failed to load Leaflet CSS'))
      }
      document.head.appendChild(link)
    } else {
      // If CSS is already loaded, just load JS
      loadLeafletJS().then(resolve).catch(reject)
    }
  })
}

const loadLeafletJS = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => {
      leafletLoaded.value = true
      console.log('Leaflet loaded successfully')
      resolve()
    }
    script.onerror = (error) => {
      console.error('Failed to load Leaflet JS:', error)
      reject(new Error('Failed to load Leaflet JS'))
    }
    document.head.appendChild(script)
  })
}

const detectUserLocation = async () => {
  if (!navigator.geolocation) {
    detectionError.value = 'Geolocation is not supported by this browser.'
    return false
  }
  
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  isDetecting.value = true
  detectionError.value = 'Detecting your location... (Please allow location access)'
  locationDetected.value = false

  try {
    // Initialize map if not already done
    if (!map.value) {
      if (!leafletLoaded.value) {
        await loadLeaflet()
      }
      initMap()
      // Give the map a moment to initialize
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Get current position with best available accuracy
    const position = await getPositionWithOptions({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    })
    
    const { latitude, longitude, accuracy } = position.coords
    
    // Log position details
    console.log('Location detected:', {
      latitude,
      longitude,
      accuracy: `${Math.round(accuracy)}m`,
      source: position.coords.altitude !== undefined ? 'GPS' : 'Network'
    })
    
    // Update the map with the user's location
    await updateUserLocation(latitude, longitude)
    
    // Clear any previous errors
    detectionError.value = ''
    
    locationDetected.value = true
    return true
    
  } catch (error) {
    console.error('Error detecting location:', error)
    
    let errorMessage = 'Failed to detect your location. ';
    
    if (error.code === 1) {
      errorMessage = 'Location permission denied. ' + (isChrome ? 
        'In Chrome, please follow these steps to enable location access:\n' +
        '1. Click the lock icon (🔒) in the address bar\n' +
        '2. Set "Location" to "Allow"\n' +
        '3. Refresh the page and try again' : 
        'Please allow location access in your browser settings.')
    } else if (error.code === 2) {
      errorMessage = 'Location unavailable. ';
      if (isChrome) {
        errorMessage += 'Chrome cannot access your location. Please ensure:\n';
        errorMessage += '1. Your device location is turned on\n';
        errorMessage += '2. Chrome has permission to access your location\n';
        errorMessage += '3. You\'re not in incognito mode (which can block location)';
      } else {
        errorMessage += 'Please check your device location settings and try again.';
      }
    } else if (error.code === 3) {
      errorMessage = 'Location detection timed out. ';
      if (isChrome) {
        errorMessage += 'Chrome is having trouble getting your location. Please try:\n';
        errorMessage += '1. Moving to an area with better GPS signal\n';
        errorMessage += '2. Disabling any VPN or proxy\n';
        errorMessage += '3. Checking Chrome\'s site settings for location permissions';
      } else {
        errorMessage += 'Please try again in an area with better reception.';
      }
    } else if (error.message && error.message.includes('Network')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message && error.message.includes('timeout')) {
      errorMessage = 'Location request took too long. ';
      if (isChrome) {
        errorMessage += 'Chrome may be waiting for more accurate location data. ';
        errorMessage += 'Try moving to an area with better GPS signal or using a different browser.';
      } else {
        errorMessage += 'Please try again in an area with better reception.';
      }
    } else {
      errorMessage = `Location detection failed: ${error.message || 'Unknown error'}`;
      if (isChrome && error.message.includes('Only secure origins are allowed')) {
        errorMessage = 'This website needs to be served over HTTPS to access your location. ';
        errorMessage += 'Please try accessing the site using HTTPS instead of HTTP.';
      }
    }
    
    detectionError.value = errorMessage
  } finally {
    isDetecting.value = false
  }
}

const updateUserLocation = async (lat, lng) => {
  if (!map.value) {
    console.warn('Map not initialized, cannot update location')
    return
  }

  try {
    // Show loading state
    isDetecting.value = true
    detectionError.value = ''
    
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

    // Center map on user location with appropriate zoom
    map.value.setView([lat, lng], 15)
    
    // Add popup to user marker
    userMarker.value.bindPopup('Your current location').openPopup()
    
    // Get address details using reverse geocoding
    console.log('Reverse geocoding coordinates:', { lat, lng })
    const addressDetails = await reverseGeocode(lat, lng)
    console.log('Reverse geocoding results:', addressDetails)
    
    // Emit update events for each address component
    if (addressDetails.city) emit('update:city', addressDetails.city)
    if (addressDetails.area) emit('update:area', addressDetails.area)
    if (addressDetails.street) emit('update:street', addressDetails.street)
    if (addressDetails.building) emit('update:building', addressDetails.building)
    
    // Emit the complete location detected event
    emit('locationDetected', { 
      lat, 
      lng, 
      address: addressDetails,
      formattedAddress: [
        addressDetails.building,
        addressDetails.street,
        addressDetails.area,
        addressDetails.city
      ].filter(Boolean).join(', ')
    })
    
    // Update UI state
    locationDetected.value = true
    detectionError.value = ''
    
  } catch (error) {
    console.error('Error updating user location:', error)
    detectionError.value = 'Location detected, but could not get address details. Please enter them manually.'
    
    // Still emit the basic location data if reverse geocoding fails
    emit('locationDetected', { 
      lat, 
      lng,
      error: 'Failed to get address details',
      errorDetails: error.message
    })
  } finally {
    isDetecting.value = false
  }
}

const onCenterAddressClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  centerOnAddress()
}

const centerOnAddress = async () => {
  if (!hasAddress.value || !map.value) return

  try {
    const address = formattedAddress.value
    
    // Construct a more specific query with address components
    const queryParts = []
    if (props.building) queryParts.push(props.building)
    if (props.street) queryParts.push(props.street)
    if (props.area) queryParts.push(props.area)
    if (props.city) queryParts.push(props.city)
    
    const query = queryParts.join(', ')
    
    console.log('Geocoding address:', query)
    
    // Use Nominatim for forward geocoding with more specific parameters
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=eg&limit=1&addressdetails=1`,
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
    
    if (!data || data.length === 0) {
      throw new Error('No results found for the provided address')
    }
    
    console.log('Geocoding result:', data[0])
    
    // Process the first result
    const result = data[0]
    const coords = [parseFloat(result.lat), parseFloat(result.lon)]
    const addressDetails = result.address || {}
    
    console.log('Found coordinates:', coords, 'for address:', result.display_name)
    
    // Remove existing address marker if any
    if (addressMarker.value) {
      map.value.removeLayer(addressMarker.value)
    }
    
    // Add marker for the address with a different color
    addressMarker.value = L.marker(coords, {
      icon: L.divIcon({
        className: 'address-marker',
        html: '<i class="fas fa-map-pin" style="color: #dc3545; font-size: 24px;"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      })
    }).addTo(map.value)
    
    // Center map on the address with a reasonable zoom level
    map.value.setView(coords, 16)
    
    // Create a more informative popup with address details
    const popupContent = `
      <div style="min-width: 200px;">
        <strong>${result.display_name || 'Location'}</strong>
        <div style="margin-top: 8px; font-size: 0.9em;">
          ${addressDetails.road ? `<div>${addressDetails.road}</div>` : ''}
          ${addressDetails.neighbourhood ? `<div>${addressDetails.neighbourhood}</div>` : ''}
          ${addressDetails.suburb ? `<div>${addressDetails.suburb}</div>` : ''}
          <div>${[addressDetails.city, addressDetails.town, addressDetails.village].filter(Boolean)[0] || ''}</div>
        </div>
      </div>
    `
    
    addressMarker.value.bindPopup(popupContent).openPopup()
    
    // If the coordinates are very far from Egypt, show a warning
    const isInEgypt = coords[0] > 22 && coords[0] < 32 && coords[1] > 25 && coords[1] < 37
    if (!isInEgypt) {
      console.warn('The geocoded location appears to be outside of Egypt. The address might be incorrect.')
      detectionError.value = 'The address might be outside of Egypt. Please check the location on the map.'
    } else {
      detectionError.value = ''
    }
    
    return true
  } catch (error) {
    console.error('Error centering on address:', error)
    // Fallback: try to center on a default location (Cairo)
    if (map.value) {
      const cairoCoords = [30.0444, 31.2357]
      map.value.setView(cairoCoords, 12)
      detectionError.value = 'Could not find the exact address. Showing Cairo area instead.'
      
      // Add a marker for Cairo
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
      
      addressMarker.value.bindPopup('Cairo, Egypt (default location)').openPopup()
      
      // Return false to indicate fallback was used
      return false
    }
    
    // If we get here, there was an error and we couldn't use the fallback
    return false
  }
}

// Helper function to get position with retries and better error handling
const getPositionWithOptions = async (options, retryCount = 0) => {
  const maxRetries = 2;
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  try {
    console.log('Getting position with options:', options, 'Retry:', retryCount);
    
    const position = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, options.timeout + 2000);
      
      const success = (position) => {
        clearTimeout(timeoutId);
        console.log('Position obtained:', {
          coords: position.coords,
          timestamp: new Date(position.timestamp).toISOString()
        });
        resolve(position);
      };
      
      const error = (error) => {
        clearTimeout(timeoutId);
        console.error('Geolocation error:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });
        reject(error);
      };
      
      // For Chrome, try watchPosition first as it sometimes works better
      if (isChrome) {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            navigator.geolocation.clearWatch(watchId);
            success(pos);
          },
          error,
          options
        );
        
        // Fallback to getCurrentPosition if watchPosition doesn't respond
        setTimeout(() => {
          navigator.geolocation.clearWatch(watchId);
          navigator.geolocation.getCurrentPosition(success, error, options);
        }, options.timeout / 2);
      } else {
        navigator.geolocation.getCurrentPosition(success, error, options);
      }
    });
    
    return position;
    
  } catch (error) {
    // Retry logic for transient errors
    if (retryCount < maxRetries && 
        (error.code === error.TIMEOUT || 
         error.code === error.POSITION_UNAVAILABLE ||
         error.message.includes('timeout'))) {
      console.log(`Retrying location detection (${retryCount + 1}/${maxRetries})...`);
      // Increase timeout for retry
      return getPositionWithOptions({
        ...options,
        timeout: options.timeout + 5000,
        enableHighAccuracy: retryCount > 0 ? false : options.enableHighAccuracy
      }, retryCount + 1);
    }
    throw error;
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
  try {
    await loadLeaflet()
    initMap()
    // Auto-detect location with a slight delay to ensure map is ready
    setTimeout(() => {
      console.log('Attempting to detect location...')
      detectUserLocation().catch(error => {
        console.error('Auto-location detection failed:', error)
      })
    }, 1500) // Slightly longer delay for better initialization
  } catch (error) {
    console.error('Failed to initialize map:', error)
    detectionError.value = 'Failed to load map. Please refresh the page and try again.'
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