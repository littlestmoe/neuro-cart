"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Sparkles, Loader2, ArrowLeft, Upload } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useProducts } from "@neuro-cart/shared/hooks";
import {
  generateProductDescription,
  generateProductTags,
} from "../../actions/ai";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

interface ProductFormValues {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  tags: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useUser();
  const sellerId = user?.id ?? "";
  const { addProduct, categories } = useProducts();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      stock: "",
      description: "",
      tags: "",
    },
  });

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const nameValue = watch("name");
  const categoryValue = watch("category");

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleGenerateDescription = async () => {
    if (!nameValue) return;
    setAiLoading("description");
    try {
      const desc = await generateProductDescription(
        nameValue,
        categoryValue,
        [],
      );
      setValue("description", desc);
    } finally {
      setAiLoading(null);
    }
  };

  const handleGenerateTags = async () => {
    if (!nameValue) return;
    setAiLoading("tags");
    try {
      const tags = await generateProductTags(nameValue, watch("description"));
      setValue("tags", tags);
    } finally {
      setAiLoading(null);
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    const price = parseFloat(data.price);
    const originalPrice = data.originalPrice
      ? parseFloat(data.originalPrice)
      : null;
    const discount = originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
    const tagsArray = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    addProduct({
      name: data.name,
      price,
      originalPrice: originalPrice ?? undefined,
      discount: discount ?? undefined,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
      images: [],
      categoryId: data.category,
      colors: [],
      sizes: [],
      description: data.description || undefined,
      stock: parseInt(data.stock || "0"),
      sellerId,
      condition: { New: {} } as never,
      tags: tagsArray,
    });

    router.push("/products");
  };

  return (
    <main className={styles.page} aria-label="Add new product">
      <div className={styles.header}>
        <Button
          className={styles.backBtn}
          onClick={() => router.back()}
          aria-label="Go back"
          variant="ghost"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className={styles.title}>Add New Product</h1>
          <p className={styles.subtitle}>
            Create a new product listing with AI-assisted content
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Product Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                  label="Product Name"
                  placeholder="Enter product name"
                  error={errors.name?.message}
                  fullWidth
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  className={styles.select}
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select category</option>
                  {categoryOptions.length > 0 ? (
                    categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home & Living</option>
                      <option value="sports">Sports</option>
                      <option value="food">Food & Beverages</option>
                    </>
                  )}
                </select>
                {errors.category && (
                  <span className={styles.errorMsg} role="alert">
                    {errors.category.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <Input
                  id="stock"
                  type="number"
                  {...register("stock", { required: "Stock is required" })}
                  label="Stock Quantity"
                  placeholder="0"
                  min={0}
                  error={errors.stock?.message}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { required: "Price is required" })}
                  label="Price ($)"
                  placeholder="0.00"
                  error={errors.price?.message}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  {...register("originalPrice")}
                  label="Original Price ($) (optional)"
                  placeholder="0.00"
                  error={errors.originalPrice?.message}
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitleRow}>
              <h2 className={styles.cardTitle}>Description</h2>
              <Button
                className={styles.aiBtn}
                onClick={handleGenerateDescription}
                disabled={!nameValue || aiLoading === "description"}
                aria-label="Generate description with AI"
                variant="ghost"
                size="small"
              >
                {aiLoading === "description" ? (
                  <Loader2 size={16} className={styles.spinning} />
                ) : (
                  <Sparkles size={16} />
                )}
                AI Generate
              </Button>
            </div>
            <textarea
              id="description"
              className={styles.textarea}
              rows={6}
              {...register("description")}
              placeholder="Describe your product..."
            />
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitleRow}>
              <h2 className={styles.cardTitle}>Tags</h2>
              <Button
                className={styles.aiBtn}
                onClick={handleGenerateTags}
                disabled={!nameValue || aiLoading === "tags"}
                aria-label="Generate tags with AI"
                variant="ghost"
                size="small"
              >
                {aiLoading === "tags" ? (
                  <Loader2 size={16} className={styles.spinning} />
                ) : (
                  <Sparkles size={16} />
                )}
                AI Generate
              </Button>
            </div>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="Comma-separated tags"
              fullWidth
            />
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Product Images</h2>
            <div
              className={styles.uploadArea}
              role="button"
              tabIndex={0}
              aria-label="Upload product images"
            >
              <Upload size={32} className={styles.uploadIcon} />
              <p className={styles.uploadText}>Drag & drop images here</p>
              <p className={styles.uploadSub}>
                or click to browse files (PNG, JPG up to 5MB)
              </p>
            </div>
          </section>
        </div>

        <div className={styles.actions}>
          <Button
            className={styles.cancelBtn}
            onClick={() => router.back()}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button className={styles.saveDraftBtn} variant="secondary">
            Save as Draft
          </Button>
          <Button className={styles.publishBtn} type="submit" variant="primary">
            Publish Product
          </Button>
        </div>
      </form>
    </main>
  );
}
