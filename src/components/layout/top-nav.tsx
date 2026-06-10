'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, Menu, Plus, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { mockDashboardData } from '@/lib/mock-data';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your assets and operations' },
  '/dashboard/vehicles': { title: 'Vehicle Inventory', subtitle: 'Manage vehicle stock across all branches' },
  '/dashboard/assets': { title: 'Asset Register', subtitle: 'Track all dealership assets' },
  '/dashboard/maintenance': { title: 'Maintenance', subtitle: 'Work orders and service schedules' },
  '/dashboard/parts': { title: 'Parts & Inventory', subtitle: 'Spare parts and consumables management' },
  '/dashboard/customers': { title: 'Customers', subtitle: 'Customer profiles and purchase history' },
  '/dashboard/vendors': { title: 'Vendors', subtitle: 'Supplier and vendor management' },
  '/dashboard/finance': { title: 'Finance & Analytics', subtitle: 'Asset valuation, depreciation, and financials' },
  '/dashboard/reports': { title: 'Reports', subtitle: 'Generate and export reports' },
  '/dashboard/settings': { title: 'Settings', subtitle: 'System configuration and preferences' },
};

const STORAGE_KEY = 'gati_read_notifications';

interface TopNavProps {
  onMobileMenuToggle?: () => void;
}

export function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReadIds(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const markAsRead = (id: string) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const markAllRead = () => {
    const allIds = mockDashboardData.alerts.map(a => a.id);
    setReadIds(new Set(allIds));
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds)); } catch {}
  };

  const unreadAlerts = mockDashboardData.alerts.filter(a => !readIds.has(a.id) && !a.isRead).length;
  const pageInfo = PAGE_TITLES[pathname] || { title: 'Gati-Tech AMS', subtitle: '' };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center gap-4 px-6 flex-shrink-0">
      {/* Mobile Menu */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenuToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-foreground truncate">{pageInfo.title}</h2>
        <p className="text-xs text-muted-foreground hidden sm:block">{pageInfo.subtitle}</p>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search assets, vehicles..."
          className="pl-9 w-56 h-9 text-sm bg-muted/40 border-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-0">
                  {unreadAlerts}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{unreadAlerts} new</Badge>
                {unreadAlerts > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockDashboardData.alerts.slice(0, 4).map((alert) => {
              const isRead = readIds.has(alert.id) || alert.isRead;
              return (
                <DropdownMenuItem
                  key={alert.id}
                  className="flex-col items-start gap-1 py-3 cursor-pointer"
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      alert.type === 'error' ? 'bg-red-500' :
                      alert.type === 'warning' ? 'bg-amber-500' :
                      alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className={`text-sm flex-1 ${isRead ? 'font-normal text-muted-foreground' : 'font-medium'}`}>
                      {alert.title}
                    </span>
                    {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground ml-4 line-clamp-2">{alert.message}</p>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center text-sm text-primary justify-center"
              onClick={() => router.push('/dashboard')}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white hidden sm:flex gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Quick Add</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/vehicles')}>Add Vehicle</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/assets')}>Add Asset</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/maintenance')}>New Work Order</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/customers')}>Add Customer</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/parts')}>Add Part</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
