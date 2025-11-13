'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Heart, Coffee, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
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
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/20 p-4 rounded-full">
                <User className="w-16 h-16" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-amber-100 text-lg">{user.email}</p>
                <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <span className="font-semibold">{favorites.length}</span> Favorites
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link 
                href="/favorites" 
                className="bg-gray-50 hover:bg-amber-50 rounded-xl p-6 text-center transition-colors border border-gray-100 hover:border-amber-200"
              >
                <Heart className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-1">Favorites</h3>
                <p className="text-gray-600">{favorites.length} saved cafes</p>
              </Link>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <Coffee className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-1">Recommendations</h3>
                <p className="text-gray-600">Your AI preferences</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="bg-gray-50 hover:bg-red-50 rounded-xl p-6 text-center transition-colors border border-gray-100 hover:border-red-200"
              >
                <LogOut className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-1">Logout</h3>
                <p className="text-gray-600">Sign out of your account</p>
              </button>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="bg-white p-3 rounded-lg border border-gray-200">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="bg-white p-3 rounded-lg border border-gray-200">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4">Preferences</h3>
                  <p className="text-gray-600">Manage your cafe preferences and recommendations settings.</p>
                  <button className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                    Edit Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}