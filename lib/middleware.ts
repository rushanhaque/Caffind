import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth';

export async function protectRoute(request: NextRequest) {
  try {
    await dbConnect();
    
    const userPayload = getUserFromToken(request);
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const user = await User.findById(userPayload.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Add user to request for use in route handlers
    (request as any).user = user;
    
    return null; // No error, proceed with request
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}