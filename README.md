<h1 align="center">Neuro Cart | AI-Powered E-Commerce Platform</h1>

<p align="center">
  <strong>Microservices E-Commerce with Real-Time Sync, AI Content Intelligence, and Multi-Dashboard Architecture</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SpacetimeDB-2.0-10b981?style=for-the-badge" alt="SpacetimeDB" />
  <img src="https://img.shields.io/badge/Vercel_AI_SDK-6.0-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel AI SDK" />
  <img src="https://img.shields.io/badge/Cohere-Command_A-purple?style=for-the-badge" alt="Cohere" />
  <img src="https://img.shields.io/badge/Clerk-6.12-6C47FF?style=for-the-badge" alt="Clerk" />
  <img src="https://img.shields.io/badge/Turborepo-2.8-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Rust-2024_Edition-DEA584?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/pnpm-9.0-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
  <a href="https://creativecommons.org/licenses/by-nc/4.0/">
    <img src="https://img.shields.io/badge/License-CC_BY--NC_4.0-EF9421?style=for-the-badge&logo=creative-commons&logoColor=white" alt="CC BY-NC 4.0" />
  </a>
</p>

## Overview

Neuro Cart is a production-grade e-commerce platform built as a Turborepo monorepo. It features three independent Next.js 16 dashboards, **Store** (customer-facing), **Seller** (merchant portal), and **Admin** (platform operations), backed by six Rust-based SpacetimeDB microservices. AI capabilities for content moderation, product generation, fraud detection, and intelligent search are powered by Cohere's Command A model via the Vercel AI SDK through Next.js Server Actions.

Every data mutation flows through SpacetimeDB WASM reducers over WebSockets. There are zero REST endpoints, zero HTTP round-trips for CRUD. Clients subscribe to table changes and receive real-time delta pushes, the UI stays synchronized across all connected dashboards instantly.

## Monorepo Structure

```
neuro-cart/
├── apps/
│   ├── store/          → Customer storefront (Next.js, port 3000)
│   ├── seller/         → Merchant dashboard (Next.js, port 3001)
│   └── admin/          → Platform admin panel (Next.js, port 3002)
├── servers/
│   ├── product-server/ → Product catalog + categories (Rust/WASM)
│   ├── cart-server/    → Cart items + wishlists (Rust/WASM)
│   ├── order-server/   → Orders + order items (Rust/WASM)
│   ├── user-server/    → User profiles + seller profiles (Rust/WASM)
│   ├── review-server/  → Product reviews + ratings (Rust/WASM)
│   └── payment-server/ → Payment processing (Rust/WASM)
├── packages/
│   ├── ui/             → Shared React component library (Button, Input, Select)
│   ├── shared/         → Hooks, providers, SpacetimeDB bindings, types
│   ├── eslint-config/  → Shared ESLint configuration
│   └── typescript-config/ → Shared TSConfig presets
├── turbo.json          → Turborepo pipeline config
└── pnpm-workspace.yaml → Workspace definition
```

## Architecture

### Why SpacetimeDB Over REST

Traditional e-commerce backends use REST APIs with PostgreSQL. Every read is a round-trip. Every write is a round-trip. Real-time features require bolting on a separate WebSocket layer. Neuro Cart eliminates all of this.

SpacetimeDB compiles Rust structs into WASM modules. Clients connect over a single WebSocket, call reducers (the equivalent of API endpoints), and receive table-change deltas pushed automatically. The data model, business logic, and real-time sync are a single artifact.

| Aspect         | REST + PostgreSQL         | SpacetimeDB                     |
| :------------- | :------------------------ | :------------------------------ |
| Read latency   | HTTP round-trip per query | In-memory table iteration       |
| Write latency  | HTTP + SQL transaction    | WASM reducer execution          |
| Real-time sync | Separate WebSocket layer  | Built-in subscription push      |
| Backend code   | Express/Fastify + ORM     | Rust struct + reducer functions |
| Deployment     | API server + DB server    | Single WASM module publish      |

### Data Synchronization Flow

```mermaid
sequenceDiagram
    participant C as Next.js Client
    participant WS as WebSocket
    participant W as WASM Reducer
    participant T as In-Memory Tables

    rect rgb(15, 42, 30)
    Note over C: User Action
    C->>WS: Call Reducer (e.g. addToCart)
    WS->>W: Execute WASM Logic
    W->>T: Mutate In-Memory State
    T-->>WS: Broadcast Delta to All Subscribers
    WS-->>C: onUpdate Callback → React Re-render
    Note over C: UI Updated Instantly
    end
```

