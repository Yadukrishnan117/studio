'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gauge, Check, X, Zap, Building2, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { PLANS } from '@/lib/plans';

const PLAN_STYLES = {
  starter: {
    border: 'border-slate-700',
    button: 'bg-slate-700 hover:bg-slate-600 text-white',
    highlight: false,
    priceColor: 'text-emerald-400',
  },
  pro: {
    border: 'border-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600 text-white',
    highlight: true,
    priceColor: 'text-orange-400',
  },
  enterprise: {
    border: 'border-violet-500',
    button: 'bg-violet-600 hover:bg-violet-700 text-white',
    highlight: false,
    priceColor: 'text-violet-400',
  },
};

const FEATURE_TABLE = [
  { feature: 'Assets', starter: '50', pro: '500', enterprise: 'Unlimited' },
  { feature: 'Branches', starter: '1', pro: '5', enterprise: 'Unlimited' },
  { feature: 'Users', starter: '2', pro: '10', enterprise: 'Unlimited' },
  { feature: 'Basic reports', starter: true, pro: true, enterprise: true },
  { feature: 'Advanced analytics', starter: false, pro: true, enterprise: true },
  { feature: 'API access', starter: false, pro: true, enterprise: true },
  { feature: 'White-label', starter: false, pro: false, enterprise: true },
  { feature: 'Custom integrations', starter: false, pro: false, enterprise: true },
  { feature: 'SLA guarantee', starter: false, pro: false, enterprise: true },
  { feature: 'Support', starter: 'Email', pro: 'Priority', enterprise: 'Dedicated' },
];

const FAQS = [
  {
    q: 'Can I change my plan later?',
    a: 'Yes. You can upgrade or downgrade your plan at any time from Settings → Subscription. Changes take effect immediately and billing is prorated.',
  },
  {
    q: 'How does billing work?',
    a: 'Pro and Enterprise plans are billed monthly or annually (20% discount). Starter is always free. We accept major credit cards and UPI for Indian customers.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data is retained for 30 days after cancellation, giving you time to export everything. After 30 days it is securely deleted from our servers.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'All new accounts start with a 14-day free trial of the Pro plan — no credit card required. After the trial you can stay on Starter (free) or subscribe to Pro or Enterprise.',
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-slate-600 mx-auto" />
    );
  }
  return <span className="text-sm text-slate-300">{value}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const displayPrice = (plan: typeof PLANS[keyof typeof PLANS]) => {
    if (plan.price === 0) return 'Free';
    const price = annual ? Math.round(plan.price * 0.8) : plan.price;
    return `₹${price.toLocaleString('en-IN')}/mo`;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500 shadow-lg">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Gati-Tech</span>
          </Link>
          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-2">
            <Zap className="w-3.5 h-3.5" /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Choose the right plan for<br className="hidden md:block" /> your dealership
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From solo operators to enterprise dealership networks — we have you covered.
          </p>

          {/* Monthly/Annual toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-sm ${!annual ? 'text-white font-medium' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${annual ? 'bg-orange-500' : 'bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-white font-medium' : 'text-slate-400'}`}>Annual</span>
            {annual && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {(Object.values(PLANS) as typeof PLANS[keyof typeof PLANS][]).map((plan) => {
            const style = PLAN_STYLES[plan.id as keyof typeof PLAN_STYLES];
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border-2 ${style.border} p-6 ${
                  style.highlight ? 'bg-slate-800/80 shadow-2xl shadow-orange-500/10 scale-105' : 'bg-slate-800/40'
                }`}
              >
                {style.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    {plan.id === 'starter' && <Zap className="w-5 h-5 text-emerald-400" />}
                    {plan.id === 'pro' && <Building2 className="w-5 h-5 text-orange-400" />}
                    {plan.id === 'enterprise' && <Shield className="w-5 h-5 text-violet-400" />}
                    <span className="font-semibold text-white text-lg">{plan.name}</span>
                  </div>
                  <div className={`text-3xl font-bold ${style.priceColor}`}>
                    {displayPrice(plan)}
                  </div>
                  {annual && plan.price > 0 && (
                    <p className="text-xs text-slate-500 mt-1 line-through">
                      ₹{plan.price.toLocaleString('en-IN')}/mo billed monthly
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${style.button}`}
                >
                  {plan.id === 'starter' ? 'Get Started Free' : 'Start Free Trial'}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-8">Compare all features</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-700">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/60">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Feature</th>
                  <th className="px-6 py-4 text-sm font-semibold text-emerald-400">Starter</th>
                  <th className="px-6 py-4 text-sm font-semibold text-orange-400">Pro</th>
                  <th className="px-6 py-4 text-sm font-semibold text-violet-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_TABLE.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-slate-700/50 ${i % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'}`}
                  >
                    <td className="text-left px-6 py-3.5 text-sm text-slate-300">{row.feature}</td>
                    <td className="px-6 py-3.5"><CellValue value={row.starter} /></td>
                    <td className="px-6 py-3.5"><CellValue value={row.pro} /></td>
                    <td className="px-6 py-3.5"><CellValue value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-400 border-t border-slate-700 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center rounded-2xl border border-orange-500/20 bg-orange-500/5 py-14 px-6">
          <h2 className="text-3xl font-bold text-white mb-3">
            Start your 14-day free trial
          </h2>
          <p className="text-slate-400 mb-6">No credit card required. Cancel anytime.</p>
          <Link
            href="/register"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-600">
        &copy; 2024 Gati-Tech Solutions. All rights reserved.
      </footer>
    </div>
  );
}
