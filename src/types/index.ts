export type UserRole = 'super_admin' | 'admin' | 'manager' | 'technician' | 'sales' | 'viewer';

export type AssetStatus = 'active' | 'inactive' | 'under_maintenance' | 'disposed' | 'sold';
export type VehicleStatus = 'available' | 'sold' | 'reserved' | 'in_transit' | 'service' | 'demo';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type AssetCategory = 'vehicle' | 'equipment' | 'tool' | 'furniture' | 'it_asset' | 'real_estate' | 'other';
export type VehicleType = 'car' | 'suv' | 'truck' | 'van' | 'motorcycle' | 'commercial' | 'electric';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg';
export type TransmissionType = 'manual' | 'automatic' | 'amt' | 'cvt' | 'dct';
export type ConditionType = 'new' | 'excellent' | 'good' | 'fair' | 'poor';

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  alternatePhone?: string;
  whatsapp?: string;
}

export interface Asset {
  _id: string;
  assetId: string;
  name: string;
  category: AssetCategory;
  subCategory?: string;
  description?: string;
  status: AssetStatus;
  condition: ConditionType;
  location: string;
  branch: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  vendor?: string;
  warrantyExpiry?: string;
  insuranceExpiry?: string;
  nextMaintenanceDate?: string;
  assignedTo?: string;
  department?: string;
  serialNumber?: string;
  make?: string;
  model?: string;
  year?: number;
  tags?: string[];
  images?: string[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  _id: string;
  vehicleId: string;
  vin: string;
  registrationNumber?: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  type: VehicleType;
  fuelType: FuelType;
  transmission: TransmissionType;
  engineCC?: number;
  mileage?: number;
  status: VehicleStatus;
  condition: ConditionType;
  costPrice: number;
  sellingPrice: number;
  msrp?: number;
  location: string;
  branch: string;
  stockDate: string;
  soldDate?: string;
  customer?: string;
  salesperson?: string;
  features?: string[];
  images?: string[];
  documents?: string[];
  inspectionStatus?: string;
  pdiStatus?: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  _id: string;
  workOrderId: string;
  assetId?: string;
  vehicleId?: string;
  assetName: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'emergency';
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  description: string;
  scheduledDate: string;
  startDate?: string;
  completedDate?: string;
  estimatedDuration: number;
  actualDuration?: number;
  estimatedCost: number;
  actualCost?: number;
  assignedTechnician?: string;
  parts?: MaintenancePart[];
  notes?: string;
  mileageAtService?: number;
  nextServiceDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePart {
  partId: string;
  partName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Part {
  _id: string;
  partId: string;
  name: string;
  partNumber: string;
  category: string;
  description?: string;
  compatibleVehicles?: string[];
  vendor?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  location: string;
  branch: string;
  unit: string;
  barcode?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  _id: string;
  vendorId: string;
  name: string;
  type: 'parts_supplier' | 'service_provider' | 'equipment_supplier' | 'other';
  contactInfo: ContactInfo;
  address: Address;
  gstNumber?: string;
  panNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  paymentTerms?: string;
  rating?: number;
  isActive: boolean;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: Address;
  dateOfBirth?: string;
  anniversary?: string;
  occupation?: string;
  income?: string;
  referredBy?: string;
  loyaltyPoints?: number;
  vehicles?: string[];
  totalPurchases?: number;
  lastVisit?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KpiMetric {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface DashboardData {
  kpis: KpiMetric[];
  assetsByCategory: { category: string; count: number; value: number }[];
  maintenanceTrend: { month: string; completed: number; scheduled: number; cost: number }[];
  vehiclesByStatus: { status: string; count: number }[];
  recentActivities: Activity[];
  alerts: Alert[];
}

export interface Activity {
  id: string;
  type: 'asset_added' | 'maintenance_completed' | 'vehicle_sold' | 'part_ordered' | 'inspection_due' | 'vehicle_added';
  description: string;
  timestamp: string;
  user: string;
  entityId?: string;
  entityType?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  entityId?: string;
  entityType?: string;
}

export interface User {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  branch?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  _id: string;
  branchId: string;
  name: string;
  code: string;
  address: Address;
  contactInfo: ContactInfo;
  manager?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
