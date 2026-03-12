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
} from "../bindings/review-server";

interface ReviewDbContextValue {
  connection: DbConnection | null;
  connected: boolean;
  error: string | null;
}

const ReviewDbContext = createContext<ReviewDbContextValue>({
  connection: null,
  connected: false,
  error: null,
});

export interface ReviewDbProviderProps {
  children: ReactNode;
  host: string;
  moduleName: string;
  authToken?: string;
}

export function ReviewDbProvider({
  children,
  host,
  moduleName,
  authToken,
}: ReviewDbProviderProps) {
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
          .subscribe(["SELECT * FROM review"]);
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
    <ReviewDbContext.Provider value={{ connection, connected, error }}>
      {children}
    </ReviewDbContext.Provider>
  );
}

export function useReviewDb() {
  return useContext(ReviewDbContext);
}

export function useReviewDbConnection(): DbConnection {
  const ctx = useContext(ReviewDbContext);
  if (!ctx.connection) {
    throw new Error(
      "useReviewDbConnection must be used inside ReviewDbProvider after connection is established",
    );
  }
  return ctx.connection;
}
