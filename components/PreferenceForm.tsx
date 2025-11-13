'use client'

import { useState, FormEvent, useEffect } from 'react'
import { UserPreferences } from '@/types'
import { 
  Sparkles, 
  Coffee, 
  MapPin, 
  Clock, 
  Users, 
  Utensils, 
  Music, 
  Sun, 
  Moon, 
  CloudRain, 
  Zap,
  Wifi,
  Car,
  TreePine,
  Dog,
  Accessibility,
  Volume2,
  Award
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void
}

export default function PreferenceForm({ onSubmit }: PreferenceFormProps) {
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
  
  const [activeMood, setActiveMood] = useState<string>('')
  const [activeCuisine, setActiveCuisine] = useState<string>('')
  const { user, token } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Save preferences to user profile if authenticated
    if (user && token) {
      try {
        await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ preferences }),
        })
      } catch (error) {
        console.error('Error saving preferences:', error)
      }
    }
    
    onSubmit(preferences)
  }

  const handleCheckboxChange = (category: 'dietaryRestrictions' | 'amenities', value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }
  
  // Mood options with icons
  const moodOptions = [
    { value: 'relaxed', label: 'Relaxed', icon: Sun, color: 'bg-blue-100 text-blue-600' },
    { value: 'energetic', label: 'Energetic', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { value: 'romantic', label: 'Romantic', icon: Coffee, color: 'bg-pink-100 text-pink-600' },
    { value: 'productive', label: 'Productive', icon: Award, color: 'bg-green-100 text-green-600' },
    { value: 'social', label: 'Social', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { value: 'cozy', label: 'Cozy', icon: CloudRain, color: 'bg-amber-100 text-amber-600' },
  ]
  
  // Cuisine options
  const cuisineOptions = [
    { value: 'continental', label: 'Continental', icon: Utensils },
    { value: 'italian', label: 'Italian', icon: Utensils },
    { value: 'indian', label: 'Indian', icon: Utensils },
    { value: 'asian', label: 'Asian', icon: Utensils },
    { value: 'american', label: 'American', icon: Utensils },
    { value: 'french', label: 'French', icon: Utensils },
    { value: 'mediterranean', label: 'Mediterranean', icon: Utensils },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Caffind AI Finder</h3>
            <p className="text-amber-100 text-sm">Tell us your preferences and we'll find the perfect cafe in Moradabad</p>
          </div>
        </div>
      </div>

      {/* Mood Selection with Visual Buttons */}
      <div className="bg-white rounded-2xl shadow-md p-5 interactive-card">
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="w-5 h-5 text-amber-600" />
          <label className="block text-lg font-semibold text-gray-800">
            How are you feeling today?
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {moodOptions.map((mood) => {
            const Icon = mood.icon
            return (
              <button
                key={mood.value}
                type="button"
                onClick={() => {
                  setPreferences({ ...preferences, mood: mood.value })
                  setActiveMood(mood.value)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                  activeMood === mood.value
                    ? `${mood.color} border-amber-500 scale-105 shadow-md`
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${activeMood === mood.value ? 'text-current' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${activeMood === mood.value ? 'text-current' : 'text-gray-700'}`}>
                  {mood.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cuisine Preference */}
      <div className="bg-white rounded-2xl shadow-md p-5 interactive-card">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-amber-600" />
          <label className="block text-lg font-semibold text-gray-800">
            What are you in the mood for?
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cuisineOptions.map((cuisine) => {
            const Icon = cuisine.icon
            return (
              <button
                key={cuisine.value}
                type="button"
                onClick={() => {
                  setPreferences({ ...preferences, cuisine: cuisine.value })
                  setActiveCuisine(cuisine.value)
                }}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                  activeCuisine === cuisine.value
                    ? 'bg-amber-100 border-amber-500 text-amber-700 scale-105 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cuisine.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl shadow-md p-5 interactive-card">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-amber-600" />
          <label className="block text-lg font-semibold text-gray-800">
            Where are you looking?
          </label>
        </div>
        <select
          value={preferences.location}
          onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 interactive-btn"
        >
          <option value="">Any area in Moradabad</option>
          <option value="civil lines">Civil Lines</option>
          <option value="mall road">Mall Road</option>
          <option value="sadar bazaar">Sadar Bazaar</option>
          <option value="jahangirabad">Jahangirabad</option>
          <option value="rajput ganj">Rajput Ganj</option>
        </select>
      </div>

      {/* Time of Day */}
      <div className="bg-white rounded-2xl shadow-md p-5 interactive-card">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <label className="block text-lg font-semibold text-gray-800">
            What time works best?
          </label>
        </div>
        <select
          value={preferences.timeOfDay}
          onChange={(e) => setPreferences({ ...preferences, timeOfDay: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 interactive-btn"
        >
          <option value="">Any time</option>
          <option value="breakfast">Breakfast (7-10 AM)</option>
          <option value="brunch">Brunch (10 AM-2 PM)</option>
          <option value="lunch">Lunch (12-3 PM)</option>
          <option value="afternoon">Afternoon (2-5 PM)</option>
          <option value="dinner">Dinner (6-10 PM)</option>
          <option value="late night">Late Night (10 PM+)</option>
        </select>
      </div>

      {/* Group Size */}
      <div className="bg-white rounded-2xl shadow-md p-5 interactive-card">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-amber-600" />
          <label className="block text-lg font-semibold text-gray-800">
            How many people?
          </label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['1', '2', '3-4', '5+'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setPreferences({ ...preferences, groupSize: size })}
              className={`py-3 rounded-xl border-2 transition-all duration-200 ${
                preferences.groupSize === size
                  ? 'bg-amber-100 border-amber-500 text-amber-700 font-semibold'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="bg-white rounded-2xl shadow-md p-5 interactive-card">
        <label className="block text-lg font-semibold text-gray-800 mb-3">
          Any dietary needs?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Keto', 'Sugar-Free'].map((option) => (
            <label key={option} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer interactive-btn">
              <input
                type="checkbox"
                checked={preferences.dietaryRestrictions.includes(option.toLowerCase())}
                onChange={() => handleCheckboxChange('dietaryRestrictions', option.toLowerCase())}
                className="mr-3 w-5 h-5 text-amber-600 focus:ring-amber-500 rounded"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-2xl shadow-md p-5 interactive-card">
        <label className="block text-lg font-semibold text-gray-800 mb-3">
          What amenities matter?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'WiFi', icon: Wifi },
            { name: 'Parking', icon: Car },
            { name: 'Outdoor Seating', icon: TreePine },
            { name: 'Pet Friendly', icon: Dog },
            { name: 'Wheelchair Accessible', icon: Accessibility },
            { name: 'Quiet Environment', icon: Volume2 },
          ].map((amenity) => {
            const Icon = amenity.icon
            return (
              <label key={amenity.name} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer interactive-btn">
                <Icon className="w-4 h-4 mr-3 text-gray-500" />
                <input
                  type="checkbox"
                  checked={preferences.amenities.includes(amenity.name.toLowerCase())}
                  onChange={() => handleCheckboxChange('amenities', amenity.name.toLowerCase())}
                  className="mr-3 w-5 h-5 text-amber-600 focus:ring-amber-500 rounded"
                />
                <span className="text-gray-700">{amenity.name}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 interactive-btn"
      >
        <Sparkles className="w-6 h-6" />
        Find My Perfect Cafe ☕
      </button>
    </form>
  )
}