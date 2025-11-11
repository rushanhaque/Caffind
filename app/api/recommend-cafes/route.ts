import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { UserPreferences, Cafe } from '@/types'

// Helper function to check if cafe is open
function isCafeOpen(openingHours: string): boolean {
  if (!openingHours) return true
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute

  // Simple parsing - in production, use a proper time parser
  const match = openingHours.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return true

  const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = match
  let openTime = parseInt(openHour) * 60 + parseInt(openMin)
  let closeTime = parseInt(closeHour) * 60 + parseInt(closeMin)

  if (openPeriod.toUpperCase() === 'PM' && parseInt(openHour) !== 12) openTime += 12 * 60
  if (closePeriod.toUpperCase() === 'PM' && parseInt(closeHour) !== 12) closeTime += 12 * 60
  if (openPeriod.toUpperCase() === 'AM' && parseInt(openHour) === 12) openTime -= 12 * 60
  if (closePeriod.toUpperCase() === 'AM' && parseInt(closeHour) === 12) closeTime -= 12 * 60

  return currentTime >= openTime && currentTime <= closeTime
}

// Moradabad cafes database (in production, this would come from an API or database)
const MORADABAD_CAFES: Cafe[] = [
  {
    id: '1',
    name: 'Town Hall Cafe',
    address: 'Town Hall, Moradabad',
    location: { lat: 28.8430, lng: 78.7680, address: 'Town Hall, Moradabad, Uttar Pradesh' },
    description: 'Central cafe located at the heart of Moradabad. Known for its spacious seating and variety of beverages. Perfect for meetings and casual hangouts. Features both indoor and outdoor seating options.',
    rating: 4.3,
    reviewCount: 420,
    cuisine: 'Continental',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Casual',
    openingHours: '8:00 AM - 10:00 PM',
    phone: '+91 591 245 1111',
    amenities: ['wifi', 'parking', 'outdoor seating'],
    dietaryOptions: ['vegetarian', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a14a5e9?w=800',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Budh Bazaar Coffee Corner',
    address: 'Budh Bazaar, Moradabad',
    location: { lat: 28.8390, lng: 78.7720, address: 'Budh Bazaar, Moradabad, Uttar Pradesh' },
    description: 'Traditional cafe in the bustling Budh Bazaar area. Famous for its authentic Indian snacks and chai. Popular among locals for its affordable prices and authentic taste.',
    rating: 4.5,
    reviewCount: 380,
    cuisine: 'Indian',
    priceRange: 'Budget',
    priceLevel: 1,
    ambiance: 'Casual',
    openingHours: '7:00 AM - 9:00 PM',
    phone: '+91 591 245 2222',
    amenities: ['wifi', 'parking'],
    dietaryOptions: ['vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    isOpen: true,
  },
  {
    id: '3',
    name: 'MDA Premium Lounge',
    address: 'MDA, Moradabad',
    location: { lat: 28.8450, lng: 78.7700, address: 'MDA, Moradabad, Uttar Pradesh' },
    description: 'Upscale lounge with premium coffee and gourmet snacks. Features elegant interiors and a quiet atmosphere. Perfect for business meetings and special occasions.',
    rating: 4.6,
    reviewCount: 290,
    cuisine: 'Continental',
    priceRange: 'Upscale',
    priceLevel: 3,
    ambiance: 'Upscale',
    openingHours: '9:00 AM - 11:00 PM',
    phone: '+91 591 245 3333',
    amenities: ['wifi', 'parking', 'outdoor seating', 'live music'],
    dietaryOptions: ['vegetarian', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    isOpen: true,
  },
  {
    id: '4',
    name: 'Civil Lines Community Cafe',
    address: 'Civil Lines, Moradabad',
    location: { lat: 28.8389, lng: 78.7765, address: 'Civil Lines, Moradabad, Uttar Pradesh' },
    description: 'Popular community cafe known for its friendly atmosphere and diverse menu. Great for casual meetings and group gatherings. Features both Indian and continental cuisine.',
    rating: 4.4,
    reviewCount: 450,
    cuisine: 'Indian',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Social',
    openingHours: '7:30 AM - 9:30 PM',
    phone: '+91 591 245 4444',
    amenities: ['wifi', 'parking', 'outdoor seating'],
    dietaryOptions: ['vegetarian', 'halal'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    isOpen: true,
  },
  {
    id: '5',
    name: 'Budhi Vihar Heritage Cafe',
    address: 'Budhi Vihar, Moradabad',
    location: { lat: 28.8350, lng: 78.7700, address: 'Budhi Vihar, Moradabad, Uttar Pradesh' },
    description: 'Heritage cafe with traditional decor and authentic local cuisine. Known for its peaceful environment and excellent service. Perfect for quiet conversations and reading.',
    rating: 4.2,
    reviewCount: 310,
    cuisine: 'Indian',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Quiet',
    openingHours: '8:00 AM - 8:00 PM',
    phone: '+91 591 245 5555',
    amenities: ['wifi', 'outdoor seating', 'pet friendly'],
    dietaryOptions: ['vegetarian', 'gluten-free'],
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    isOpen: true,
  },
  {
    id: '6',
    name: 'Delhi Road Express',
    address: 'Delhi Road, Moradabad',
    location: { lat: 28.8410, lng: 78.7650, address: 'Delhi Road, Moradabad, Uttar Pradesh' },
    description: 'Modern cafe on the busy Delhi Road with quick service and takeaway options. Perfect for travelers and busy professionals. Offers a variety of quick bites and beverages.',
    rating: 4.1,
    reviewCount: 270,
    cuisine: 'Continental',
    priceRange: 'Budget',
    priceLevel: 1,
    ambiance: 'Quick Service',
    openingHours: '6:00 AM - 10:00 PM',
    phone: '+91 591 245 6666',
    amenities: ['wifi', 'parking', 'drive-through'],
    dietaryOptions: ['vegetarian', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    isOpen: true,
  },
]

// Update isOpen status based on current time
MORADABAD_CAFES.forEach((cafe) => {
  if (cafe.openingHours) {
    cafe.isOpen = isCafeOpen(cafe.openingHours)
  }
})

// Export MORADABAD_CAFES for use in other routes
export { MORADABAD_CAFES }

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function filterCafesByPreferences(cafes: Cafe[], preferences: UserPreferences): Cafe[] {
  let filtered = [...cafes]

  // Filter by location
  if (preferences.location) {
    const locationLower = preferences.location.toLowerCase()
    filtered = filtered.filter((cafe) =>
      cafe.address?.toLowerCase().includes(locationLower) ||
      cafe.location?.address?.toLowerCase().includes(locationLower)
    )
  }

  // Filter by cuisine
  if (preferences.cuisine) {
    filtered = filtered.filter((cafe) =>
      cafe.cuisine?.toLowerCase().includes(preferences.cuisine.toLowerCase())
    )
  }

  // Filter by price range
  if (preferences.priceRange) {
    filtered = filtered.filter((cafe) =>
      cafe.priceRange?.toLowerCase() === preferences.priceRange.toLowerCase()
    )
  }

  // Filter by ambiance
  if (preferences.ambiance) {
    filtered = filtered.filter((cafe) =>
      cafe.ambiance?.toLowerCase().includes(preferences.ambiance.toLowerCase())
    )
  }

  // Filter by dietary restrictions
  if (preferences.dietaryRestrictions.length > 0) {
    filtered = filtered.filter((cafe) =>
      preferences.dietaryRestrictions.some((restriction) =>
        cafe.dietaryOptions?.some((option) =>
          option.toLowerCase().includes(restriction.toLowerCase())
        )
      )
    )
  }

  // Filter by amenities
  if (preferences.amenities.length > 0) {
    filtered = filtered.filter((cafe) =>
      preferences.amenities.some((amenity) =>
        cafe.amenities?.some((cafeAmenity) =>
          cafeAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      )
    )
  }

  return filtered
}

async function getAIRankings(
  cafes: Cafe[],
  preferences: UserPreferences
): Promise<Cafe[]> {
  if (!process.env.OPENAI_API_KEY) {
    // If no OpenAI API key, return cafes sorted by rating
    return cafes.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  try {
    const prompt = `You are a cafe recommendation expert for Moradabad, India. Based on the following user preferences, rank these cafes from best to worst match (return only the cafe IDs in order, separated by commas):

User Preferences:
- Mood: ${preferences.mood || 'Not specified'}
- Cuisine: ${preferences.cuisine || 'Not specified'}
- Ambiance: ${preferences.ambiance || 'Not specified'}
- Price Range: ${preferences.priceRange || 'Not specified'}
- Occasion: ${preferences.occasion || 'Not specified'}
- Time of Day: ${preferences.timeOfDay || 'Not specified'}
- Dietary Restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
- Amenities: ${preferences.amenities.join(', ') || 'None'}

Cafes:
${cafes.map((cafe) => `ID: ${cafe.id}, Name: ${cafe.name}, Cuisine: ${cafe.cuisine}, Ambiance: ${cafe.ambiance}, Price: ${cafe.priceRange}, Rating: ${cafe.rating}`).join('\n')}

Return only the cafe IDs in order of best match (comma-separated, no explanations):`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that ranks cafes based on user preferences. Return only comma-separated cafe IDs.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const response = completion.choices[0]?.message?.content?.trim() || ''
    const rankedIds = response
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id)

    // Create a map for quick lookup
    const cafeMap = new Map(cafes.map((cafe) => [cafe.id || '', cafe]))
    const ranked: Cafe[] = []
    const unranked: Cafe[] = []

    // Add ranked cafes in order
    rankedIds.forEach((id) => {
      const cafe = cafeMap.get(id)
      if (cafe) {
        ranked.push(cafe)
        cafeMap.delete(id)
      }
    })

    // Add any remaining cafes
    cafeMap.forEach((cafe) => unranked.push(cafe))

    return [...ranked, ...unranked]
  } catch (error) {
    console.error('Error getting AI rankings:', error)
    // Fallback to rating-based sorting
    return cafes.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }
}

export async function POST(request: NextRequest) {
  try {
    const preferences: UserPreferences = await request.json()

    // Filter cafes based on preferences
    let filteredCafes = filterCafesByPreferences(MORADABAD_CAFES, preferences)

    // If no cafes match filters, return all Moradabad cafes
    if (filteredCafes.length === 0) {
      filteredCafes = MORADABAD_CAFES
    }

    // Limit to top 15 cafes
    filteredCafes = filteredCafes.slice(0, 15)

    // Get AI-powered rankings
    const rankedCafes = await getAIRankings(filteredCafes, preferences)

    return NextResponse.json({
      cafes: rankedCafes,
      count: rankedCafes.length,
    })
  } catch (error) {
    console.error('Error recommending cafes:', error)
    return NextResponse.json(
      { error: 'Failed to get cafe recommendations' },
      { status: 500 }
    )
  }
}