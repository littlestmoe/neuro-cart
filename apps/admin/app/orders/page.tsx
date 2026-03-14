"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, Eye, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { useOrders } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

const STATUS_ICONS: Record<string, typeof Clock> = {
  Pending: Clock,
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
};

function getStatusTag(status: Record<string, unknown>): string {
  return Object.keys(status)[0] ?? "Pending";
}

export default function AdminOrdersPage() {
  const t = useTranslations("orders");
  const tc = useTranslations("common");
  const { orders } = useOrders();
  const { userProfiles, sellerProfiles } = useUserProfiles();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const enrichedOrders = useMemo(() => {
    return orders.map((o) => {
      const buyer = userProfiles.find((u) => u.clerkId === o.userId);
      const seller = sellerProfiles.find((s) => s.userId === o.sellerId);
      const tag = getStatusTag(o.status as unknown as Record<string, unknown>);
      return {
        ...o,
        statusTag: tag,
        buyerName: buyer
          ? `${buyer.firstName} ${buyer.lastName}`
          : o.userId.slice(0, 10),
        sellerName: seller?.storeName ?? o.sellerId.slice(0, 10),
      };
    });
  }, [orders, userProfiles, sellerProfiles]);

  const filtered = useMemo(() => {
    return enrichedOrders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
        o.sellerName.toLowerCase().includes(search.toLowerCase());
      return matchSearch && (status === "all" || o.statusTag === status);
    });
  }, [enrichedOrders, search, status]);

  const statusLabels: Record<string, string> = {
    all: tc("search"),
    Pending: t("processing"),
    Processing: t("processing"),
    Shipped: t("shipped"),
    Delivered: t("delivered"),
    Cancelled: t("cancelled"),
  };

  return (
    <main className={styles.page} aria-label={t("title")} id="main-content">
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <Input
            placeholder={tc("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </div>
        <div className={styles.filters} role="group" aria-label={t("title")}>
          {(
            [
              "all",
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ] as const
          ).map((s) => (
            <Button
              key={s}
              className={`${styles.filterBtn} ${status === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatus(s)}
              variant="secondary"
              size="small"
            >
              {s === "all" ? tc("search") : (statusLabels[s] ?? s)}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table} aria-label={t("title")}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>{t("buyer")}</th>
              <th className={styles.th}>{t("seller")}</th>
              <th className={styles.th}>Total</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const Icon = STATUS_ICONS[order.statusTag] ?? Clock;
              return (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.orderId}>
                      {order.id.slice(0, 12)}...
                    </span>
                  </td>
                  <td className={styles.td}>{order.buyerName}</td>
                  <td className={styles.td}>{order.sellerName}</td>
                  <td className={styles.td}>
                    <span className={styles.total}>
                      ${order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.statusBadge} ${styles[`status${order.statusTag}`]}`}
                    >
                      <Icon size={14} />{" "}
                      {statusLabels[order.statusTag] ?? order.statusTag}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <Button
                      className={styles.viewBtn}
                      aria-label={`${tc("view")} ${order.id}`}
                      variant="ghost"
                      size="small"
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className={styles.empty}>{tc("loading")}</p>
        )}
      </div>
    </main>
  );
}
