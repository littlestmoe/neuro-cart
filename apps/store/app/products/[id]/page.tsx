"use client";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Truck,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useUser } from "@clerk/nextjs";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { useProducts } from "@neuro-cart/shared/hooks";
import { useCart } from "@neuro-cart/shared/hooks";
import { useReviews } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import type { Product } from "@neuro-cart/shared/types";
import styles from "./page.module.css";

const SALES_DATA = [
  { month: "Jan", sales: 420, revenue: 4200 },
  { month: "Feb", sales: 380, revenue: 3800 },
  { month: "Mar", sales: 510, revenue: 5100 },
  { month: "Apr", sales: 640, revenue: 6400 },
  { month: "May", sales: 580, revenue: 5800 },
  { month: "Jun", sales: 720, revenue: 7200 },
  { month: "Jul", sales: 860, revenue: 8600 },
  { month: "Aug", sales: 930, revenue: 9300 },
];

const RADAR_DATA = [
  { subject: "Quality", A: 90, fullMark: 100 },
  { subject: "Value", A: 85, fullMark: 100 },
  { subject: "Design", A: 88, fullMark: 100 },
  { subject: "Durability", A: 80, fullMark: 100 },
  { subject: "Performance", A: 92, fullMark: 100 },
];

const RATING_DIST = [
  { label: "5 Stars", value: 62, fill: "#6c5ce7" },
  { label: "4 Stars", value: 22, fill: "#00cec9" },
  { label: "3 Stars", value: 10, fill: "#f39c12" },
  { label: "2 Stars", value: 4, fill: "#fd79a8" },
  { label: "1 Star", value: 2, fill: "#e74c3c" },
];

