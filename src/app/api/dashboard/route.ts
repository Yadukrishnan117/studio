export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Asset } from '@/models/Asset';
import { Vehicle } from '@/models/Vehicle';
import { Maintenance } from '@/models/Maintenance';

export async function GET() {
  try {
    await connectDB();

    const [
      totalAssets,
      totalVehicles,
      activeWorkOrders,
      overdueWorkOrders,
      assetsByCategory,
      vehiclesByStatus,
    ] = await Promise.all([
      Asset.countDocuments({ status: { $ne: 'disposed' } }),
      Vehicle.countDocuments({}),
      Maintenance.countDocuments({ status: { $in: ['scheduled', 'in_progress'] } }),
      Maintenance.countDocuments({ status: 'overdue' }),
      Asset.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, value: { $sum: '$currentValue' } } },
        { $project: { category: '$_id', count: 1, value: 1, _id: 0 } },
      ]),
      Vehicle.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAssets,
        totalVehicles,
        activeWorkOrders,
        overdueWorkOrders,
        assetsByCategory,
        vehiclesByStatus,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
