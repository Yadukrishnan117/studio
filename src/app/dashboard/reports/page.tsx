'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, BarChart2, Car, Package, Wrench, Users, Building2, IndianRupee, Calendar, Clock, CheckCircle2, Loader2 } from 'lucide-react';

const REPORT_TYPES = [
  {
    id: 'asset_register',
    title: 'Asset Register Report',
    description: 'Complete list of all registered assets with current values, depreciation, and status',
    icon: Package,
    color: 'bg-blue-500',
    category: 'Assets',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-06-08',
  },
  {
    id: 'vehicle_inventory',
    title: 'Vehicle Inventory Report',
    description: 'Full vehicle stock report with pricing, status, branch allocation, and PDI status',
    icon: Car,
    color: 'bg-orange-500',
    category: 'Vehicles',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-06-09',
  },
  {
    id: 'maintenance_summary',
    title: 'Maintenance Summary',
    description: 'Work orders summary including completed, pending, overdue and cost analysis',
    icon: Wrench,
    color: 'bg-amber-500',
    category: 'Maintenance',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-06-07',
  },
  {
    id: 'depreciation_schedule',
    title: 'Depreciation Schedule',
    description: 'Asset-wise depreciation calculation and projected future values',
    icon: IndianRupee,
    color: 'bg-red-500',
    category: 'Finance',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-06-01',
  },
  {
    id: 'sales_performance',
    title: 'Sales Performance Report',
    description: 'Monthly vehicle sales, revenue, margins, and target achievement analysis',
    icon: BarChart2,
    color: 'bg-emerald-500',
    category: 'Finance',
    format: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2024-06-08',
  },
  {
    id: 'customer_analysis',
    title: 'Customer Analysis Report',
    description: 'Customer segmentation, purchase history, loyalty points, and retention metrics',
    icon: Users,
    color: 'bg-purple-500',
    category: 'Customers',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-06-05',
  },
  {
    id: 'vendor_performance',
    title: 'Vendor Performance Report',
    description: 'Vendor ratings, purchase orders, delivery performance, and cost analysis',
    icon: Building2,
    color: 'bg-indigo-500',
    category: 'Vendors',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-05-31',
  },
  {
    id: 'parts_inventory',
    title: 'Parts Inventory Report',
    description: 'Spare parts stock levels, low-stock alerts, reorder requirements, and valuation',
    icon: Package,
    color: 'bg-teal-500',
    category: 'Parts',
    format: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2024-06-06',
  },
  {
    id: 'warranty_expiry',
    title: 'Warranty & Insurance Expiry',
    description: 'Assets and vehicles with upcoming warranty and insurance expiry dates',
    icon: Calendar,
    color: 'bg-pink-500',
    category: 'Compliance',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-06-01',
  },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-06-09');
  const [branch, setBranch] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleGenerate = async (reportId: string) => {
    setGenerating(reportId);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(null);
  };

  const categories = [...new Set(REPORT_TYPES.map(r => r.category))];
  const filtered = categoryFilter === 'all' ? REPORT_TYPES : REPORT_TYPES.filter(r => r.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Reports Available', value: REPORT_TYPES.length, icon: FileText, color: 'bg-blue-500' },
          { label: 'Generated This Month', value: 18, icon: CheckCircle2, color: 'bg-emerald-500' },
          { label: 'Scheduled Reports', value: 4, icon: Clock, color: 'bg-orange-500' },
          { label: 'Data Categories', value: categories.length, icon: BarChart2, color: 'bg-purple-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="gati-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="gati-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Report Parameters</CardTitle>
          <CardDescription>Set date range and filters for report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Date From</Label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date To</Label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All Branches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="main">Main Branch - Chennai</SelectItem>
                  <SelectItem value="annanagar">Anna Nagar Branch</SelectItem>
                  <SelectItem value="omr">OMR Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(report => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          return (
            <Card key={report.id} className="gati-card hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${report.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{report.title}</h3>
                    <Badge variant="secondary" className="text-xs mt-0.5">{report.category}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{report.description}</p>
                <div className="flex items-center gap-1 mb-3">
                  {report.format.map(fmt => (
                    <Badge key={fmt} variant="outline" className="text-xs">{fmt}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Last: {report.lastGenerated}</span>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-primary text-white h-8 text-xs"
                    disabled={isGenerating}
                    onClick={() => handleGenerate(report.id)}
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> Generate</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
