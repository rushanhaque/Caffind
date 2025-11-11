export interface UserPreferences {
  mood: string
  cuisine: string
  ambiance: string
  priceRange: string
  dietaryRestrictions: string[]
  amenities: string[]
  location: string
  occasion: string
  groupSize: string
  timeOfDay: string
}

export interface CafeLocation {
  lat: number
  lng: number
  address?: string
}

export interface Cafe {
  id?: string
  name: string
  address?: string
  location?: CafeLocation
  description?: string
  rating?: number
  reviewCount?: number
  cuisine?: string
  priceRange?: string
  ambiance?: string
  openingHours?: string
  phone?: string
  website?: string
  amenities?: string[]
  dietaryOptions?: string[]
  imageUrl?: string
  distance?: number
  isOpen?: boolean
  priceLevel?: number // 1-4 for $ to $$$$
  photos?: string[]
  menuUrl?: string
  reservationUrl?: string
  socialMedia?: {
    instagram?: string
    facebook?: string
  }
}

