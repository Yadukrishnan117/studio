'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gauge, Eye, EyeOff, Lock, Mail, Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@gatitech.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate auth - in production this would call NextAuth
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (email && password) {
      router.push('/dashboard');
    } else {
      setError('Please enter valid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo & Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 shadow-2xl mb-4">
          <Gauge className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Gati-Tech</h1>
        <p className="text-slate-400 mt-1">Asset Management System</p>
        <p className="text-slate-500 text-sm mt-1">Automobile Dealership Platform</p>
      </div>

      <Card className="border-0 shadow-2xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your dealership assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gatitech.in"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-blue-700 mb-1">Demo Credentials</p>
              <p className="text-xs text-blue-600">Email: admin@gatitech.in</p>
              <p className="text-xs text-blue-600">Password: any password works</p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: Car, label: 'Vehicle Tracking' },
          { icon: Gauge, label: 'Asset Management' },
          { icon: Lock, label: 'Secure & Scalable' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 mb-2">
              <Icon className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-600 mt-6">
        &copy; 2024 Gati-Tech Solutions. All rights reserved.
      </p>
    </div>
  );
}
