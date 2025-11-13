import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { UserPreferences, Cafe } from '@/types'
import dbConnect from '@/lib/dbConnect'
import CafeModel from '@/models/Cafe'

// Moradabad cafes database (in production, this would come from an API or database)
const MORADABAD_CAFES: Cafe[] = [
  {
    id: '21',
    name: 'Coffee House Moradabad',
    address: 'Civil Lines, Moradabad',
    location: { lat: 28.8389, lng: 78.7765, address: 'Civil Lines, Moradabad, Uttar Pradesh' },
    description: 'Popular local cafe known for its authentic Indian filter coffee and snacks. Cozy atmosphere perfect for casual meetings and conversations. A favorite among locals for its traditional ambiance.',
    rating: 4.3,
    reviewCount: 450,
    cuisine: 'Indian',
    priceRange: 'Budget',
    priceLevel: 1,
    ambiance: 'Casual',
    openingHours: '7:00 AM - 9:00 PM',
    phone: '+91 591 245 6789',
    amenities: ['wifi', 'parking'],
    dietaryOptions: ['vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a14a5e9?w=800',
    isOpen: true,
  },
  {
    id: '22',
    name: 'The Urban Brew',
    address: 'Mall Road, Moradabad',
    location: { lat: 28.8421, lng: 78.7689, address: 'Mall Road, Moradabad, Uttar Pradesh' },
    description: 'Modern cafe with a blend of international and local flavors. Known for their specialty coffee and artisanal pastries. Great for work sessions with reliable WiFi and comfortable seating.',
    rating: 4.5,
    reviewCount: 320,
    cuisine: 'Continental',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Productive',
    openingHours: '9:00 AM - 10:00 PM',
    phone: '+91 591 256 1234',
    amenities: ['wifi', 'parking', 'outdoor seating'],
    dietaryOptions: ['vegetarian', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    isOpen: true,
  },
  {
    id: '23',
    name: 'Green Leaf Café',
    address: 'Sadar Bazaar, Moradabad',
    location: { lat: 28.8356, lng: 78.7723, address: 'Sadar Bazaar, Moradabad, Uttar Pradesh' },
    description: 'Eco-friendly cafe with organic menu options. Features fresh, locally-sourced ingredients and a peaceful garden setting. Perfect for health-conscious visitors and those seeking a tranquil environment.',
    rating: 4.4,
    reviewCount: 280,
    cuisine: 'Continental',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Quiet',
    openingHours: '8:00 AM - 8:00 PM',
    phone: '+91 591 234 5678',
    amenities: ['wifi', 'outdoor seating', 'pet friendly'],
    dietaryOptions: ['vegetarian', 'vegan', 'gluten-free'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    isOpen: true,
  },
  {
    id: '24',
    name: 'Royal Spice',
    address: 'Jahangirabad, Moradabad',
    location: { lat: 28.8512, lng: 78.7834, address: 'Jahangirabad, Moradabad, Uttar Pradesh' },
    description: 'Upscale restaurant offering a royal dining experience with traditional Indian cuisine. Known for their elaborate thali and Mughlai dishes. Perfect for special occasions and family gatherings.',
    rating: 4.6,
    reviewCount: 520,
    cuisine: 'Indian',
    priceRange: 'Upscale',
    priceLevel: 3,
    ambiance: 'Upscale',
    openingHours: '11:00 AM - 11:00 PM',
    phone: '+91 591 267 8901',
    amenities: ['parking', 'live music', 'wheelchair accessible'],
    dietaryOptions: ['vegetarian', 'halal'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    isOpen: true,
    reservationUrl: 'https://royalspicemoradabad.com/reservations',
  },
  {
    id: '25',
    name: 'Sunset Lounge',
    address: 'Rajput Ganj, Moradabad',
    location: { lat: 28.8298, lng: 78.7654, address: 'Rajput Ganj, Moradabad, Uttar Pradesh' },
    description: 'Rooftop cafe with stunning views of the city skyline. Perfect for romantic dinners and evening hangouts. Features a diverse menu with both Indian and continental options.',
    rating: 4.2,
    reviewCount: 380,
    cuisine: 'Mediterranean',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Romantic',
    openingHours: '5:00 PM - 12:00 AM',
    phone: '+91 591 278 4321',
    amenities: ['outdoor seating', 'live music', 'parking'],
    dietaryOptions: ['vegetarian', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    isOpen: true,
  },
]

// Adding more cafe options for Moradabad
const ADDITIONAL_CAFES: Cafe[] = [
  {
    id: '26',
    name: 'Brew & Bean',
    address: 'Katra, Moradabad',
    location: { lat: 28.8456, lng: 78.7712, address: 'Katra, Moradabad, Uttar Pradesh' },
    description: 'Specialty coffee shop with artisanal brewing methods. Known for their single-origin beans and latte art. Cozy atmosphere with books and board games available.',
    rating: 4.4,
    reviewCount: 295,
    cuisine: 'Cafe',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Cozy',
    openingHours: '8:00 AM - 9:00 PM',
    phone: '+91 591 245 1122',
    amenities: ['wifi', 'books', 'board games'],
    dietaryOptions: ['vegetarian', 'vegan', 'gluten-free'],
    imageUrl: 'https://images.unsplash.com/photo-1554115261-2bed223582a0?w=800',
    isOpen: true,
  },
  {
    id: '27',
    name: 'Chai Point Express',
    address: 'Near Railway Station, Moradabad',
    location: { lat: 28.8398, lng: 78.7821, address: 'Near Railway Station, Moradabad, Uttar Pradesh' },
    description: 'Quick-service chai and snacks outlet. Famous for their masala chai and quick bites. Perfect for travelers and those in a hurry.',
    rating: 4.1,
    reviewCount: 420,
    cuisine: 'Indian',
    priceRange: 'Budget',
    priceLevel: 1,
    ambiance: 'Quick-service',
    openingHours: '6:00 AM - 10:00 PM',
    phone: '+91 591 234 3344',
    amenities: ['takeaway', 'delivery'],
    dietaryOptions: ['vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1573496130407-57329f01f045?w=800',
    isOpen: true,
  },
  {
    id: '28',
    name: 'The Garden Terrace',
    address: 'Sector 11, Moradabad',
    location: { lat: 28.8276, lng: 78.7789, address: 'Sector 11, Moradabad, Uttar Pradesh' },
    description: 'Beautiful garden cafe with outdoor seating and fresh air. Offers a variety of teas, coffees, and light meals. Perfect for weekend brunches and family outings.',
    rating: 4.5,
    reviewCount: 350,
    cuisine: 'Continental',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Relaxed',
    openingHours: '9:00 AM - 8:00 PM',
    phone: '+91 591 256 5566',
    amenities: ['outdoor seating', 'garden', 'kids friendly', 'parking'],
    dietaryOptions: ['vegetarian', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    isOpen: true,
  },
  {
    id: '29',
    name: 'Midnight Munchies',
    address: 'Old Delhi Road, Moradabad',
    location: { lat: 28.8489, lng: 78.7698, address: 'Old Delhi Road, Moradabad, Uttar Pradesh' },
    description: '24-hour cafe serving late-night snacks and beverages. Popular among night owls and shift workers. Offers a variety of sandwiches, wraps, and hot drinks.',
    rating: 4.0,
    reviewCount: 310,
    cuisine: 'Continental',
    priceRange: 'Budget',
    priceLevel: 1,
    ambiance: 'Casual',
    openingHours: '24 hours',
    phone: '+91 591 278 7788',
    amenities: ['24 hours', 'delivery', 'wifi'],
    dietaryOptions: ['vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    isOpen: true,
  },
  {
    id: '30',
    name: 'Artisan Bakers',
    address: 'Meerut Road, Moradabad',
    location: { lat: 28.8321, lng: 78.7543, address: 'Meerut Road, Moradabad, Uttar Pradesh' },
    description: 'Premium bakery and cafe specializing in artisanal breads and pastries. Known for their sourdough bread and French pastries. Great for breakfast and afternoon tea.',
    rating: 4.6,
    reviewCount: 275,
    cuisine: 'Bakery',
    priceRange: 'Moderate',
    priceLevel: 2,
    ambiance: 'Elegant',
    openingHours: '7:00 AM - 7:00 PM',
    phone: '+91 591 290 9900',
    amenities: ['bakery', 'pastry counter', 'takeaway'],
    dietaryOptions: ['vegetarian', 'vegan options'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    isOpen: true,
  },
]

// Combine all cafes
const ALL_MORADABAD_CAFES: Cafe[] = [...MORADABAD_CAFES, ...ADDITIONAL_CAFES]

// Export ALL_MORADABAD_CAFES for use in other routes
export { ALL_MORADABAD_CAFES }

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

// New endpoint to seed cafes into database
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // Check if cafes already exist
    const existingCafes = await CafeModel.countDocuments()
    if (existingCafes > 0) {
      return NextResponse.json(
        { message: 'Cafes already seeded' },
        { status: 200 }
      )
    }
    
    // Seed cafes
    const cafesToSeed = ALL_MORADABAD_CAFES.map(cafe => ({
      ...cafe,
      _id: cafe.id
    }))
    
    await CafeModel.insertMany(cafesToSeed)
    
    return NextResponse.json(
      { message: 'Cafes seeded successfully', count: cafesToSeed.length },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error seeding cafes:', error)
    return NextResponse.json(
      { error: 'Failed to seed cafes' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Get all cafes from database
    const cafesFromDb = await CafeModel.find({})
    
    // Convert to Cafe type
    const cafes: Cafe[] = cafesFromDb.map(cafe => ({
      id: cafe._id.toString(),
      name: cafe.name,
      address: cafe.address,
      location: cafe.location,
      description: cafe.description,
      rating: cafe.rating,
      reviewCount: cafe.reviewCount,
      cuisine: cafe.cuisine,
      priceRange: cafe.priceRange,
      ambiance: cafe.ambiance,
      openingHours: cafe.openingHours,
      phone: cafe.phone,
      website: cafe.website,
      amenities: cafe.amenities,
      dietaryOptions: cafe.dietaryOptions,
      imageUrl: cafe.imageUrl,
      distance: cafe.distance,
      isOpen: cafe.isOpen,
      priceLevel: cafe.priceLevel,
      photos: cafe.photos,
      menuUrl: cafe.menuUrl,
      reservationUrl: cafe.reservationUrl,
      socialMedia: cafe.socialMedia
    }))
    
    // Update isOpen status based on current time
    cafes.forEach((cafe) => {
      if (cafe.openingHours) {
        cafe.isOpen = isCafeOpen(cafe.openingHours)
      }
    })
    
    return NextResponse.json({
      cafes,
      count: cafes.length,
    })
  } catch (error) {
    console.error('Error fetching cafes:', error)
    return NextResponse.json(
      { error: 'Failed to get cafes' },
      { status: 500 }
    )
  }
}