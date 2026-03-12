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
} from "../bindings/order-server";

interface OrderDbContextValue {
  connection: DbConnection | null;
  connected: boolean;
  error: string | null;
}

const OrderDbContext = createContext<OrderDbContextValue>({
  connection: null,
  connected: false,
  error: null,
});

export interface OrderDbProviderProps {
  children: ReactNode;
  host: string;
  moduleName: string;
  authToken?: string;
}

export function OrderDbProvider({
  children,
  host,
  moduleName,
  authToken,
}: OrderDbProviderProps) {
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
          .subscribe(["SELECT * FROM order", "SELECT * FROM order_item"]);
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
    <OrderDbContext.Provider value={{ connection, connected, error }}>
      {children}
    </OrderDbContext.Provider>
  );
}

export function useOrderDb() {
  return useContext(OrderDbContext);
}

export function useOrderDbConnection(): DbConnection {
  const ctx = useContext(OrderDbContext);
  if (!ctx.connection) {
    throw new Error(
      "useOrderDbConnection must be used inside OrderDbProvider after connection is established",
    );
  }
  return ctx.connection;
}
