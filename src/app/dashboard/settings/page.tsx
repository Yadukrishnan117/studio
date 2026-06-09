'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Settings, Building2, Users, Bell, Shield, Database, Plus, Edit, Trash2, CheckCircle2, Save } from 'lucide-react';

const mockUsers = [
  { id: 'u1', name: 'Admin User', email: 'admin@gatitech.in', role: 'super_admin', branch: 'All Branches', isActive: true, lastLogin: '2024-06-09' },
  { id: 'u2', name: 'Arun Kumar', email: 'arun.k@gatitech.in', role: 'sales', branch: 'Main Branch - Chennai', isActive: true, lastLogin: '2024-06-08' },
  { id: 'u3', name: 'Ramesh Babu', email: 'ramesh.b@gatitech.in', role: 'technician', branch: 'Main Branch - Chennai', isActive: true, lastLogin: '2024-06-08' },
  { id: 'u4', name: 'Suresh Kumar', email: 'suresh.k@gatitech.in', role: 'technician', branch: 'Main Branch - Chennai', isActive: true, lastLogin: '2024-06-07' },
  { id: 'u5', name: 'Priya Nair', email: 'priya.n@gatitech.in', role: 'manager', branch: 'Anna Nagar Branch', isActive: true, lastLogin: '2024-06-08' },
  { id: 'u6', name: 'Karthik R', email: 'karthik.r@gatitech.in', role: 'technician', branch: 'OMR Branch', isActive: false, lastLogin: '2024-05-30' },
];

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  super_admin: { label: 'Super Admin', className: 'bg-red-100 text-red-800' },
  admin: { label: 'Admin', className: 'bg-orange-100 text-orange-800' },
  manager: { label: 'Manager', className: 'bg-blue-100 text-blue-800' },
  technician: { label: 'Technician', className: 'bg-purple-100 text-purple-800' },
  sales: { label: 'Sales', className: 'bg-emerald-100 text-emerald-800' },
  viewer: { label: 'Viewer', className: 'bg-gray-100 text-gray-700' },
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="company">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="company" className="gap-2"><Building2 className="w-4 h-4" />Company</TabsTrigger>
          <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" />Users & Roles</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="w-4 h-4" />Security</TabsTrigger>
          <TabsTrigger value="system" className="gap-2"><Database className="w-4 h-4" />System</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="mt-6 space-y-6">
          <Card className="gati-card">
            <CardHeader>
              <CardTitle className="text-base">Company Information</CardTitle>
              <CardDescription>Basic company details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'companyName', label: 'Company Name', value: 'Gati-Tech Automobile Solutions Pvt Ltd' },
                  { id: 'gst', label: 'GST Number', value: '33AABCG1234H1ZX' },
                  { id: 'pan', label: 'PAN Number', value: 'AABCG1234H' },
                  { id: 'cin', label: 'CIN Number', value: 'U74140TN2018PTC123456' },
                  { id: 'phone', label: 'Primary Phone', value: '+91-44-28901234' },
                  { id: 'email', label: 'Primary Email', value: 'info@gatitech.in' },
                  { id: 'website', label: 'Website', value: 'www.gatitech.in' },
                  { id: 'founded', label: 'Founded Year', value: '2018' },
                ].map(({ id, label, value }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id} className="text-xs">{label}</Label>
                    <Input id={id} defaultValue={value} className="h-9" />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs">Registered Address</Label>
                <Input defaultValue="42, Dr. Radhakrishnan Salai, Mylapore, Chennai - 600004, Tamil Nadu, India" className="h-9" />
              </div>
            </CardContent>
          </Card>

          <Card className="gati-card">
            <CardHeader>
              <CardTitle className="text-base">Branch Configuration</CardTitle>
              <CardDescription>Manage branches across the dealership network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Main Branch - Chennai', code: 'CHN-MAIN', manager: 'Rajiv Menon', status: 'Active' },
                  { name: 'Anna Nagar Branch', code: 'CHN-AN', manager: 'Priya Nair', status: 'Active' },
                  { name: 'OMR Branch', code: 'CHN-OMR', manager: 'Vivek Subramaniam', status: 'Active' },
                ].map(branch => (
                  <div key={branch.code} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{branch.name}</p>
                      <p className="text-xs text-muted-foreground">{branch.code} · Manager: {branch.manager}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs">{branch.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" /> Add Branch
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-primary text-white gap-2" onClick={handleSave}>
              {saved ? <><CheckCircle2 className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
            </Button>
          </div>
        </TabsContent>

        {/* Users & Roles */}
        <TabsContent value="users" className="mt-6">
          <Card className="gati-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">User Management</CardTitle>
                <CardDescription>Manage team members and their access levels</CardDescription>
              </div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => setShowAddUser(true)}>
                <Plus className="w-4 h-4" /> Add User
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold pl-6">User</TableHead>
                    <TableHead className="text-xs font-semibold">Role</TableHead>
                    <TableHead className="text-xs font-semibold">Branch</TableHead>
                    <TableHead className="text-xs font-semibold">Last Login</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map(user => (
                    <TableRow key={user.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${ROLE_CONFIG[user.role]?.className}`}>{ROLE_CONFIG[user.role]?.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.branch}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell>
                        <Switch checked={user.isActive} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { id: 'fn', label: 'First Name *', placeholder: 'First name' },
                  { id: 'ln', label: 'Last Name *', placeholder: 'Last name' },
                  { id: 'email', label: 'Email *', placeholder: 'email@gatitech.in' },
                  { id: 'phone', label: 'Phone', placeholder: '+91-XXXXX-XXXXX' },
                ].map(({ id, label, placeholder }) => (
                  <div key={id} className="space-y-1.5">
                    <Label className="text-xs">{label}</Label>
                    <Input placeholder={placeholder} className="h-9" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Role *</Label>
                  <Select>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Branch *</Label>
                  <Select>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Branch</SelectItem>
                      <SelectItem value="an">Anna Nagar</SelectItem>
                      <SelectItem value="omr">OMR Branch</SelectItem>
                      <SelectItem value="all">All Branches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddUser(false)}>Cancel</Button>
                <Button className="flex-1 bg-primary text-white" onClick={() => setShowAddUser(false)}>Add User</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="gati-card">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Configure when and how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: 'Maintenance Due Alerts', desc: 'Notify when maintenance is scheduled or overdue', enabled: true },
                { title: 'Low Stock Alerts', desc: 'Alert when parts fall below minimum stock level', enabled: true },
                { title: 'Warranty Expiry Reminders', desc: 'Remind 30 days before warranty expiry', enabled: true },
                { title: 'Insurance Expiry Reminders', desc: 'Remind 60 days before insurance expiry', enabled: true },
                { title: 'Vehicle Sale Notifications', desc: 'Notify team when a vehicle is sold', enabled: false },
                { title: 'New Asset Added', desc: 'Notify when a new asset is registered', enabled: false },
                { title: 'Daily Summary Report', desc: 'Send daily operational summary email', enabled: true },
                { title: 'Weekly Analytics Report', desc: 'Send weekly performance analytics', enabled: false },
              ].map(item => (
                <div key={item.title} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-6">
          <Card className="gati-card">
            <CardHeader>
              <CardTitle className="text-base">Security Settings</CardTitle>
              <CardDescription>Authentication and access control configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: 'Two-Factor Authentication', desc: 'Require 2FA for all admin users', enabled: false },
                { title: 'Session Timeout', desc: 'Automatically log out after 30 minutes of inactivity', enabled: true },
                { title: 'IP Whitelist', desc: 'Restrict access to specific IP addresses', enabled: false },
                { title: 'Audit Logging', desc: 'Log all user actions for compliance tracking', enabled: true },
                { title: 'Password Complexity', desc: 'Enforce strong password requirements', enabled: true },
                { title: 'Single Sign-On (SSO)', desc: 'Enable SSO with corporate directory', enabled: false },
              ].map(item => (
                <div key={item.title} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="mt-6 space-y-6">
          <Card className="gati-card">
            <CardHeader>
              <CardTitle className="text-base">System Configuration</CardTitle>
              <CardDescription>Database, backup, and performance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Database', value: 'MongoDB Atlas v7.0', status: 'Connected', statusColor: 'bg-emerald-500' },
                  { label: 'Cache Layer', value: 'Redis 7.2', status: 'Connected', statusColor: 'bg-emerald-500' },
                  { label: 'Storage', value: 'AWS S3', status: 'Active', statusColor: 'bg-emerald-500' },
                  { label: 'Email Service', value: 'SendGrid', status: 'Active', statusColor: 'bg-emerald-500' },
                ].map(({ label, value, status, statusColor }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                      <span className="text-xs text-emerald-600">{status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                {[
                  { title: 'Automatic Backups', desc: 'Daily database backup at 2:00 AM IST', enabled: true },
                  { title: 'Performance Monitoring', desc: 'Track API response times and error rates', enabled: true },
                  { title: 'Data Compression', desc: 'Compress attachments and documents for storage', enabled: false },
                  { title: 'Debug Mode', desc: 'Enable detailed logging (not recommended in production)', enabled: false },
                ].map(item => (
                  <div key={item.title} className="flex items-center justify-between py-1.5">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="gati-card">
            <CardHeader>
              <CardTitle className="text-base">Application Version</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'App Version', value: 'v1.0.0' },
                  { label: 'Build', value: '2024.06.09' },
                  { label: 'Environment', value: 'Production' },
                  { label: 'Node.js', value: '20.x LTS' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-bold mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
