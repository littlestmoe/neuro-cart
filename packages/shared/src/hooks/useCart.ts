"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { type DbConnection } from "../bindings/cart-server";
import { useCartDb } from "../providers/CartDbProvider";
import {
  type CartItem,
  type WishlistItem,
} from "../bindings/cart-server/types";

type AddToCartParams = Parameters<DbConnection["reducers"]["addToCart"]>[0];
type RemoveFromCartParams = Parameters<
  DbConnection["reducers"]["removeFromCart"]
>[0];
type UpdateCartQuantityParams = Parameters<
  DbConnection["reducers"]["updateCartQuantity"]
>[0];
type ClearUserCartParams = Parameters<
  DbConnection["reducers"]["clearUserCart"]
>[0];
type AddToWishlistParams = Parameters<
  DbConnection["reducers"]["addToWishlist"]
>[0];
type RemoveFromWishlistParams = Parameters<
  DbConnection["reducers"]["removeFromWishlist"]
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

export function useCart(userId?: string) {
  const { connection, connected } = useCartDb();

  const allCartItems = useTableData<CartItem>(
    useCallback((conn: DbConnection) => conn.db.cart_item.iter(), []),
    connection,
    connected,
  );

  const allWishlistItems = useTableData<WishlistItem>(
    useCallback((conn: DbConnection) => conn.db.wishlist_item.iter(), []),
    connection,
    connected,
  );

  const cartItems = useMemo(() => {
    if (!userId) return allCartItems;
    return allCartItems.filter((item) => item.userId === userId);
  }, [allCartItems, userId]);

  const wishlistItems = useMemo(() => {
    if (!userId) return allWishlistItems;
    return allWishlistItems.filter((item) => item.userId === userId);
  }, [allWishlistItems, userId]);

  const addToCart = useCallback(
    (params: AddToCartParams) => {
      if (!connection || !connected) return;
      connection.reducers.addToCart(params);
    },
    [connection, connected],
  );

  const removeFromCart = useCallback(
    (params: RemoveFromCartParams) => {
      if (!connection || !connected) return;
      connection.reducers.removeFromCart(params);
    },
    [connection, connected],
  );

  const updateCartQuantity = useCallback(
    (params: UpdateCartQuantityParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateCartQuantity(params);
    },
    [connection, connected],
  );

  const clearUserCart = useCallback(
    (params: ClearUserCartParams) => {
      if (!connection || !connected) return;
      connection.reducers.clearUserCart(params);
    },
    [connection, connected],
  );

  const addToWishlist = useCallback(
    (params: AddToWishlistParams) => {
      if (!connection || !connected) return;
      connection.reducers.addToWishlist(params);
    },
    [connection, connected],
  );

  const removeFromWishlist = useCallback(
    (params: RemoveFromWishlistParams) => {
      if (!connection || !connected) return;
      connection.reducers.removeFromWishlist(params);
    },
    [connection, connected],
  );

  return {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearUserCart,
    addToWishlist,
    removeFromWishlist,
    connected,
  };
}
