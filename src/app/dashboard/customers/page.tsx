'use client';

import { useState } from 'react';
import { mockCustomers as initialCustomers } from '@/lib/mock-data';
import { Customer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Plus, Search, MoreHorizontal, Eye, Edit, Phone, Mail, MapPin, Star, Car, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '', occupation: '', address: '' });

  const handleAddCustomer = () => {
    if (!addForm.firstName || !addForm.lastName || !addForm.phone) return;
    const newCustomer: Customer = {
      _id: `customer-${Date.now()}`,
      customerId: `GT-CUST-${String(customers.length + 1).padStart(3, '0')}`,
      firstName: addForm.firstName,
      lastName: addForm.lastName,
      email: addForm.email,
      phone: addForm.phone,
      dateOfBirth: addForm.dob || undefined,
      occupation: addForm.occupation || undefined,
      address: addForm.address ? { street: addForm.address, city: '', state: '', pincode: '', country: 'India' } : undefined,
      loyaltyPoints: 0,
      totalPurchases: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setAddForm({ firstName: '', lastName: '', email: '', phone: '', dob: '', occupation: '', address: '' });
    setShowAddModal(false);
  };

  const filtered = customers.filter(c => {
    return !search ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.customerId.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
  });

  const totalRevenue = customers.reduce((s, c) => s + (c.totalPurchases || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, color: 'bg-blue-500', icon: Users },
          { label: 'Active Customers', value: customers.filter(c => c.isActive).length, color: 'bg-emerald-500', icon: Users },
          { label: 'VIP Customers', value: customers.filter(c => (c.loyaltyPoints || 0) >= 5000).length, color: 'bg-amber-500', icon: Star },
          { label: 'Total Revenue', value: `₹${(totalRevenue / 10000000).toFixed(2)}Cr`, color: 'bg-orange-500', icon: Car },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="gati-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter + Add */}
      <Card className="gati-card">
        <CardContent className="p-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search customers by name, email, phone..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" /> Add Customer
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="gati-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs font-semibold">Customer ID</TableHead>
                <TableHead className="text-xs font-semibold">Name</TableHead>
                <TableHead className="text-xs font-semibold">Contact</TableHead>
                <TableHead className="text-xs font-semibold">Occupation</TableHead>
                <TableHead className="text-xs font-semibold">Loyalty Points</TableHead>
                <TableHead className="text-xs font-semibold">Total Purchases</TableHead>
                <TableHead className="text-xs font-semibold">Last Visit</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(customer => (
                <TableRow key={customer._id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setViewCustomer(customer)}>
                  <TableCell className="text-xs font-mono font-medium text-primary">{customer.customerId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{customer.firstName} {customer.lastName}</p>
                        {(customer.loyaltyPoints || 0) >= 5000 && (
                          <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">VIP</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</div>
                      <div className="flex items-center gap-1"><Mail className="w-3 h-3" /><span className="truncate max-w-32 block">{customer.email}</span></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{customer.occupation || '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{(customer.loyaltyPoints || 0).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">₹{((customer.totalPurchases || 0) / 100000).toFixed(2)}L</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd/MM/yyyy') : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${customer.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewCustomer(customer)}><Eye className="w-3.5 h-3.5 mr-2" />View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setViewCustomer(customer)}><Edit className="w-3.5 h-3.5 mr-2" />Edit Customer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = '/dashboard/vehicles'}><Car className="w-3.5 h-3.5 mr-2" />Vehicle History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Customer Detail Modal */}
      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {viewCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {viewCustomer.firstName[0]}{viewCustomer.lastName[0]}
                  </div>
                  <div>
                    <div>{viewCustomer.firstName} {viewCustomer.lastName}</div>
                    <div className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                      {viewCustomer.customerId}
                      {(viewCustomer.loyaltyPoints || 0) >= 5000 && (
                        <Badge className="text-xs bg-amber-100 text-amber-800">VIP Customer</Badge>
                      )}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Phone', value: viewCustomer.phone },
                  { label: 'Email', value: viewCustomer.email },
                  { label: 'Alt. Phone', value: viewCustomer.alternatePhone || '—' },
                  { label: 'Date of Birth', value: viewCustomer.dateOfBirth ? format(new Date(viewCustomer.dateOfBirth), 'dd/MM/yyyy') : '—' },
                  { label: 'Anniversary', value: viewCustomer.anniversary ? format(new Date(viewCustomer.anniversary), 'dd/MM/yyyy') : '—' },
                  { label: 'Occupation', value: viewCustomer.occupation || '—' },
                  { label: 'Income Range', value: viewCustomer.income || '—' },
                  { label: 'Loyalty Points', value: (viewCustomer.loyaltyPoints || 0).toLocaleString() },
                  { label: 'Total Purchases', value: `₹${((viewCustomer.totalPurchases || 0) / 100000).toFixed(2)}L` },
                  { label: 'Last Visit', value: viewCustomer.lastVisit ? format(new Date(viewCustomer.lastVisit), 'dd/MM/yyyy') : '—' },
                  { label: 'Status', value: viewCustomer.isActive ? 'Active' : 'Inactive' },
                  { label: 'Member Since', value: format(new Date(viewCustomer.createdAt), 'dd/MM/yyyy') },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {viewCustomer.address && (
                <div className="mt-3 bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm mt-0.5">{viewCustomer.address.street}, {viewCustomer.address.city}, {viewCustomer.address.state} - {viewCustomer.address.pincode}</p>
                </div>
              )}
              {viewCustomer.notes && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">Notes</p>
                  <p className="text-sm mt-0.5 text-blue-800">{viewCustomer.notes}</p>
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(true); setViewCustomer(null); }}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setViewCustomer(null); window.location.href = '/dashboard/vehicles'; }}><Car className="w-4 h-4 mr-2" />View Vehicles</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Customer Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer profile</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {([
              { id: 'firstName', label: 'First Name *', placeholder: 'First name' },
              { id: 'lastName', label: 'Last Name *', placeholder: 'Last name' },
              { id: 'email', label: 'Email *', placeholder: 'email@example.com' },
              { id: 'phone', label: 'Phone *', placeholder: '+91-XXXXX-XXXXX' },
              { id: 'dob', label: 'Date of Birth', placeholder: '', type: 'date' },
              { id: 'occupation', label: 'Occupation', placeholder: 'e.g. Engineer' },
            ] as { id: keyof typeof addForm; label: string; placeholder: string; type?: string }[]).map(({ id, label, placeholder, type }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs">{label}</Label>
                <Input
                  id={id}
                  type={type || 'text'}
                  placeholder={placeholder}
                  className="h-9"
                  value={addForm[id]}
                  onChange={e => setAddForm(f => ({ ...f, [id]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs">Address</Label>
            <Textarea
              placeholder="Full address..."
              className="h-20 resize-none"
              value={addForm.address}
              onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-white" onClick={handleAddCustomer}>Add Customer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