### Microservices Architecture

```mermaid
graph TB
    subgraph Clients
        ST[Store App<br/>Port 3000]
        SE[Seller App<br/>Port 3001]
        AD[Admin App<br/>Port 3002]
    end

    subgraph Auth
        CK[Clerk Auth]
    end

    subgraph AI Layer
        SA[Next.js Server Actions]
        CO[Cohere Command A]
    end

    subgraph SpacetimeDB Microservices
        PS[product-server<br/>Product + Category]
        CS[cart-server<br/>CartItem + WishlistItem]
        OS[order-server<br/>Order + OrderItem]
        US[user-server<br/>UserProfile + SellerProfile]
        RS[review-server<br/>Review]
        PMS[payment-server<br/>Payment]
    end

    ST & SE & AD -->|WebSocket| PS & CS & OS & US & RS & PMS
    ST & SE & AD -->|Session| CK
    ST & SE & AD -->|Server Action| SA
    SA -->|generateText| CO

    style PS fill:#6c5ce7,color:#fff
    style CS fill:#00cec9,color:#fff
    style OS fill:#fd79a8,color:#fff
    style US fill:#f39c12,color:#fff
    style RS fill:#27ae60,color:#fff
    style PMS fill:#e74c3c,color:#fff
    style CO fill:#8b5cf6,color:#fff
```

### AI Server Actions Architecture

```mermaid
sequenceDiagram
    participant UC as Client Component
    participant SA as Next.js Server Action
    participant AI as Cohere Command A

    rect rgb(30, 15, 42)
    Note over UC: Store App
    UC->>SA: searchProducts(query)
    SA->>AI: generateText(search prompt)
    AI-->>SA: JSON suggestions array
    SA-->>UC: Parsed search results
    end

    rect rgb(15, 30, 42)
    Note over UC: Seller App
    UC->>SA: generateProductDescription(name, category, keywords)
    SA->>AI: generateText(description prompt)
    AI-->>SA: Product copy text
    SA-->>UC: AI-written description
    end

    rect rgb(42, 15, 30)
    Note over UC: Admin App
    UC->>SA: analyzeContent(content, contentType)
    SA->>AI: generateText(moderation prompt)
    AI-->>SA: JSON safety analysis
    SA-->>UC: Moderation result with flags
    end
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Next.js App
    participant CK as Clerk
    participant SDB as SpacetimeDB

    U->>C: Visit /sign-in
    C->>CK: Render Clerk Sign-In
    U->>CK: Enter Credentials
    CK-->>C: Session Token + User Object
    C->>SDB: Connect 6 WebSockets (with clerkId)
    SDB-->>C: Subscription Sync (all tables)
    C-->>U: Render Dashboard
```

## Database Schema

