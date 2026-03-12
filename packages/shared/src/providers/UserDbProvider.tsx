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
} from "../bindings/user-server";

interface UserDbContextValue {
  connection: DbConnection | null;
  connected: boolean;
  error: string | null;
}

const UserDbContext = createContext<UserDbContextValue>({
  connection: null,
  connected: false,
  error: null,
});

export interface UserDbProviderProps {
  children: ReactNode;
  host: string;
  moduleName: string;
  authToken?: string;
}

export function UserDbProvider({
  children,
  host,
  moduleName,
  authToken,
}: UserDbProviderProps) {
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
            "SELECT * FROM user_profile",
            "SELECT * FROM seller_profile",
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
    <UserDbContext.Provider value={{ connection, connected, error }}>
      {children}
    </UserDbContext.Provider>
  );
}

export function useUserDb() {
  return useContext(UserDbContext);
}

export function useUserDbConnection(): DbConnection {
  const ctx = useContext(UserDbContext);
  if (!ctx.connection) {
    throw new Error(
      "useUserDbConnection must be used inside UserDbProvider after connection is established",
    );
  }
  return ctx.connection;
}
