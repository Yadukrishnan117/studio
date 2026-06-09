# Gati-Tech AMS — Deployment Guide

## Prerequisites

- Kubernetes cluster (v1.28+)
- kubectl configured
- Helm 3.x
- Docker registry access (GHCR)
- MongoDB Atlas account
- Domain DNS configured

## Quick Deploy

```bash
# 1. Create namespace
kubectl apply -f docs/k8s/namespace.yaml

# 2. Create secrets (edit values first!)
kubectl apply -f docs/k8s/secret.yaml

# 3. Deploy ConfigMap
kubectl apply -f docs/k8s/configmap.yaml

# 4. Deploy Redis
kubectl apply -f docs/k8s/redis-statefulset.yaml
kubectl apply -f docs/k8s/service.yaml

# 5. Deploy Application
kubectl apply -f docs/k8s/deployment.yaml

# 6. Configure Ingress
kubectl apply -f docs/k8s/ingress.yaml

# 7. Configure Autoscaling
kubectl apply -f docs/k8s/hpa.yaml

# 8. Apply Network Policies
kubectl apply -f docs/k8s/network-policy.yaml

# 9. Apply PDB
kubectl apply -f docs/k8s/pdb.yaml

# Verify deployment
kubectl get pods -n gati-tech-prod
kubectl get svc -n gati-tech-prod
kubectl get ingress -n gati-tech-prod
```

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI

# Run development server
npm run dev

# Run type checks
npm run typecheck

# Run lint
npm run lint

# Build for production
npm run build
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| MONGODB_URI | ✅ | MongoDB connection string |
| NEXTAUTH_SECRET | ✅ | JWT signing secret (min 32 chars) |
| NEXTAUTH_URL | ✅ | Application base URL |
| NEXT_PUBLIC_APP_NAME | ✅ | Application name |
| REDIS_URL | Optional | Redis cache URL |
| AWS_ACCESS_KEY_ID | Optional | For S3 file storage |
| AWS_SECRET_ACCESS_KEY | Optional | For S3 file storage |

## Security Checklist

- [ ] Change all default secrets in secret.yaml
- [ ] Enable TLS via cert-manager
- [ ] Configure Cloudflare WAF rules
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Enable MongoDB Atlas audit logging
- [ ] Configure Prometheus alerting
- [ ] Set up backup retention policy (30 days minimum)
- [ ] Run `npm audit` before each deployment
- [ ] Review RBAC permissions for each user role
