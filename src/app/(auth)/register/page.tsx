'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gauge, Eye, EyeOff, Lock, Mail, User, Building2, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PLANS, type PlanId } from '@/lib/plans';

const PLAN_STYLES: Record<string, { border: string; badge: string; highlight: string }> = {
  starter: {
    border: 'border-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800',
    highlight: 'ring-2 ring-emerald-400',
  },
  pro: {
    border: 'border-orange-400',
    badge: 'bg-orange-100 text-orange-800',
    highlight: 'ring-2 ring-orange-400',
  },
  enterprise: {
    border: 'border-violet-400',
    badge: 'bg-violet-100 text-violet-800',
    highlight: 'ring-2 ring-violet-400',
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgName, setOrgName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('starter');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!orgName.trim()) newErrors.orgName = 'Organization name is required.';
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim()) {
      newErrors.email = 'Work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    localStorage.setItem(
      'gati_auth',
      JSON.stringify({ org: orgName, name: fullName, email, plan: selectedPlan, role: 'admin', ts: Date.now() })
    );
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-xl py-8">
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
          <CardTitle className="text-xl text-center">Create Your Account</CardTitle>
          <CardDescription className="text-center">
            Start your 14-day free trial — no credit card required
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">

            {/* Organization Name */}
            <div className="space-y-1.5">
              <Label htmlFor="orgName">Organization Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="orgName"
                  type="text"
                  placeholder="Acme Automobiles Pvt Ltd"
                  className="pl-10"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              {errors.orgName && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.orgName}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Rajiv Menon"
                  className="pl-10"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>
              )}
            </div>

            {/* Work Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yourdealership.in"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>
              )}
            </div>

            {/* Plan Selector */}
            <div className="space-y-2">
              <Label>Select Plan</Label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.values(PLANS) as typeof PLANS[PlanId][]).map((plan) => {
                  const style = PLAN_STYLES[plan.id];
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id as PlanId)}
                      className={`relative flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected ? `${style.border} ${style.highlight} bg-slate-50` : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${style.badge}`}>
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                      <span className="text-sm font-semibold text-slate-800">{plan.name}</span>
                      <span className="text-xs font-medium text-slate-500 mt-0.5">{plan.priceLabel}</span>
                      <ul className="mt-2 space-y-1">
                        {plan.features.slice(0, 3).map((f) => (
                          <li key={f} className="text-xs text-slate-500 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please fix the errors above before continuing.</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Start Free Trial'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-slate-600 mt-6">
        &copy; 2024 Gati-Tech Solutions. All rights reserved.
      </p>
    </div>
  );
}
