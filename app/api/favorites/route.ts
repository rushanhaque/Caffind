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
      favorites: user.favorites || []
    });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Protect route
    const authError = await protectRoute(request);
    if (authError) {
      return authError;
    }
    
    const user = (request as any).user;
    const { cafeId } = await request.json();
    
    if (!cafeId) {
      return NextResponse.json(
        { error: 'Cafe ID is required' },
        { status: 400 }
      );
    }
    
    // Add cafe to favorites if not already there
    if (!user.favorites.includes(cafeId)) {
      user.favorites.push(cafeId);
      await user.save();
    }
    
    return NextResponse.json({
      message: 'Cafe added to favorites',
      favorites: user.favorites
    });
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Protect route
    const authError = await protectRoute(request);
    if (authError) {
      return authError;
    }
    
    const user = (request as any).user;
    const { cafeId } = await request.json();
    
    if (!cafeId) {
      return NextResponse.json(
        { error: 'Cafe ID is required' },
        { status: 400 }
      );
    }
    
    // Remove cafe from favorites
    user.favorites = user.favorites.filter((id: string) => id !== cafeId);
    await user.save();
    
    return NextResponse.json({
      message: 'Cafe removed from favorites',
      favorites: user.favorites
    });
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}