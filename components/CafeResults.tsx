'use client'

import { useState, useMemo } from 'react'
import { Cafe } from '@/types'
import CafeCard from './CafeCard'
import MapView from './MapView'
import { Map, List, Search, Filter, SortAsc, X, Coffee, Navigation } from 'lucide-react'
import { calculateDistance } from '@/utils/distance'

interface CafeResultsProps {
  cafes: Cafe[]
  userLocation: { lat: number; lng: number } | null
  onCafeSelect?: (cafe: Cafe) => void
}

type SortOption = 'relevance' | 'distance' | 'rating' | 'price'

export default function CafeResults({ cafes, userLocation, onCafeSelect }: CafeResultsProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [priceFilter, setPriceFilter] = useState<string>('')
  const [cuisineFilter, setCuisineFilter] = useState<string>('')
  const [ambianceFilter, setAmbianceFilter] = useState<string>('')
  const [useOSM, setUseOSM] = useState(true) // Use OpenStreetMap by default

  // Calculate distances for all cafes
  const cafesWithDistance = useMemo(() => {
    return cafes.map((cafe) => {
      if (userLocation && cafe.location) {
        const distance = calculateDistance(userLocation, cafe.location)
        return { ...cafe, distance }
      }
      return cafe
    })
  }, [cafes, userLocation])

  // Filter cafes
  const filteredCafes = useMemo(() => {
    let filtered = cafesWithDistance

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (cafe) =>
          cafe.name.toLowerCase().includes(query) ||
          cafe.address?.toLowerCase().includes(query) ||
          cafe.description?.toLowerCase().includes(query) ||
          cafe.cuisine?.toLowerCase().includes(query)
      )
    }

    // Price filter
    if (priceFilter) {
      filtered = filtered.filter(
        (cafe) => cafe.priceRange?.toLowerCase() === priceFilter.toLowerCase()
      )
    }

    // Cuisine filter
    if (cuisineFilter) {
      filtered = filtered.filter(
        (cafe) => cafe.cuisine?.toLowerCase() === cuisineFilter.toLowerCase()
      )
    }

    // Ambiance filter
    if (ambianceFilter) {
      filtered = filtered.filter(
        (cafe) => cafe.ambiance?.toLowerCase() === ambianceFilter.toLowerCase()
      )
    }

    return filtered
  }, [cafesWithDistance, searchQuery, priceFilter, cuisineFilter, ambianceFilter])

  // Sort cafes
  const sortedCafes = useMemo(() => {
    const sorted = [...filteredCafes]

    switch (sortBy) {
      case 'distance':
        return sorted.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'price':
        return sorted.sort((a, b) => {
          const priceOrder = { budget: 1, moderate: 2, upscale: 3, luxury: 4 }
          const aPrice = priceOrder[a.priceRange?.toLowerCase() as keyof typeof priceOrder] || 2
          const bPrice = priceOrder[b.priceRange?.toLowerCase() as keyof typeof priceOrder] || 2
          return aPrice - bPrice
        })
      default:
        return sorted
    }
  }, [filteredCafes, sortBy])

  const hasActiveFilters = priceFilter || cuisineFilter || ambianceFilter

  const clearFilters = () => {
    setPriceFilter('')
    setCuisineFilter('')
    setAmbianceFilter('')
  }

  const uniqueCuisines = Array.from(new Set(cafes.map((c) => c.cuisine).filter(Boolean)))
  const uniqueAmbiances = Array.from(new Set(cafes.map((c) => c.ambiance).filter(Boolean)))

  // Handle directions button click
  const handleGetDirections = (cafe: Cafe) => {
    setSelectedCafe(cafe)
    setViewMode('map') // Automatically switch to map view
    if (onCafeSelect) onCafeSelect(cafe)
  }

  // Dynamically import OSMMapView only on client side
  const OSMMapView = typeof window !== 'undefined' ? require('./OSMMapView').default : () => null

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-5 glass">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Coffee className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Found {sortedCafes.length} {sortedCafes.length === 1 ? 'Cafe' : 'Cafes'}
              </h3>
              <p className="text-gray-600 text-sm">Discover the perfect cafe for you</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 transition ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <List className="w-5 h-5" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 transition ${
                viewMode === 'map'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <Map className="w-5 h-5" />
              Map
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cafes by name, location, or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <SortAsc className="w-5 h-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-gray-50"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 transition ${
              showFilters || hasActiveFilters
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {[priceFilter, cuisineFilter, ambianceFilter].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 shadow-md transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">All Prices</option>
                <option value="budget">Budget (₹)</option>
                <option value="moderate">Moderate (₹₹)</option>
                <option value="upscale">Upscale (₹₹₹)</option>
                <option value="luxury">Luxury (₹₹₹₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine
              </label>
              <select
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">All Cuisines</option>
                {uniqueCuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine?.toLowerCase()}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ambiance
              </label>
              <select
                value={ambianceFilter}
                onChange={(e) => setAmbianceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">All Ambiances</option>
                {uniqueAmbiances.map((ambiance) => (
                  <option key={ambiance} value={ambiance?.toLowerCase()}>
                    {ambiance}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {viewMode === 'list' ? (
        <div className="space-y-5">
          {sortedCafes.length > 0 ? (
            sortedCafes.map((cafe, index) => (
              <CafeCard
                key={cafe.id || index}
                cafe={cafe}
                userLocation={userLocation}
                onSelect={() => handleGetDirections(cafe)}
              />
            ))
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center glass">
              <div className="bg-amber-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Cafes Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find more cafes
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary px-6 py-3"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      ) : useOSM ? (
        typeof window !== 'undefined' ? (
          <OSMMapView
            cafes={sortedCafes}
            userLocation={userLocation}
            selectedCafe={selectedCafe}
            onCafeSelect={setSelectedCafe}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-96 bg-gray-200 animate-pulse" />
          </div>
        )
      ) : (
        <MapView
          cafes={sortedCafes}
          userLocation={userLocation}
          selectedCafe={selectedCafe}
          onCafeSelect={setSelectedCafe}
        />
      )}
    </div>
  )
}