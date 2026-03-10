"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
  Edit,
  Trash2,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useProducts } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

type ProductRow = {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived" | "out_of_stock";
  soldCount: number;
};

export default function SellerProductsPage() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useUser();
  const sellerId = user?.id ?? "";

  const { products, deleteProduct } = useProducts();

  const productData = useMemo<ProductRow[]>(() => {
    return products
      .filter((p) => p.sellerId === sellerId)
      .map((p) => {
        let statusStr: ProductRow["status"] = "draft";
        if ("Active" in p.status) statusStr = "active";
        if ("Draft" in p.status) statusStr = "draft";
        if ("Archived" in p.status) statusStr = "archived";
        if ("OutOfStock" in p.status) statusStr = "out_of_stock";

        return {
          id: p.id,
          name: p.name,
          image: p.image,
          category: p.categoryId ?? tc("loading"),
          price: p.price,
          stock: p.stock ?? 50,
          status: statusStr,
          soldCount: p.soldCount ?? 0,
        };
      });
  }, [products, sellerId, tc]);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await deleteProduct({ id });
      } finally {
        setDeletingId(null);
      }
    },
    [deleteProduct, setDeletingId],
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
            {tc("name")} <ArrowUpDown size={14} />
          </button>
        ),
        cell: ({ row }) => (
          <div className={styles.productCell}>
            <Image
              src={row.original.image}
              alt={row.original.name}
              width={44}
              height={44}
              className={styles.productImg}
            />
            <span className={styles.productName}>{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: tc("loading"),
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
            {tc("price")} <ArrowUpDown size={14} />
          </button>
        ),
        cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "stock",
        header: tc("loading"),
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return (
            <span className={v < 10 ? styles.stockLow : styles.stockOk}>
              {v}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ getValue }) => {
          const v = getValue<string>();
          const cls =
            v === "active"
              ? styles.statusActive
              : v === "draft"
                ? styles.statusDraft
                : styles.statusArchived;
          return (
            <span className={`${styles.statusBadge} ${cls}`}>
              {v === "active"
                ? t("active")
                : v === "draft"
                  ? t("draft")
                  : t("archived")}
            </span>
          );
        },
      },
      {
        accessorKey: "soldCount",
        header: ({ column }) => (
          <button
            className={styles.sortBtn}
            onClick={() => column.toggleSorting()}
            type="button"
          >
            {tc("loading")} <ArrowUpDown size={14} />
          </button>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className={styles.actions}>
            <Link
              href={`/products/${row.original.id}/edit`}
              className={styles.actionBtn}
              aria-label={`${tc("edit")} ${row.original.name}`}
            >
              <Edit size={16} />
            </Link>
            <Button
              className={styles.actionBtn}
              aria-label={`${tc("view")} ${row.original.name}`}
              variant="ghost"
              size="small"
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="danger"
              disabled={deletingId === row.original.id}
              onClick={() => handleDelete(row.original.id)}
              className={styles.actionBtn}
              aria-label={`${tc("delete")} ${row.original.name}`}
            >
              {deletingId === row.original.id ? (
                <Loader2 size={16} className={styles.spinning} />
              ) : (
                <Trash2 size={16} />
              )}
            </Button>
          </div>
        ),
      },
    ],
    [t, tc, handleDelete, deletingId],
  );

  const table = useReactTable({
    data: productData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={tc("search")}
            fullWidth
          />
        </div>
      </div>

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

      <div className={styles.pagination}>
        <span className={styles.pageInfo}>
          {tc("loading")} {table.getState().pagination.pageIndex + 1}{" "}
          {tc("loading")} {table.getPageCount()}
        </span>
        <div className={styles.pageButtons}>
          <Button
            className={styles.pageBtn}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={tc("loading")}
            variant="secondary"
            size="small"
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            className={styles.pageBtn}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={tc("loading")}
            variant="secondary"
            size="small"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </main>
  );
}