const CHART_COLORS = { primary: "#6c5ce7", accent: "#00cec9" };
const TABS = [
  "Description",
  "Analytics",
  "Reviews",
  "Specifications",
  "Related",
] as const;
type Tab = (typeof TABS)[number];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id ?? "";
  const id = params.id as string;

  const { activeProducts: PRODUCTS } = useProducts();
  const { addToCart } = useCart(userId);
  const { reviews: productReviews } = useReviews(id);
  const t = useTranslations("product");
  const tc = useTranslations("common");

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0],
    [id, PRODUCTS],
  );
  const related = useMemo(
    () =>
      PRODUCTS.filter(
        (p) => p.categoryId === product?.categoryId && p.id !== product?.id,
      ).slice(0, 4),
    [product, PRODUCTS],
  );

  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] ?? "",
  );
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("Description");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <h2>{tc("noResults")}</h2>
        <Link href="/">{tc("continueShpping")}</Link>
      </div>
    );
  }

  const images = product.images ?? [product.image];

  const handleAddToCart = () => {
    addToCart({
      userId,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      unitPrice: product.price,
      quantity: qty,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className={styles.page}
        aria-label={`Product: ${product.name}`}
      >
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <ChevronRight
            size={14}
            className={styles.breadcrumbSep}
            aria-hidden="true"
          />
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <div className={styles.mainGrid}>
          <div
            className={styles.thumbCol}
            role="list"
            aria-label="Product images"
          >
            {images.map((img, i) => (
              <Image
                key={i}
                className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ""}`}
                src={
                  img ||
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop"
                }
                alt={`${product.name} view ${i + 1}`}
                width={80}
                height={80}
                role="listitem"
                onClick={() => setActiveImg(i)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
              />
            ))}
          </div>

          <div className={styles.mainImgWrap}>
            {product.discount && product.discount > 0 && (
              <span
                className={styles.mainImgBadge}
                aria-label={`${product.discount}% off`}
              >
                -{product.discount}%
              </span>
            )}
            <Image
              className={styles.mainImg}
              src={
                images[activeImg] ||
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop"
              }
              alt={product.name}
              width={500}
              height={500}
              priority
            />
          </div>

          <div className={styles.infoPanel}>
            <h1 className={styles.productName}>{product.name}</h1>

            <div
              className={styles.ratingRow}
              aria-label={`Rating: ${product.rating} out of 5`}
            >
              <div className={styles.stars} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < product.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className={styles.reviewCount}>
                ({product.reviewCount} Reviews)
              </span>
              <span className={styles.inStock} aria-live="polite">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <hr className={styles.divider} aria-hidden="true" />

            <div
              className={styles.price}
              aria-label={`Price: $${product.price}`}
            >
              ${product.price}
              {product.originalPrice && (
                <span
                  className={styles.priceOriginal}
                  aria-label={`Original price: $${product.originalPrice}`}
                >
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            <hr className={styles.divider} aria-hidden="true" />

            {product.colors && product.colors.length > 0 && (
              <div className={styles.optionBlock}>
                <p className={styles.optionLabel}>
                  {t("colors")}:{" "}
                  <span className={styles.optionValue}>{selectedColor}</span>
                </p>
                <div
                  className={styles.colorRow}
                  role="group"
                  aria-label="Select color"
                >
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`${styles.colorSwatch} ${selectedColor === c ? styles.colorSwatchActive : ""}`}
                      style={{ background: c }}
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Color: ${c}`}
                      aria-pressed={selectedColor === c}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.optionBlock}>
                <p className={styles.optionLabel}>{t("size")}:</p>
                <div
                  className={styles.sizeRow}
                  role="group"
                  aria-label="Select size"
                >
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeBtnActive : ""}`}
                      onClick={() => setSelectedSize(s)}
                      aria-pressed={selectedSize === s}
                      aria-label={`Size: ${s}`}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.addRow}>
              <div
                className={styles.qtyWrap}
                role="group"
                aria-label="Product quantity"
              >
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  type="button"
                >
                  <Minus size={16} />
                </button>
                <input
                  className={styles.qtyInput}
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  aria-label="Quantity"
                />
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  type="button"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                aria-label={`Add ${qty} ${product.name} to cart`}
                style={
                  added ? { background: "var(--color-success)" } : undefined
                }
                variant="primary"
              >
                {added ? "Added!" : "Add To Cart"}
              </Button>
              <Button
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
                aria-label="Buy now"
                variant="secondary"
              >
                Buy Now
              </Button>
            </div>

            <div
              className={styles.deliveryCard}
              aria-label="Delivery information"
            >
              <div className={styles.deliveryRow}>
                <Truck
                  size={22}
                  className={styles.deliveryIcon}
                  aria-hidden="true"
                />
                <div>
                  <p className={styles.deliveryTitle}>{t("freeDelivery")}</p>
                  <p className={styles.deliverySub}>{t("enterPostalCode")}</p>
                </div>
              </div>
              <div className={styles.deliveryRow}>
                <RotateCcw
                  size={22}
                  className={styles.deliveryIcon}
                  aria-hidden="true"
                />
                <div>
                  <p className={styles.deliveryTitle}>{t("returnDelivery")}</p>
                  <p className={styles.deliverySub}>{t("freeReturns")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section aria-label="Product details">
          <div
            className={styles.tabsWrap}
            role="tablist"
            aria-label="Product information tabs"
          >
            {TABS.map((t) => (
              <button
                key={t}
                className={`${styles.tab} ${activeTab === t ? styles.tabActive : ""}`}
                role="tab"
                aria-selected={activeTab === t}
                aria-controls={`tab-panel-${t}`}
                onClick={() => setActiveTab(t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>

          <div
            id={`tab-panel-${activeTab}`}
            className={styles.tabContent}
            role="tabpanel"
            aria-label={`${activeTab} tab`}
            tabIndex={0}
          >
            {activeTab === "Description" && (
              <div>
                <p className={styles.descText}>{product.description}</p>
                <p className={styles.descText}>
                  Experience the perfect blend of form and function. Designed
                  with the modern consumer in mind, this product offers
                  unparalleled quality at an exceptional value.
                </p>
              </div>
            )}

            {activeTab === "Analytics" && (
              <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Monthly Sales Trend</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={SALES_DATA}>
                      <defs>
                        <linearGradient
                          id="salesGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.primary}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.primary}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                      />
                      <XAxis dataKey="month" stroke="var(--color-border)" />
                      <YAxis stroke="var(--color-border)" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke={CHART_COLORS.primary}
                        fill="url(#salesGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Revenue (Monthly)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={SALES_DATA}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                      />
                      <XAxis dataKey="month" stroke="var(--color-border)" />
                      <YAxis stroke="var(--color-border)" />
                      <Tooltip />
                      <Bar
                        dataKey="revenue"
                        fill={CHART_COLORS.accent}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>
                    Product Ratings Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={RATING_DIST}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {RATING_DIST.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Product Quality Radar</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="var(--color-border)" />
                      <PolarAngleAxis dataKey="subject" />
                      <Radar
                        dataKey="A"
                        stroke={CHART_COLORS.primary}
                        fill={CHART_COLORS.primary}
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className={styles.reviewsGrid}>
                {productReviews.length === 0 && (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
                {productReviews.map((r) => (
                  <article
                    key={r.id}
                    className={styles.reviewCard}
                    aria-label={`Review by ${r.userName}`}
                  >
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAvatar} aria-hidden="true">
                        {r.userName.charAt(0)}
                      </div>
                      <div>
                        <p className={styles.reviewName}>{r.userName}</p>
                      </div>
                      <div
                        className={styles.stars}
                        aria-label={`${r.rating} stars`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < r.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewText}>{r.comment}</p>
                  </article>
                ))}
              </div>
            )}

            {activeTab === "Specifications" && (
              <div className={styles.specsWrap}>
                <table
                  className={styles.specsTable}
                  aria-label="Product specifications"
                >
                  <tbody>
                    {[
                      ["Category", product.categoryId],
                      ["In Stock", product.inStock ? "Yes" : "No"],
                      ["Available Colors", product.colors?.length ?? 0],
                      ["Sizes Available", product.sizes?.join(", ") ?? "N/A"],
                      ["Rating", `${product.rating}/5`],
                      ["Reviews", product.reviewCount],
                      [
                        "Units Sold",
                        product.soldCount?.toLocaleString() ?? "N/A",
                      ],
                      ["Price", `$${product.price}`],
                    ].map(([key, val]) => (
                      <tr key={String(key)} className={styles.specsRow}>
                        <td className={styles.specsKey}>{key}</td>
                        <td className={styles.specsVal}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Related" && (
              <div className={styles.relatedGrid}>
                {related.length > 0 ? (
                  related.map((p) => (
                    <ProductCard key={p.id} product={p as unknown as Product} />
                  ))
                ) : (
                  <p className={styles.noRelated}>{tc("noResults")}</p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
