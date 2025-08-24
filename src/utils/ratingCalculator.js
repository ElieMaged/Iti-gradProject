import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Calculate the average rating for a technician based on their reviews
 * @param {string} technicianId - The technician's ID
 * @returns {Promise<number>} - The average rating (0 if no reviews)
 */
export async function calculateTechnicianRating(technicianId) {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('technicianId', '==', technicianId)
    )
    
    const reviewsSnapshot = await getDocs(reviewsQuery)
    const reviews = reviewsSnapshot.docs.map(doc => doc.data())
    
    if (reviews.length === 0) {
      return 0
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length
    
    return Math.round(averageRating * 10) / 10 // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating technician rating:', error)
    return 0
  }
}

/**
 * Calculate average ratings for multiple technicians
 * @param {Array} technicians - Array of technician objects with id field
 * @returns {Promise<Array>} - Array of technicians with calculated ratings
 */
export async function calculateTechnicianRatings(technicians) {
  try {
    const techniciansWithRatings = await Promise.all(
      technicians.map(async (technician) => {
        const averageRating = await calculateTechnicianRating(technician.id)
        return {
          ...technician,
          rating: averageRating
        }
      })
    )
    
    return techniciansWithRatings
  } catch (error) {
    console.error('Error calculating technician ratings:', error)
    return technicians.map(tech => ({ ...tech, rating: 0 }))
  }
}
