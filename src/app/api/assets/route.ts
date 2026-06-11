export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Asset } from '@/models/Asset';
import { requireAuth, isAuthError } from '@/lib/api-auth';
import { escapeRegex, safePagination, AssetCreateSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit } = safePagination(searchParams.get('page'), searchParams.get('limit')); // V-004
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const branch = searchParams.get('branch');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (branch && branch !== 'all') query.branch = branch;
    if (search) {
      const safe = escapeRegex(search); // V-003
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { assetId: { $regex: safe, $options: 'i' } },
        { serialNumber: { $regex: safe, $options: 'i' } },
      ];
    }

    const total = await Asset.countDocuments(query);
    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: assets, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();
    const body = await request.json();

    // V-005: allowlist + validate fields with Zod
    const parsed = AssetCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const lastAsset = await Asset.findOne({}).sort({ createdAt: -1 }).lean();
    const lastNum = lastAsset ? parseInt((lastAsset as { assetId: string }).assetId.replace('GT-ASSET-', '')) + 1 : 1;
    const assetId = `GT-ASSET-${String(lastNum).padStart(3, '0')}`;

    const asset = await Asset.create({ ...parsed.data, assetId }); // only validated fields
    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create asset' }, { status: 500 });
  }
}
