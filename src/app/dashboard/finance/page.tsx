'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockDashboardData, salesTrendData, mockVehicles, mockAssets } from '@/lib/mock-data';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown, Package, Car, Wrench, Download, BarChart3 } from 'lucide-react';

const depreciationData = [
  { year: '2020', value: 9500000 },
  { year: '2021', value: 11200000 },
  { year: '2022', value: 13800000 },
  { year: '2023', value: 16500000 },
  { year: '2024', value: 18400000 },
];

const revenueBreakdown = [
  { name: 'Vehicle Sales', value: 219000000, color: '#1a3c5e' },
  { name: 'Service Revenue', value: 8200000, color: '#e8821a' },
  { name: 'Parts Revenue', value: 4850000, color: '#10b981' },
  { name: 'Finance Income', value: 3200000, color: '#f59e0b' },
];

const monthlyRevenue = salesTrendData.map(d => ({
  month: d.month,
  sales: d.revenue,
  service: Math.round(d.revenue * 0.037),
  parts: Math.round(d.revenue * 0.022),
}));

const costData = [
  { category: 'Vehicle Procurement', amount: 175000000, pct: 72 },
  { category: 'Staff Salaries', amount: 28000000, pct: 12 },
  { category: 'Maintenance Costs', amount: 2800000, pct: 1.2 },
  { category: 'Facility & Utilities', amount: 8500000, pct: 3.5 },
  { category: 'Marketing', amount: 5500000, pct: 2.3 },
  { category: 'Admin & Others', amount: 7200000, pct: 3 },
];

export default function FinancePage() {
  const totalAssetValue = mockAssets.reduce((s, a) => s + a.currentValue, 0);
  const totalVehicleValue = mockVehicles.filter(v => v.status !== 'sold').reduce((s, v) => s + v.sellingPrice, 0);
  const totalDepreciation = mockAssets.reduce((s, a) => s + (a.purchasePrice - a.currentValue), 0);

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Asset Value', value: '₹18.4 Cr', sub: 'All registered assets', icon: Package, color: 'bg-blue-500', trend: '+5.2%', up: true },
          { label: 'Vehicle Inventory Value', value: `₹${(totalVehicleValue / 10000000).toFixed(1)} Cr`, sub: 'Unsold vehicles', icon: Car, color: 'bg-orange-500', trend: '-3.1%', up: false },
          { label: 'Annual Revenue (YTD)', value: '₹23.5 Cr', sub: 'All revenue streams', icon: TrendingUp, color: 'bg-emerald-500', trend: '+18.4%', up: true },
          { label: 'Total Depreciation', value: `₹${(totalDepreciation / 100000).toFixed(1)}L`, sub: 'Cumulative', icon: TrendingDown, color: 'bg-red-500', trend: 'YTD', up: false },
        ].map(({ label, value, sub, icon: Icon, color, trend, up }) => (
          <Card key={label} className="gati-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
                  <Icon className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trend}
                </span>
              </div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xs text-muted-foreground/70">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Revenue Breakdown</CardTitle>
            <CardDescription>Sales, service & parts revenue (2024)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => `₹${(Number(v)/100000).toFixed(1)}L`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="sales" name="Vehicle Sales" stackId="a" fill="#1a3c5e" radius={[0,0,0,0]} />
                <Bar dataKey="service" name="Service" stackId="a" fill="#e8821a" />
                <Bar dataKey="parts" name="Parts" stackId="a" fill="#10b981" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asset Value Trend</CardTitle>
            <CardDescription>Total registered asset value (2020–2024)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={depreciationData}>
                <defs>
                  <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3c5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a3c5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} />
                <Tooltip formatter={v => `₹${(Number(v)/10000000).toFixed(2)} Cr`} />
                <Area type="monotone" dataKey="value" name="Asset Value" stroke="#1a3c5e" fill="url(#valueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown + Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Sources</CardTitle>
            <CardDescription>YTD revenue by stream</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={revenueBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {revenueBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `₹${(Number(v)/10000000).toFixed(2)}Cr`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {revenueBreakdown.map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">₹{(item.value/10000000).toFixed(2)}Cr</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(item.value/235250000)*100}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gati-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cost Analysis</CardTitle>
            <CardDescription>YTD operational cost breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {costData.map(cost => (
                <div key={cost.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{cost.category}</span>
                    <span className="font-medium">₹{(cost.amount/10000000).toFixed(2)}Cr ({cost.pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${cost.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between">
              <span className="text-sm font-semibold">Total Costs (YTD)</span>
              <span className="text-sm font-bold text-primary">₹22.7 Cr</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Depreciation Schedule */}
      <Card className="gati-card">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Asset Depreciation Schedule</CardTitle>
            <CardDescription>Current value vs purchase price for top assets</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">Asset</th>
                  <th className="text-right py-2 font-medium">Purchase Price</th>
                  <th className="text-right py-2 font-medium">Current Value</th>
                  <th className="text-right py-2 font-medium">Depreciation</th>
                  <th className="text-right py-2 font-medium">Rate</th>
                </tr>
              </thead>
              <tbody>
                {mockAssets.slice(0, 6).map(asset => {
                  const dep = asset.purchasePrice - asset.currentValue;
                  const depPct = Math.round((dep / asset.purchasePrice) * 100);
                  return (
                    <tr key={asset._id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="py-2.5">
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.assetId}</p>
                      </td>
                      <td className="text-right py-2.5">₹{(asset.purchasePrice/1000).toFixed(0)}K</td>
                      <td className="text-right py-2.5 font-medium">₹{(asset.currentValue/1000).toFixed(0)}K</td>
                      <td className="text-right py-2.5 text-red-600">-₹{(dep/1000).toFixed(0)}K ({depPct}%)</td>
                      <td className="text-right py-2.5 text-muted-foreground">{asset.depreciationRate}%/yr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
