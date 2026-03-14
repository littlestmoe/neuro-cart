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
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useProducts } from "@neuro-cart/shared/hooks";
import { z } from "zod";
import { PRODUCT_CATEGORIES } from "@neuro-cart/shared/constants";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import Modal from "@neuro-cart/ui/Modal";
import Select from "@neuro-cart/ui/Select";
import FormField, { inputClass, textareaClass } from "@neuro-cart/ui/FormField";
import styles from "./page.module.css";
import { ProductCondition, ProductStatus } from "../../../../../packages/shared/src/bindings/product-server/types";

const parseCsv = (val: unknown) => {
  if (typeof val === "string") return val.split(",").map((v) => v.trim()).filter(Boolean);
  return val;
};

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  price: z.number().positive("Price must be greater than 0"),
  originalPrice: z.number().positive().optional().nullable(),
  discount: z.number().min(0).max(100).optional().nullable(),
  image: z.string().url("Must be a valid URL").min(1, "Main Image URL is required"),
  images: z.array(z.string().url()).optional(),
  categoryId: z.string().min(1, "Category is required"),
  colors: z.preprocess(parseCsv, z.array(z.string()).optional()),
  sizes: z.preprocess(parseCsv, z.array(z.string()).optional()),
  description: z.string().max(5000).optional(),
  stock: z.number({ invalid_type_error: "Required" }).min(0, "Invalid stock"),
  tags: z.preprocess(parseCsv, z.array(z.string()).optional()),
  condition: z.enum(["new", "refurbished", "used"]),
});

type ProductFormInput = z.input<typeof productFormSchema>;
type ProductFormOutput = z.output<typeof productFormSchema>;

interface ProductRow {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived" | "out_of_stock";
  soldCount: number;
  sellerId: string;
  originalPrice: number | undefined;
  discount: number | undefined;
  description: string | undefined;
  tags: string[];
  colors: string[];
  sizes: string[];
  condition: string;
  images: string[];
}

function getStatusString(status: Record<string, unknown>): ProductRow["status"] {
  if ("Active" in status) return "active";
  if ("Draft" in status) return "draft";
  if ("Archived" in status) return "archived";
  if ("OutOfStock" in status) return "out_of_stock";
  return "draft";
}

function getConditionString(condition: Record<string, unknown>): string {
  if ("New" in condition) return "new";
  if ("Refurbished" in condition) return "refurbished";
  if ("Used" in condition) return "used";
  return "new";
}

