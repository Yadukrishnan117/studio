'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Car, Package, Wrench, Boxes, Users, Building2,
  BarChart3, FileText, Settings, ChevronRight, Gauge, Bell, LogOut,
  UserCircle, MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car, badge: '86' },
  { href: '/dashboard/assets', label: 'Assets', icon: Package },
  { href: '/dashboard/maintenance', label: 'Maintenance', icon: Wrench, badge: '3', badgeVariant: 'destructive' as const },
  { href: '/dashboard/parts', label: 'Parts & Inventory', icon: Boxes },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/vendors', label: 'Vendors', icon: Building2 },
  { href: '/dashboard/finance', label: 'Finance', icon: BarChart3 },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

const bottomItems = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('gati_auth');
    router.push('/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className={cn('flex flex-col h-full sidebar-gradient text-white', className)}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-lg">
          <Gauge className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight text-white">Gati-Tech</h1>
          <p className="text-xs text-white/60 leading-tight">Asset Management</p>
        </div>
      </div>

      {/* Branch Indicator */}
      <div className="mx-4 mt-3 mb-1 px-3 py-2 rounded-lg bg-white/5 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
        <span className="text-xs text-white/70 truncate">Main Branch - Chennai</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/65 hover:bg-white/8 hover:text-white'
              )}
            >
              <Icon className={cn('flex-shrink-0 transition-colors', active ? 'text-orange-400' : 'group-hover:text-orange-300')} style={{width: '18px', height: '18px'}} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <Badge
                  variant={item.badgeVariant || 'secondary'}
                  className={cn(
                    'text-xs h-5 px-1.5',
                    item.badgeVariant === 'destructive'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-white/15 text-white/80 border-white/20'
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              {active && <ChevronRight className="w-3.5 h-3.5 text-white/40" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-3 space-y-0.5 border-t border-white/10 pt-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white'
              )}
            >
              <Icon style={{width: '18px', height: '18px'}} className="flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1 bg-white/5">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-white/50 truncate">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white transition-colors"
            title="Log out"
          >
            <LogOut style={{width: '15px', height: '15px'}} />
          </button>
        </div>
      </div>
    </aside>
  );
}
