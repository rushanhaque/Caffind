'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Cafe } from '@/types'
import CafeCard from './CafeCard'
import { Navigation, MapPin, Coffee } from 'lucide-react'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface OSMMapViewProps {
  cafes: Cafe[]
  userLocation: { lat: number; lng: number } | null
  selectedCafe: Cafe | null
  onCafeSelect: (cafe: Cafe) => void
}

export default function OSMMapView({
  cafes,
  userLocation,
  selectedCafe,
  onCafeSelect,
}: OSMMapViewProps) {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.8389, 78.7765]) // Moradabad center
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  // Set initial map center
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng])
    }
  }, [userLocation])

  // Fetch actual route when a cafe is selected
  useEffect(() => {
    const fetchRoute = async () => {
      if (selectedCafe && userLocation && selectedCafe.location) {
        setLoadingRoute(true)
        try {
          // Use OSRM (Open Source Routing Machine) for real routing
          const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${selectedCafe.location.lng},${selectedCafe.location.lat}?overview=full&geometries=geojson`
          
          const response = await fetch(url)
          const data = await response.json()
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0]
            // Extract coordinates from the route geometry
            const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]) as [number, number][]
            setRoutePoints(coordinates)
            
            // Extract route information
            const distance = route.distance / 1000 // Convert to kilometers
            const duration = route.duration / 60 // Convert to minutes
            setRouteInfo({ distance, duration })
          } else {
            // Fallback to straight line if routing fails
            const startPoint: [number, number] = [userLocation.lat, userLocation.lng]
            const endPoint: [number, number] = [selectedCafe.location.lat, selectedCafe.location.lng]
            setRoutePoints([startPoint, endPoint])
            setRouteInfo(null)
          }
        } catch (error) {
          console.error('Error fetching route:', error)
          // Fallback to straight line if API fails
          const startPoint: [number, number] = [userLocation.lat, userLocation.lng]
          const endPoint: [number, number] = [selectedCafe.location.lat, selectedCafe.location.lng]
          setRoutePoints([startPoint, endPoint])
          setRouteInfo(null)
        } finally {
          setLoadingRoute(false)
        }
      } else {
        setRoutePoints([])
        setRouteInfo(null)
      }
    }

    fetchRoute()
  }, [selectedCafe, userLocation])

  // Format time for display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  // Format distance for display
  const formatDistance = (km: number) => {
    return km.toFixed(1) + ' km'
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-5 glass">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-2 rounded-xl">
            <Navigation className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Cafe Map</h3>
            <p className="text-gray-600 text-sm">Find cafes and get directions in Moradabad</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '400px', width: '100%', borderRadius: '12px' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">Your Location</span>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Cafe markers */}
            {cafes.map((cafe) => {
              if (!cafe.location) return null
              return (
                <Marker 
                  key={cafe.id} 
                  position={[cafe.location.lat, cafe.location.lng]}
                  eventHandlers={{
                    click: () => {
                      onCafeSelect(cafe)
                    },
                  }}
                >
                  <Popup>
                    <div className="font-semibold">{cafe.name}</div>
                    <div className="text-sm text-gray-600">{cafe.address}</div>
                    <button 
                      onClick={() => onCafeSelect(cafe)}
                      className="mt-2 text-amber-600 hover:text-amber-700 text-sm font-semibold"
                    >
                      Get Directions
                    </button>
                  </Popup>
                </Marker>
              )
            })}
            
            {/* Route line */}
            {routePoints.length > 0 && (
              <Polyline 
                positions={routePoints} 
                color="#f59e0b" 
                weight={6}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </MapContainer>
        </div>
      </div>
      
      {selectedCafe && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-5 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Coffee className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Selected Cafe</h3>
              <p className="text-gray-600 text-sm">Details and directions</p>
            </div>
          </div>
          <CafeCard
            cafe={selectedCafe}
            userLocation={userLocation}
            onSelect={() => {}}
          />
        </div>
      )}
      
      {loadingRoute && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center glass">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Calculating Route...</h4>
          <p className="text-gray-600">Finding the best path to your destination</p>
        </div>
      )}
      
      {routeInfo && !loadingRoute && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-5 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Navigation className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Route Information</h3>
              <p className="text-gray-600 text-sm">Distance and estimated travel time</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-amber-700">{formatDistance(routeInfo.distance)}</div>
              <div className="text-sm text-amber-600">Distance</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">{formatTime(routeInfo.duration)}</div>
              <div className="text-sm text-blue-600">Estimated Time</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Route provided by OSRM (Open Source Routing Machine)
          </div>
        </div>
      )}
      
      {routePoints.length > 0 && !routeInfo && !loadingRoute && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-5 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Navigation className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Route Information</h3>
              <p className="text-gray-600 text-sm">Showing straight-line distance</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing straight-line distance (real routing unavailable)
          </div>
        </div>
      )}
    </div>
  )
}