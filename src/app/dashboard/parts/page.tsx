'use client';

import { useState } from 'react';
import { mockParts as initialParts } from '@/lib/mock-data';
import { Part } from '@/types';
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
import { Boxes, Plus, Search, MoreHorizontal, Eye, Edit, AlertTriangle, PackagePlus, ShoppingCart } from 'lucide-react';

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewPart, setViewPart] = useState<Part | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', partNumber: '', category: '', vendor: '', costPrice: '', unitPrice: '', stockQuantity: '', minStockLevel: '' });

  const handleAddPart = () => {
    if (!addForm.name || !addForm.partNumber || !addForm.category) return;
    const stockQuantity = Number(addForm.stockQuantity) || 0;
    const minStockLevel = Number(addForm.minStockLevel) || 0;
    const newPart: Part = {
      _id: `part-${Date.now()}`,
      partId: `GT-PART-${String(parts.length + 1).padStart(3, '0')}`,
      name: addForm.name,
      partNumber: addForm.partNumber,
      category: addForm.category,
      vendor: addForm.vendor || undefined,
      costPrice: Number(addForm.costPrice) || 0,
      unitPrice: Number(addForm.unitPrice) || 0,
      stockQuantity,
      minStockLevel,
      maxStockLevel: Math.max(stockQuantity, minStockLevel * 4, 10),
      reorderPoint: Math.max(minStockLevel, 1),
      location: 'Main Store',
      branch: 'Main Branch - Chennai',
      unit: 'pcs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setParts(prev => [newPart, ...prev]);
    setAddForm({ name: '', partNumber: '', category: '', vendor: '', costPrice: '', unitPrice: '', stockQuantity: '', minStockLevel: '' });
    setShowAddModal(false);
  };

  const handleAddStock = (part: Part) => {
    const input = prompt(`Add stock for ${part.name}. Enter quantity (${part.unit}):`, '10');
    if (input === null) return;
    const qty = parseInt(input, 10);
    if (isNaN(qty) || qty <= 0) return;
    setParts(prev => prev.map(p => p._id === part._id ? { ...p, stockQuantity: p.stockQuantity + qty, updatedAt: new Date().toISOString() } : p));
    setViewPart(v => v && v._id === part._id ? { ...v, stockQuantity: v.stockQuantity + qty } : v);
  };

  const handleReorder = (part: Part) => {
    if (confirm(`Reorder ${part.name}? Stock will be replenished from ${part.stockQuantity} to ${part.maxStockLevel} ${part.unit}.`)) {
      setParts(prev => prev.map(p => p._id === part._id ? { ...p, stockQuantity: Math.max(p.stockQuantity, p.maxStockLevel), updatedAt: new Date().toISOString() } : p));
      setViewPart(v => v && v._id === part._id ? { ...v, stockQuantity: Math.max(v.stockQuantity, v.maxStockLevel) } : v);
    }
  };

  const categories = [...new Set(parts.map(p => p.category))];

  const filtered = parts.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.partId.toLowerCase().includes(search.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && p.stockQuantity <= p.minStockLevel) ||
      (stockFilter === 'ok' && p.stockQuantity > p.minStockLevel);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = parts.filter(p => p.stockQuantity <= p.minStockLevel).length;
  const totalValue = parts.reduce((s, p) => s + (p.costPrice * p.stockQuantity), 0);
  const totalRetailValue = parts.reduce((s, p) => s + (p.unitPrice * p.stockQuantity), 0);

  const getStockStatus = (part: Part) => {
    if (part.stockQuantity <= part.minStockLevel) return { label: 'Low Stock', className: 'bg-red-100 text-red-800 border-red-200' };
    if (part.stockQuantity >= part.maxStockLevel * 0.8) return { label: 'Well Stocked', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    return { label: 'In Stock', className: 'bg-blue-100 text-blue-800 border-blue-200' };
  };

  const getStockPct = (part: Part) => Math.min(100, Math.round((part.stockQuantity / part.maxStockLevel) * 100));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{parts.length}</p>
              <p className="text-xs text-muted-foreground">Total Part Types</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockCount}</p>
              <p className="text-xs text-muted-foreground">Low Stock Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <PackagePlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">₹{(totalValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Inventory Cost Value</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">₹{(totalRetailValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Retail Value</p>
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
              <Input placeholder="Search by part name, number, ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Stock Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="ok">In Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" /> Add Part
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parts Table */}
      <Card className="gati-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs font-semibold">Part ID</TableHead>
                <TableHead className="text-xs font-semibold">Name</TableHead>
                <TableHead className="text-xs font-semibold">Part Number</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Stock</TableHead>
                <TableHead className="text-xs font-semibold">Stock Level</TableHead>
                <TableHead className="text-xs font-semibold">Cost Price</TableHead>
                <TableHead className="text-xs font-semibold">Retail Price</TableHead>
                <TableHead className="text-xs font-semibold">Location</TableHead>
                <TableHead className="text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(part => {
                const stockStatus = getStockStatus(part);
                const stockPct = getStockPct(part);
                return (
                  <TableRow key={part._id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setViewPart(part)}>
                    <TableCell className="text-xs font-mono font-medium text-primary">{part.partId}</TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold">{part.name}</p>
                      {part.vendor && <p className="text-xs text-muted-foreground">{part.vendor}</p>}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{part.partNumber}</TableCell>
                    <TableCell className="text-xs">{part.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{part.stockQuantity}</span>
                        <span className="text-xs text-muted-foreground">{part.unit}</span>
                      </div>
                      <Badge className={`text-xs border mt-1 ${stockStatus.className}`}>{stockStatus.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-muted-foreground">Min: {part.minStockLevel}</span>
                          <span className="text-muted-foreground">Max: {part.maxStockLevel}</span>
                        </div>
                        <Progress value={stockPct} className={`h-1.5 ${part.stockQuantity <= part.minStockLevel ? '[&>div]:bg-red-500' : ''}`} />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">₹{part.costPrice.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-sm font-medium">₹{part.unitPrice.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{part.location}</TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewPart(part)}><Eye className="w-3.5 h-3.5 mr-2" />View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setViewPart(part)}><Edit className="w-3.5 h-3.5 mr-2" />Edit Part</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAddStock(part)}><PackagePlus className="w-3.5 h-3.5 mr-2" />Add Stock</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReorder(part)}><ShoppingCart className="w-3.5 h-3.5 mr-2" />Reorder</DropdownMenuItem>
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

      {/* Part Detail Modal */}
      <Dialog open={!!viewPart} onOpenChange={() => setViewPart(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {viewPart && (
            <>
              <DialogHeader>
                <DialogTitle>{viewPart.name}</DialogTitle>
                <DialogDescription>{viewPart.partId} · {viewPart.partNumber}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Category', value: viewPart.category },
                  { label: 'Vendor', value: viewPart.vendor || '—' },
                  { label: 'Unit', value: viewPart.unit },
                  { label: 'Barcode', value: viewPart.barcode || '—' },
                  { label: 'Stock Qty', value: `${viewPart.stockQuantity} ${viewPart.unit}` },
                  { label: 'Min Stock', value: `${viewPart.minStockLevel} ${viewPart.unit}` },
                  { label: 'Max Stock', value: `${viewPart.maxStockLevel} ${viewPart.unit}` },
                  { label: 'Reorder Point', value: `${viewPart.reorderPoint} ${viewPart.unit}` },
                  { label: 'Cost Price', value: `₹${viewPart.costPrice.toLocaleString('en-IN')}` },
                  { label: 'Retail Price', value: `₹${viewPart.unitPrice.toLocaleString('en-IN')}` },
                  { label: 'Location', value: viewPart.location },
                  { label: 'Branch', value: viewPart.branch },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {viewPart.compatibleVehicles && viewPart.compatibleVehicles.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1.5">Compatible Vehicles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewPart.compatibleVehicles.map(v => <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>)}
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(true); setViewPart(null); }}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                <Button className="flex-1 bg-primary text-white" onClick={() => handleAddStock(viewPart)}><PackagePlus className="w-4 h-4 mr-2" />Add Stock</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Part Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Part</DialogTitle>
            <DialogDescription>Register a new spare part or consumable</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {([
              { id: 'name', label: 'Part Name *', placeholder: 'e.g. Engine Oil 5W-40' },
              { id: 'partNumber', label: 'Part Number *', placeholder: 'e.g. EO-5W40-1L' },
              { id: 'category', label: 'Category *', placeholder: 'e.g. Lubricants & Fluids' },
              { id: 'vendor', label: 'Vendor', placeholder: 'Supplier name' },
              { id: 'costPrice', label: 'Cost Price (₹) *', placeholder: '500' },
              { id: 'unitPrice', label: 'Retail Price (₹) *', placeholder: '650' },
              { id: 'stockQuantity', label: 'Initial Stock *', placeholder: '20' },
              { id: 'minStockLevel', label: 'Min Stock Level *', placeholder: '5' },
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
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-white" onClick={handleAddPart}>Add Part</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
