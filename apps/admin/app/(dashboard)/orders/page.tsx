"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Search,
  ArrowUpDown,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useOrders } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import Modal from "@neuro-cart/ui/Modal";
import Select from "@neuro-cart/ui/Select";
import FormField from "@neuro-cart/ui/FormField";
import styles from "./page.module.css";

const STATUS_ICONS: Record<string, typeof Clock> = {
  Pending: Clock,
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
};

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

interface StatusFormData {
  status: string;
}

function getStatusTag(status: Record<string, unknown>): string {
  return Object.keys(status)[0] ?? "Pending";
}

interface OrderRow {
  id: string;
  statusTag: string;
  buyerName: string;
  sellerName: string;
  total: number;
  userId: string;
  sellerId: string;
}

export default function AdminOrdersPage() {
  const t = useTranslations("orders");
  const tc = useTranslations("common");
  const { orders, updateOrderStatus } = useOrders();
  const { userProfiles, sellerProfiles } = useUserProfiles();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  const { register, handleSubmit, reset } = useForm<StatusFormData>();

  const enrichedOrders = useMemo<OrderRow[]>(() => {
    return orders.map((o) => {
      const buyer = userProfiles.find((u) => u.clerkId === o.userId);
      const seller = sellerProfiles.find((s) => s.userId === o.sellerId);
      const tag = getStatusTag(o.status as unknown as Record<string, unknown>);
      return {
        id: o.id,
        statusTag: tag,
        buyerName: buyer
          ? `${buyer.firstName} ${buyer.lastName}`
          : o.userId.slice(0, 10),
        sellerName: seller?.storeName ?? o.sellerId.slice(0, 10),
        total: o.total,
        userId: o.userId,
        sellerId: o.sellerId,
      };
    });
  }, [orders, userProfiles, sellerProfiles]);

  const filtered = useMemo(() => {
    return enrichedOrders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
        o.buyerName.toLowerCase().includes(globalFilter.toLowerCase()) ||
        o.sellerName.toLowerCase().includes(globalFilter.toLowerCase());
      return matchSearch && (statusFilter === "all" || o.statusTag === statusFilter);
    });
  }, [enrichedOrders, globalFilter, statusFilter]);

  const openStatusModal = useCallback(
    (order: OrderRow) => {
      setSelectedOrder(order);
      reset({ status: order.statusTag });
      setStatusModalOpen(true);
    },
    [reset],
  );

  const onStatusSubmit = useCallback(
    (data: StatusFormData) => {
      if (!selectedOrder) return;
      updateOrderStatus({
        id: selectedOrder.id,
        status: { tag: data.status as "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded" },
      });
      setStatusModalOpen(false);
      setSelectedOrder(null);
    },
    [selectedOrder, updateOrderStatus],
  );

  const statusLabels = useMemo<Record<string, string>>(() => ({
    Pending: t("pending"),
    Processing: t("processing"),
    Shipped: t("shipped"),
    Delivered: t("delivered"),
    Cancelled: t("cancelled"),
  }), [t]);

  const columns = useMemo<ColumnDef<OrderRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: t("orderId"),
        cell: ({ getValue }) => (
          <span className={styles.orderId}>
            {(getValue<string>()).slice(0, 12)}...
          </span>
        ),
      },
      {
        accessorKey: "buyerName",
        header: ({ column }) => (
          <button
            className={styles.sortBtn}
            onClick={() => column.toggleSorting()}
            type="button"
          >
            {t("buyer")} <ArrowUpDown size={14} aria-hidden="true" />
          </button>
        ),
      },
      {
        accessorKey: "sellerName",
        header: t("seller"),
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <button
            className={styles.sortBtn}
            onClick={() => column.toggleSorting()}
            type="button"
          >
            {tc("total")} <ArrowUpDown size={14} aria-hidden="true" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className={styles.total}>${getValue<number>().toFixed(2)}</span>
        ),
      },
      {
        accessorKey: "statusTag",
        header: tc("status"),
        cell: ({ getValue }) => {
          const tag = getValue<string>();
          const Icon = STATUS_ICONS[tag] ?? Clock;
          return (
            <span className={`${styles.statusBadge} ${styles[`status${tag}`]}`}>
              <Icon size={14} aria-hidden="true" /> {statusLabels[tag] ?? tag}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={() => openStatusModal(row.original)}
              aria-label={`${t("updateStatus")} ${row.original.id}`}
              type="button"
            >
              <RefreshCw size={16} aria-hidden="true" />
            </button>
          </div>
        ),
      },
    ],
    [t, tc, statusLabels, openStatusModal],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <main className={styles.page} id="main-content" aria-label={t("title")}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <Input
            placeholder={tc("search")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            fullWidth
          />
        </div>
        <div className={styles.filters} role="group" aria-label={tc("status")}>
          {(["all", ...ORDER_STATUSES] as const).map((s) => (
            <Button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
              variant="secondary"
              size="small"
            >
              {s === "all" ? t("all") : (statusLabels[s] ?? s)}
            </Button>
          ))}
        </div>
      </div>

      <section aria-label={t("title")}>
        <div className={styles.tableWrap}>
          <table className={styles.table} aria-label={t("title")}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id} className={styles.th}>
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.tr}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className={styles.empty}>{t("noOrders")}</p>
        )}

        <nav className={styles.pagination} aria-label={tc("page")}>
          <span className={styles.pageInfo}>
            {tc("page")} {table.getState().pagination.pageIndex + 1}{" "}
            {tc("of")} {table.getPageCount()}
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label={tc("previous")}
              type="button"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label={tc("next")}
              type="button"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </section>

      <Modal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedOrder(null);
        }}
        title={t("updateStatus")}
      >
        <form onSubmit={handleSubmit(onStatusSubmit)} className={styles.form} noValidate>
          <FormField label={tc("status")} htmlFor="order-status">
            <Select
              {...register("status")}
              id="order-status"
              options={ORDER_STATUSES.map((s) => ({
                value: s,
                label: statusLabels[s] ?? s,
              }))}
            />
          </FormField>
          <div className={styles.formActions}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setStatusModalOpen(false);
                setSelectedOrder(null);
              }}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit">{t("updateStatus")}</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
