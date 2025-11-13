'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Coffee, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchFavorites();
  }, [user, router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      if (response.ok) {
        setFavorites(data.favorites);
        fetchFavoriteCafes(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteCafes = async (favoriteIds: string[]) => {
    try {
      const response = await fetch('/api/all-cafes');
      const data = await response.json();
      if (response.ok) {
        const favoriteCafes = data.cafes.filter((cafe: any) => 
          favoriteIds.includes(cafe.id)
        );
        setCafes(favoriteCafes);
      }
    } catch (error) {
      console.error('Error fetching favorite cafes:', error);
    }
  };

  const removeFavorite = async (cafeId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cafeId }),
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(id => id !== cafeId));
        setCafes(cafes.filter(cafe => cafe.id !== cafeId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            Your Favorite Cafes
          </h1>
          <p className="text-gray-600 mt-2">
            {cafes.length} {cafes.length === 1 ? 'cafe' : 'cafes'} saved to your favorites
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : cafes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Favorites Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't saved any cafes to your favorites yet. Start exploring and save your favorite cafes!
            </p>
            <Link 
              href="/" 
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Coffee className="w-5 h-5" />
              Discover Cafes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cafes.map((cafe) => (
              <div key={cafe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={cafe.imageUrl} 
                    alt={cafe.name} 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFavorite(cafe.id)}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{cafe.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-sm font-medium">{cafe.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {cafe.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{cafe.address}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      {cafe.priceRange}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      {cafe.cuisine}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {cafe.ambiance}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium">
                      View Details
                    </button>
                    <button className="py-2 px-4 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}