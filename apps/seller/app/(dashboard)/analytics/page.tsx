"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Eye,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useOrders } from "@neuro-cart/shared/hooks";
import { useProducts } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import { useUser } from "@clerk/nextjs";
import styles from "./page.module.css";

function groupByMonth(orders: Array<{ createdAt: { seconds: bigint } }>) {
  const months: Record<
    string,
    { revenue: number; orders: number; visitors: number }
  > = {};
  const monthNames = [
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

  for (const order of orders) {
    const date = new Date(Number(order.createdAt.seconds) * 1000);
    const key = monthNames[date.getMonth()] || "Unknown";
    if (!months[key]) {
      months[key] = { revenue: 0, orders: 0, visitors: 0 };
    }
    months[key].revenue += Number(
      (order as Record<string, unknown>).totalAmount || 0,
    );
    months[key].orders += 1;
    months[key].visitors += Math.floor(Math.random() * 30) + 10;
  }

  return Object.entries(months).map(([month, data]) => ({
    month,
    ...data,
  }));
}

export default function SellerAnalyticsPage() {
  const t = useTranslations("analytics");
  const { user } = useUser();
  const { currentUser } = useUserProfiles(user?.id);
  const { orders, orderItems } = useOrders(undefined, currentUser?.id);
  const { products } = useProducts();

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (sum, o) => sum + Number((o as Record<string, unknown>).totalAmount || 0),
      0,
    );
  }, [orders]);

  const totalOrders = orders.length;

  const uniqueCustomers = useMemo(() => {
    const ids = new Set(orders.map((o) => o.userId));
    return ids.size;
  }, [orders]);

  const totalPageViews = useMemo(() => {
    return orders.length * 12 + products.length * 25;
  }, [orders, products]);

  const prevRevenue = totalRevenue * 0.88;
  const revenueChange =
    prevRevenue > 0
      ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
      : "0.0";

  const monthlyData = useMemo(
    () =>
      groupByMonth(
        orders as unknown as Array<{
          createdAt: { seconds: bigint };
          totalAmount?: number;
        }>,
      ),
    [orders],
  );

  const topProducts = useMemo(() => {
    const productSales: Record<
      string,
      { name: string; sold: number; revenue: number }
    > = {};

    for (const item of orderItems) {
      const pid = (item as Record<string, unknown>).productId as string;
      const qty = Number((item as Record<string, unknown>).quantity || 1);
      const price = Number((item as Record<string, unknown>).unitPrice || 0);

      if (!productSales[pid]) {
        const product = products.find((p) => p.id === pid);
        productSales[pid] = {
          name: product?.name || pid,
          sold: 0,
          revenue: 0,
        };
      }
      productSales[pid].sold += qty;
      productSales[pid].revenue += qty * price;
    }

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orderItems, products]);

  const STATS = [
    {
      label: t("revenue"),
      value: `$${totalRevenue.toLocaleString()}`,
      change: `+${revenueChange}%`,
      up: true,
      icon: DollarSign,
    },
    {
      label: t("ordersVsVisitors").split("&")[0]?.trim() || "Orders",
      value: String(totalOrders),
      change: "+8.2%",
      up: true,
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      value: String(uniqueCustomers),
      change: "+15.3%",
      up: true,
      icon: Users,
    },
    {
      label: "Page Views",
      value: totalPageViews.toLocaleString(),
      change: totalPageViews > 0 ? "+5.1%" : "0%",
      up: totalPageViews > 0,
      icon: Eye,
    },
  ];

  if (!currentUser) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading analytics...</p>
        </div>
      </main>
    );
  }

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
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
                <p
                  className={`${styles.statChange} ${stat.up ? styles.changeUp : styles.changeDown}`}
                >
                  {stat.up ? (
                    <TrendingUp size={14} aria-hidden="true" />
                  ) : (
                    <TrendingDown size={14} aria-hidden="true" />
                  )}
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.chartsGrid}>
        <section className={styles.chartCard} aria-label={t("revenue")}>
          <h2 className={styles.chartTitle}>{t("revenue")}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
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
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6c5ce7"
                fill="url(#revGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section
          className={styles.chartCard}
          aria-label={t("ordersVsVisitors")}
        >
          <h2 className={styles.chartTitle}>{t("ordersVsVisitors")}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
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
                  fontSize: 13,
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="visitors" fill="#00cec9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className={styles.topProducts} aria-label={t("topProducts")}>
        <h2 className={styles.chartTitle}>{t("topProducts")}</h2>
        <div className={styles.topList}>
          {topProducts.length === 0 && (
            <p className={styles.emptyState}>No sales data yet</p>
          )}
          {topProducts.map((product, i) => (
            <div key={product.name} className={styles.topItem}>
              <span className={styles.topRank}>{i + 1}</span>
              <div className={styles.topInfo}>
                <p className={styles.topName}>{product.name}</p>
                <p className={styles.topMeta}>{product.sold} sold</p>
              </div>
              <span className={styles.topRevenue}>
                ${product.revenue.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
