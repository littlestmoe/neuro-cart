"use client";
import { useTranslations } from "next-intl";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProductCard from "../components/ProductCard/ProductCard";
import SectionHeader from "../components/SectionHeader/SectionHeader";
import { CATEGORIES } from "../data/products";
import { useProducts } from "@neuro-cart/shared/hooks";
import type { Product } from "@neuro-cart/shared/types";
import { useMemo } from "react";
import {
  Smartphone,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
  Shirt,
  Sofa,
  Truck,
  ShieldCheck,
  HeadphonesIcon,
  RefreshCw,
} from "lucide-react";
import styles from "./page.module.css";

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={28} />,
  Monitor: <Monitor size={28} />,
  Watch: <Watch size={28} />,
  Camera: <Camera size={28} />,
  Headphones: <Headphones size={28} />,
  Gamepad2: <Gamepad2 size={28} />,
  Shirt: <Shirt size={28} />,
  Sofa: <Sofa size={28} />,
};

export default function HomePage() {
  const t = useTranslations("home");
  const { activeProducts: PRODUCTS } = useProducts();
  const activeProducts = useMemo((): Product[] => {
    return PRODUCTS.map((p) => {
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
        status: hasStatus && "Active" in hasStatus ? "active" : "draft",
        condition:
          hasCondition && "New" in hasCondition
            ? "new"
            : hasCondition && "Used" in hasCondition
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
  }, [PRODUCTS]);

  const flashSaleProducts = activeProducts
    .filter((p) => p.discount && p.discount >= 25)
    .slice(0, 4);
  const featuredProducts = activeProducts.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = [...activeProducts]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 4);

  return (
    <>
      <Navbar />
      <a href="#main-content" className={styles.skipLink}>
        {t("skipToContent")}
      </a>
      <main id="main-content" className={styles.main}>
        <section className={styles.hero} aria-label={t("bannerLabel")}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>{t("heroBadge")}</span>
            <h1 className={styles.heroTitle}>
              {t("heroTitle1")}{" "}
              <span className={styles.heroGradient}>Neuro Cart</span>
            </h1>
            <p className={styles.heroSubtitle}>{t("heroSubtitle")}</p>
            <div className={styles.heroActions}>
              <a href="/search?q=" className={styles.heroCta}>
                {t("explore")}
              </a>
              <a href="#categories" className={styles.heroSecondary}>
                {t("browseCategories")}
              </a>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.heroOrb} />
            <div className={styles.heroOrb2} />
          </div>
        </section>

        <section className={styles.section} aria-label={t("flashSales")}>
          <SectionHeader
            title={t("flashSales")}
            subtitle={t("todays")}
            viewAllHref="/search?q=sale"
            accentColor
          />
          <div className={styles.productGrid}>
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section
          id="categories"
          className={styles.section}
          aria-label={t("browseCategories")}
        >
          <SectionHeader
            title={t("browseCategories")}
            subtitle={t("categories")}
            accentColor
          />
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`/search?category=${cat.id}`}
                className={styles.categoryCard}
                aria-label={`${cat.name}, ${cat.productCount} products`}
              >
                <span className={styles.categoryIcon}>
                  {ICON_MAP[cat.icon]}
                </span>
                <span className={styles.categoryName}>{cat.name}</span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label={t("bestSellers")}>
          <SectionHeader
            title={t("bestSellers")}
            subtitle={t("thisMonth")}
            viewAllHref="/search?sort=best_selling"
            accentColor
          />
          <div className={styles.productGrid}>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className={styles.promoBanner} aria-label={t("promoBanner")}>
          <div className={styles.promoContent}>
            <span className={styles.promoBadge}>{t("promoBadge")}</span>
            <h2 className={styles.promoTitle}>{t("promoTitle")}</h2>
            <p className={styles.promoText}>{t("promoText")}</p>
            <a href="/search?q=recommended" className={styles.promoCta}>
              {t("getRecommendations")}
            </a>
          </div>
        </section>

        <section className={styles.section} aria-label={t("newArrivals")}>
          <SectionHeader
            title={t("newArrivals")}
            subtitle={t("featured")}
            viewAllHref="/search?sort=newest"
            accentColor
          />
          <div className={styles.productGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className={styles.features} aria-label={t("guarantees")}>
          <div className={styles.featureCard}>
            <Truck
              size={32}
              className={styles.featureIcon}
              aria-hidden="true"
            />
            <h3 className={styles.featureTitle}>{t("freeShipping")}</h3>
            <p className={styles.featureText}>{t("freeShippingSub")}</p>
          </div>
          <div className={styles.featureCard}>
            <ShieldCheck
              size={32}
              className={styles.featureIcon}
              aria-hidden="true"
            />
            <h3 className={styles.featureTitle}>{t("securePayment")}</h3>
            <p className={styles.featureText}>{t("securePaymentSub")}</p>
          </div>
          <div className={styles.featureCard}>
            <HeadphonesIcon
              size={32}
              className={styles.featureIcon}
              aria-hidden="true"
            />
            <h3 className={styles.featureTitle}>{t("support")}</h3>
            <p className={styles.featureText}>{t("supportSub")}</p>
          </div>
          <div className={styles.featureCard}>
            <RefreshCw
              size={32}
              className={styles.featureIcon}
              aria-hidden="true"
            />
            <h3 className={styles.featureTitle}>{t("returns")}</h3>
            <p className={styles.featureText}>{t("returnsSub")}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
