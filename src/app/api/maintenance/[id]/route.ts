import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Maintenance } from '@/models/Maintenance';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const record = await Maintenance.findById(params.id).lean();
    if (!record) return NextResponse.json({ success: false, error: 'Work order not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: record });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch work order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    if (body.status === 'completed' && !body.completedDate) {
      body.completedDate = new Date();
    }
    const record = await Maintenance.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).lean();
    if (!record) return NextResponse.json({ success: false, error: 'Work order not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: record });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update work order' }, { status: 500 });
  }
}
