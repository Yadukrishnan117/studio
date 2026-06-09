'use client';

import { useState } from 'react';
import { mockVehicles } from '@/lib/mock-data';
import { Vehicle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus, Search, Filter, MoreHorizontal, Car, Eye, Edit, Trash2,
  Download, BarChart2, RefreshCw, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  sold: { label: 'Sold', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  reserved: { label: 'Reserved', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  in_transit: { label: 'In Transit', className: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  service: { label: 'In Service', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  demo: { label: 'Demo', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
};

const FUEL_ICONS: Record<string, string> = {
  petrol: '⛽',
  diesel: '🛢️',
  electric: '⚡',
  hybrid: '🔋',
  cng: '🌿',
  lpg: '🔥',
};

const PDI_CONFIG: Record<string, { icon: React.ComponentType<any>; className: string }> = {
  completed: { icon: CheckCircle2, className: 'text-emerald-500' },
  pending: { icon: Clock, className: 'text-amber-500' },
  failed: { icon: AlertCircle, className: 'text-red-500' },
};

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockVehicles.filter(v => {
    const matchesSearch = !search ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
      v.vin.toLowerCase().includes(search.toLowerCase()) ||
      (v.registrationNumber?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesFuel = fuelFilter === 'all' || v.fuelType === fuelFilter;
    const matchesBranch = branchFilter === 'all' || v.branch === branchFilter;
    return matchesSearch && matchesStatus && matchesFuel && matchesBranch;
  });

  const statusCounts = mockVehicles.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = filtered.reduce((s, v) => s + v.sellingPrice, 0);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <Card key={status} className="gati-card cursor-pointer hover:border-primary/30"
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{statusCounts[status] || 0}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{config.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="gati-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, VIN, registration..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="service">In Service</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fuelFilter} onValueChange={setFuelFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fuel</SelectItem>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="cng">CNG</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> of{' '}
              <span className="font-medium text-foreground">{mockVehicles.length}</span> vehicles
            </p>
            <p className="text-sm text-muted-foreground">
              Total Value:{' '}
              <span className="font-semibold text-foreground">
                ₹{(totalValue / 100000).toFixed(1)}L
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Table */}
      <Card className="gati-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs font-semibold">Vehicle ID</TableHead>
                <TableHead className="text-xs font-semibold">Make / Model</TableHead>
                <TableHead className="text-xs font-semibold">Year</TableHead>
                <TableHead className="text-xs font-semibold">VIN</TableHead>
                <TableHead className="text-xs font-semibold">Fuel</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">PDI</TableHead>
                <TableHead className="text-xs font-semibold">Branch</TableHead>
                <TableHead className="text-xs font-semibold text-right">Price (₹)</TableHead>
                <TableHead className="text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vehicle) => {
                const statusCfg = STATUS_CONFIG[vehicle.status];
                const pdiCfg = PDI_CONFIG[vehicle.pdiStatus || 'pending'];
                const PdiIcon = pdiCfg.icon;
                return (
                  <TableRow key={vehicle._id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setViewVehicle(vehicle)}>
                    <TableCell className="text-xs font-mono font-medium text-primary">{vehicle.vehicleId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold">{vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.variant} · {vehicle.color}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{vehicle.year}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{vehicle.vin.slice(-8)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{FUEL_ICONS[vehicle.fuelType]} {vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${statusCfg.className}`}>{statusCfg.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <PdiIcon className={`w-4 h-4 ${pdiCfg.className}`} />
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground truncate max-w-24 block">{vehicle.branch.split(' - ')[1] || vehicle.branch}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="text-sm font-semibold">₹{(vehicle.sellingPrice / 100000).toFixed(2)}L</p>
                        {vehicle.msrp && vehicle.msrp > vehicle.sellingPrice && (
                          <p className="text-xs text-emerald-600">
                            Save ₹{((vehicle.msrp - vehicle.sellingPrice) / 1000).toFixed(0)}K
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewVehicle(vehicle)}>
                            <Eye className="w-3.5 h-3.5 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-3.5 h-3.5 mr-2" /> Edit Vehicle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Mark as Reserved</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
                          <DropdownMenuItem>Create Work Order</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
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

      {/* Vehicle Detail Modal */}
      <Dialog open={!!viewVehicle} onOpenChange={() => setViewVehicle(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewVehicle && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div>{viewVehicle.make} {viewVehicle.model}</div>
                    <div className="text-sm font-normal text-muted-foreground">{viewVehicle.vehicleId} · {viewVehicle.variant}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { label: 'VIN', value: viewVehicle.vin },
                  { label: 'Registration', value: viewVehicle.registrationNumber || 'Not registered' },
                  { label: 'Year', value: viewVehicle.year },
                  { label: 'Color', value: viewVehicle.color },
                  { label: 'Fuel Type', value: `${FUEL_ICONS[viewVehicle.fuelType]} ${viewVehicle.fuelType}` },
                  { label: 'Transmission', value: viewVehicle.transmission.toUpperCase() },
                  { label: 'Engine', value: viewVehicle.engineCC ? `${viewVehicle.engineCC}cc` : 'Electric' },
                  { label: 'Mileage', value: `${viewVehicle.mileage?.toLocaleString() || 0} km` },
                  { label: 'Status', value: STATUS_CONFIG[viewVehicle.status]?.label },
                  { label: 'Condition', value: viewVehicle.condition },
                  { label: 'Branch', value: viewVehicle.branch },
                  { label: 'Location', value: viewVehicle.location },
                  { label: 'Stock Date', value: new Date(viewVehicle.stockDate).toLocaleDateString('en-IN') },
                  { label: 'PDI Status', value: viewVehicle.pdiStatus || 'Pending' },
                  { label: 'Cost Price', value: `₹${(viewVehicle.costPrice / 100000).toFixed(2)}L` },
                  { label: 'Selling Price', value: `₹${(viewVehicle.sellingPrice / 100000).toFixed(2)}L` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {viewVehicle.features && viewVehicle.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {viewVehicle.features.map(f => (
                      <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button className="flex-1" variant="outline">
                  <Edit className="w-4 h-4 mr-2" /> Edit Vehicle
                </Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Create Work Order
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Enter vehicle details to add to inventory</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { id: 'make', label: 'Make *', placeholder: 'e.g. Maruti Suzuki' },
              { id: 'model', label: 'Model *', placeholder: 'e.g. Swift' },
              { id: 'variant', label: 'Variant *', placeholder: 'e.g. ZXi Plus' },
              { id: 'vin', label: 'VIN *', placeholder: 'Vehicle Identification Number' },
              { id: 'year', label: 'Year *', placeholder: '2024' },
              { id: 'color', label: 'Color *', placeholder: 'e.g. Pearl White' },
              { id: 'costPrice', label: 'Cost Price (₹) *', placeholder: '800000' },
              { id: 'sellingPrice', label: 'Selling Price (₹) *', placeholder: '860000' },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs">{label}</Label>
                <Input id={id} placeholder={placeholder} className="h-9" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Fuel Type *</Label>
              <Select>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {['petrol','diesel','electric','hybrid','cng','lpg'].map(f => (
                    <SelectItem key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Transmission *</Label>
              <Select>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {['manual','automatic','amt','cvt','dct'].map(t => (
                    <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs">Branch *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Branch - Chennai</SelectItem>
                <SelectItem value="annanagar">Anna Nagar Branch</SelectItem>
                <SelectItem value="omr">OMR Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs">Features (comma-separated)</Label>
            <Textarea placeholder="Sunroof, CarPlay, Reverse Camera..." className="h-20 resize-none" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-white" onClick={() => setShowAddModal(false)}>Add Vehicle</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
