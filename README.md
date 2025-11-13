# Caffind - AI-Powered Cafe Discovery

Caffind is a full-stack web application that helps users discover the perfect cafe in Moradabad based on their preferences, mood, and location. The application uses AI-powered recommendations and provides features like cafe favorites, user authentication, and interactive maps.

## Features

- AI-powered cafe recommendations based on user preferences
- User authentication (signup/login)
- Save favorite cafes
- Interactive map view with directions
- Modern, responsive UI with animations
- User profile management
- Cafe search and filtering

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with bcrypt for password hashing
- **AI Integration**: OpenAI API for intelligent cafe recommendations
- **Maps**: Leaflet.js for interactive maps
- **UI Components**: Lucide React icons

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key (optional, for AI recommendations)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cafe-finder-new
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/caffind
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **Start MongoDB**:
   Make sure MongoDB is running on your system. You can use:
   ```bash
   mongod
   ```

5. **Initialize the database**:
   ```bash
   npm run init-db
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── all-cafes/     # Get all cafes
│   │   ├── auth/          # Authentication routes
│   │   ├── favorites/     # User favorites
│   │   ├── recommend-cafes/ # AI cafe recommendations
│   │   └── user/          # User profile
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── profile/           # User profile page
│   ├── favorites/         # Favorites page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── models/                # Mongoose models
├── scripts/               # Utility scripts
├── types/                 # TypeScript types
├── utils/                 # Helper functions
└── ...
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user preferences

### Cafes
- `GET /api/all-cafes` - Get all cafes
- `POST /api/recommend-cafes` - Get AI-powered cafe recommendations

### Favorites
- `GET /api/favorites` - Get user's favorite cafes
- `POST /api/favorites` - Add cafe to favorites
- `DELETE /api/favorites` - Remove cafe from favorites

## Database Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- favorites: Array of cafe IDs
- preferences: User preferences object
- createdAt: Date

### Cafe
- name: String
- address: String
- location: Object with lat/lng
- description: String
- rating: Number
- reviewCount: Number
- cuisine: String
- priceRange: String
- ambiance: String
- openingHours: String
- phone: String
- website: String
- amenities: Array of strings
- dietaryOptions: Array of strings
- imageUrl: String
- distance: Number
- isOpen: Boolean
- priceLevel: Number
- photos: Array of strings
- menuUrl: String
- reservationUrl: String
- socialMedia: Object
- createdAt: Date

## Authentication Flow

1. Users can sign up for a new account or log in with existing credentials
2. On successful login, a JWT token is generated and stored in localStorage
3. The token is used to authenticate protected API routes
4. User data is stored in React context for easy access throughout the application

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize database with cafe data

### Adding New Features

1. Create new components in the `components/` directory
2. Add new API routes in the `app/api/` directory
3. Update TypeScript types in the `types/` directory as needed
4. Add new utility functions in the `lib/` or `utils/` directories

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.