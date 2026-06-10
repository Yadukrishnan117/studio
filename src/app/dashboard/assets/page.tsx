'use client';

import { useState } from 'react';
import { mockAssets as initialAssets } from '@/lib/mock-data';
import { Asset } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Package, Search, Plus, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle, Wrench, IndianRupee, TrendingDown, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  under_maintenance: { label: 'Under Maintenance', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  disposed: { label: 'Disposed', className: 'bg-red-100 text-red-800 border-red-200' },
  sold: { label: 'Sold', className: 'bg-blue-100 text-blue-800 border-blue-200' },
};

const CATEGORY_ICONS: Record<string, string> = {
  vehicle: '🚗',
  equipment: '⚙️',
  tool: '🔧',
  furniture: '🪑',
  it_asset: '💻',
  real_estate: '🏢',
  other: '📦',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewAsset, setViewAsset] = useState<Asset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', serialNumber: '', make: '', model: '', purchasePrice: '', currentValue: '', category: '', branch: '' });

  const handleAddAsset = () => {
    if (!addForm.name || !addForm.category || !addForm.branch) return;
    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      assetId: `GT-ASSET-${String(assets.length + 1).padStart(3, '0')}`,
      name: addForm.name,
      category: addForm.category as Asset['category'],
      status: 'active',
      condition: 'good',
      location: addForm.branch,
      branch: addForm.branch,
      purchaseDate: new Date().toISOString(),
      purchasePrice: Number(addForm.purchasePrice) || 0,
      currentValue: Number(addForm.currentValue) || 0,
      depreciationRate: 10,
      serialNumber: addForm.serialNumber,
      make: addForm.make,
      model: addForm.model,
      tags: [],
    } as unknown as Asset;
    setAssets(prev => [newAsset, ...prev]);
    setAddForm({ name: '', serialNumber: '', make: '', model: '', purchasePrice: '', currentValue: '', category: '', branch: '' });
    setShowAddModal(false);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  const filtered = assets.filter(a => {
    const matchesSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.assetId.toLowerCase().includes(search.toLowerCase()) ||
      (a.serialNumber?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalValue = filtered.reduce((s, a) => s + a.currentValue, 0);
  const totalCost = filtered.reduce((s, a) => s + a.purchasePrice, 0);
  const depreciation = totalCost - totalValue;

  const statusCounts = mockAssets.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const isWarrantyExpiringSoon = (date?: string) => {
    if (!date) return false;
    const days = differenceInDays(new Date(date), new Date());
    return days >= 0 && days <= 30;
  };

  const isInsuranceExpiringSoon = (date?: string) => {
    if (!date) return false;
    const days = differenceInDays(new Date(date), new Date());
    return days >= 0 && days <= 60;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockAssets.length}</p>
              <p className="text-xs text-muted-foreground">Total Assets</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground">Current Value</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">₹{(depreciation / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground">Total Depreciation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statusCounts['under_maintenance'] || 0}</p>
              <p className="text-xs text-muted-foreground">Under Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="gati-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search assets by name, ID, serial number..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_ICONS).map(([v, icon]) => (
                  <SelectItem key={v} value={v}>{icon} {v.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" /> Add Asset
            </Button>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t text-sm text-muted-foreground">
            <span>Showing <span className="font-medium text-foreground">{filtered.length}</span> assets</span>
            <span>Value: <span className="font-semibold text-foreground">₹{(totalValue / 100000).toFixed(1)}L</span></span>
          </div>
        </CardContent>
      </Card>

      {/* Asset Table */}
      <Card className="gati-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs font-semibold">Asset ID</TableHead>
                <TableHead className="text-xs font-semibold">Name</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Location</TableHead>
                <TableHead className="text-xs font-semibold">Purchase Value</TableHead>
                <TableHead className="text-xs font-semibold">Current Value</TableHead>
                <TableHead className="text-xs font-semibold">Depreciation</TableHead>
                <TableHead className="text-xs font-semibold">Warranty</TableHead>
                <TableHead className="text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(asset => {
                const statusCfg = STATUS_CONFIG[asset.status];
                const depPct = Math.round(((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100);
                const warrantySoon = isWarrantyExpiringSoon(asset.warrantyExpiry);
                return (
                  <TableRow key={asset._id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setViewAsset(asset)}>
                    <TableCell className="text-xs font-mono font-medium text-primary">{asset.assetId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{CATEGORY_ICONS[asset.category]}</span>
                        <div>
                          <p className="text-sm font-semibold">{asset.name}</p>
                          {asset.make && <p className="text-xs text-muted-foreground">{asset.make} {asset.model}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs capitalize">{asset.category.replace('_', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${statusCfg.className}`}>{statusCfg.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs font-medium">{asset.location}</p>
                        <p className="text-xs text-muted-foreground">{asset.branch.split(' - ')[1] || asset.branch}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">₹{(asset.purchasePrice / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="text-sm font-medium">₹{(asset.currentValue / 1000).toFixed(0)}K</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-muted-foreground">{depPct}%</span>
                        </div>
                        <Progress value={depPct} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {asset.warrantyExpiry ? (
                        <div className={`text-xs flex items-center gap-1 ${warrantySoon ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
                          {warrantySoon && <AlertTriangle className="w-3.5 h-3.5" />}
                          {format(new Date(asset.warrantyExpiry), 'dd/MM/yy')}
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewAsset(asset)}><Eye className="w-3.5 h-3.5 mr-2" />View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setViewAsset(asset); }}><Edit className="w-3.5 h-3.5 mr-2" />Edit Asset</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.location.href = '/dashboard/maintenance'}><Wrench className="w-3.5 h-3.5 mr-2" />Create Work Order</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAsset(asset.id)}><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Asset Detail Modal */}
      <Dialog open={!!viewAsset} onOpenChange={() => setViewAsset(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{CATEGORY_ICONS[viewAsset.category]}</span>
                  <div>
                    <div>{viewAsset.name}</div>
                    <div className="text-sm font-normal text-muted-foreground">{viewAsset.assetId}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Category', value: viewAsset.category.replace('_',' ') },
                  { label: 'Status', value: STATUS_CONFIG[viewAsset.status]?.label },
                  { label: 'Condition', value: viewAsset.condition },
                  { label: 'Location', value: viewAsset.location },
                  { label: 'Branch', value: viewAsset.branch },
                  { label: 'Department', value: viewAsset.department || '—' },
                  { label: 'Serial Number', value: viewAsset.serialNumber || '—' },
                  { label: 'Make / Model', value: viewAsset.make ? `${viewAsset.make} ${viewAsset.model}` : '—' },
                  { label: 'Purchase Date', value: format(new Date(viewAsset.purchaseDate),'dd/MM/yyyy') },
                  { label: 'Purchase Price', value: `₹${(viewAsset.purchasePrice/1000).toFixed(0)}K` },
                  { label: 'Current Value', value: `₹${(viewAsset.currentValue/1000).toFixed(0)}K` },
                  { label: 'Depreciation Rate', value: `${viewAsset.depreciationRate}% p.a.` },
                  { label: 'Warranty Expiry', value: viewAsset.warrantyExpiry ? format(new Date(viewAsset.warrantyExpiry),'dd/MM/yyyy') : '—' },
                  { label: 'Insurance Expiry', value: viewAsset.insuranceExpiry ? format(new Date(viewAsset.insuranceExpiry),'dd/MM/yyyy') : '—' },
                  { label: 'Next Maintenance', value: viewAsset.nextMaintenanceDate ? format(new Date(viewAsset.nextMaintenanceDate),'dd/MM/yyyy') : '—' },
                  { label: 'Vendor', value: viewAsset.vendor || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium mt-0.5 capitalize">{value}</p>
                  </div>
                ))}
              </div>
              {viewAsset.description && (
                <div className="mt-3 bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm mt-0.5">{viewAsset.description}</p>
                </div>
              )}
              {viewAsset.tags && viewAsset.tags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1.5">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewAsset.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(true); setViewAsset(null); }}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setViewAsset(null); window.location.href = '/dashboard/maintenance'; }}><Wrench className="w-4 h-4 mr-2" />Work Order</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Asset Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>Register a new asset in the system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {([
              { id:'name', label:'Asset Name *', placeholder:'e.g. Hydraulic Lift Bay 2' },
              { id:'serialNumber', label:'Serial Number', placeholder:'SN-XXXX-XXXX' },
              { id:'make', label:'Make', placeholder:'e.g. BendPak' },
              { id:'model', label:'Model', placeholder:'e.g. HD-9XW' },
              { id:'purchasePrice', label:'Purchase Price (₹) *', placeholder:'250000' },
              { id:'currentValue', label:'Current Value (₹) *', placeholder:'220000' },
            ] as { id: keyof typeof addForm; label: string; placeholder: string }[]).map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs">{label}</Label>
                <Input
                  id={id}
                  placeholder={placeholder}
                  className="h-9"
                  value={addForm[id]}
                  onChange={e => setAddForm(f => ({ ...f, [id]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Category *</Label>
              <Select value={addForm.category} onValueChange={v => setAddForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_ICONS).map(([v, icon]) => (
                    <SelectItem key={v} value={v}>{icon} {v.replace('_',' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Branch *</Label>
              <Select value={addForm.branch} onValueChange={v => setAddForm(f => ({ ...f, branch: v }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select branch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Branch - Chennai">Main Branch - Chennai</SelectItem>
                  <SelectItem value="Anna Nagar Branch">Anna Nagar Branch</SelectItem>
                  <SelectItem value="OMR Branch">OMR Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-white" onClick={handleAddAsset}>Add Asset</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