```mermaid
erDiagram
    UserProfile {
        string id PK
        string clerk_id UK
        string email
        string first_name
        string last_name
        string phone
        string address
        string avatar
        UserRole role
        AccountStatus status
        timestamp created_at
        timestamp updated_at
    }
    SellerProfile {
        string id PK
        string user_id FK
        string store_name
        string store_description
        string logo
        string banner
        float rating
        int total_sales
        int total_products
        AccountStatus status
        timestamp created_at
        timestamp updated_at
    }
    Product {
        string id PK
        string name
        float price
        float original_price
        int discount
        float rating
        int review_count
        string image
        string category_id FK
        bool in_stock
        bool is_new
        bool is_featured
        int stock
        int sold_count
        string seller_id FK
        ProductCondition condition
        ProductStatus status
        timestamp created_at
        timestamp updated_at
    }
    Category {
        string id PK
        string name
        string icon
        int product_count
        timestamp created_at
        timestamp updated_at
    }
    Order {
        string id PK
        string user_id FK
        string seller_id FK
        float total
        float subtotal
        float tax
        float shipping_cost
        OrderStatus status
        string shipping_address
        string billing_address
        string payment_id FK
        string notes
        timestamp created_at
        timestamp updated_at
    }
    OrderItem {
        string id PK
        string order_id FK
        string product_id FK
        string product_name
        int quantity
        float unit_price
        float total_price
        string selected_color
        string selected_size
        timestamp created_at
    }
    CartItem {
        string id PK
        string user_id FK
        string product_id FK
        string product_name
        string product_image
        float unit_price
        int quantity
        string selected_color
        string selected_size
        timestamp created_at
        timestamp updated_at
    }
    WishlistItem {
        string id PK
        string user_id FK
        string product_id FK
        string product_name
        string product_image
        float unit_price
        timestamp added_at
    }
    Review {
        string id PK
        string product_id FK
        string user_id FK
        string user_name
        int rating
        string comment
        int helpful_count
        timestamp created_at
        timestamp updated_at
    }
    Payment {
        string id PK
        string order_id FK
        string user_id FK
        float amount
        PaymentMethod method
        PaymentStatus status
        string transaction_ref
        timestamp created_at
        timestamp updated_at
    }

    UserProfile ||--o{ SellerProfile : "has seller profile"
    UserProfile ||--o{ Order : "places"
    UserProfile ||--o{ CartItem : "owns"
    UserProfile ||--o{ WishlistItem : "saves"
    UserProfile ||--o{ Review : "writes"
    UserProfile ||--o{ Payment : "makes"
    SellerProfile ||--o{ Product : "sells"
    SellerProfile ||--o{ Order : "fulfills"
    Product ||--o{ OrderItem : "ordered in"
    Product ||--o{ CartItem : "added to"
    Product ||--o{ WishlistItem : "wishlisted"
    Product ||--o{ Review : "reviewed"
    Category ||--o{ Product : "categorizes"
    Order ||--o{ OrderItem : "contains"
    Order ||--o{ Payment : "paid via"
```

## AI Capabilities

All AI features use real Cohere Command A model calls via Next.js Server Actions (`"use server"`).

### Store AI

| Action          | Function                                | Description                                             |
| :-------------- | :-------------------------------------- | :------------------------------------------------------ |
| Smart Search    | `searchProducts(query)`                 | Natural language product search with category inference |
| Recommendations | `getRecommendations(product, category)` | AI-generated related product suggestions                |
| Summarization   | `generateProductSummary(description)`   | Concise listing summaries from long descriptions        |

### Seller AI

| Action          | Function                                               | Description                               |
| :-------------- | :----------------------------------------------------- | :---------------------------------------- |
| Copy Generation | `generateProductDescription(name, category, keywords)` | AI-written product listings               |
| Tag Generation  | `generateProductTags(name, description)`               | SEO-optimized product tags                |
| Sales Analysis  | `analyzeSalesData(salesSummary)`                       | Business intelligence from sales patterns |

### Admin AI

| Action             | Function                               | Description                            |
| :----------------- | :------------------------------------- | :------------------------------------- |
| Content Moderation | `analyzeContent(content, contentType)` | Automated policy violation detection   |
| Platform Insights  | `generatePlatformInsights(metrics)`    | AI-driven analytics from platform data |
| Fraud Detection    | `detectFraud(transactionData)`         | Risk scoring for transaction patterns  |

## User Flows

### Customer Purchase Flow

```mermaid
graph LR
    A([Browse Store]) --> B([Product Details])
    B --> C([Add to Cart])
    C --> D([Checkout])
    D --> E([Payment])
    E --> F([Order Confirmed ✓])

    style A fill:#10b981,color:#fff
    style F fill:#10b981,color:#fff
    style E fill:#6c5ce7,color:#fff
```

### Seller Product Listing

```mermaid
graph LR
    A([Seller Dashboard]) --> B([New Product])
    B --> C([AI Generate Description])
    C --> D([AI Generate Tags])
    D --> E([Set Price + Stock])
    E --> F([Published ✓])

    style A fill:#6366f1,color:#fff
    style F fill:#10b981,color:#fff
    style C fill:#8b5cf6,color:#fff
    style D fill:#8b5cf6,color:#fff
```

### Admin Moderation Flow

```mermaid
graph LR
    A([Admin Dashboard]) --> B([Moderation Queue])
    B --> C([AI Analyzes Content])
    C --> D{Safe?}
    D -->|Yes| E([Dismiss Flag])
    D -->|No| F([Take Action])
    F --> G([Resolved ✓])

    style A fill:#6366f1,color:#fff
    style G fill:#10b981,color:#fff
    style C fill:#8b5cf6,color:#fff
    style F fill:#e74c3c,color:#fff
```

