import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'API route is working'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      message: 'API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}