import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { protectRoute } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Protect route
    const authError = await protectRoute(request);
    if (authError) {
      return authError;
    }
    
    const user = (request as any).user;
    
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites || [],
        preferences: user.preferences || {}
      }
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Protect route
    const authError = await protectRoute(request);
    if (authError) {
      return authError;
    }
    
    const user = (request as any).user;
    const { preferences } = await request.json();
    
    // Update user preferences
    user.preferences = {
      ...user.preferences,
      ...preferences
    };
    
    await user.save();
    
    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}