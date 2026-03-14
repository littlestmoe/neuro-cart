"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { type DbConnection } from "../bindings/product-server";
import { useProductDb } from "../providers/ProductDbProvider";
import type { Product, Category } from "../bindings/product-server/types";

type AddProductParams = Parameters<DbConnection["reducers"]["addProduct"]>[0];
type UpdateProductParams = Parameters<
  DbConnection["reducers"]["updateProduct"]
>[0];
type DeleteProductParams = Parameters<
  DbConnection["reducers"]["deleteProduct"]
>[0];
type AddCategoryParams = Parameters<DbConnection["reducers"]["addCategory"]>[0];
type DeleteCategoryParams = Parameters<
  DbConnection["reducers"]["deleteCategory"]
>[0];
type UpdateProductStockParams = Parameters<
  DbConnection["reducers"]["updateProductStock"]
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

export function useProducts() {
  const { connection, connected } = useProductDb();

  const products = useTableData<Product>(
    useCallback((conn: DbConnection) => conn.db.product.iter(), []),
    connection,
    connected,
  );

  const categories = useTableData<Category>(
    useCallback((conn: DbConnection) => conn.db.category.iter(), []),
    connection,
    connected,
  );

  const activeProducts = useMemo(() => {
    return products.filter((p: Product) => (p.status as { tag?: string }).tag === "Active");
  }, [products]);

  const addProduct = useCallback(
    (params: AddProductParams) => {
      if (!connection || !connected) return;
      connection.reducers.addProduct(params);
    },
    [connection, connected],
  );

  const updateProduct = useCallback(
    (params: UpdateProductParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateProduct(params);
    },
    [connection, connected],
  );

  const deleteProduct = useCallback(
    (params: DeleteProductParams) => {
      if (!connection || !connected) return;
      connection.reducers.deleteProduct(params);
    },
    [connection, connected],
  );

  const addCategory = useCallback(
    (params: AddCategoryParams) => {
      if (!connection || !connected) return;
      connection.reducers.addCategory(params);
    },
    [connection, connected],
  );

  const deleteCategory = useCallback(
    (params: DeleteCategoryParams) => {
      if (!connection || !connected) return;
      connection.reducers.deleteCategory(params);
    },
    [connection, connected],
  );

  const updateProductStock = useCallback(
    (params: UpdateProductStockParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateProductStock(params);
    },
    [connection, connected],
  );

  return {
    products,
    categories,
    activeProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    updateProductStock,
    connected,
  };
}
