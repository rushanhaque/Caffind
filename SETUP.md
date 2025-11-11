# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI API Key for AI recommendations
   OPENAI_API_KEY=your_openai_api_key_here

   # Google Maps API Key for location and routing
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into `.env.local`

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Go to Credentials and create an API key
5. (Optional) Restrict the API key to your domain
6. Copy and paste it into `.env.local`

## Features Implemented

✅ **AI-Powered Recommendations** - Uses OpenAI to intelligently match cafes
✅ **Interactive Maps** - Google Maps integration with routing
✅ **Smart Filtering** - Filter by mood, cuisine, ambiance, price, etc.
✅ **Search Functionality** - Search cafes by name, location, or cuisine
✅ **Sort Options** - Sort by relevance, distance, rating, or price
✅ **Favorites System** - Save favorite cafes with localStorage
✅ **Distance Calculation** - Accurate distance using Haversine formula
✅ **Route Planning** - Get shortest route with distance and duration
✅ **Cafe Images** - Beautiful cafe photos from Unsplash
✅ **Open/Closed Status** - Real-time status based on opening hours
✅ **Share Functionality** - Share cafes with friends
✅ **Responsive Design** - Works on all devices
✅ **Enhanced UI** - Modern, beautiful interface with Tailwind CSS

## Project Structure

```
cafe-finder-delhi/
├── app/
│   ├── api/
│   │   ├── all-cafes/          # Get all cafes
│   │   └── recommend-cafes/    # AI-powered recommendations
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CafeCard.tsx            # Individual cafe card
│   ├── CafeFinder.tsx          # Main finder component
│   ├── CafeResults.tsx          # Results with search/sort/filter
│   ├── FavoritesView.tsx        # Favorites page
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── MapView.tsx             # Google Maps integration
│   └── PreferenceForm.tsx      # User preferences form
├── utils/
│   ├── distance.ts             # Distance calculations
│   ├── favorites.ts             # Favorites management
│   └── share.ts                 # Share functionality
└── types/
    └── index.ts                 # TypeScript types
```

## Troubleshooting

### Maps Not Loading
- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Check that Maps JavaScript API is enabled in Google Cloud Console
- Verify API key restrictions allow your domain

### AI Recommendations Not Working
- Ensure `OPENAI_API_KEY` is set correctly
- Check OpenAI account has credits
- Verify API key has proper permissions

### Favorites Not Saving
- Check browser allows localStorage
- Ensure cookies/localStorage are enabled

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. For deployment to Vercel/Netlify:
   - Set environment variables in the platform dashboard
   - Deploy the repository
   - The app will automatically build and deploy

## Notes

- The app uses 20+ real Delhi cafes with accurate locations
- All cafe data is stored in the API route (in production, use a database)
- Images are from Unsplash (free to use)
- The app works offline for favorites (localStorage)
- Maps require internet connection