export default function ProductsPage() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const { user } = useUser();
  const sellerId = user?.id;

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),
  });

  const productData = useMemo<ProductRow[]>(() => {
    return products
      .filter((p) => p.sellerId === sellerId)
      .map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        category: p.categoryId ?? "",
        price: p.price,
        stock: p.stock ?? 0,
        status: getStatusString(p.status as unknown as Record<string, unknown>),
        soldCount: p.soldCount ?? 0,
        sellerId: p.sellerId,
        originalPrice: p.originalPrice ?? undefined,
        discount: p.discount ?? undefined,
        description: p.description ?? undefined,
        tags: p.tags ?? [],
        colors: p.colors ?? [],
        sizes: p.sizes ?? [],
        condition: getConditionString(p.condition as unknown as Record<string, unknown>),
        images: p.images ?? [],
      }));
  }, [products, sellerId]);

  const openAddModal = useCallback(() => {
    setEditProduct(null);
    reset({
      name: "",
      price: 0,
      image: "https://placehold.co/400",
      categoryId: "",
      stock: 0,
      condition: "new",
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (product: ProductRow) => {
      setEditProduct(product);
      reset({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        images: product.images,
        categoryId: product.category,
        colors: product.colors?.join(", "),
        sizes: product.sizes?.join(", "),
        description: product.description,
        stock: product.stock,
        tags: product.tags?.join(", "),
        condition: product.condition as ProductFormInput["condition"],
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    (data: ProductFormOutput) => {
      const statusTag = editProduct
        ? editProduct.status === "out_of_stock"
          ? "OutOfStock"
          : editProduct.status.charAt(0).toUpperCase() + editProduct.status.slice(1)
        : "Draft";

      const conditionTag = data.condition.charAt(0).toUpperCase() + data.condition.slice(1);

      let parsedStatus: ProductStatus = { tag: "Draft" };
      if (statusTag === "Active") parsedStatus = { tag: "Active" };
      else if (statusTag === "Archived") parsedStatus = { tag: "Archived" };
      else if (statusTag === "OutOfStock") parsedStatus = { tag: "OutOfStock" };

      let parsedCondition: ProductCondition = { tag: "New" };
      if (conditionTag === "Refurbished") parsedCondition = { tag: "Refurbished" };
      else if (conditionTag === "Used") parsedCondition = { tag: "Used" };

      if (editProduct) {
        updateProduct({
          id: editProduct.id,
          name: data.name,
          price: data.price,
          originalPrice: data.originalPrice ?? undefined,
          discount: data.discount ?? undefined,
          image: data.image,
          images: data.images ?? [],
          categoryId: data.categoryId,
          colors: data.colors ?? [],
          sizes: data.sizes ?? [],
          description: data.description ?? undefined,
          stock: data.stock,
          isFeatured: false,
          status: parsedStatus,
          tags: data.tags ?? [],
        });
      } else {
        addProduct({
          name: data.name,
          price: data.price,
          originalPrice: data.originalPrice ?? undefined,
          discount: data.discount ?? undefined,
          image: data.image,
          images: data.images ?? [],
          categoryId: data.categoryId,
          colors: data.colors ?? [],
          sizes: data.sizes ?? [],
          description: data.description ?? undefined,
          stock: data.stock,
          sellerId: sellerId || "",
          condition: parsedCondition,
          tags: data.tags ?? [],
        });
      }
      setModalOpen(false);
      setEditProduct(null);
      reset();
    },
    [editProduct, addProduct, updateProduct, sellerId, reset],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
      deleteProduct({ id });
      setDeletingId(null);
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
            {t("productName")} <ArrowUpDown size={14} aria-hidden="true" />
          </button>
        ),
        cell: ({ row }) => (
          <div className={styles.productCell}>
            <Image
              src={row.original.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop"}
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
            {t("price")} <ArrowUpDown size={14} aria-hidden="true" />
          </button>
        ),
        cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "stock",
        header: tc("stock"),
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
                  : v === "out_of_stock"
                    ? t("outOfStock")
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
            {tc("sold")} <ArrowUpDown size={14} aria-hidden="true" />
          </button>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={() => openEditModal(row.original)}
              aria-label={`${tc("edit")} ${row.original.name}`}
              type="button"
            >
              <Edit size={16} aria-hidden="true" />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.actionDanger}`}
              disabled={deletingId === row.original.id}
              onClick={() => handleDelete(row.original.id)}
              aria-label={`${tc("delete")} ${row.original.name}`}
              type="button"
            >
              {deletingId === row.original.id ? (
                <Loader2 size={16} className={styles.spinning} aria-hidden="true" />
              ) : (
                <Trash2 size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        ),
      },
    ],
    [t, tc, openEditModal, handleDelete, deletingId],
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
    <main className={styles.page} id="main-content" aria-label={t("title")}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>{t("title")}</h1>
          <p>{productData.length} {t("title").toLowerCase()}</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={openAddModal}
          type="button"
        >
          <Plus size={16} aria-hidden="true" /> {t("addProduct")}
        </button>
      </header>

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

        {productData.length === 0 && (
          <p className={styles.empty}>{t("noProducts")}</p>
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
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        title={editProduct ? t("editProduct") : t("addProduct")}
        size="large"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          <div className={styles.formGrid2}>
            <FormField
              label={t("productName")}
              error={errors.name?.message}
              required
              htmlFor="product-name"
            >
              <input
                {...register("name")}
                id="product-name"
                className={inputClass}
                aria-invalid={!!errors.name}
              />
            </FormField>
            <FormField
              label={t("category")}
              error={errors.categoryId?.message}
              required
              htmlFor="product-category"
            >
              <Select
                {...register("categoryId")}
                id="product-category"
                options={PRODUCT_CATEGORIES.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                placeholder={t("selectCategory")}
                aria-invalid={!!errors.categoryId}
              />
            </FormField>
          </div>

          <div className={styles.formGrid3}>
            <FormField
              label={t("price")}
              error={errors.price?.message}
              required
              htmlFor="product-price"
            >
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                id="product-price"
                className={inputClass}
                aria-invalid={!!errors.price}
              />
            </FormField>
            <FormField
              label={t("originalPrice")}
              error={errors.originalPrice?.message}
              htmlFor="product-original-price"
            >
              <input
                type="number"
                step="0.01"
                {...register("originalPrice", { valueAsNumber: true })}
                id="product-original-price"
                className={inputClass}
              />
            </FormField>
            <FormField
              label={t("discount")}
              error={errors.discount?.message}
              htmlFor="product-discount"
            >
              <input
                type="number"
                {...register("discount", { valueAsNumber: true })}
                id="product-discount"
                className={inputClass}
              />
            </FormField>
          </div>

          <div className={styles.formGrid2}>
            <FormField
              label={t("stock")}
              error={errors.stock?.message}
              required
              htmlFor="product-stock"
            >
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                id="product-stock"
                className={inputClass}
                aria-invalid={!!errors.stock}
              />
            </FormField>
            <FormField
              label={t("condition")}
              error={errors.condition?.message}
              htmlFor="product-condition"
            >
              <Select
                {...register("condition")}
                id="product-condition"
                options={[
                  { value: "new", label: t("conditionNew") },
                  { value: "refurbished", label: t("conditionRefurbished") },
                  { value: "used", label: t("conditionUsed") },
                ]}
              />
            </FormField>
          </div>

          <FormField
            label={t("image")}
            error={errors.image?.message}
            required
            htmlFor="product-image"
          >
            <input
              {...register("image")}
              id="product-image"
              className={inputClass}
              aria-invalid={!!errors.image}
            />
          </FormField>

          <FormField
            label={t("description")}
            error={errors.description?.message}
            htmlFor="product-description"
          >
            <textarea
              {...register("description")}
              id="product-description"
              rows={3}
              className={textareaClass}
            />
          </FormField>

          <div className={styles.formGrid2}>
            <FormField
              label={t("colors")}
              htmlFor="product-colors"
            >
              <input
                {...register("colors")}
                id="product-colors"
                className={inputClass}
                placeholder={t("colorsPlaceholder")}
              />
            </FormField>
            <FormField
              label={t("sizes")}
              htmlFor="product-sizes"
            >
              <input
                {...register("sizes")}
                id="product-sizes"
                className={inputClass}
                placeholder={t("sizesPlaceholder")}
              />
            </FormField>
          </div>

          <FormField
            label={t("tags")}
            htmlFor="product-tags"
          >
            <input
              {...register("tags")}
              id="product-tags"
              className={inputClass}
              placeholder={t("tagsPlaceholder")}
            />
          </FormField>

          <div className={styles.formActions}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditProduct(null);
              }}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editProduct ? t("update") : t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
