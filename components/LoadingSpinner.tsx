'use client'

export default function LoadingSpinner() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
      <p className="text-gray-600 text-lg">Finding your perfect cafes...</p>
      <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
    </div>
  )
}

