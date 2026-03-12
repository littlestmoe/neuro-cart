"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { type DbConnection } from "../bindings/user-server";
import { useUserDb } from "../providers/UserDbProvider";
import {
  type UserProfile,
  type SellerProfile,
} from "../bindings/user-server/types";

type CreateUserParams = Parameters<DbConnection["reducers"]["createUser"]>[0];
type UpdateUserParams = Parameters<DbConnection["reducers"]["updateUser"]>[0];
type UpdateUserStatusParams = Parameters<
  DbConnection["reducers"]["updateUserStatus"]
>[0];
type CreateSellerParams = Parameters<
  DbConnection["reducers"]["createSeller"]
>[0];
type UpdateSellerParams = Parameters<
  DbConnection["reducers"]["updateSeller"]
>[0];

function useTableData<T>(
  queryFn: (conn: DbConnection) => Iterable<T>,
  connection: DbConnection | null,
  connected: boolean,
): T[] {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    if (!connection || !connected) return;

    const refresh = () => {
      try {
        setData([...queryFn(connection)]);
      } catch {
        setData([]);
      }
    };

    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [connection, connected, queryFn]);

  return data;
}

export function useUserProfiles(clerkId?: string) {
  const { connection, connected } = useUserDb();

  const userProfiles = useTableData<UserProfile>(
    useCallback((conn: DbConnection) => conn.db.user_profile.iter(), []),
    connection,
    connected,
  );

  const sellerProfiles = useTableData<SellerProfile>(
    useCallback((conn: DbConnection) => conn.db.seller_profile.iter(), []),
    connection,
    connected,
  );

  const currentUser = useMemo(() => {
    if (!clerkId) return null;
    return userProfiles.find((u) => u.clerkId === clerkId) ?? null;
  }, [userProfiles, clerkId]);

  const createUser = useCallback(
    (params: CreateUserParams) => {
      if (!connection || !connected) return;
      connection.reducers.createUser(params);
    },
    [connection, connected],
  );

  const updateUser = useCallback(
    (params: UpdateUserParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateUser(params);
    },
    [connection, connected],
  );

  const updateUserStatus = useCallback(
    (params: UpdateUserStatusParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateUserStatus(params);
    },
    [connection, connected],
  );

  const createSeller = useCallback(
    (params: CreateSellerParams) => {
      if (!connection || !connected) return;
      connection.reducers.createSeller(params);
    },
    [connection, connected],
  );

  const updateSeller = useCallback(
    (params: UpdateSellerParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateSeller(params);
    },
    [connection, connected],
  );

  return {
    userProfiles,
    sellerProfiles,
    currentUser,
    createUser,
    updateUser,
    updateUserStatus,
    createSeller,
    updateSeller,
    connected,
  };
}