## Features by Dashboard

### Store (Customer)

- Product catalog with search, filtering, categories
- AI-powered product search and recommendations
- Shopping cart with quantity management
- Wishlist for saved items
- Full checkout flow with payment
- Order history and cancellation
- Product reviews and ratings
- User account management with Clerk
- Dark/light theme toggle
- Arabic/English i18n with RTL support

### Seller (Merchant)

- Sales dashboard with revenue metrics
- Product management (create, edit, stock)
- AI-generated product descriptions and tags
- Order fulfillment tracking
- Sales analytics with AI insights
- Store profile and settings
- Dark/light theme toggle
- Arabic/English i18n with RTL support

### Admin (Platform)

- Platform-wide analytics (GMV, orders, users)
- Revenue and category distribution charts
- User and seller management
- AI-powered content moderation queue
- AI tools center (moderation, suggestions, forecasting)
- Order monitoring across all sellers
- Product oversight with bulk actions
- Platform settings and security
- Dark/light theme toggle
- Arabic/English i18n with RTL support

## Shared Packages

### `@neuro-cart/ui`

Reusable React component library used across all 3 apps: `Button`, `Input`, `Select`. Consistent styling via CSS modules with theme-aware CSS variables.

### `@neuro-cart/shared`

- **Hooks**: `useProducts`, `useCart`, `useOrders`, `useUserProfiles`, `usePayments`, `useReviews`, `useModeration`, `useAITools`
- **Providers**: 6 SpacetimeDB connection providers (Product, Cart, Order, User, Review, Payment)
- **Bindings**: Auto-generated TypeScript bindings for all 6 server modules
- **Types**: Shared type definitions derived from SpacetimeDB schemas

## Scripts

| Command            | Description                                       |
| :----------------- | :------------------------------------------------ |
| `pnpm dev`         | Start all 3 dev servers via Turborepo             |
| `pnpm build`       | TypeScript check + production build (all apps)    |
| `pnpm lint`        | ESLint strict checks across monorepo (0 warnings) |
| `pnpm check-types` | TypeScript verification for all packages          |
| `pnpm format`      | Prettier formatting                               |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- SpacetimeDB CLI (`spacetime`)

### Installation

```sh
git clone https://github.com/littlestmo/neuro-cart.git
cd neuro-cart
pnpm install
```

### Environment Setup

Create `.env.local` in each app directory (`apps/store/`, `apps/seller/`, `apps/admin/`):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
COHERE_API_KEY=your_cohere_api_key
NEXT_PUBLIC_SPACETIMEDB_URI=http://localhost:3000
```

### Deploy SpacetimeDB Modules

```sh
spacetime start

spacetime publish -s local neuro-cart-products
spacetime publish -s local neuro-cart-cart
spacetime publish -s local neuro-cart-orders
spacetime publish -s local neuro-cart-users
spacetime publish -s local neuro-cart-reviews
spacetime publish -s local neuro-cart-payments
```

### Generate TypeScript Bindings

TODO

### Run Development Servers

```sh
pnpm dev
```

| App    | URL                     |
| :----- | :---------------------- |
| Store  | `http://localhost:3001` |
| Seller | `http://localhost:3002` |
| Admin  | `http://localhost:3003` |

## Tutorials

| Guide                                                            | Description                                   |
| :--------------------------------------------------------------- | :-------------------------------------------- |
| [Environment Setup](docs/tutorials/setup-env.md)                 | Configure all environment variables           |
| [Clerk Auth Setup](docs/tutorials/clerk-setup.md)                | Get Clerk API keys step by step               |
| [Cohere AI Setup](docs/tutorials/cohere-ai-setup.md)             | Get Cohere API key for AI features            |
| [SpacetimeDB Setup](docs/tutorials/spacetimedb-setup.md)         | Manage microservices and bindings             |
| [AI Integration](docs/tutorials/ai-integration.md)               | How Server Actions and Cohere are implemented |
| [i18n Setup](docs/tutorials/i18n-setup.md)                       | Multi-language and RTL configuration          |
| [Railway Deployment Guide](docs/tutorials/railway-deployment.md) | Deploying to Railway natively                 |

## License

<p>
  <a href="https://creativecommons.org/licenses/by-nc/4.0/">
    <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc.png" alt="CC BY-NC 4.0" />
  </a>
</p>

This work is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).
