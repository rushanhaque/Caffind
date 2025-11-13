import dbConnect from './dbConnect';
import Cafe from '../models/Cafe';
import { MORADABAD_CAFES } from '../app/api/all-cafes/route';

export async function initializeDatabase() {
  try {
    await dbConnect();
    
    // Check if cafes already exist
    const existingCafes = await Cafe.countDocuments();
    if (existingCafes > 0) {
      console.log('Cafes already exist in database');
      return;
    }
    
    // Seed cafes
    const cafesToSeed = MORADABAD_CAFES.map(cafe => ({
      ...cafe,
      // Remove the _id assignment to let MongoDB generate it automatically
    }));
    
    await Cafe.insertMany(cafesToSeed);
    console.log('Database initialized with cafes');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}