"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import {
  ProductDbProvider,
  CartDbProvider,
  UserDbProvider,
  OrderDbProvider,
  ReviewDbProvider,
  PaymentDbProvider,
} from "@neuro-cart/shared/providers";
import { useAuth } from "@clerk/nextjs";

const SPACETIMEDB_HOST =
  process.env.NEXT_PUBLIC_SPACETIMEDB_HOST || "ws://localhost:3000";

function SpacetimeProviders({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [token, setToken] = React.useState<string | undefined>();

  React.useEffect(() => {
    getToken().then((t) => setToken(t || undefined));
  }, [getToken]);

  return (
    <UserDbProvider
      host={SPACETIMEDB_HOST}
      moduleName="neuro-cart-user-server"
      authToken={token}
    >
      <ProductDbProvider
        host={SPACETIMEDB_HOST}
        moduleName="neuro-cart-product-server"
        authToken={token}
      >
        <CartDbProvider
          host={SPACETIMEDB_HOST}
          moduleName="neuro-cart-cart-server"
          authToken={token}
        >
          <OrderDbProvider
            host={SPACETIMEDB_HOST}
            moduleName="neuro-cart-order-server"
            authToken={token}
          >
            <ReviewDbProvider
              host={SPACETIMEDB_HOST}
              moduleName="neuro-cart-review-server"
              authToken={token}
            >
              <PaymentDbProvider
                host={SPACETIMEDB_HOST}
                moduleName="neuro-cart-payment-server"
                authToken={token}
              >
                {children}
              </PaymentDbProvider>
            </ReviewDbProvider>
          </OrderDbProvider>
        </CartDbProvider>
      </ProductDbProvider>
    </UserDbProvider>
  );
}

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="UTC"
      >
        <SpacetimeProviders>{children}</SpacetimeProviders>
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
}
