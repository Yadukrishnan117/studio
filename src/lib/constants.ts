export const BRANCHES = [
  { id: 'main', name: 'Main Branch - Chennai', code: 'CHN-MAIN' },
  { id: 'annanagar', name: 'Anna Nagar Branch', code: 'CHN-AN' },
  { id: 'omr', name: 'OMR Branch', code: 'CHN-OMR' },
];

export const DEPARTMENTS = [
  'Sales', 'Service', 'Parts', 'Finance', 'HR', 'IT', 'Security', 'Front Office', 'Management'
];

export const ASSET_CATEGORIES = [
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'tool', label: 'Tool' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'it_asset', label: 'IT Asset' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

export const VEHICLE_MAKES = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Kia', 'MG Motor',
  'Mahindra', 'Skoda', 'Volkswagen', 'Jeep', 'Renault', 'Nissan', 'Ford',
];

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-gray-100 text-gray-800',
  under_maintenance: 'bg-amber-100 text-amber-800',
  disposed: 'bg-red-100 text-red-800',
  sold: 'bg-blue-100 text-blue-800',
  available: 'bg-green-100 text-green-800',
  reserved: 'bg-purple-100 text-purple-800',
  in_transit: 'bg-cyan-100 text-cyan-800',
  service: 'bg-orange-100 text-orange-800',
  demo: 'bg-indigo-100 text-indigo-800',
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  overdue: 'bg-red-100 text-red-800',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'technician', label: 'Technician' },
  { value: 'sales', label: 'Sales Executive' },
  { value: 'viewer', label: 'Viewer' },
];

export const NAVIGATION_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/dashboard/vehicles', label: 'Vehicles', icon: 'Car' },
  { href: '/dashboard/assets', label: 'Assets', icon: 'Package' },
  { href: '/dashboard/maintenance', label: 'Maintenance', icon: 'Wrench' },
  { href: '/dashboard/parts', label: 'Parts & Inventory', icon: 'Boxes' },
  { href: '/dashboard/customers', label: 'Customers', icon: 'Users' },
  { href: '/dashboard/vendors', label: 'Vendors', icon: 'Building2' },
  { href: '/dashboard/finance', label: 'Finance', icon: 'BarChart3' },
  { href: '/dashboard/reports', label: 'Reports', icon: 'FileText' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
];
