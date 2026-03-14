"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useProducts } from "@neuro-cart/shared/hooks";
import { useOrders } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import styles from "./page.module.css";

function StatusBadge({
  status,
  tc,
}: {
  status: Record<string, unknown>;
  tc: (key: string) => string;
}) {
  const tag = Object.keys(status)[0] ?? "Unknown";
  const classMap: Record<string, string | undefined> = {
    Pending: styles.statusPending,
    Processing: styles.statusProcessing,
    Shipped: styles.statusShipped,
    Delivered: styles.statusDelivered,
    Cancelled: styles.statusCancelled,
  };
  return (
    <span className={`${styles.statusBadge} ${classMap[tag] || ""}`}>
      {tag === "Pending" || tag === "Processing" ? tc("loading") : tag}
    </span>
  );
}

export default function SellerDashboard() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const { user } = useUser();
  const sellerId = user?.id ?? "";
  const { products } = useProducts();
  const { orders } = useOrders(undefined, sellerId);

  const sellerProducts = useMemo(() => {
    return products.filter((p) => p.sellerId === sellerId);
  }, [products, sellerId]);

  const nonCancelledOrders = useMemo(() => {
    return orders.filter((o) => !("Cancelled" in o.status));
  }, [orders]);

  const revenue = useMemo(() => {
    return nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
  }, [nonCancelledOrders]);

  const pendingOrders = useMemo(() => {
    return orders.filter(
      (o) => "Pending" in o.status || "Processing" in o.status,
    );
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  const stats = [
    {
      label: t("totalProducts"),
      value: sellerProducts.length.toString(),
      icon: Package,
      trend: `${sellerProducts.filter((p) => "Active" in p.status).length} ${t("active")}`,
      color: "#6c5ce7",
    },
    {
      label: t("totalOrders"),
      value: orders.length.toString(),
      icon: ShoppingBag,
      trend: `${nonCancelledOrders.length} ${t("completed")}`,
      color: "#00cec9",
    },
    {
      label: t("revenue"),
      value: `$${revenue.toFixed(0)}`,
      icon: DollarSign,
      trend: `${orders.length} ${t("orders")}`,
      color: "#27ae60",
    },
    {
      label: t("pendingOrders"),
      value: pendingOrders.length.toString(),
      icon: AlertTriangle,
      trend: `${pendingOrders.length} ${t("orders")}`,
      color: "#f39c12",
    },
  ];

  return (
    <main className={styles.content} id="main-content">
      <section className={styles.statsGrid} aria-label={t("overviewLabel")}>
        {stats.map((stat) => (
          <article key={stat.label} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: `${stat.color}15`, color: stat.color }}
            >
              <stat.icon size={22} aria-hidden="true" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <span className={styles.statTrend}>
              <TrendingUp size={14} aria-hidden="true" /> {stat.trend}
            </span>
          </article>
        ))}
      </section>

      <section className={styles.tableSection} aria-label={t("recentOrders")}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>{t("recentOrders")}</h2>
          <Button
            className={styles.viewAll}
            onClick={() => (window.location.href = "/orders")}
            variant="ghost"
            size="small"
          >
            {tc("viewAll")} &rarr;
          </Button>
        </div>
        <div
          className={styles.tableWrapper}
          role="region"
          aria-label={t("recentOrders")}
          tabIndex={0}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">{t("revenue")}</th>
                <th scope="col">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={3} className={styles.orderId}>
                    {tc("loading")}
                  </td>
                </tr>
              )}
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.orderId}>{order.id.slice(0, 12)}...</td>
                  <td className={styles.orderTotal}>
                    ${order.total.toFixed(2)}
                  </td>
                  <td>
                    <StatusBadge
                      status={
                        order.status as unknown as Record<string, unknown>
                      }
                      tc={tc}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
