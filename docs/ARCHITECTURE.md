# Gati-Tech Asset Management System (AMS)
## System Architecture Document
**Version:** 1.0.0 | **Date:** June 2024 | **Classification:** Internal

---

## 1. Executive Summary

Gati-Tech AMS is a cloud-native, multi-tenant asset management platform built for automobile dealerships. It provides real-time tracking of vehicles, equipment, tools, and other assets across multiple branches, with integrated maintenance management, financial reporting, and vendor/customer CRM capabilities.

**Platform Name:** Gati-Tech AMS  
**Target Industry:** Automobile Dealerships  
**Deployment Model:** Cloud-native (Kubernetes) / On-premise hybrid  
**Architecture Style:** Microservices-ready Monolith (Modular Monolith)

---

## 2. Technology Stack

### 2.1 Frontend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15.x | Server-side rendering, routing |
| UI Library | React | 18.x | Component-based UI |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Components | Shadcn/UI + Radix UI | Latest | Accessible UI components |
| Charts | Recharts | 2.x | Data visualization |
| Forms | React Hook Form + Zod | Latest | Form validation |
| State | React Query / Context | Latest | Data fetching & caching |

### 2.2 Backend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 20.x LTS | JavaScript runtime |
| API | Next.js API Routes | 15.x | RESTful API endpoints |
| ODM | Mongoose | 8.x | MongoDB object modeling |
| Auth | NextAuth.js | 4.x | Authentication & sessions |
| Password | bcryptjs | 2.x | Password hashing |
| PDF | jsPDF + AutoTable | 2.x | Report generation |

### 2.3 Database & Infrastructure
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Primary DB | MongoDB | 7.x | Document storage |
| Cache | Redis | 7.x | Session cache & rate limiting |
| File Storage | AWS S3 / MinIO | Latest | Document & image storage |
| Container | Docker | 25.x | Application containerization |
| Orchestration | Kubernetes | 1.29.x | Container orchestration |
| Ingress | NGINX Ingress | 1.9.x | Load balancing & routing |
| CI/CD | GitHub Actions | Latest | Automated deployments |
| Monitoring | Prometheus + Grafana | Latest | Metrics & dashboards |
| Logging | ELK Stack | 8.x | Centralized logging |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET / WAN                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Cloudflare    │
                    │  WAF + CDN     │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │  NGINX Ingress │
                    │  Load Balancer │
                    └───────┬────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
     ┌────────▼─────┐ ┌────▼──────┐ ┌────▼──────┐
     │  Next.js App  │ │  Next.js  │ │  Next.js  │
     │  Pod 1        │ │  Pod 2    │ │  Pod 3    │
     │  (AMS App)    │ │  (AMS)    │ │  (AMS)    │
     └────────┬──────┘ └────┬──────┘ └────┬──────┘
              └─────────────┼──────────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
     ┌────────▼─────┐ ┌────▼──────┐ ┌────▼──────┐
     │  MongoDB      │ │   Redis   │ │  AWS S3   │
     │  Atlas/       │ │  Cache    │ │  Storage  │
     │  ReplicaSet   │ │  Cluster  │ │           │
     └───────────────┘ └───────────┘ └───────────┘
