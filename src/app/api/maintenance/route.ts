import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Maintenance } from '@/models/Maintenance';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const query: Record<string, any> = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (search) query.$or = [
      { assetName: { $regex: search, $options: 'i' } },
      { workOrderId: { $regex: search, $options: 'i' } },
    ];

    const total = await Maintenance.countDocuments(query);
    const records = await Maintenance.find(query)
      .sort({ scheduledDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: records, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch maintenance records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const count = await Maintenance.countDocuments({});
    const workOrderId = `GT-WO-${String(count + 1).padStart(3, '0')}`;

    const record = await Maintenance.create({ ...body, workOrderId, status: 'scheduled' });
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create work order' }, { status: 500 });
  }
}
