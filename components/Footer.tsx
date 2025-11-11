'use client'

import { Heart, Link } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-2 text-lg">
          Developed with <Heart className="w-5 h-5 text-red-500 fill-current" /> by Rushan Haque
        </p>
        <a 
          href="https://linktr.ee/rushanhaque?utm_source=linktree_profile_share&ltsid=77580ed5-c9d7-4f78-b2ad-534946718762" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-2 text-amber-300 hover:text-white transition-colors"
          aria-label="Linktree Profile"
        >
          <Link className="w-6 h-6" />
        </a>
      </div>
    </footer>
  )
}