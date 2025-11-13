'use client'

import { useState, useEffect } from 'react'
import { Coffee, MapPin, Star, Users, TrendingUp, Sparkles, LogIn, UserPlus } from 'lucide-react'
import CafeFinder from '@/components/CafeFinder'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeView, setActiveView] = useState<'finder' | 'map'>('finder')
  const { user } = useAuth()
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { icon: Coffee, value: '5+', label: 'Cafes Listed' },
    { icon: Users, value: '1K+', label: 'Happy Customers' },
    { icon: Star, value: '4.4', label: 'Average Rating' },
    { icon: MapPin, value: 'Moradabad', label: 'City' },
  ]

  const handleFindCafeClick = () => {
    setActiveView('finder')
  }

  const handleViewMapClick = () => {
    setActiveView('map')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16 flex-grow">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-700">AI-Powered Recommendations</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Discover Your Perfect <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Cafe</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Caffind uses AI to find the perfect cafe in Moradabad based on your mood, preferences, and location
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up
              </Link>
              <Link 
                href="/login" 
                className="bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-500 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={handleFindCafeClick}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Find My Cafe
              </button>
              <button 
                onClick={handleViewMapClick}
                className="bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-500 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-md"
              >
                View Map
              </button>
            </div>
          )}
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
                <stat.icon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cafe Finder Section */}
      {user && (
        <div className="container mx-auto px-4 pb-20 flex-grow">
          <CafeFinder />
        </div>
      )}
      
      <Footer />
    </main>
  )
}