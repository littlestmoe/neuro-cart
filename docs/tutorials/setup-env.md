# Environment Setup

Configure all environment variables needed to run the Neuro Cart monorepo locally.

## Prerequisites

| Tool            | Version      | Install                                           |
| :-------------- | :----------- | :------------------------------------------------ |
| Node.js         | 22+          | [nodejs.org](https://nodejs.org)                  |
| pnpm            | 9+           | `npm install -g pnpm`                             |
| Rust            | 2024 Edition | [rustup.rs](https://rustup.rs)                    |
| SpacetimeDB CLI | Latest       | `curl -sSf https://install.spacetimedb.com \| sh` |

## Install Dependencies

```sh
cd neuro-cart
pnpm install
```

## Environment Files

Each app requires its own `.env.local`. Create one in each of the three app directories:

### `apps/store/.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
COHERE_API_KEY=your_cohere_api_key
NEXT_PUBLIC_SPACETIMEDB_URI=http://localhost:3000
NEXT_PUBLIC_SPACETIMEDB_PRODUCT_MODULE=neuro-cart-products
NEXT_PUBLIC_SPACETIMEDB_CART_MODULE=neuro-cart-cart
NEXT_PUBLIC_SPACETIMEDB_ORDER_MODULE=neuro-cart-orders
NEXT_PUBLIC_SPACETIMEDB_USER_MODULE=neuro-cart-users
NEXT_PUBLIC_SPACETIMEDB_REVIEW_MODULE=neuro-cart-reviews
NEXT_PUBLIC_SPACETIMEDB_PAYMENT_MODULE=neuro-cart-payments
```

### `apps/seller/.env.local`

Same variables as Store. Seller and Store share the same Clerk application.

### `apps/admin/.env.local`

Same variables. Admin may use a separate Clerk application or the same one with role-based access.

## Variable Reference

| Variable                            | Required | Description                                   |
| :---------------------------------- | :------- | :-------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Clerk frontend key from your Clerk dashboard  |
| `CLERK_SECRET_KEY`                  | Yes      | Clerk backend key (never exposed to client)   |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | Yes      | Path to sign-in page                          |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | Yes      | Path to sign-up page                          |
| `COHERE_API_KEY`                    | Yes      | Cohere API key for AI server actions          |
| `NEXT_PUBLIC_SPACETIMEDB_URI`       | Yes      | SpacetimeDB server address                    |
| `NEXT_PUBLIC_SPACETIMEDB_*_MODULE`  | Yes      | Module name for each SpacetimeDB microservice |

## Verify Setup

```sh
pnpm build
```

A successful build confirms all environment variables and dependencies are correctly configured.
