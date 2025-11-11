'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Cafe } from '@/types'
import CafeCard from './CafeCard'

// Type declarations for Google Maps
declare global {
  interface Window {
    google: any
  }
}

interface MapViewProps {
  cafes: Cafe[]
  userLocation: { lat: number; lng: number } | null
  selectedCafe?: Cafe | null
  onCafeSelect?: (cafe: Cafe) => void
}

export default function MapView({
  cafes,
  userLocation,
  selectedCafe = null,
  onCafeSelect = () => {},
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any | null>(null)
  const [directionsService, setDirectionsService] = useState<any | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<any | null>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [route, setRoute] = useState<any | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        setMapError('Google Maps API key is not set. Falling back to OpenStreetMap.')
        return
      }

      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry'],
      })

      try {
        const google = await loader.load()
        if (mapRef.current) {
          const center = userLocation || { lat: 28.8389, lng: 78.7765 } // Moradabad center
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          })

          setMap(mapInstance)

          const directionsServiceInstance = new google.maps.DirectionsService()
          const directionsRendererInstance = new google.maps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: false,
          })

          setDirectionsService(directionsServiceInstance)
          setDirectionsRenderer(directionsRendererInstance)

          // Add user location marker
          if (userLocation) {
            new google.maps.Marker({
              position: userLocation,
              map: mapInstance,
              title: 'Your Location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
            })
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setMapError('Failed to load Google Maps. Falling back to OpenStreetMap.')
      }
    }

    initMap()
  }, [userLocation, isClient])

  useEffect(() => {
    if (!isClient || !map || !cafes.length) return

    const google = window.google
    if (!google) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    const newMarkers: any[] = []

    cafes.forEach((cafe) => {
      const position = cafe.location
        ? { lat: cafe.location.lat, lng: cafe.location.lng }
        : null

      if (position) {
        const marker = new google.maps.Marker({
          position,
          map,
          title: cafe.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        })

        marker.addListener('click', () => {
          onCafeSelect(cafe)
        })

        newMarkers.push(marker)
      }
    })

    setMarkers(newMarkers)

    // Fit bounds to show all cafes
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      newMarkers.forEach((marker) => {
        const position = marker.getPosition()
        if (position) bounds.extend(position)
      })
      if (userLocation) bounds.extend(userLocation)
      map.fitBounds(bounds)
    }
  }, [map, cafes, userLocation, onCafeSelect, isClient])

  const calculateRoute = (cafe: Cafe) => {
    if (!directionsService || !directionsRenderer || !userLocation || !cafe.location) return

    const request: any = {
      origin: userLocation,
      destination: { lat: cafe.location.lat, lng: cafe.location.lng },
      travelMode: 'DRIVING',
    }

    directionsService.route(request, (result: any, status: string) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result)
        setRoute(result)
      } else {
        console.error('Directions request failed:', status)
      }
    })
  }

  useEffect(() => {
    if (!isClient) return

    if (selectedCafe) {
      calculateRoute(selectedCafe)
    } else if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] })
      setRoute(null)
    }
  }, [selectedCafe, directionsService, directionsRenderer, userLocation, isClient])

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full h-96 bg-gray-200 animate-pulse" />
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Google Maps Unavailable</h3>
        <p className="text-yellow-700 mb-4">{mapError}</p>
        <p className="text-sm text-yellow-600">
          The application will automatically use OpenStreetMap as a fallback.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div ref={mapRef} className="w-full h-96" />
      </div>
      {selectedCafe && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-bold text-lg mb-2">Selected Cafe</h4>
          <CafeCard
            cafe={selectedCafe}
            userLocation={userLocation}
            onSelect={() => {}}
          />
        </div>
      )}
      {route && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-bold text-lg mb-2">Route Information</h4>
          {route.routes[0]?.legs[0] && (
            <div className="text-sm text-gray-700">
              <p>
                <strong>Distance:</strong> {route.routes[0].legs[0].distance?.text}
              </p>
              <p>
                <strong>Duration:</strong> {route.routes[0].legs[0].duration?.text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}