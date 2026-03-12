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
} from "../bindings/payment-server";

interface PaymentDbContextValue {
  connection: DbConnection | null;
  connected: boolean;
  error: string | null;
}

const PaymentDbContext = createContext<PaymentDbContextValue>({
  connection: null,
  connected: false,
  error: null,
});

export interface PaymentDbProviderProps {
  children: ReactNode;
  host: string;
  moduleName: string;
  authToken?: string;
}

export function PaymentDbProvider({
  children,
  host,
  moduleName,
  authToken,
}: PaymentDbProviderProps) {
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
          .subscribe(["SELECT * FROM payment"]);
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
    <PaymentDbContext.Provider value={{ connection, connected, error }}>
      {children}
    </PaymentDbContext.Provider>
  );
}

export function usePaymentDb() {
  return useContext(PaymentDbContext);
}

export function usePaymentDbConnection(): DbConnection {
  const ctx = useContext(PaymentDbContext);
  if (!ctx.connection) {
    throw new Error(
      "usePaymentDbConnection must be used inside PaymentDbProvider after connection is established",
    );
  }
  return ctx.connection;
}
