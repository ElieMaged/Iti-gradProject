import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Calculate the average rating for a technician based on their reviews
 * @param {string} technicianId - The technician's UID
 * @returns {Promise<number>} - The average rating (0 if no reviews)
 */
export async function calculateAverageRating(technicianId) {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('technicianId', '==', technicianId)
    )
    
    const snapshot = await getDocs(reviewsQuery)
    
    if (snapshot.empty) {
      return 0
    }
    
    const reviews = snapshot.docs.map(doc => doc.data())
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length
    
    // Round to 1 decimal place
    return Math.round(averageRating * 10) / 10
  } catch (error) {
    console.error('Error calculating average rating:', error)
    return 0
  }
}

/**
 * Calculate average ratings for multiple technicians
 * @param {Array} technicians - Array of technician objects with id property
 * @returns {Promise<Array>} - Array of technicians with averageRating property
 */
export async function calculateAverageRatingsForTechnicians(technicians) {
  try {
    const techniciansWithRatings = await Promise.all(
      technicians.map(async (technician) => {
        const averageRating = await calculateAverageRating(technician.id)
        return {
          ...technician,
          averageRating
        }
      })
    )
    
    return techniciansWithRatings
  } catch (error) {
    console.error('Error calculating average ratings for technicians:', error)
    return technicians.map(technician => ({
      ...technician,
      averageRating: 0
    }))
  }
}
