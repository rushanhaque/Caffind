import { initializeDatabase } from '../lib/initDb';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function init() {
  await initializeDatabase();
  process.exit(0);
}

init().catch((error) => {
  console.error('Error initializing database:', error);
  process.exit(1);
});