```

### 3.2 Module Architecture

```
Gati-Tech AMS
├── Auth Module          → NextAuth.js + bcryptjs
├── Dashboard Module     → KPIs, Charts, Alerts
├── Asset Module         → CRUD + Depreciation Engine
├── Vehicle Module       → Inventory + PDI Tracking
├── Maintenance Module   → Work Orders + Scheduling
├── Parts Module         → Inventory + Reorder Management
├── Vendor Module        → Supplier CRM
├── Customer Module      → Customer CRM + Loyalty
├── Finance Module       → Depreciation + P&L Reports
├── Reports Module       → PDF/Excel Generation
└── Settings Module      → User + Branch Management
```

---

## 4. Database Architecture

### 4.1 MongoDB Collections

```
gati-tech-ams Database
├── users           → User accounts & roles (RBAC)
├── assets          → All registered assets
├── vehicles        → Vehicle inventory
├── maintenances    → Work orders & service records
├── parts           → Spare parts & consumables
├── vendors         → Supplier profiles
├── customers       → Customer profiles & CRM
├── branches        → Branch/location configuration
├── audit_logs      → System audit trail
└── notifications   → System notifications
```

### 4.2 Key Relationships

```
User ──── Branch (many-to-one)
Asset ──── Vendor (many-to-one, optional)
Vehicle ──── Customer (many-to-one, sold vehicles)
Vehicle ──── User/Salesperson (many-to-one)
Maintenance ──── Asset OR Vehicle (polymorphic)
Maintenance ──── Part (embedded array)
Customer ──── Vehicle[] (one-to-many purchase history)
```

### 4.3 Indexing Strategy

| Collection | Index | Purpose |
|------------|-------|---------|
| assets | `{branch, category}` | Branch-scoped category filtering |
| assets | `{status}` | Status-based queries |
| assets | `{nextMaintenanceDate}` | Maintenance scheduling |
| vehicles | `{branch, status}` | Inventory queries |
| vehicles | `{make, model}` | Search optimization |
| vehicles | `{vin}` unique | VIN uniqueness |
| maintenances | `{status, scheduledDate}` | Work order queries |
| maintenances | `{priority}` | Priority filtering |
| users | `{email}` unique | Auth queries |

---

## 5. API Architecture

### 5.1 RESTful Endpoints

```
Base URL: /api/v1

Assets
  GET    /api/assets           → List assets (paginated, filtered)
  POST   /api/assets           → Create asset
  GET    /api/assets/:id       → Get asset details
  PUT    /api/assets/:id       → Update asset
  DELETE /api/assets/:id       → Delete asset

Vehicles
  GET    /api/vehicles         → List vehicles
  POST   /api/vehicles         → Add vehicle to inventory
  GET    /api/vehicles/:id     → Get vehicle details
  PUT    /api/vehicles/:id     → Update vehicle
  DELETE /api/vehicles/:id     → Remove vehicle

Maintenance
  GET    /api/maintenance      → List work orders
  POST   /api/maintenance      → Create work order
  GET    /api/maintenance/:id  → Get work order
  PUT    /api/maintenance/:id  → Update work order

Parts
  GET    /api/parts            → List parts
  POST   /api/parts            → Add part
  PUT    /api/parts/:id        → Update part/stock

Customers
  GET    /api/customers        → List customers
  POST   /api/customers        → Create customer
  GET    /api/customers/:id    → Customer profile
  PUT    /api/customers/:id    → Update customer

Vendors
  GET    /api/vendors          → List vendors
  POST   /api/vendors          → Create vendor
  GET    /api/vendors/:id      → Vendor details
  PUT    /api/vendors/:id      → Update vendor

Dashboard
  GET    /api/dashboard        → Aggregated KPIs and metrics

Reports
  POST   /api/reports/generate → Generate and download report
```

### 5.2 Authentication Flow

```
1. User submits credentials (email + password)
2. NextAuth validates against MongoDB User collection
3. bcryptjs.compare() verifies password hash
4. JWT session token issued (httpOnly cookie)
5. Middleware validates token on each protected route
6. Role-based access control enforced at API level
```

---

## 6. Security Architecture

### 6.1 Security Layers

| Layer | Mechanism | Implementation |
|-------|-----------|----------------|
| Network | WAF + DDoS | Cloudflare |
| Transport | TLS 1.3 | cert-manager on K8s |
| Authentication | JWT Sessions | NextAuth.js |
| Authorization | RBAC | Middleware + API guards |
| Password | bcrypt (salt=12) | bcryptjs |
| Data | Input validation | Zod schemas |
| XSS | CSP Headers | Next.js headers config |
| CSRF | SameSite cookies | NextAuth.js default |
| SQL/NoSQL Injection | Mongoose ORM | Parameterized queries |
| Secrets | K8s Secrets | Environment variables |

### 6.2 Role-Based Access Control (RBAC)

| Role | Dashboard | Vehicles | Assets | Maintenance | Finance | Users | Settings |
|------|-----------|----------|--------|-------------|---------|-------|----------|
| Super Admin | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W |
| Admin | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R | ✅ R |
| Manager | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R | ❌ | ❌ |
| Sales | ✅ R | ✅ R/W | ✅ R | ❌ | ❌ | ❌ | ❌ |
| Technician | ✅ R | ✅ R | ✅ R | ✅ R/W | ❌ | ❌ | ❌ |
| Viewer | ✅ R | ✅ R | ✅ R | ✅ R | ❌ | ❌ | ❌ |

---

## 7. Kubernetes Architecture

### 7.1 Cluster Layout

```
Kubernetes Cluster
├── Namespace: gati-tech-prod
│   ├── Deployments
│   │   ├── gati-tech-app     (3 replicas, HPA: 3-10)
│   │   ├── redis             (1 replica, StatefulSet)
│   │   └── mongo-seed        (Job, initial data)
│   ├── Services
│   │   ├── gati-tech-svc     (ClusterIP)
│   │   └── redis-svc         (ClusterIP)
│   ├── Ingress
│   │   └── gati-tech-ingress (NGINX, TLS)
│   ├── ConfigMaps
│   │   └── gati-tech-config  (App configuration)
│   ├── Secrets
│   │   └── gati-tech-secrets (DB URI, JWT secret)
│   └── HPA
│       └── gati-tech-hpa     (CPU/Memory based)
│
├── Namespace: monitoring
│   ├── Prometheus
│   ├── Grafana
│   └── AlertManager
│
└── Namespace: logging
    ├── Elasticsearch
    ├── Logstash
    └── Kibana
