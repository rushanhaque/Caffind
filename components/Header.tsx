'use client'

import { useState, useEffect } from 'react'
import { Coffee, Home, MapPin, Heart, Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-white/80 backdrop-blur-sm py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl transform transition-transform hover:scale-105">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Caffind
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">AI-Powered Cafe Discovery</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-amber-600 font-semibold transition-all hover:text-orange-500 hover:scale-105">
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link href="#" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-all hover:scale-105">
              <MapPin className="w-5 h-5" />
              Map
            </Link>
            <Link href="#" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-all hover:scale-105">
              <Heart className="w-5 h-5" />
              Favorites
            </Link>
            
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-all">
                  <User className="w-5 h-5" />
                  {user.name}
                </Link>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg bg-white shadow-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-amber-600 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-600 hover:text-amber-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="w-5 h-5" />
              Map
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-600 hover:text-amber-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="w-5 h-5" />
              Favorites
            </Link>
            
            {/* Mobile Auth Buttons */}
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-600 hover:text-amber-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-600 hover:text-amber-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-600 hover:text-amber-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}