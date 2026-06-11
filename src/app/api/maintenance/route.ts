export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Maintenance } from '@/models/Maintenance';
import { requireAuth, isAuthError } from '@/lib/api-auth';
import { escapeRegex, safePagination, MaintenanceCreateSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit } = safePagination(searchParams.get('page'), searchParams.get('limit'));
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { assetName: { $regex: safe, $options: 'i' } },
        { workOrderId: { $regex: safe, $options: 'i' } },
      ];
    }

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
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();
    const body = await request.json();

    const parsed = MaintenanceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const count = await Maintenance.countDocuments({});
    const workOrderId = `GT-WO-${String(count + 1).padStart(3, '0')}`;

    const record = await Maintenance.create({ ...parsed.data, workOrderId, status: 'scheduled' });
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create work order' }, { status: 500 });
  }
}
