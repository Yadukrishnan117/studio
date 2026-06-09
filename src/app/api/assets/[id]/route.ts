export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Asset } from '@/models/Asset';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const asset = await Asset.findById(params.id).lean();
    if (!asset) return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: asset });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch asset' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const asset = await Asset.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).lean();
    if (!asset) return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: asset });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update asset' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const asset = await Asset.findByIdAndDelete(params.id).lean();
    if (!asset) return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Asset deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete asset' }, { status: 500 });
  }
}

export function generateStaticParams() {
  return [{"id": "GT-ASSET-001"}, {"id": "GT-ASSET-002"}, {"id": "GT-ASSET-003"}, {"id": "GT-ASSET-004"}, {"id": "GT-ASSET-005"}, {"id": "GT-ASSET-006"}, {"id": "GT-ASSET-007"}, {"id": "GT-ASSET-008"}];
}
