"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { type DbConnection } from "../bindings/payment-server";
import { usePaymentDb } from "../providers/PaymentDbProvider";
import { type Payment } from "../bindings/payment-server/types";

type CreatePaymentParams = Parameters<
  DbConnection["reducers"]["createPayment"]
>[0];
type UpdatePaymentStatusParams = Parameters<
  DbConnection["reducers"]["updatePaymentStatus"]
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

export function usePayments(userId?: string) {
  const { connection, connected } = usePaymentDb();

  const allPayments = useTableData<Payment>(
    useCallback((conn: DbConnection) => conn.db.payment.iter(), []),
    connection,
    connected,
  );

  const payments = useMemo(() => {
    if (!userId) return allPayments;
    return allPayments.filter((p) => p.userId === userId);
  }, [allPayments, userId]);

  const createPayment = useCallback(
    (params: CreatePaymentParams) => {
      if (!connection || !connected) return;
      connection.reducers.createPayment(params);
    },
    [connection, connected],
  );

  const updatePaymentStatus = useCallback(
    (params: UpdatePaymentStatusParams) => {
      if (!connection || !connected) return;
      connection.reducers.updatePaymentStatus(params);
    },
    [connection, connected],
  );

  return {
    payments,
    createPayment,
    updatePaymentStatus,
    connected,
  };
}
