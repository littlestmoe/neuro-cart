"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DbConnection,
  type ErrorContext,
  type SubscriptionHandle,
} from "../bindings/cart-server";

interface CartDbContextValue {
  connection: DbConnection | null;
  connected: boolean;
  error: string | null;
}

const CartDbContext = createContext<CartDbContextValue>({
  connection: null,
  connected: false,
  error: null,
});

export interface CartDbProviderProps {
  children: ReactNode;
  host: string;
  moduleName: string;
  authToken?: string;
}

export function CartDbProvider({
  children,
  host,
  moduleName,
  authToken,
}: CartDbProviderProps) {
  const [connection, setConnection] = useState<DbConnection | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connRef = useRef<DbConnection | null>(null);
  const subRef = useRef<SubscriptionHandle | null>(null);

  useEffect(() => {
    const builder = DbConnection.builder()
      .withUri(host)
      .withDatabaseName(moduleName)
      .onConnect((conn: DbConnection) => {
        setConnected(true);
        setError(null);
        connRef.current = conn;

        const handle = conn
          .subscriptionBuilder()
          .onApplied(() => {})
          .subscribe([
            "SELECT * FROM cart_item",
            "SELECT * FROM wishlist_item",
          ]);
        subRef.current = handle;
      })
      .onDisconnect(() => {
        setConnected(false);
      })
      .onConnectError((_ctx: ErrorContext, e: Error) => {
        setError(String(e));
        setConnected(false);
      });

    if (authToken) {
      builder.withToken(authToken);
    }

    const conn = builder.build();
    setConnection(conn);
    connRef.current = conn;

    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
      if (connRef.current) {
        connRef.current.disconnect();
      }
    };
  }, [host, moduleName, authToken]);

  return (
    <CartDbContext.Provider value={{ connection, connected, error }}>
      {children}
    </CartDbContext.Provider>
  );
}

export function useCartDb() {
  return useContext(CartDbContext);
}

export function useCartDbConnection(): DbConnection {
  const ctx = useContext(CartDbContext);
  if (!ctx.connection) {
    throw new Error(
      "useCartDbConnection must be used inside CartDbProvider after connection is established",
    );
  }
  return ctx.connection;
}
