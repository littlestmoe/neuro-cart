"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Eye, Truck, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useOrders } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

const STATUS_CONFIG: Record<string, { icon: typeof Clock; class: string }> = {
  Pending: { icon: Clock, class: "statusPending" },
  Processing: { icon: Clock, class: "statusProcessing" },
  Shipped: { icon: Truck, class: "statusShipped" },
  Delivered: { icon: CheckCircle, class: "statusDelivered" },
  Cancelled: { icon: XCircle, class: "statusCancelled" },
};

function getStatusTag(status: Record<string, unknown>): string {
  return Object.keys(status)[0] ?? "Pending";
}

export default function SellerOrdersPage() {
  const t = useTranslations("orders");
  const tc = useTranslations("common");
  const { user } = useUser();
  const sellerId = user?.id ?? "";
  const { orders } = useOrders(undefined, sellerId);
  const { userProfiles } = useUserProfiles();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const enrichedOrders = useMemo(() => {
    return orders.map((o) => {
      const buyer = userProfiles.find((u) => u.clerkId === o.userId);
      const tag = getStatusTag(o.status as unknown as Record<string, unknown>);
      return {
        ...o,
        statusTag: tag,
        buyerName: buyer
          ? `${buyer.firstName} ${buyer.lastName}`
          : o.userId.slice(0, 10),
        buyerEmail: buyer?.email ?? "",
      };
    });
  }, [orders, userProfiles]);

  const filtered = useMemo(() => {
    return enrichedOrders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.buyerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || o.statusTag === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enrichedOrders, search, statusFilter]);

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
        <div
          className={styles.statusFilters}
          role="group"
          aria-label={t("title")}
        >
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
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
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
              <th className={styles.th}>{t("orderId")}</th>
              <th className={styles.th}>{t("customer")}</th>
              <th className={styles.th}>{t("total")}</th>
              <th className={styles.th}>{t("status")}</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const cfg = (STATUS_CONFIG[order.statusTag] ??
                STATUS_CONFIG["Pending"])!;
              const StatusIcon = cfg.icon;
              return (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.orderId}>
                      {order.id.slice(0, 12)}...
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div>
                      <p className={styles.customerName}>{order.buyerName}</p>
                      <p className={styles.customerEmail}>{order.buyerEmail}</p>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.total}>
                      ${order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.statusBadge} ${styles[cfg.class]}`}
                    >
                      <StatusIcon size={14} />{" "}
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
          <div className={styles.empty}>{tc("loading")}</div>
        )}
      </div>
    </main>
  );
}
