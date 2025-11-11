import { NextResponse } from 'next/server'
import { MORADABAD_CAFES } from '../recommend-cafes/route'

// Export all cafes for favorites view
export async function GET() {
  return NextResponse.json({
    cafes: MORADABAD_CAFES,
    count: MORADABAD_CAFES.length,
  })
}