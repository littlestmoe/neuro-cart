"use client";

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
import styles from "./page.module.css";

import { useTranslations } from "next-intl";

const MONTHLY_DATA = [
  { month: "Sep", revenue: 4200, orders: 42, visitors: 1200 },
  { month: "Oct", revenue: 5100, orders: 51, visitors: 1450 },
  { month: "Nov", revenue: 7800, orders: 78, visitors: 2100 },
  { month: "Dec", revenue: 9200, orders: 92, visitors: 2800 },
  { month: "Jan", revenue: 6800, orders: 68, visitors: 1900 },
  { month: "Feb", revenue: 8400, orders: 84, visitors: 2300 },
  { month: "Mar", revenue: 10500, orders: 105, visitors: 3100 },
];

const TOP_PRODUCTS = [
  { name: "Smart Watch Pro", sold: 156, revenue: 54444 },
  { name: "Wireless Headphones", sold: 132, revenue: 19798 },
  { name: "Running Shoes", sold: 98, revenue: 18522 },
  { name: "Leather Jacket", sold: 45, revenue: 13455 },
  { name: "Desk Lamp", sold: 88, revenue: 6952 },
];

export default function SellerAnalyticsPage() {
  const t = useTranslations("analytics");

  const STATS = [
    {
      label: t("revenue"),
      value: "$52,000",
      change: "+12.5%",
      up: true,
      icon: DollarSign,
    },
    {
      label: "Orders",
      value: "520",
      change: "+8.2%",
      up: true,
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      value: "284",
      change: "+15.3%",
      up: true,
      icon: Users,
    },
    {
      label: "Page Views",
      value: "14,850",
      change: "-2.1%",
      up: false,
      icon: Eye,
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
        <section className={styles.chartCard} aria-label={t("revenue")}>
          <h2 className={styles.chartTitle}>{t("revenue")}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY_DATA}>
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
            <BarChart data={MONTHLY_DATA}>
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
          {TOP_PRODUCTS.map((product, i) => (
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
