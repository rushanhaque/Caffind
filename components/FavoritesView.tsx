'use client'

import { useState, useEffect } from 'react'
import { Cafe } from '@/types'
import { getFavorites } from '@/utils/favorites'
import CafeCard from './CafeCard'
import { Heart, X } from 'lucide-react'

interface FavoritesViewProps {
  allCafes: Cafe[]
  userLocation: { lat: number; lng: number } | null
}

export default function FavoritesView({ allCafes, userLocation }: FavoritesViewProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [favoriteCafes, setFavoriteCafes] = useState<Cafe[]>([])

  useEffect(() => {
    const updateFavorites = () => {
      const favorites = getFavorites()
      setFavoriteIds(favorites)
      const cafes = allCafes.filter((cafe) => cafe.id && favorites.includes(cafe.id))
      setFavoriteCafes(cafes)
    }
    
    updateFavorites()
    // Listen for storage changes (when favorites are updated in other tabs)
    window.addEventListener('storage', updateFavorites)
    // Also check periodically for changes within the same tab
    const interval = setInterval(updateFavorites, 1000)
    
    return () => {
      window.removeEventListener('storage', updateFavorites)
      clearInterval(interval)
    }
  }, [allCafes])

  if (favoriteCafes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Favorites Yet</h3>
        <p className="text-gray-600">
          Start exploring cafes and add your favorites!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            My Favorites ({favoriteCafes.length})
          </h3>
        </div>
      </div>
      <div className="space-y-4">
        {favoriteCafes.map((cafe, index) => (
          <CafeCard
            key={cafe.id || index}
            cafe={cafe}
            userLocation={userLocation}
            onSelect={() => {}}
          />
        ))}
      </div>
    </div>
  )
}

