'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Clock, Users, Coffee, Award } from 'lucide-react'
import { Cafe, UserPreferences } from '@/types'

interface CafeInsightsProps {
  cafes: Cafe[]
  preferences: UserPreferences
}

export default function CafeInsights({ cafes, preferences }: CafeInsightsProps) {
  const [insights, setInsights] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Generate AI-powered insights based on cafes and preferences
    const newInsights: string[] = []
    
    // Add insight about cafe ratings
    const avgRating = cafes.reduce((sum, cafe) => sum + (cafe.rating || 0), 0) / cafes.length
    if (avgRating >= 4.5) {
      newInsights.push(`These cafes have exceptional ratings (avg. ${avgRating.toFixed(1)}/5)`)
    } else if (avgRating >= 4.0) {
      newInsights.push(`These cafes are highly rated (avg. ${avgRating.toFixed(1)}/5)`)
    }
    
    // Add insight about price range
    const priceCounts: Record<string, number> = {}
    cafes.forEach(cafe => {
      const price = cafe.priceRange?.toLowerCase() || 'moderate'
      priceCounts[price] = (priceCounts[price] || 0) + 1
    })
    
    const mostCommonPrice = Object.entries(priceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'moderate'
    if (mostCommonPrice === 'budget') {
      newInsights.push('Most recommended cafes are budget-friendly options')
    } else if (mostCommonPrice === 'upscale') {
      newInsights.push('These are premium cafes with upscale offerings')
    } else {
      newInsights.push('These cafes offer great value for money')
    }
    
    // Add insight based on user preferences
    if (preferences.mood) {
      newInsights.push(`Based on your ${preferences.mood} mood, these cafes offer the perfect atmosphere`)
    }
    
    if (preferences.timeOfDay) {
      newInsights.push(`These cafes are great for ${preferences.timeOfDay} visits`)
    }
    
    setInsights(newInsights)
  }, [cafes, preferences])

  if (insights.length === 0) return null

  return (
    <div className={`bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/20 p-2 rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">Caffind AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.slice(0, 3).map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm animate-fadeIn">
            <div className="mt-0.5">
              {index === 0 && <TrendingUp className="w-5 h-5" />}
              {index === 1 && <Clock className="w-5 h-5" />}
              {index === 2 && <Users className="w-5 h-5" />}
              {index > 2 && <Coffee className="w-5 h-5" />}
            </div>
            <p className="text-sm">{insight}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-amber-100 flex items-center gap-1">
        <Award className="w-4 h-4" />
        <span>Powered by Caffind AI</span>
      </div>
    </div>
  )
}