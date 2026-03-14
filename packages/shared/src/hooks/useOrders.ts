"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { type DbConnection } from "../bindings/order-server";
import { useOrderDb } from "../providers/OrderDbProvider";
import { type Order, type OrderItem } from "../bindings/order-server/types";

type CreateOrderParams = Parameters<DbConnection["reducers"]["createOrder"]>[0];
type AddOrderItemParams = Parameters<
  DbConnection["reducers"]["addOrderItem"]
>[0];
type UpdateOrderStatusParams = Parameters<
  DbConnection["reducers"]["updateOrderStatus"]
>[0];
type CancelOrderParams = Parameters<DbConnection["reducers"]["cancelOrder"]>[0];

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

export function useOrders(userId?: string, sellerId?: string) {
  const { connection, connected } = useOrderDb();

  const allOrders = useTableData<Order>(
    useCallback((conn: DbConnection) => conn.db.order.iter(), []),
    connection,
    connected,
  );

  const allOrderItems = useTableData<OrderItem>(
    useCallback((conn: DbConnection) => conn.db.order_item.iter(), []),
    connection,
    connected,
  );

  const orders = useMemo(() => {
    // If specific IDs are requested but not yet loaded, return empty to avoid flickering all data
    if (userId === "" || sellerId === "") return [];
    
    let filtered = allOrders;
    if (userId) filtered = filtered.filter((o) => o.userId === userId);
    if (sellerId) filtered = filtered.filter((o) => o.sellerId === sellerId);
    return filtered;
  }, [allOrders, userId, sellerId]);

  const orderItems = useMemo(() => {
    if (!userId && !sellerId) return allOrderItems;
    const orderIds = new Set(orders.map((o) => o.id));
    return allOrderItems.filter((item) => orderIds.has(item.orderId));
  }, [allOrderItems, orders, userId, sellerId]);

  const createOrder = useCallback(
    (params: CreateOrderParams) => {
      if (!connection || !connected) return;
      connection.reducers.createOrder(params);
    },
    [connection, connected],
  );

  const addOrderItem = useCallback(
    (params: AddOrderItemParams) => {
      if (!connection || !connected) return;
      connection.reducers.addOrderItem(params);
    },
    [connection, connected],
  );

  const updateOrderStatus = useCallback(
    (params: UpdateOrderStatusParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateOrderStatus(params);
    },
    [connection, connected],
  );

  const cancelOrder = useCallback(
    (params: CancelOrderParams) => {
      if (!connection || !connected) return;
      connection.reducers.cancelOrder(params);
    },
    [connection, connected],
  );

  return {
    orders,
    orderItems,
    createOrder,
    addOrderItem,
    updateOrderStatus,
    cancelOrder,
    connected,
  };
}
