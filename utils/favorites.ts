import { Cafe } from '@/types'

const FAVORITES_KEY = 'cafe_finder_favorites'

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch {
    return []
  }
}

export function addFavorite(cafeId: string): void {
  if (typeof window === 'undefined') return
  try {
    const favorites = getFavorites()
    if (!favorites.includes(cafeId)) {
      favorites.push(cafeId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  } catch (error) {
    console.error('Error adding favorite:', error)
  }
}

export function removeFavorite(cafeId: string): void {
  if (typeof window === 'undefined') return
  try {
    const favorites = getFavorites()
    const updated = favorites.filter((id) => id !== cafeId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error removing favorite:', error)
  }
}

export function isFavorite(cafeId: string): boolean {
  const favorites = getFavorites()
  return favorites.includes(cafeId)
}

export function toggleFavorite(cafeId: string): boolean {
  if (isFavorite(cafeId)) {
    removeFavorite(cafeId)
    return false
  } else {
    addFavorite(cafeId)
    return true
  }
}

