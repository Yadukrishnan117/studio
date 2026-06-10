export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const vehicle = await Vehicle.findById(params.id).lean();
    if (!vehicle) return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: vehicle });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch vehicle' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const vehicle = await Vehicle.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).lean();
    if (!vehicle) return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: vehicle });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const vehicle = await Vehicle.findByIdAndDelete(params.id).lean();
    if (!vehicle) return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Vehicle deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete vehicle' }, { status: 500 });
  }
}

export function generateStaticParams() {
  return [{"id": "GT-VEH-001"}, {"id": "GT-VEH-002"}, {"id": "GT-VEH-003"}, {"id": "GT-VEH-004"}, {"id": "GT-VEH-005"}, {"id": "GT-VEH-006"}, {"id": "GT-VEH-007"}, {"id": "GT-VEH-008"}, {"id": "GT-VEH-009"}, {"id": "GT-VEH-010"}, {"id": "GT-VEH-011"}, {"id": "GT-VEH-012"}, {"id": "veh_005"}, {"id": "veh_007"}, {"id": "veh_009"}, {"id": "veh_006"}];
}
