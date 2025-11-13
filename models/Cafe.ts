import mongoose, { Document, Schema } from 'mongoose';

export interface ICafeLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface ICafe extends Document {
  name: string;
  address?: string;
  location?: ICafeLocation;
  description?: string;
  rating?: number;
  reviewCount?: number;
  cuisine?: string;
  priceRange?: string;
  ambiance?: string;
  openingHours?: string;
  phone?: string;
  website?: string;
  amenities?: string[];
  dietaryOptions?: string[];
  imageUrl?: string;
  distance?: number;
  isOpen?: boolean;
  priceLevel?: number;
  photos?: string[];
  menuUrl?: string;
  reservationUrl?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
}

const CafeSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  description: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  cuisine: {
    type: String,
    trim: true
  },
  priceRange: {
    type: String,
    enum: ['Budget', 'Moderate', 'Upscale']
  },
  ambiance: {
    type: String,
    trim: true
  },
  openingHours: {
    type: String
  },
  phone: {
    type: String
  },
  website: {
    type: String
  },
  amenities: [{
    type: String
  }],
  dietaryOptions: [{
    type: String
  }],
  imageUrl: {
    type: String
  },
  distance: {
    type: Number
  },
  isOpen: {
    type: Boolean
  },
  priceLevel: {
    type: Number,
    min: 1,
    max: 4
  },
  photos: [{
    type: String
  }],
  menuUrl: {
    type: String
  },
  reservationUrl: {
    type: String
  },
  socialMedia: {
    instagram: String,
    facebook: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Cafe || mongoose.model<ICafe>('Cafe', CafeSchema);