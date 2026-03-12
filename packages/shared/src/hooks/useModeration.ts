"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useReviews } from "./useReviews";
import { useProducts } from "./useProducts";

export type FlagType = "spam" | "inappropriate" | "counterfeit" | "misleading";
export type FlagStatus = "pending" | "resolved" | "dismissed";

export interface FlagItem {
  id: string;
  type: FlagType;
  target: string;
  targetType: "product" | "review" | "seller";
  reporter: string;
  reason: string;
  date: string;
  status: FlagStatus;
  aiSuggestion?: string;
}

function inferFlagType(text: string): FlagType {
  const lower = text.toLowerCase();
  if (lower.includes("spam") || lower.includes("bot") || lower.includes("link"))
    return "spam";
  if (
    lower.includes("fake") ||
    lower.includes("clone") ||
    lower.includes("counterfeit")
  )
    return "counterfeit";
  if (
    lower.includes("nsfw") ||
    lower.includes("inappropriate") ||
    lower.includes("offensive")
  )
    return "inappropriate";
  return "misleading";
}

export function useModeration() {
  const { reviews } = useReviews();
  const { products } = useProducts();
  const [flags, setFlags] = useState<FlagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("neuro_moderation_resolved");
    if (stored) {
      setResolvedIds(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    const reviewFlags: FlagItem[] = reviews
      .filter((r) => r.rating <= 1 || (r.comment && r.comment.length < 5))
      .map((r) => ({
        id: `rf_${r.id}`,
        type: inferFlagType(r.comment || ""),
        target: r.comment || `Review ${r.id.slice(0, 8)}`,
        targetType: "review" as const,
        reporter: "System",
        reason:
          r.rating <= 1
            ? `Very low rating (${r.rating}/5) with suspicious content pattern.`
            : "Extremely short review body detected.",
        date:
          typeof r.createdAt === "object" &&
          r.createdAt !== null &&
          "toDate" in (r.createdAt as object)
            ? (r.createdAt as { toDate: () => Date }).toDate().toISOString()
            : new Date().toISOString(),
        status: resolvedIds.has(`rf_${r.id}`) ? "resolved" : "pending",
        aiSuggestion:
          r.rating <= 1
            ? "Low-quality review detected. Consider verifying purchase history."
            : "Auto-flagged for brevity. May be spam.",
      }));

    const productFlags: FlagItem[] = products
      .filter((p) => {
        const name = p.name?.toLowerCase() ?? "";
        return (
          name.includes("clone") ||
          name.includes("replica") ||
          name.includes("fake")
        );
      })
      .map((p) => ({
        id: `pf_${p.id}`,
        type: "counterfeit" as FlagType,
        target: p.name,
        targetType: "product" as const,
        reporter: "System",
        reason: `Product name "${p.name}" contains terms associated with counterfeit goods.`,
        date:
          typeof p.createdAt === "object" &&
          p.createdAt !== null &&
          "toDate" in (p.createdAt as object)
            ? (p.createdAt as { toDate: () => Date }).toDate().toISOString()
            : new Date().toISOString(),
        status: resolvedIds.has(`pf_${p.id}`) ? "resolved" : "pending",
        aiSuggestion:
          "High confidence counterfeit. Recommend immediate review and potential takedown.",
      }));

    setFlags([...productFlags, ...reviewFlags]);
    setLoading(false);
  }, [reviews, products, resolvedIds]);

  const updateStatus = useCallback((id: string, status: FlagStatus) => {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    if (status === "resolved" || status === "dismissed") {
      setResolvedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        localStorage.setItem(
          "neuro_moderation_resolved",
          JSON.stringify([...next]),
        );
        return next;
      });
    }
  }, []);

  const addFlag = useCallback(
    (flag: Omit<FlagItem, "id" | "date" | "status">) => {
      setFlags((prev) => [
        {
          ...flag,
          id: `f${Date.now()}`,
          date: new Date().toISOString(),
          status: "pending" as FlagStatus,
        },
        ...prev,
      ]);
    },
    [],
  );

  const pendingCount = useMemo(
    () => flags.filter((f) => f.status === "pending").length,
    [flags],
  );

  return { flags, loading, updateStatus, addFlag, pendingCount };
}
