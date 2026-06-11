export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { requireAuth, isAuthError } from '@/lib/api-auth';
import { escapeRegex, safePagination, VehicleCreateSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit } = safePagination(searchParams.get('page'), searchParams.get('limit'));
    const status = searchParams.get('status');
    const fuelType = searchParams.get('fuelType');
    const branch = searchParams.get('branch');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.status = status;
    if (fuelType && fuelType !== 'all') query.fuelType = fuelType;
    if (branch && branch !== 'all') query.branch = branch;
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { make: { $regex: safe, $options: 'i' } },
        { model: { $regex: safe, $options: 'i' } },
        { vin: { $regex: safe, $options: 'i' } },
        { vehicleId: { $regex: safe, $options: 'i' } },
        { registrationNumber: { $regex: safe, $options: 'i' } },
      ];
    }

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
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();
    const body = await request.json();

    const parsed = VehicleCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const count = await Vehicle.countDocuments({});
    const vehicleId = `GT-VEH-${String(count + 1).padStart(3, '0')}`;

    const vehicle = await Vehicle.create({ ...parsed.data, vehicleId, stockDate: new Date() });
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create vehicle' }, { status: 500 });
  }
}
