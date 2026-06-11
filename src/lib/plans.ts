export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0,
    priceLabel: 'Free',
    color: 'emerald',
    features: ['Up to 50 assets', '1 branch', '2 users', 'Basic reports', 'Email support'],
    limits: { assets: 50, branches: 1, users: 2 },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 2999,
    priceLabel: '₹2,999/mo',
    color: 'orange',
    features: ['Up to 500 assets', '5 branches', '10 users', 'Advanced analytics', 'API access', 'Priority support'],
    limits: { assets: 500, branches: 5, users: 10 },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9999,
    priceLabel: '₹9,999/mo',
    color: 'violet',
    features: ['Unlimited assets', 'Unlimited branches', 'Unlimited users', 'Custom integrations', 'White-label', 'Dedicated support', 'SLA guarantee'],
    limits: { assets: Infinity, branches: Infinity, users: Infinity },
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type Plan = typeof PLANS[PlanId];
