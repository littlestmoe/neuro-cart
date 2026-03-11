"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@neuro-cart/shared/hooks";
import { useProducts } from "@neuro-cart/shared/hooks";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import Button from "@neuro-cart/ui/Button";
import styles from "./page.module.css";

export default function WishlistPage() {
  const tc = useTranslations("common");
  const { user } = useUser();
  const userId = user?.id ?? "";
  const { wishlistItems, addToCart, removeFromWishlist, connected } =
    useCart(userId);
  const { products } = useProducts();

  const wishlistProducts = useMemo(() => {
    return wishlistItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product;
      })
      .filter(Boolean);
  }, [wishlistItems, products]);

  const handleMoveAllToCart = () => {
    for (const item of wishlistItems) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        addToCart({
          userId,
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          unitPrice: product.price,
          quantity: 1,
          selectedColor: undefined,
          selectedSize: undefined,
        });
        removeFromWishlist({ id: item.id });
      }
    }
  };

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className={styles.page}
        aria-label={tc("wishlist")}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>
            {tc("wishlist")}
            <span className={styles.count}>
              ({wishlistProducts.length} items)
            </span>
          </h1>
          {wishlistProducts.length > 0 && (
            <Button
              className={styles.moveAllBtn}
              onClick={handleMoveAllToCart}
              aria-label={tc("cart")}
              variant="primary"
            >
              {tc("cart")}
            </Button>
          )}
        </div>

        {!connected ? (
          <div className={styles.empty} aria-live="polite">
            <Heart size={80} className={styles.emptyIcon} aria-hidden="true" />
            <p className={styles.emptyText}>{tc("loading")}...</p>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className={styles.empty} aria-live="polite">
            <Heart size={80} className={styles.emptyIcon} aria-hidden="true" />
            <p className={styles.emptyText}>{tc("loading")}</p>
            <p className={styles.emptySub}>{tc("loading")}</p>
            <Link href="/" className={styles.ctaBtn}>
              {tc("home")}
            </Link>
          </div>
        ) : (
          <div className={styles.grid} role="list" aria-label={tc("wishlist")}>
            {wishlistProducts.map(
              (product) =>
                product && (
                  <div key={product.id} role="listitem">
                    <ProductCard
                      product={
                        product as unknown as import("@neuro-cart/shared/types").Product
                      }
                      isInWishlist
                    />
                  </div>
                ),
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
