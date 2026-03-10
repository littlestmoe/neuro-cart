"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ChevronRight, ShoppingCart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@neuro-cart/shared/hooks";
import { useProducts } from "@neuro-cart/shared/hooks";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Button from "@neuro-cart/ui/Button";
import styles from "./page.module.css";

export default function CartPage() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id ?? "";
  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    clearUserCart,
    connected,
  } = useCart(userId);
  const { products } = useProducts();

  const enrichedItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return { ...item, product };
      })
      .filter((item) => item.product);
  }, [cartItems, products]);

  const cartTotal = enrichedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const shipping = cartTotal > 140 ? 0 : 12;
  const total = cartTotal + shipping;

  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.page} aria-label={tc("cart")}>
        <nav aria-label={tc("search")} className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            {tc("home")}
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span>{tc("cart")}</span>
        </nav>

        <h1 className={styles.title}>{tc("cart")}</h1>

        {!connected && (
          <div className={styles.empty} aria-live="polite">
            <ShoppingCart
              size={80}
              className={styles.emptyIcon}
              aria-hidden="true"
            />
            <p className={styles.emptyText}>{tc("loading")}...</p>
          </div>
        )}

        {connected && enrichedItems.length === 0 ? (
          <div className={styles.empty} aria-live="polite">
            <ShoppingCart
              size={80}
              className={styles.emptyIcon}
              aria-hidden="true"
            />
            <p className={styles.emptyText}>{t("emptyCart")}</p>
            <p className={styles.emptySub}>{t("startShopping")}</p>
            <Link href="/" className={styles.ctaBtn}>
              {tc("home")}
            </Link>
          </div>
        ) : connected && enrichedItems.length > 0 ? (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table} aria-label={tc("cart")}>
                <thead className={styles.thead}>
                  <tr>
                    <th scope="col">{t("product")}</th>
                    <th scope="col">{t("price")}</th>
                    <th scope="col">{t("quantity")}</th>
                    <th scope="col">{t("subtotal")}</th>
                    <th scope="col">
                      <span className="sr-only">{tc("delete")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedItems.map((item) => (
                    <tr key={item.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.productCell}>
                          <Image
                            className={styles.productImg}
                            src={item.product!.image}
                            alt={item.product!.name}
                            width={70}
                            height={70}
                          />
                          <div>
                            <Link
                              href={`/products/${item.productId}`}
                              className={styles.productName}
                            >
                              {item.product!.name}
                            </Link>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className={styles.productMeta}>
                                {item.selectedColor &&
                                  `Color: ${item.selectedColor}`}
                                {item.selectedSize &&
                                  ` · Size: ${item.selectedSize}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>${item.unitPrice}</td>
                      <td className={styles.td}>
                        <div
                          className={styles.qtyWrap}
                          role="group"
                          aria-label={`${t("quantity")} for ${item.product!.name}`}
                        >
                          <Button
                            className={styles.qtyBtn}
                            onClick={() =>
                              item.quantity > 1
                                ? updateCartQuantity({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  })
                                : removeFromCart({ id: item.id })
                            }
                            aria-label={t("quantity")}
                            type="button"
                            variant="ghost"
                            size="small"
                          >
                            <Minus size={14} />
                          </Button>
                          <span
                            className={styles.qtyVal}
                            aria-label={`${item.quantity} items`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            className={styles.qtyBtn}
                            onClick={() =>
                              updateCartQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                            aria-label={t("quantity")}
                            type="button"
                            variant="ghost"
                            size="small"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.subtotal}>
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <Button
                          className={styles.removeBtn}
                          onClick={() => removeFromCart({ id: item.id })}
                          aria-label={`${tc("delete")} ${item.product!.name}`}
                          type="button"
                          variant="danger"
                          size="small"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.actionRow}>
              <Link href="/" className={styles.outlineBtn}>
                {tc("home")}
              </Link>
              <Button
                className={styles.outlineBtn}
                onClick={() => clearUserCart({ userId })}
                aria-label={t("clearCart")}
                variant="ghost"
              >
                {t("clearCart")}
              </Button>
            </div>

            <div className={styles.bottomGrid}>
              <div />
              <div className={styles.summaryCard} aria-label={tc("checkout")}>
                <h2 className={styles.summaryTitle}>{t("cartTotal")}</h2>
                <div className={styles.summaryRow}>
                  <span>{t("subtotal")}:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>{tc("save")}:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button
                  className={styles.checkoutBtn}
                  onClick={() => router.push("/checkout")}
                  aria-label={tc("checkout")}
                  fullWidth
                  variant="primary"
                >
                  {tc("checkout")}
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
