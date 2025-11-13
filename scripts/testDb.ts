import dbConnect from '../lib/dbConnect';
import User from '../models/User';
import Cafe from '../models/Cafe';

async function testConnection() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected successfully!');
    
    // Test creating a user
    console.log('Creating test user...');
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await user.save();
    console.log('User created successfully!');
    
    // Test counting cafes
    const cafeCount = await Cafe.countDocuments();
    console.log(`Found ${cafeCount} cafes in database`);
    
    // Clean up test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Test user cleaned up');
    
    console.log('All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testConnection();