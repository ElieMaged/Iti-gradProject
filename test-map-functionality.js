// Test file to verify map and geocoding functionality
// This can be run in the browser console to test the geocoding API

async function testReverseGeocoding() {
  console.log('Testing reverse geocoding...')
  
  try {
    // Test coordinates for Cairo, Egypt
    const lat = 30.0444
    const lon = 31.2357
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
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
    console.log('Reverse geocoding test result:', data)
    
    if (data.error) {
      console.error('Geocoding error:', data.error)
      return false
    }
    
    // Extract address components
    const address = data.address || {}
    const addressDetails = {
      city: address.city || address.town || address.village || address.county || '',
      area: address.suburb || address.neighbourhood || address.district || '',
      street: address.road || address.street || '',
      building: address.house_number || address.building || ''
    }
    
    console.log('Extracted address details:', addressDetails)
    return true
    
  } catch (error) {
    console.error('Reverse geocoding test failed:', error)
    return false
  }
}

async function testForwardGeocoding() {
  console.log('Testing forward geocoding...')
  
  try {
    const address = 'Cairo, Egypt'
    
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
    console.log('Forward geocoding test result:', data)
    
    if (data && data.length > 0) {
      const result = data[0]
      console.log('Found coordinates:', { lat: result.lat, lon: result.lon })
      return true
    } else {
      console.log('No results found')
      return false
    }
    
  } catch (error) {
    console.error('Forward geocoding test failed:', error)
    return false
  }
}

async function testGeolocation() {
  console.log('Testing geolocation...')
  
  if (!navigator.geolocation) {
    console.error('Geolocation not supported')
    return false
  }
  
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })
    
    console.log('Geolocation test successful:', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    })
    return true
    
  } catch (error) {
    console.error('Geolocation test failed:', error)
    return false
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting Map Functionality Tests ===')
  
  const results = {
    reverseGeocoding: await testReverseGeocoding(),
    forwardGeocoding: await testForwardGeocoding(),
    geolocation: await testGeolocation()
  }
  
  console.log('=== Test Results ===')
  console.log(results)
  
  const allPassed = Object.values(results).every(result => result === true)
  console.log(`Overall result: ${allPassed ? 'PASSED' : 'FAILED'}`)
  
  return results
}

// Export for use in browser console
window.testMapFunctionality = {
  testReverseGeocoding,
  testForwardGeocoding,
  testGeolocation,
  runAllTests
}

console.log('Map functionality tests loaded. Run testMapFunctionality.runAllTests() to test everything.') 