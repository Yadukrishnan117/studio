'use client';

import { mockDashboardData, salesTrendData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, Car, Package, Wrench, TrendingUp, AlertTriangle,
  IndianRupee, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  AlertCircle, Info, ChevronRight, Activity
} from 'lucide-react';
import { format } from 'date-fns';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Package, Car, IndianRupee, Wrench, TrendingUp, AlertTriangle,
};

const KPI_BG: Record<string, string> = {
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-600',
  red: 'bg-red-500',
};

const ALERT_ICON: Record<string, React.ComponentType<any>> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const ALERT_COLORS: Record<string, string> = {
  error: 'text-red-600 bg-red-50 border-red-100',
  warning: 'text-amber-600 bg-amber-50 border-amber-100',
  info: 'text-blue-600 bg-blue-50 border-blue-100',
  success: 'text-emerald-600 bg-emerald-50 border-emerald-100',
};

const PIE_COLORS = ['#1a3c5e', '#e8821a', '#10b981', '#f59e0b', '#8b5cf6'];

const ACTIVITY_ICONS: Record<string, React.ComponentType<any>> = {
  vehicle_sold: TrendingUp,
  maintenance_completed: Wrench,
  vehicle_added: Car,
  part_ordered: Package,
  asset_added: Package,
  inspection_due: AlertTriangle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  vehicle_sold: 'bg-emerald-100 text-emerald-700',
  maintenance_completed: 'bg-blue-100 text-blue-700',
  vehicle_added: 'bg-orange-100 text-orange-700',
  part_ordered: 'bg-purple-100 text-purple-700',
  asset_added: 'bg-teal-100 text-teal-700',
  inspection_due: 'bg-amber-100 text-amber-700',
};

export default function DashboardPage() {
  const { kpis, assetsByCategory, maintenanceTrend, vehiclesByStatus, recentActivities, alerts } = mockDashboardData;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = ICON_MAP[kpi.icon] || Package;
          const isUp = kpi.trend === 'up';
          const isNeutral = kpi.trend === 'neutral';
          return (
            <Card key={kpi.label} className="gati-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${KPI_BG[kpi.color]} flex items-center justify-center`}>
                    <Icon className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} />
                  </div>
                  {!isNeutral && (
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {Math.abs(kpi.change)}%
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
                <div className="text-xs text-muted-foreground/70 mt-0.5">{kpi.changeLabel}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts Row */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Active Alerts ({alerts.filter(a => !a.isRead).length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {alerts.filter(a => !a.isRead).map((alert) => {
              const Icon = ALERT_ICON[alert.type];
              return (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${ALERT_COLORS[alert.type]}`}>
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-xs opacity-80 mt-0.5 line-clamp-2">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vehicle Sales Trend</CardTitle>
            <CardDescription>Monthly sales units vs target (2024)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3c5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a3c5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8821a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#e8821a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${(Number(value)/100000).toFixed(1)}L` : value,
                    name === 'units' ? 'Units Sold' : name === 'target' ? 'Target' : name
                  ]}
                />
                <Area type="monotone" dataKey="units" stroke="#1a3c5e" fill="url(#salesGrad)" strokeWidth={2} name="units" />
                <Area type="monotone" dataKey="target" stroke="#e8821a" fill="url(#targetGrad)" strokeWidth={2} strokeDasharray="5 5" name="target" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Trend */}
        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Maintenance Overview</CardTitle>
            <CardDescription>Completed vs scheduled work orders (2024)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={maintenanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[3,3,0,0]} />
                <Bar dataKey="scheduled" name="Scheduled" fill="#1a3c5e" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Distribution Pie */}
        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Assets by Category</CardTitle>
            <CardDescription>Distribution across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assetsByCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                >
                  {assetsByCategory.map((entry, index) => (
                    <Cell key={entry.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} assets`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {assetsByCategory.map((cat, i) => (
                <div key={cat.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-muted-foreground">{cat.category}</span>
                  </div>
                  <span className="font-medium">{cat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Status */}
        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vehicle Status</CardTitle>
            <CardDescription>Current inventory breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehiclesByStatus.map((item) => {
                const pct = Math.round((item.count / vehiclesByStatus.reduce((s, v) => s + v.count, 0)) * 100);
                const colors: Record<string, string> = {
                  Available: 'bg-emerald-500',
                  Reserved: 'bg-purple-500',
                  'In Transit': 'bg-cyan-500',
                  Service: 'bg-orange-500',
                  Demo: 'bg-indigo-500',
                  'Sold (MTD)': 'bg-blue-500',
                };
                return (
                  <div key={item.status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{item.status}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[item.status] || 'bg-primary'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t text-center">
              <p className="text-2xl font-bold text-foreground">
                {vehiclesByStatus.reduce((s, v) => s + v.count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Vehicles</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.type] || Package;
                const colorClass = ACTIVITY_COLORS[activity.type] || 'bg-gray-100 text-gray-700';
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon style={{width:'13px',height:'13px'}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug line-clamp-2">{activity.description}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock style={{width:'10px',height:'10px'}} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                        </span>
                        <span className="text-xs text-muted-foreground">· {activity.user}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground">
              View all activity <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Asset Value', value: '₹18.4 Cr', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Maintenance Cost YTD', value: '₹11.3 L', icon: Wrench, color: 'text-orange-600 bg-orange-50' },
          { label: 'Vehicle Sales Revenue', value: '₹21.9 Cr', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
          { label: 'Parts & Service Revenue', value: '₹1.3 Cr', icon: Package, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="gati-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon style={{width:'18px',height:'18px'}} />
              </div>
              <div>
                <p className="text-base font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
