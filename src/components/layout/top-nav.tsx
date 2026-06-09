'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
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

interface TopNavProps {
  onMobileMenuToggle?: () => void;
}

export function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const unreadAlerts = mockDashboardData.alerts.filter(a => !a.isRead).length;
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
              <Badge variant="secondary">{unreadAlerts} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockDashboardData.alerts.slice(0, 4).map((alert) => (
              <DropdownMenuItem key={alert.id} className="flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-amber-500' :
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-sm font-medium flex-1">{alert.title}</span>
                  {!alert.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
                <p className="text-xs text-muted-foreground ml-4 line-clamp-2">{alert.message}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary justify-center">
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
            <DropdownMenuItem>Add Vehicle</DropdownMenuItem>
            <DropdownMenuItem>Add Asset</DropdownMenuItem>
            <DropdownMenuItem>New Work Order</DropdownMenuItem>
            <DropdownMenuItem>Add Customer</DropdownMenuItem>
            <DropdownMenuItem>Add Part</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
