# Setup Guide

This guide will help you set up the Caffind application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cafe-finder-new
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

You can either use a local MongoDB instance or MongoDB Atlas (cloud):

#### Option A: Local MongoDB
1. Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   mongod
   ```

#### Option B: MongoDB Atlas
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/caffind
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/caffind?retryWrites=true&w=majority

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# OpenAI API Key (optional, for AI recommendations)
OPENAI_API_KEY=your-openai-api-key-here
```

### 5. Initialize the Database

Run the database initialization script to populate the database with cafe data:

```bash
npm run init-db
```

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure Overview

```
caffind/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── profile/           # User profile
│   ├── favorites/         # Favorites page
│   └── ...                # Other pages
├── components/            # React components
├── contexts/              # React contexts (AuthContext)
├── lib/                   # Utility functions
├── models/                # Mongoose models
├── scripts/               # Utility scripts
├── types/                 # TypeScript types
├── utils/                 # Helper functions
└── ...
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint
- `npm run init-db` - Initializes the database with cafe data

## Development Workflow

1. **Create a new feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test your changes locally**:
   ```bash
   npm run dev
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add your commit message"
   ```

5. **Push to your fork and create a pull request**

## Troubleshooting

### Common Issues

1. **MongoDB connection error**:
   - Ensure MongoDB is running
   - Check your MONGODB_URI in `.env.local`
   - Verify MongoDB credentials if using Atlas

2. **Port already in use**:
   - The app runs on port 3000 by default
   - Change the port in the dev script if needed

3. **Missing environment variables**:
   - Ensure `.env.local` exists with all required variables

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check that MongoDB is running

For additional help, please open an issue on the repository.