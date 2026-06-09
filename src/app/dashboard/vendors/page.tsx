'use client';

import { useState } from 'react';
import { mockVendors } from '@/lib/mock-data';
import { Vendor } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Building2, Plus, Search, MoreHorizontal, Eye, Edit, Star, Phone, Mail, MapPin, Package } from 'lucide-react';

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  parts_supplier: { label: 'Parts Supplier', className: 'bg-blue-100 text-blue-800' },
  service_provider: { label: 'Service Provider', className: 'bg-purple-100 text-purple-800' },
  equipment_supplier: { label: 'Equipment Supplier', className: 'bg-orange-100 text-orange-800' },
  other: { label: 'Other', className: 'bg-gray-100 text-gray-700' },
};

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockVendors.filter(v => {
    const matchesSearch = !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.vendorId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
    ));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: mockVendors.length, color: 'bg-blue-500', icon: Building2 },
          { label: 'Active Vendors', value: mockVendors.filter(v => v.isActive).length, color: 'bg-emerald-500', icon: Building2 },
          { label: 'Parts Suppliers', value: mockVendors.filter(v => v.type === 'parts_supplier').length, color: 'bg-orange-500', icon: Package },
          { label: 'Equipment Suppliers', value: mockVendors.filter(v => v.type === 'equipment_supplier').length, color: 'bg-purple-500', icon: Package },
        ].map(({ label, value, color, icon: Icon }) => (
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
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search vendors by name or ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(TYPE_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" /> Add Vendor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(vendor => (
          <Card key={vendor._id} className="gati-card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewVendor(vendor)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold line-clamp-1">{vendor.name}</h3>
                    <p className="text-xs text-muted-foreground">{vendor.vendorId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewVendor(vendor)}><Eye className="w-3.5 h-3.5 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="w-3.5 h-3.5 mr-2" />Edit Vendor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Badge className={`text-xs mb-3 ${TYPE_CONFIG[vendor.type]?.className}`}>{TYPE_CONFIG[vendor.type]?.label}</Badge>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{vendor.contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{vendor.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{vendor.address.city}, {vendor.address.state}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                {vendor.rating && (
                  <div className="flex items-center gap-1">
                    {renderStars(vendor.rating)}
                    <span className="text-xs text-muted-foreground ml-1">{vendor.rating}</span>
                  </div>
                )}
                <Badge variant={vendor.isActive ? 'default' : 'secondary'} className={`text-xs ${vendor.isActive ? 'bg-emerald-100 text-emerald-800' : ''}`}>
                  {vendor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vendor Detail Modal */}
      <Dialog open={!!viewVendor} onOpenChange={() => setViewVendor(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {viewVendor && (
            <>
              <DialogHeader>
                <DialogTitle>{viewVendor.name}</DialogTitle>
                <DialogDescription>{viewVendor.vendorId} · {TYPE_CONFIG[viewVendor.type]?.label}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Phone', value: viewVendor.contactInfo.phone },
                  { label: 'Email', value: viewVendor.contactInfo.email },
                  { label: 'WhatsApp', value: viewVendor.contactInfo.whatsapp || '—' },
                  { label: 'Payment Terms', value: viewVendor.paymentTerms || '—' },
                  { label: 'GST Number', value: viewVendor.gstNumber || '—' },
                  { label: 'PAN Number', value: viewVendor.panNumber || '—' },
                  { label: 'Rating', value: viewVendor.rating ? `${viewVendor.rating} / 5` : '—' },
                  { label: 'Status', value: viewVendor.isActive ? 'Active' : 'Inactive' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm mt-0.5">{viewVendor.address.street}, {viewVendor.address.city}, {viewVendor.address.state} - {viewVendor.address.pincode}</p>
              </div>
              {viewVendor.notes && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">Notes</p>
                  <p className="text-sm mt-0.5 text-blue-800">{viewVendor.notes}</p>
                </div>
              )}
              {viewVendor.tags && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {viewVendor.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" className="flex-1"><Edit className="w-4 h-4 mr-2" />Edit Vendor</Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"><Package className="w-4 h-4 mr-2" />Create PO</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Vendor Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>Register a new vendor or supplier</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { id: 'name', label: 'Vendor Name *', placeholder: 'Company name' },
              { id: 'phone', label: 'Phone *', placeholder: '+91-XXXXX-XXXXX' },
              { id: 'email', label: 'Email *', placeholder: 'contact@vendor.com' },
              { id: 'gst', label: 'GST Number', placeholder: 'GSTIN' },
              { id: 'pan', label: 'PAN Number', placeholder: 'PANNO' },
              { id: 'terms', label: 'Payment Terms', placeholder: 'e.g. Net 30' },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs">{label}</Label>
                <Input id={id} placeholder={placeholder} className="h-9" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs">Type *</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select vendor type" /></SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs">Address</Label>
            <Textarea placeholder="Full address..." className="h-20 resize-none" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-white" onClick={() => setShowAddModal(false)}>Add Vendor</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
