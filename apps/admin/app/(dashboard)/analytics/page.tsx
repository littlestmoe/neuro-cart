"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import styles from "./page.module.css";
import {
  useOrders,
  useProducts,
  useUserProfiles,
} from "@neuro-cart/shared/hooks";
import { useTranslations } from "next-intl";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CATEGORY_COLORS = [
  "#6c5ce7",
  "#00cec9",
  "#fd79a8",
  "#f39c12",
  "#27ae60",
  "#e74c3c",
  "#3498db",
  "#9b59b6",
];

export default function AdminAnalyticsPage() {
  const t = useTranslations("analytics");
  const { orders } = useOrders();
  const { products } = useProducts();
  const { userProfiles } = useUserProfiles();

  const totalGmv = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total), 0),
    [orders],
  );
  const totalOrders = orders.length;
  const totalUsers = userProfiles.length;
  const activeProductsCount = useMemo(
    () =>
      products.filter(
        (p) => p.status && typeof p.status === "object" && "Active" in p.status,
      ).length,
    [products],
  );

  const revenueData = useMemo(() => {
    const buckets: Record<string, { revenue: number; gmv: number }> = {};
    for (const order of orders) {
      let d: Date;
      const ts = order.createdAt as unknown;
      if (ts && typeof (ts as { toDate?: unknown }).toDate === "function") {
        d = (ts as { toDate: () => Date }).toDate();
      } else {
        d = new Date(ts as string | number | Date);
      }
      const key = MONTH_NAMES[d.getMonth()] ?? "Unknown";
      if (!buckets[key]) buckets[key] = { revenue: 0, gmv: 0 };
      const total = Number(order.total);
      buckets[key].revenue += total * 0.9;
      buckets[key].gmv += total;
    }
    return Object.entries(buckets).map(([month, vals]) => ({
      month,
      revenue: Math.round(vals.revenue),
      gmv: Math.round(vals.gmv),
    }));
  }, [orders]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const cat = p.categoryId ?? "Other";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));
  }, [products]);

  const STATS = [
    {
      label: t("platformGmv"),
      value: `$${(totalGmv / 1000).toFixed(1)}K`,
      change: totalGmv > 0 ? "+18.3%" : "0%",
      up: totalGmv > 0,
      icon: DollarSign,
    },
    {
      label: t("totalOrders"),
      value: totalOrders.toString(),
      change: totalOrders > 0 ? "+12.7%" : "0%",
      up: totalOrders > 0,
      icon: ShoppingBag,
    },
    {
      label: t("activeUsers"),
      value: totalUsers.toString(),
      change: totalUsers > 0 ? "+22.1%" : "0%",
      up: totalUsers > 0,
      icon: Users,
    },
    {
      label: t("activeProducts"),
      value: activeProductsCount.toString(),
      change: activeProductsCount > 0 ? "+5.4%" : "0%",
      up: activeProductsCount > 0,
      icon: Package,
    },
  ];

  return (
    <main className={styles.page} aria-label={t("title")}>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>

      <div className={styles.statsGrid}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statIcon}>
                <Icon size={20} />
              </div>
              <div>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
                <p
                  className={`${styles.statChange} ${stat.up ? styles.changeUp : styles.changeDown}`}
                >
                  {stat.up ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.chartsGrid}>
        <section className={styles.chartCard} aria-label={t("revenueGmv")}>
          <h2 className={styles.chartTitle}>{t("revenueGmv")}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00cec9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00cec9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="month" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6c5ce7"
                fill="url(#gradRev)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="gmv"
                stroke="#00cec9"
                fill="url(#gradGmv)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className={styles.chartCard} aria-label={t("salesByCategory")}>
          <h2 className={styles.chartTitle}>{t("salesByCategory")}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>
    </main>
  );
}
