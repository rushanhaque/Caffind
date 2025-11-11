# Cafe Finder Delhi ☕

An AI-powered cafe finder application for Delhi that suggests cafes based on user preferences, mood, and location. The app provides the shortest route to suggested cafes using Google Maps integration.

## Features

- 🤖 **AI-Powered Recommendations**: Uses OpenAI to intelligently match cafes based on your preferences
- 🗺️ **Interactive Maps**: Google Maps integration for viewing cafe locations and getting directions
- 🎯 **Smart Filtering**: Filter cafes by mood, cuisine, ambiance, price range, dietary restrictions, and amenities
- 📍 **Location-Based**: Automatically detects your location or allows manual area selection
- 🛣️ **Route Planning**: Get the shortest route to your chosen cafe with distance and duration
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- ⭐ **Enhanced Features**:
  - Multiple view modes (List and Map)
  - Cafe ratings and reviews
  - Contact information (phone, website)
  - Opening hours
  - Detailed cafe descriptions
  - Amenities and dietary options

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API
- **Maps**: Google Maps JavaScript API
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd "cafe finder new"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Key for AI recommendations
OPENAI_API_KEY=your_openai_api_key_here

# Google Maps API Key for location and routing
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Get API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into `.env.local`

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Go to Credentials and create an API key
5. Restrict the API key to your domain (optional but recommended)
6. Copy and paste it into `.env.local`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Fill in your preferences**:
   - Select your current mood
   - Choose cuisine preference
   - Set preferred ambiance
   - Select price range
   - Choose area in Delhi
   - Add dietary restrictions and amenities
   - Select occasion and time of day

2. **Click "Find My Perfect Cafe"** to get AI-powered recommendations

3. **View results** in List or Map view

4. **Click "Get Directions"** on any cafe to see the route on the map

5. **Switch between views** using the List/Map toggle

## Project Structure

```
cafe-finder-delhi/
├── app/
│   ├── api/
│   │   └── recommend-cafes/
│   │       └── route.ts          # API endpoint for cafe recommendations
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── CafeCard.tsx              # Individual cafe card component
│   ├── CafeFinder.tsx            # Main cafe finder component
│   ├── CafeResults.tsx           # Results display component
│   ├── Header.tsx                # Header component
│   ├── LoadingSpinner.tsx       # Loading indicator
│   ├── MapView.tsx               # Google Maps integration
│   └── PreferenceForm.tsx       # User preference form
├── types/
│   └── index.ts                  # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## API Endpoints

### POST `/api/recommend-cafes`

Recommends cafes based on user preferences.

**Request Body:**
```json
{
  "mood": "relaxed",
  "cuisine": "continental",
  "ambiance": "casual",
  "priceRange": "moderate",
  "dietaryRestrictions": ["vegetarian"],
  "amenities": ["wifi", "parking"],
  "location": "khan market",
  "occasion": "friends",
  "timeOfDay": "afternoon"
}
```

**Response:**
```json
{
  "cafes": [...],
  "count": 5
}
```

## Future Enhancements

- [ ] Real-time cafe data from external APIs (Zomato, Google Places)
- [ ] User accounts and favorite cafes
- [ ] Reviews and ratings system
- [ ] Cafe photos and galleries
- [ ] Real-time availability and wait times
- [ ] Reservation system
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Price comparison
- [ ] Menu previews

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

---

Made with ☕ in Delhi

