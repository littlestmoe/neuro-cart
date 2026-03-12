"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { type DbConnection } from "../bindings/review-server";
import { useReviewDb } from "../providers/ReviewDbProvider";
import { type Review } from "../bindings/review-server/types";

type AddReviewParams = Parameters<DbConnection["reducers"]["addReview"]>[0];
type UpdateReviewParams = Parameters<
  DbConnection["reducers"]["updateReview"]
>[0];
type DeleteReviewParams = Parameters<
  DbConnection["reducers"]["deleteReview"]
>[0];
type MarkReviewHelpfulParams = Parameters<
  DbConnection["reducers"]["markReviewHelpful"]
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

export function useReviews(productId?: string, userId?: string) {
  const { connection, connected } = useReviewDb();

  const allReviews = useTableData<Review>(
    useCallback((conn: DbConnection) => conn.db.review.iter(), []),
    connection,
    connected,
  );

  const reviews = useMemo(() => {
    let filtered = allReviews;
    if (productId) filtered = filtered.filter((r) => r.productId === productId);
    if (userId) filtered = filtered.filter((r) => r.userId === userId);
    return filtered;
  }, [allReviews, productId, userId]);

  const addReview = useCallback(
    (params: AddReviewParams) => {
      if (!connection || !connected) return;
      connection.reducers.addReview(params);
    },
    [connection, connected],
  );

  const updateReview = useCallback(
    (params: UpdateReviewParams) => {
      if (!connection || !connected) return;
      connection.reducers.updateReview(params);
    },
    [connection, connected],
  );

  const deleteReview = useCallback(
    (params: DeleteReviewParams) => {
      if (!connection || !connected) return;
      connection.reducers.deleteReview(params);
    },
    [connection, connected],
  );

  const markReviewHelpful = useCallback(
    (params: MarkReviewHelpfulParams) => {
      if (!connection || !connected) return;
      connection.reducers.markReviewHelpful(params);
    },
    [connection, connected],
  );

  return {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    connected,
  };
}
