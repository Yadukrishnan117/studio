import { z } from 'zod';

// Escape regex metacharacters to prevent ReDoS (V-003)
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Cap pagination params (V-004)
export function safePagination(pageStr: string | null, limitStr: string | null) {
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(limitStr || '20', 10) || 20));
  return { page, limit };
}

// ── Asset schemas (V-005 allowlist) ──────────────────────────────────────────
export const AssetCreateSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(['vehicle', 'equipment', 'tool', 'furniture', 'it_asset', 'real_estate', 'other']),
  status: z.enum(['active', 'inactive', 'under_maintenance', 'disposed', 'sold']).optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  location: z.string().max(200).optional(),
  branch: z.string().max(200).optional(),
  department: z.string().max(200).optional(),
  serialNumber: z.string().max(100).optional(),
  make: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  purchaseDate: z.string().datetime().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  currentValue: z.number().nonnegative().optional(),
  depreciationRate: z.number().min(0).max(100).optional(),
  warrantyExpiry: z.string().datetime().optional(),
  insuranceExpiry: z.string().datetime().optional(),
  nextMaintenanceDate: z.string().datetime().optional(),
  vendor: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

// ── Vehicle schemas ───────────────────────────────────────────────────────────
export const VehicleCreateSchema = z.object({
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  variant: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'cng']).optional(),
  transmission: z.enum(['manual', 'automatic']).optional(),
  vin: z.string().max(17).optional(),
  registrationNumber: z.string().max(20).optional(),
  engineNumber: z.string().max(50).optional(),
  status: z.enum(['available', 'sold', 'reserved', 'in_transit', 'demo']).optional(),
  branch: z.string().max(200).optional(),
  purchasePrice: z.number().nonnegative().optional(),
  sellingPrice: z.number().nonnegative().optional(),
  mileage: z.number().nonnegative().optional(),
  description: z.string().max(1000).optional(),
});

// ── Maintenance schemas ───────────────────────────────────────────────────────
export const MaintenanceCreateSchema = z.object({
  assetId: z.string().min(1).max(50),
  assetName: z.string().min(1).max(200),
  assetType: z.enum(['vehicle', 'equipment', 'other']).optional(),
  maintenanceType: z.enum(['routine', 'repair', 'inspection', 'emergency']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  scheduledDate: z.string().datetime().optional(),
  description: z.string().max(1000).optional(),
  assignedTo: z.string().max(200).optional(),
  estimatedCost: z.number().nonnegative().optional(),
  parts: z.array(z.object({
    name: z.string().max(100),
    quantity: z.number().int().positive(),
    cost: z.number().nonnegative(),
  })).max(50).optional(),
});

export type AssetCreate = z.infer<typeof AssetCreateSchema>;
export type VehicleCreate = z.infer<typeof VehicleCreateSchema>;
export type MaintenanceCreate = z.infer<typeof MaintenanceCreateSchema>;
