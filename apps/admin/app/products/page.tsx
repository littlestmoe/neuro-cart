"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { useProducts } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

type ModerationStatus = "approved" | "pending" | "rejected";

interface ProductMod {
  id: string;
  name: string;
  image: string;
  seller: string;
  price: number;
  category: string;
  status: ModerationStatus;
}

export default function AdminProductsPage() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const [filter, setFilter] = useState<ModerationStatus | "all">("all");
  const [search, setSearch] = useState("");

  const { products, deleteProduct } = useProducts();
  const { sellerProfiles } = useUserProfiles();

  const productData = useMemo<ProductMod[]>(() => {
    return products.map((p) => {
      const seller = sellerProfiles.find((s) => s.userId === p.sellerId);
      let statusStr: ModerationStatus = "pending";
      if ("Active" in p.status) statusStr = "approved";
      if ("Draft" in p.status) statusStr = "pending";
      if ("Archived" in p.status) statusStr = "rejected";

      return {
        id: p.id,
        name: p.name,
        image: p.image,
        seller: seller?.storeName ?? p.sellerId.slice(0, 10),
        price: p.price,
        category: p.categoryId ?? tc("loading"),
        status: statusStr,
      };
    });
  }, [products, sellerProfiles, tc]);

  const filtered = productData.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filterLabels: Record<string, string> = {
    all: tc("search"),
    pending: tc("moderation"),
    approved: t("active"),
    rejected: t("archived"),
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
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <Button
              key={s}
              className={`${styles.filterBtn} ${filter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter(s)}
              variant="secondary"
              size="small"
            >
              {s === "all" ? tc("search") : filterLabels[s]}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((product) => (
          <div key={product.id} className={styles.card}>
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className={styles.cardImg}
            />
            <div className={styles.cardBody}>
              <p className={styles.cardName}>{product.name}</p>
              <p className={styles.cardSeller}>
                {t("seller")} {product.seller}
              </p>
              <div className={styles.cardMeta}>
                <span className={styles.cardPrice}>
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`${styles.modBadge} ${styles[`mod${product.status.charAt(0).toUpperCase() + product.status.slice(1)}`]}`}
                >
                  {filterLabels[product.status]}
                </span>
              </div>
              <div className={styles.cardActions}>
                {product.status === "pending" && (
                  <>
                    <Button
                      className={styles.approveBtn}
                      aria-label={`${t("active")} ${product.name}`}
                      variant="primary"
                      size="small"
                    >
                      <CheckCircle size={16} /> {t("active")}
                    </Button>
                    <Button
                      className={styles.rejectBtn}
                      onClick={() => deleteProduct({ id: product.id })}
                      aria-label={`${t("archived")} ${product.name}`}
                      variant="danger"
                      size="small"
                    >
                      <XCircle size={16} /> {t("archived")}
                    </Button>
                  </>
                )}
                <Button
                  className={styles.viewBtn}
                  aria-label={`${tc("view")} ${product.name}`}
                  variant="ghost"
                  size="small"
                >
                  <Eye size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className={styles.empty}>{tc("loading")}</p>
        )}
      </div>
    </main>
  );
}
