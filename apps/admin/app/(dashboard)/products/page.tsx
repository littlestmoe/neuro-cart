"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
  CheckCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProducts } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

interface ProductRow {
  id: string;
  name: string;
  image: string;
  seller: string;
  price: number;
  category: string;
  status: "approved" | "pending" | "rejected";
  stock: number;
}

function getStatusTag(
  status: { tag?: string } | Record<string, unknown>,
): ProductRow["status"] {
  const tag = (status as { tag?: string }).tag;
  if (tag === "Active" || "Active" in status) return "approved";
  if (tag === "Draft" || "Draft" in status) return "pending";
  return "rejected";
}

export default function AdminProductsPage() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { products, deleteProduct } = useProducts();
  const { sellerProfiles } = useUserProfiles();

  const productData = useMemo<ProductRow[]>(() => {
    return products.map((p) => {
      const seller = sellerProfiles.find((s) => s.userId === p.sellerId);
      return {
        id: p.id,
        name: p.name,
        image: p.image,
        seller: seller?.storeName ?? p.sellerId.slice(0, 10),
        price: p.price,
        category: p.categoryId ?? "",
        status: getStatusTag(p.status as unknown as Record<string, unknown>),
        stock: p.stock ?? 0,
      };
    });
  }, [products, sellerProfiles]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return productData;
    return productData.filter((p) => p.status === statusFilter);
  }, [productData, statusFilter]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteProduct({ id });
    },
    [deleteProduct],
  );

  const columns = useMemo<ColumnDef<ProductRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            className={styles.sortBtn}
            onClick={() => column.toggleSorting()}
            type="button"
          >
            {tc("name")} <ArrowUpDown size={14} aria-hidden="true" />
          </button>
        ),
        cell: ({ row }) => (
          <div className={styles.productCell}>
            <Image
              src={
                row.original.image ||
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop"
              }
              alt={row.original.name}
              width={44}
              height={44}
              className={styles.productImg}
            />
            <div>
              <div className={styles.productName}>{row.original.name}</div>
              <div className={styles.productSeller}>{row.original.seller}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: t("category"),
        cell: ({ getValue }) => (
          <span className={styles.categoryBadge}>{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <button
            className={styles.sortBtn}
            onClick={() => column.toggleSorting()}
            type="button"
          >
            {tc("price")} <ArrowUpDown size={14} aria-hidden="true" />
          </button>
        ),
        cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "stock",
        header: tc("stock"),
      },
      {
        accessorKey: "status",
        header: tc("status"),
        cell: ({ getValue }) => {
          const v = getValue<string>();
          const cls =
            v === "approved"
              ? styles.statusActive
              : v === "pending"
                ? styles.statusDraft
                : styles.statusArchived;
          const label =
            v === "approved"
              ? t("approved")
              : v === "pending"
                ? t("pending")
                : t("rejected");
          return (
            <span className={`${styles.statusBadge} ${cls}`}>{label}</span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className={styles.actions}>
            {row.original.status === "pending" && (
              <button
                className={styles.approveBtn}
                aria-label={`${tc("approve")} ${row.original.name}`}
                type="button"
              >
                <CheckCircle size={16} aria-hidden="true" />
              </button>
            )}
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(row.original.id)}
              aria-label={`${tc("delete")} ${row.original.name}`}
              type="button"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ),
      },
    ],
    [t, tc, handleDelete],
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

  const statusOptions = ["all", "pending", "approved", "rejected"] as const;

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
          {statusOptions.map((s) => (
            <Button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
              variant="secondary"
              size="small"
            >
              {s === "all"
                ? t("all")
                : s === "pending"
                  ? t("pending")
                  : s === "approved"
                    ? t("approved")
                    : t("rejected")}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className={styles.empty}>{t("noProducts")}</p>
        )}

        <nav className={styles.pagination} aria-label={tc("page")}>
          <span className={styles.pageInfo}>
            {tc("page")} {table.getState().pagination.pageIndex + 1} {tc("of")}{" "}
            {table.getPageCount()}
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
    </main>
  );
}
