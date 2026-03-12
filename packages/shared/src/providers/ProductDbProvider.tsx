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
} from "../bindings/product-server";

interface ProductDbContextValue {
  connection: DbConnection | null;
  connected: boolean;
  error: string | null;
}

const ProductDbContext = createContext<ProductDbContextValue>({
  connection: null,
  connected: false,
  error: null,
});

export interface ProductDbProviderProps {
  children: ReactNode;
  host: string;
  moduleName: string;
  authToken?: string;
}

export function ProductDbProvider({
  children,
  host,
  moduleName,
  authToken,
}: ProductDbProviderProps) {
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
          .subscribe(["SELECT * FROM product", "SELECT * FROM category"]);
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
    <ProductDbContext.Provider value={{ connection, connected, error }}>
      {children}
    </ProductDbContext.Provider>
  );
}

export function useProductDb() {
  return useContext(ProductDbContext);
}

export function useProductDbConnection(): DbConnection {
  const ctx = useContext(ProductDbContext);
  if (!ctx.connection) {
    throw new Error(
      "useProductDbConnection must be used inside ProductDbProvider after connection is established",
    );
  }
  return ctx.connection;
}
