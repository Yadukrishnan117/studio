export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const fuelType = searchParams.get('fuelType');
    const branch = searchParams.get('branch');
    const search = searchParams.get('search');

    const query: Record<string, any> = {};
    if (status && status !== 'all') query.status = status;
    if (fuelType && fuelType !== 'all') query.fuelType = fuelType;
    if (branch && branch !== 'all') query.branch = branch;
    if (search) query.$or = [
      { make: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { vin: { $regex: search, $options: 'i' } },
      { vehicleId: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } },
    ];

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort({ stockDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: vehicles, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const count = await Vehicle.countDocuments({});
    const vehicleId = `GT-VEH-${String(count + 1).padStart(3, '0')}`;

    const vehicle = await Vehicle.create({ ...body, vehicleId, stockDate: new Date() });
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create vehicle' }, { status: 500 });
  }
}
