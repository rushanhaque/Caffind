'use client'

import { useState, useEffect } from 'react'
import { Coffee, Heart, Search, Sparkles, TrendingUp, MapPin } from 'lucide-react'
import PreferenceForm from './PreferenceForm'
import CafeResults from './CafeResults'
import CafeInsights from './CafeInsights'
import LoadingSpinner from './LoadingSpinner'
import FavoritesView from './FavoritesView'
import MapView from './MapView'
import { Cafe, UserPreferences } from '@/types'

type ViewMode = 'search' | 'favorites' | 'map'

export default function CafeFinder() {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [allCafes, setAllCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('search')
  const [preferences, setPreferences] = useState<UserPreferences>({
    mood: '',
    cuisine: '',
    ambiance: '',
    priceRange: '',
    dietaryRestrictions: [],
    amenities: [],
    location: '',
    occasion: '',
    groupSize: '',
    timeOfDay: '',
  })
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)

  useEffect(() => {
    // Get user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Default to Moradabad center if geolocation fails
          setUserLocation({ lat: 28.8389, lng: 78.7765 })
        }
      )
    } else {
      setUserLocation({ lat: 28.8389, lng: 78.7765 })
    }

    // Load all cafes for favorites view
    fetch('/api/all-cafes')
      .then((res) => res.json())
      .then((data) => {
        setAllCafes(data.cafes || [])
      })
      .catch((err) => {
        console.error('Error loading all cafes:', err)
      })
  }, [])

  const handleFindCafes = async (userPreferences: UserPreferences) => {
    setLoading(true)
    setError(null)
    setCafes([])
    setViewMode('search')
    setPreferences(userPreferences)

    try {
      // Call API to get cafe recommendations
      const response = await fetch('/api/recommend-cafes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPreferences),
      })

      if (!response.ok) {
        throw new Error('Failed to get cafe recommendations')
      }

      const data = await response.json()
      setCafes(data.cafes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 glass">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Caffind AI Cafe Recommendations</h2>
              <p className="text-gray-600">Personalized suggestions based on your preferences</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('search')}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                viewMode === 'search'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <Search className="w-5 h-5" />
              Search Cafes
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <MapPin className="w-5 h-5" />
              Map View
            </button>
            <button
              onClick={() => setViewMode('favorites')}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                viewMode === 'favorites'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <Heart className="w-5 h-5" />
              My Favorites
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'search' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 glass">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Your Preferences
              </h3>
              <PreferenceForm onSubmit={handleFindCafes} />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights */}
            {cafes.length > 0 && (
              <CafeInsights cafes={cafes} preferences={preferences} />
            )}
            
            {loading && <LoadingSpinner />}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            {!loading && !error && cafes.length > 0 && (
              <CafeResults 
                cafes={cafes} 
                userLocation={userLocation} 
                onCafeSelect={(cafe) => {
                  // This callback can be used for additional actions when a cafe is selected
                  console.log('Cafe selected for directions:', cafe)
                }} 
              />
            )}
            {!loading && !error && cafes.length === 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center glass">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Find Your Perfect Cafe</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Fill out the form to get AI-powered cafe recommendations tailored to your preferences
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-amber-50 p-4 rounded-xl interactive-card">
                    <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-amber-800 mb-2">Mood-Based</h4>
                    <p className="text-sm text-amber-600">Find cafes that match your current mood</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl interactive-card">
                    <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-blue-800 mb-2">Location-Aware</h4>
                    <p className="text-sm text-blue-600">Discover nearby cafes in Moradabad</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl interactive-card">
                    <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <Coffee className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-800 mb-2">Personalized</h4>
                    <p className="text-sm text-green-600">Tailored to your taste and preferences</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : viewMode === 'map' ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 glass">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Cafe Map View
          </h3>
          <p className="text-gray-600 mb-6">Explore cafes in Moradabad on the map</p>
          <MapView 
            cafes={allCafes.length > 0 ? allCafes : cafes} 
            userLocation={userLocation} 
            selectedCafe={selectedCafe}
            onCafeSelect={setSelectedCafe}
          />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <FavoritesView allCafes={allCafes.length > 0 ? allCafes : cafes} userLocation={userLocation} />
        </div>
      )}
    </div>
  )
}