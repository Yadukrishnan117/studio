'use client';

import { useState } from 'react';
import { mockMaintenance } from '@/lib/mock-data';
import { MaintenanceRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Wrench, Plus, Search, MoreHorizontal, Eye, Edit, CheckCircle2, Clock, AlertTriangle, AlertCircle, XCircle, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ComponentType<any> }> = {
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-800 border-amber-200', icon: Wrench },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-gray-100 text-gray-700' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700' },
};

const TYPE_LABELS: Record<string, string> = {
  preventive: 'Preventive',
  corrective: 'Corrective',
  predictive: 'Predictive',
  emergency: 'Emergency',
};

export default function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewRecord, setViewRecord] = useState<MaintenanceRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockMaintenance.filter(m => {
    const matchesSearch = !search ||
      m.assetName.toLowerCase().includes(search.toLowerCase()) ||
      m.workOrderId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || m.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const counts = mockMaintenance.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEstimatedCost = filtered.reduce((s, m) => s + m.estimatedCost, 0);
  const totalActualCost = filtered.filter(m => m.actualCost).reduce((s, m) => s + (m.actualCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <Card key={status} className={`gati-card cursor-pointer ${statusFilter === status ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{config.label}</span>
                </div>
                <p className="text-2xl font-bold">{counts[status] || 0}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">₹{(totalEstimatedCost / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Estimated Cost (Filtered)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gati-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">₹{(totalActualCost / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Actual Cost (Completed)</p>
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
              <Input placeholder="Search work orders, assets..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {Object.entries(PRIORITY_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" /> New Work Order
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Table */}
      <Card className="gati-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs font-semibold">Work Order</TableHead>
                <TableHead className="text-xs font-semibold">Asset / Vehicle</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Priority</TableHead>
                <TableHead className="text-xs font-semibold">Scheduled</TableHead>
                <TableHead className="text-xs font-semibold">Technician</TableHead>
                <TableHead className="text-xs font-semibold">Est. Cost</TableHead>
                <TableHead className="text-xs font-semibold">Actual Cost</TableHead>
                <TableHead className="text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(record => {
                const statusCfg = STATUS_CONFIG[record.status];
                const priorityCfg = PRIORITY_CONFIG[record.priority];
                const StatusIcon = statusCfg.icon;
                return (
                  <TableRow key={record._id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setViewRecord(record)}>
                    <TableCell className="text-xs font-mono font-medium text-primary">{record.workOrderId}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium line-clamp-1">{record.assetName}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{record.description}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs capitalize">{TYPE_LABELS[record.type]}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border gap-1 ${statusCfg.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${priorityCfg.className}`}>{priorityCfg.label}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{format(new Date(record.scheduledDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-xs">{record.assignedTechnician || '—'}</TableCell>
                    <TableCell className="text-sm">₹{(record.estimatedCost / 1000).toFixed(1)}K</TableCell>
                    <TableCell className="text-sm">{record.actualCost ? `₹${(record.actualCost / 1000).toFixed(1)}K` : '—'}</TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewRecord(record)}><Eye className="w-3.5 h-3.5 mr-2" />View Details</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-3.5 h-3.5 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><CheckCircle2 className="w-3.5 h-3.5 mr-2" />Mark Completed</DropdownMenuItem>
                          <DropdownMenuItem><AlertTriangle className="w-3.5 h-3.5 mr-2" />Mark In Progress</DropdownMenuItem>
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

      {/* Work Order Detail Modal */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewRecord && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div>{viewRecord.workOrderId}</div>
                    <div className="text-sm font-normal text-muted-foreground">{viewRecord.assetName}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Type', value: TYPE_LABELS[viewRecord.type] },
                  { label: 'Status', value: STATUS_CONFIG[viewRecord.status]?.label },
                  { label: 'Priority', value: PRIORITY_CONFIG[viewRecord.priority]?.label },
                  { label: 'Technician', value: viewRecord.assignedTechnician || '—' },
                  { label: 'Scheduled Date', value: format(new Date(viewRecord.scheduledDate), 'dd/MM/yyyy') },
                  { label: 'Start Date', value: viewRecord.startDate ? format(new Date(viewRecord.startDate), 'dd/MM/yyyy') : '—' },
                  { label: 'Completion Date', value: viewRecord.completedDate ? format(new Date(viewRecord.completedDate), 'dd/MM/yyyy') : '—' },
                  { label: 'Est. Duration', value: `${viewRecord.estimatedDuration} hours` },
                  { label: 'Actual Duration', value: viewRecord.actualDuration ? `${viewRecord.actualDuration} hours` : '—' },
                  { label: 'Est. Cost', value: `₹${viewRecord.estimatedCost.toLocaleString('en-IN')}` },
                  { label: 'Actual Cost', value: viewRecord.actualCost ? `₹${viewRecord.actualCost.toLocaleString('en-IN')}` : '—' },
                  { label: 'Mileage at Service', value: viewRecord.mileageAtService ? `${viewRecord.mileageAtService.toLocaleString()} km` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm mt-0.5">{viewRecord.description}</p>
              </div>
              {viewRecord.parts && viewRecord.parts.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Parts Used</p>
                  <div className="space-y-1.5">
                    {viewRecord.parts.map((part, i) => (
                      <div key={i} className="flex justify-between text-sm bg-muted/20 rounded p-2">
                        <span>{part.partName} × {part.quantity}</span>
                        <span className="font-medium">₹{part.totalCost.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {viewRecord.notes && (
                <div className="mt-3 bg-amber-50 rounded-lg p-3 border border-amber-100">
                  <p className="text-xs text-amber-700 font-medium">Notes</p>
                  <p className="text-sm mt-0.5 text-amber-800">{viewRecord.notes}</p>
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" className="flex-1"><Edit className="w-4 h-4 mr-2" />Edit Work Order</Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="w-4 h-4 mr-2" />Mark Complete</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Work Order Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Work Order</DialogTitle>
            <DialogDescription>Create a new maintenance work order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Asset / Vehicle Name *</Label>
              <Input placeholder="e.g. Vehicle Lift Bay 1" className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Maintenance Type *</Label>
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority *</Label>
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Scheduled Date *</Label>
                <Input type="date" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Estimated Duration (hours) *</Label>
                <Input type="number" placeholder="4" className="h-9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Estimated Cost (₹) *</Label>
                <Input type="number" placeholder="10000" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Assigned Technician</Label>
                <Input placeholder="e.g. Ramesh Babu" className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description *</Label>
              <Textarea placeholder="Describe the maintenance work to be done..." className="h-24 resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Textarea placeholder="Additional notes or instructions..." className="h-16 resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-white" onClick={() => setShowAddModal(false)}>Create Work Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
