export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Asset } from '@/models/Asset';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const branch = searchParams.get('branch');
    const search = searchParams.get('search');

    const query: Record<string, any> = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (branch && branch !== 'all') query.branch = branch;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { assetId: { $regex: search, $options: 'i' } },
      { serialNumber: { $regex: search, $options: 'i' } },
    ];

    const total = await Asset.countDocuments(query);
    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: assets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const lastAsset = await Asset.findOne({}).sort({ createdAt: -1 }).lean();
    const lastNum = lastAsset
      ? parseInt((lastAsset as any).assetId.replace('GT-ASSET-', '')) + 1
      : 1;
    const assetId = `GT-ASSET-${String(lastNum).padStart(3, '0')}`;

    const asset = await Asset.create({ ...body, assetId });
    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create asset' }, { status: 500 });
  }
}
