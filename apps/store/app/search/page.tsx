"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import { CATEGORIES } from "../../data/products";
import { useProducts } from "@neuro-cart/shared/hooks";
import type { Product } from "@neuro-cart/shared/types";
import Button from "@neuro-cart/ui/Button";
import Select from "@neuro-cart/ui/Select";
import styles from "./page.module.css";

type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "best_selling"
  | "rating";

function SearchPageContent() {
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialSort = (searchParams.get("sort") as SortOption) ?? "relevance";

  const { activeProducts: RAW_PRODUCTS } = useProducts();
  const PRODUCTS = useMemo((): Product[] => {
    return RAW_PRODUCTS.map((p) => {
      const hasStatus = p.status as { status?: string } | undefined;
      const hasCondition = p.condition as { condition?: string } | undefined;
      const createdTs = p.createdAt as
        | { microsSinceUnixEpoch?: bigint }
        | string
        | undefined;
      const updatedTs = p.updatedAt as
        | { microsSinceUnixEpoch?: bigint }
        | string
        | undefined;
      return {
        ...p,
        status: hasStatus && (hasStatus as { tag?: string }).tag === "Active" ? "active" : "draft",
        condition:
          hasCondition && (hasCondition as { tag?: string }).tag === "New"
            ? "new"
            : hasCondition && (hasCondition as { tag?: string }).tag === "Used"
              ? "used"
              : "refurbished",
        createdAt:
          typeof createdTs === "string"
            ? createdTs
            : createdTs &&
                typeof createdTs === "object" &&
                "microsSinceUnixEpoch" in createdTs
              ? new Date(
                  Number(createdTs.microsSinceUnixEpoch ?? 0n) / 1000,
                ).toISOString()
              : undefined,
        updatedAt:
          typeof updatedTs === "string"
            ? updatedTs
            : updatedTs &&
                typeof updatedTs === "object" &&
                "microsSinceUnixEpoch" in updatedTs
              ? new Date(
                  Number(updatedTs.microsSinceUnixEpoch ?? 0n) / 1000,
                ).toISOString()
              : undefined,
      };
    });
  }, [RAW_PRODUCTS]);

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1200]);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const filterAndSort = useCallback(() => {
    let filtered = [...PRODUCTS];

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.categoryId ?? "").toLowerCase().includes(q),
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.categoryId === category);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sort) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "best_selling":
        filtered.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setResults(filtered);
  }, [query, category, sort, priceRange, PRODUCTS]);

  useEffect(() => {
    filterAndSort();
  }, [filterAndSort]);

  const clearFilters = () => {
    setCategory("");
    setPriceRange([0, 1200]);
    setSort("relevance");
  };

  const activeFilterCount =
    (category ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 1200 ? 1 : 0);

  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.page} aria-label={tc("search")}>
        <div className={styles.searchHeader}>
          <form
            className={styles.searchForm}
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <Search
              size={20}
              className={styles.searchIcon}
              aria-hidden="true"
            />
            <input
              type="search"
              className={styles.searchInput}
              placeholder={tc("search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={tc("search")}
              autoFocus
            />
            {query && (
              <Button
                className={styles.clearBtn}
                onClick={() => setQuery("")}
                aria-label={tc("search")}
                type="button"
                variant="ghost"
                size="small"
              >
                <X size={18} />
              </Button>
            )}
          </form>
          <Button
            className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ""}`}
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
            type="button"
            variant="secondary"
            size="small"
          >
            <SlidersHorizontal size={18} />
            {t("filters")}
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </Button>
        </div>

        <div className={styles.layout}>
          {showFilters && (
            <aside
              id="filters-panel"
              className={styles.filtersPanel}
              aria-label={t("filters")}
            >
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>{t("category")}</h3>
                <div
                  className={styles.filterOptions}
                  role="group"
                  aria-label={t("filters")}
                >
                  <Button
                    className={`${styles.filterChip} ${!category ? styles.filterChipActive : ""}`}
                    onClick={() => setCategory("")}
                    type="button"
                    variant={!category ? "primary" : "secondary"}
                    size="small"
                  >
                    {t("all")}
                  </Button>
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat.id}
                      className={`${styles.filterChip} ${category === cat.id ? styles.filterChipActive : ""}`}
                      onClick={() => setCategory(cat.id)}
                      type="button"
                      variant={category === cat.id ? "primary" : "secondary"}
                      size="small"
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>{t("priceRange")}</h3>
                <div className={styles.priceInputs}>
                  <input
                    type="number"
                    className={styles.priceInput}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    aria-label={t("priceRange")}
                    min={0}
                  />
                  <span className={styles.priceSep}>-</span>
                  <input
                    type="number"
                    className={styles.priceInput}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    aria-label={t("priceRange")}
                    min={0}
                  />
                </div>
              </div>

              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>{t("sortBy")}</h3>
                <Select
                  className={styles.sortSelect}
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  aria-label={t("sortBy")}
                  options={[
                    { value: "relevance", label: t("relevance") },
                    { value: "price_asc", label: t("priceLowHigh") },
                    { value: "price_desc", label: t("priceHighLow") },
                    { value: "newest", label: t("newest") },
                    { value: "best_selling", label: t("bestSelling") },
                    { value: "rating", label: t("highestRated") },
                  ]}
                />
              </div>

              <Button
                className={styles.clearFiltersBtn}
                onClick={clearFilters}
                variant="secondary"
                fullWidth
              >
                {t("clearFilters")}
              </Button>
            </aside>
          )}

          <section className={styles.results} aria-label={tc("search")}>
            <p className={styles.resultCount}>
              {results.length} {t("resultsFound")}
              {query && (
                <>
                  {" "}
                  {t("for")} &quot;<strong>{query}</strong>&quot;
                </>
              )}
            </p>
            {results.length === 0 ? (
              <div className={styles.noResults}>
                <Search
                  size={64}
                  className={styles.noResultsIcon}
                  aria-hidden="true"
                />
                <p className={styles.noResultsText}>{t("noResults")}</p>
                <p className={styles.noResultsSub}>{t("adjustSearch")}</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  const tc = useTranslations("common");
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "100px" }}>
          {tc("loading")}
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
