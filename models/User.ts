import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  favorites: string[]; // Array of cafe IDs
  preferences: {
    mood?: string;
    cuisine?: string;
    ambiance?: string;
    priceRange?: string;
    dietaryRestrictions?: string[];
    amenities?: string[];
    location?: string;
    occasion?: string;
    groupSize?: string;
    timeOfDay?: string;
  };
  createdAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  favorites: [{
    type: String
  }],
  preferences: {
    mood: String,
    cuisine: String,
    ambiance: String,
    priceRange: String,
    dietaryRestrictions: [String],
    amenities: [String],
    location: String,
    occasion: String,
    groupSize: String,
    timeOfDay: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);