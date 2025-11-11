'use client'

import { useState, useEffect } from 'react'
import { Cafe } from '@/types'
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Globe, 
  Navigation, 
  Heart, 
  Share2, 
  ExternalLink, 
  CheckCircle, 
  Wifi, 
  Car, 
  Users, 
  Music, 
  Award, 
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { isFavorite, toggleFavorite } from '@/utils/favorites'
import { calculateDistance, formatDistance } from '@/utils/distance'
import { shareCafe } from '@/utils/share'

interface CafeCardProps {
  cafe: Cafe
  userLocation: { lat: number; lng: number } | null
  onSelect: () => void
}

export default function CafeCard({ cafe, userLocation, onSelect }: CafeCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [distance, setDistance] = useState<string | null>(null)
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  useEffect(() => {
    if (cafe.id) {
      setFavorite(isFavorite(cafe.id))
    }
  }, [cafe.id])

  useEffect(() => {
    if (userLocation && cafe.location) {
      const dist = calculateDistance(userLocation, cafe.location)
      setDistance(formatDistance(dist))
    }
  }, [userLocation, cafe.location])

  const handleFavoriteToggle = () => {
    if (cafe.id) {
      const newFavorite = toggleFavorite(cafe.id)
      setFavorite(newFavorite)
    }
  }

  const handleShare = () => {
    shareCafe(cafe)
  }

  const getPriceSymbols = () => {
    if (!cafe.priceLevel) {
      if (cafe.priceRange?.toLowerCase().includes('budget')) return '₹'
      if (cafe.priceRange?.toLowerCase().includes('moderate')) return '₹₹'
      if (cafe.priceRange?.toLowerCase().includes('upscale')) return '₹₹₹'
      if (cafe.priceRange?.toLowerCase().includes('luxury')) return '₹₹₹₹'
      return '₹₹'
    }
    return '₹'.repeat(cafe.priceLevel)
  }

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase()
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4" />
    if (lower.includes('parking')) return <Car className="w-4 h-4" />
    if (lower.includes('music')) return <Music className="w-4 h-4" />
    if (lower.includes('outdoor')) return <Globe className="w-4 h-4" />
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 card-hover glass interactive-card">
      {/* Cafe Image */}
      {cafe.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={cafe.imageUrl}
            alt={cafe.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 transform hover:scale-110 ${
                favorite
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
              }`}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-all duration-200 transform hover:scale-110 shadow-md"
              title="Share cafe"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          {cafe.isOpen !== undefined && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-md animate-pulseSlow ${
              cafe.isOpen
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}>
              {cafe.isOpen ? 'Open Now' : 'Closed'}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xl font-bold text-gray-800">{cafe.name}</h4>
              {!cafe.imageUrl && (
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-1.5 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      favorite
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-full text-gray-400 hover:text-amber-600 transition-all duration-200 transform hover:scale-110"
                    title="Share cafe"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{cafe.address || cafe.location?.address}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {cafe.rating && (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{cafe.rating}</span>
                  {cafe.reviewCount && (
                    <span className="text-xs text-gray-500">({cafe.reviewCount})</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  {getPriceSymbols()}
                </span>
              </div>
              {distance && (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-600 font-semibold">
                    {distance} away
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {cafe.description && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {showFullDescription || cafe.description.length < 150
                ? cafe.description
                : `${cafe.description.substring(0, 150)}...`}
            </p>
            {cafe.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 transition-colors"
              >
                {showFullDescription ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Show more</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {cafe.cuisine && (
            <span className="tag-primary animate-slideInUp">
              {cafe.cuisine}
            </span>
          )}
          {cafe.ambiance && (
            <span className="tag-secondary animate-slideInUp">
              {cafe.ambiance}
            </span>
          )}
          {cafe.dietaryOptions && cafe.dietaryOptions.length > 0 && (
            <span className="tag-accent animate-slideInUp">
              {cafe.dietaryOptions[0]}
            </span>
          )}
        </div>

        {/* Amenities */}
        {cafe.amenities && cafe.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {cafe.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg text-xs text-gray-600 animate-slideInUp">
                {getAmenityIcon(amenity)}
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
            {cafe.amenities.length > 3 && (
              <button 
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="text-amber-600 text-xs font-semibold hover:text-amber-700 transition-colors"
              >
                {showMoreInfo ? 'Show less' : `+${cafe.amenities.length - 3} more`}
              </button>
            )}
          </div>
        )}

        {/* Additional Info (Hidden by default) */}
        {showMoreInfo && cafe.amenities && cafe.amenities.length > 3 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {cafe.amenities.slice(3).map((amenity, index) => (
                <div key={index} className="flex items-center gap-1">
                  {getAmenityIcon(amenity)}
                  <span className="capitalize text-gray-600">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
          {cafe.openingHours && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{cafe.openingHours}</span>
            </div>
          )}
          {cafe.phone && (
            <a
              href={`tel:${cafe.phone}`}
              className="flex items-center gap-1 hover:text-amber-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{cafe.phone}</span>
            </a>
          )}
          {cafe.website && (
            <a
              href={cafe.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-amber-600 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onSelect}
            className="flex-1 btn-primary flex items-center justify-center gap-2 interactive-btn"
          >
            <Navigation className="w-5 h-5" />
            Get Directions
          </button>
          <div className="flex gap-3">
            {cafe.phone && (
              <a
                href={`tel:${cafe.phone}`}
                className="flex-1 btn-secondary flex items-center justify-center interactive-btn"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            {cafe.reservationUrl && (
              <a
                href={cafe.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center interactive-btn"
              >
                <Award className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}