```

### 7.2 Resource Requirements

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| App Pod | 250m | 1000m | 512Mi | 1Gi |
| Redis | 100m | 500m | 256Mi | 512Mi |
| MongoDB | External (Atlas) | — | — | — |

---

## 8. UAT Test Plan

### 8.1 Test Categories

#### Functional Testing
- [ ] User authentication (login/logout/session expiry)
- [ ] Asset CRUD operations (create, read, update, delete)
- [ ] Vehicle inventory management (add, status change, sell)
- [ ] Maintenance work order lifecycle (create → in-progress → complete)
- [ ] Parts inventory and reorder alerts
- [ ] Customer profile management
- [ ] Vendor management
- [ ] Report generation (PDF download)
- [ ] Dashboard KPIs accuracy
- [ ] Multi-branch data isolation

#### Performance Testing
- [ ] Page load time < 2s (LCP under 2.5s)
- [ ] API response time < 200ms (p95)
- [ ] Dashboard rendering < 1s with 1000+ assets
- [ ] Concurrent users: 50+ without degradation
- [ ] Database query time < 100ms with indexes

#### Security Testing
- [ ] SQL/NoSQL injection prevention
- [ ] XSS attack prevention
- [ ] CSRF protection verification
- [ ] Authentication bypass attempts
- [ ] Role-based access enforcement
- [ ] JWT token manipulation
- [ ] Brute force protection
- [ ] Sensitive data in logs check

#### Compatibility Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile responsive (iOS Safari, Android Chrome)

---

## 9. Deployment Architecture

### 9.1 CI/CD Pipeline

```
Developer Push
    ↓
GitHub Actions Trigger
    ↓
├── Unit Tests (Jest)
├── Integration Tests (Playwright)
├── Security Scan (Trivy, npm audit)
├── TypeScript Check
└── Lint Check
    ↓
Docker Build & Push (GHCR/ECR)
    ↓
Helm Deploy to Staging
    ↓
Automated E2E Tests
    ↓
Manual UAT Sign-off
    ↓
Helm Deploy to Production
    ↓
Post-deploy Health Check
```

### 9.2 Environment Configuration

| Environment | URL | Replicas | DB |
|-------------|-----|----------|-----|
| Development | localhost:9002 | 1 | Local MongoDB |
| Staging | staging.gatitech.in | 2 | MongoDB Atlas (staging) |
| Production | ams.gatitech.in | 3-10 (HPA) | MongoDB Atlas (prod) |

---

## 10. Monitoring & Observability

### 10.1 Key Metrics
- **Availability**: 99.9% uptime SLA
- **Error Rate**: < 0.1% of requests
- **Response Time**: p95 < 500ms
- **CPU Usage**: < 70% average
- **Memory Usage**: < 80% of limit

### 10.2 Alerting Rules
- API error rate > 1% → PagerDuty alert
- Pod restart count > 3 in 5min → Slack alert
- Database connection failures → PagerDuty critical
- CPU > 80% sustained 5min → Auto-scale + Slack
- Disk usage > 85% → Email alert

---

*Document maintained by Gati-Tech Platform Team*  
*Last Updated: June 2024*
