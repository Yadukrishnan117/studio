export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';

// Stub for Parts API - MongoDB model would be added here
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({
    success: true,
    data: [],
    total: 0,
    message: 'Parts API endpoint - connect MongoDB Part model to activate',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body, message: 'Part creation endpoint' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
