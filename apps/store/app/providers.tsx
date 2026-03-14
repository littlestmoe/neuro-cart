"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import {
  ProductDbProvider,
  CartDbProvider,
  UserDbProvider,
  ReviewDbProvider,
  OrderDbProvider,
  PaymentDbProvider,
} from "@neuro-cart/shared/providers";
import { useAuth } from "@clerk/nextjs";
import { SPACETIMEDB_MODULES } from "@neuro-cart/shared/constants";

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
      moduleName={
        process.env.NEXT_PUBLIC_USER_MODULE || SPACETIMEDB_MODULES.user
      }
      authToken={token}
    >
      <ProductDbProvider
        host={SPACETIMEDB_HOST}
        moduleName={
          process.env.NEXT_PUBLIC_PRODUCT_MODULE || SPACETIMEDB_MODULES.product
        }
        authToken={token}
      >
        <CartDbProvider
          host={SPACETIMEDB_HOST}
          moduleName={
            process.env.NEXT_PUBLIC_CART_MODULE || SPACETIMEDB_MODULES.cart
          }
          authToken={token}
        >
          <OrderDbProvider
            host={SPACETIMEDB_HOST}
            moduleName={
              process.env.NEXT_PUBLIC_ORDER_MODULE || SPACETIMEDB_MODULES.order
            }
            authToken={token}
          >
            <ReviewDbProvider
              host={SPACETIMEDB_HOST}
              moduleName={
                process.env.NEXT_PUBLIC_REVIEW_MODULE ||
                SPACETIMEDB_MODULES.review
              }
              authToken={token}
            >
              <PaymentDbProvider
                host={SPACETIMEDB_HOST}
                moduleName={
                  process.env.NEXT_PUBLIC_PAYMENT_MODULE ||
                  SPACETIMEDB_MODULES.payment
                }
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
