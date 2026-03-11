# Deploying Neuro Cart to Railway

Neuro Cart consists of three Next.js dashboards (Store, Seller, and Admin). Since they are part of a Turborepo monorepo, Railway requires specific configurations to build and deploy each app independently.

We have already included a `nixpacks.toml` file at the root to enforce `pnpm` usage, and the `next.config.ts` files are configured for `standalone` output mode.

Follow these steps to deploy all three dashboards from the same GitHub repository natively in Railway.

## 1. Deploy the Store Dashboard

1. Go to Railway -> **New Project** -> **Deploy from GitHub repo**.
1. Select your `neuro-cart` repository.
1. Railway will start building. Go to the service **Settings** panel.
1. **Root Directory:** Leave this blank (or `/`).
1. Scroll to the **Build** section:
   - **Build Command:** `pnpm build --filter=@neuro-cart/store`
1. Scroll down to the **Deploy** section:
   - **Start Command:** `pnpm --filter @neuro-cart/store start`
1. Go to the **Variables** tab and add all your Store environment variables (Clerk keys, SpacetimeDB URIs, Cohere API key, etc.).
1. Click **Deploy**.

## 2. Deploy the Seller Dashboard

1. Go back to your Railway project dashboard.
1. Click **Create** -> **GitHub Repo**.
1. Select your exact same `neuro-cart` repository again.
1. Go to this new service's **Settings** panel.
1. In the **Build** section:
   - **Root Directory:** Leave blank.
   - **Build Command:** `pnpm build --filter=@neuro-cart/seller`
1. In the **Deploy** section:
   - **Start Command:** `pnpm --filter @neuro-cart/seller start`
1. Go to the **Variables** tab and add your Seller environment variables.
1. Click **Deploy**.

## 3. Deploy the Admin Dashboard

1. Follow the same steps as above for the Admin dashboard.
1. In the **Build** section:
   - **Build Command:** `pnpm build --filter=@neuro-cart/admin`
1. In the **Deploy** section:
   - **Start Command:** `pnpm --filter @neuro-cart/admin start`
1. Add your Admin environment variables in the **Variables** tab.
1. Click **Deploy**.

### Why this works

Because Next.js `output: "standalone"` is enabled and `nixpacks.toml` configures pnpm for the workspace, Railway correctly captures all shared local packages (`@neuro-cart/ui`, `@neuro-cart/shared`) and isolates each dashboard into its own optimized Docker container.

## SpacetimeDB Deployment

SpacetimeDB modules should be published separately via the SpacetimeDB CLI:

```sh
spacetime login

spacetime publish -s maincloud neuro-cart-cart
spacetime publish -s maincloud neuro-cart-orders
spacetime publish -s maincloud neuro-cart-payments
spacetime publish -s maincloud neuro-cart-products
spacetime publish -s maincloud neuro-cart-reviews
spacetime publish -s maincloud neuro-cart-users
```

Update your Railway environment variables with the production SpacetimeDB modules.
