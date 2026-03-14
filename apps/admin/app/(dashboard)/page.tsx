"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import { useProducts } from "@neuro-cart/shared/hooks";
import { useOrders } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import { usePayments } from "@neuro-cart/shared/hooks";
import styles from "./page.module.css";

interface StatCardProps {
  title?: string;
  value: string | number;
  icon: React.ReactNode;
  trend: { value: string | number; color: string; isPositive?: boolean };
  label: string;
}

const StatCard = ({ value, icon, trend, label }: StatCardProps) => (
  <article className={styles.statCard}>
    <div
      className={styles.statIcon}
      style={{ background: `${trend.color}15`, color: trend.color }}
    >
      {icon}
    </div>
    <div className={styles.statInfo}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
    <span className={styles.statTrend}>
      <TrendingUp size={14} aria-hidden="true" /> {trend.value}
    </span>
  </article>
);

export default function AdminDashboard() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const { activeProducts } = useProducts();
  const { orders } = useOrders();
  const { userProfiles, sellerProfiles } = useUserProfiles();
  const { payments } = usePayments();

  const totalUsers = useMemo(() => {
    return userProfiles.length + sellerProfiles.length;
  }, [userProfiles, sellerProfiles]);

  const revenue = useMemo(() => {
    return orders.reduce((sum, o) => {
      if ("Cancelled" in (o.status as unknown as Record<string, unknown>))
        return sum;
      return sum + o.total;
    }, 0);
  }, [orders]);

  const pendingItems = useMemo(() => {
    return activeProducts.filter((p) => "Draft" in p.status).length;
  }, [activeProducts]);

  const newUsersThisMonth = useMemo(() => {
    return userProfiles.filter((u) => {
      type TimestampObj = { toDate?: () => Date };
      let createdDate: Date;
      if (
        u.createdAt &&
        typeof (u.createdAt as TimestampObj).toDate === "function"
      ) {
        createdDate = (u.createdAt as { toDate: () => Date }).toDate();
      } else {
        createdDate = new Date(
          u.createdAt as unknown as string | number | Date,
        );
      }
      return createdDate.getMonth() === new Date().getMonth();
    }).length;
  }, [userProfiles]);

  const newSellersThisMonth = useMemo(() => {
    return sellerProfiles.filter((s) => {
      type TimestampObj = { toDate?: () => Date };
      let createdDate: Date;
      if (
        s.createdAt &&
        typeof (s.createdAt as TimestampObj).toDate === "function"
      ) {
        createdDate = (s.createdAt as { toDate: () => Date }).toDate();
      } else {
        createdDate = new Date(
          s.createdAt as unknown as string | number | Date,
        );
      }
      return createdDate.getMonth() === new Date().getMonth();
    }).length;
  }, [sellerProfiles]);

  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5).map((o) => {
      const buyer = userProfiles.find((u) => u.clerkId === o.userId);
      const seller = sellerProfiles.find((s) => s.userId === o.sellerId);
      const tag =
        Object.keys(o.status as unknown as Record<string, unknown>)[0] ??
        "Pending";
      return {
        id: o.id,
        action: t("orderPlaced"),
        detail: `${buyer ? `${buyer.firstName} ${buyer.lastName}` : t("user")} → ${seller?.storeName ?? t("seller")}, $${o.total.toFixed(2)}`,
        time: tag,
        type:
          tag === "Delivered"
            ? "order"
            : tag === "Cancelled"
              ? "alert"
              : "user",
      };
    });
  }, [orders, userProfiles, sellerProfiles, t]);

  return (
    <main className={styles.content} id="main-content">
      <section className={styles.statsGrid} aria-label="Platform metrics">
        <StatCard
          title="Users"
          value={totalUsers.toString()}
          icon={
            <Users size={24} className={styles.statIcon} aria-hidden="true" />
          }
          trend={{ value: `${newUsersThisMonth} new users`, color: "#6c5ce7" }}
          label={t("activeUsers")}
        />
        <StatCard
          title="Products"
          value={activeProducts.length.toString()}
          icon={
            <Package size={24} className={styles.statIcon} aria-hidden="true" />
          }
          trend={{
            value: `${activeProducts.filter((p) => "Active" in p.status).length} active`,
            color: "#00cec9",
          }}
          label={t("activeProducts")}
        />
        <StatCard
          title="Orders"
          value={orders.length.toString()}
          icon={
            <ShoppingBag
              size={24}
              className={styles.statIcon}
              aria-hidden="true"
            />
          }
          trend={{ value: `${payments.length} payments`, color: "#27ae60" }}
          label={t("totalOrders")}
        />
        <StatCard
          title="Revenue"
          value={
            revenue > 1000
              ? `$${(revenue / 1000).toFixed(1)}K`
              : `$${revenue.toFixed(0)}`
          }
          icon={
            <DollarSign
              size={24}
              className={styles.statIcon}
              aria-hidden="true"
            />
          }
          trend={{ value: `${orders.length} orders`, color: "#fd79a8" }}
          label={t("platformGmv")}
        />
        <StatCard
          title="Sellers"
          value={sellerProfiles.length.toString()}
          icon={
            <TrendingUp
              size={24}
              className={styles.statIcon}
              aria-hidden="true"
            />
          }
          trend={{
            value: `${newSellersThisMonth} new sellers`,
            color: "#f39c12",
          }}
          label={t("systemStatus")}
        />
        <StatCard
          title="Moderation"
          value={pendingItems.toString()}
          icon={
            <AlertTriangle
              size={24}
              className={styles.statIcon}
              aria-hidden="true"
            />
          }
          trend={{ value: `${pendingItems} draft`, color: "#e74c3c" }}
          label={tc("moderation")}
        />
      </section>

      <section className={styles.activitySection} aria-label="Recent activity">
        <h2 className={styles.sectionTitle}>{t("recentActivity")}</h2>
        <div className={styles.activityList}>
          {recentOrders.length === 0 && (
            <div className={styles.activityItem}>
              <div className={styles.activityContent}>
                <span className={styles.activityAction}>{tc("loading")}</span>
              </div>
            </div>
          )}
          {recentOrders.map((item, i) => (
            <div key={i} className={styles.activityItem}>
              <div
                className={`${styles.activityDot} ${styles[`dot_${item.type}`]}`}
                aria-hidden="true"
              />
              <div className={styles.activityContent}>
                <span className={styles.activityAction}>{item.action}</span>
                <span className={styles.activityDetail}>{item.detail}</span>
              </div>
              <span className={styles.activityTime}>{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
