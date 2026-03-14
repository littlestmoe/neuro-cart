"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import styles from "./ProductCard.module.css";
import Button from "@neuro-cart/ui/Button";
import { useCart } from "@neuro-cart/shared/hooks";
import { useUser } from "@clerk/nextjs";
import type { Product } from "@neuro-cart/shared/types";

type UIProduct = Omit<
  Product,
  "status" | "condition" | "createdAt" | "updatedAt"
> & {
  status?: string | { tag: string } | { status: string };
  condition?: string | { condition: string };
  category?: string;
  createdAt?: string | Date | number | { toDate: () => Date };
  updatedAt?: string | Date | number | { toDate: () => Date };
};

interface ProductCardProps {
  product: UIProduct | Product;
  featured?: boolean;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const { wishlistItems, addToWishlist, removeFromWishlist } = useCart(userId);

  const isInWishlist = wishlistItems.some((w) => w.productId === product.id);

  const handleToggleWishlist = () => {
    if (!userId) return;
    if (isInWishlist) {
      const wishlistItem = wishlistItems.find(
        (w) => w.productId === product.id,
      );
      if (wishlistItem) removeFromWishlist({ id: wishlistItem.id });
    } else {
      addToWishlist({
        userId,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        unitPrice: product.price,
      });
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Link
          href={`/products/${product.id}`}
          aria-label={`View ${product.name}`}
        >
          <Image
            src={
              product.image ||
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop"
            }
            alt={product.name}
            width={300}
            height={300}
            className={styles.image}
            loading="lazy"
          />
        </Link>

        {product.discount && product.discount > 0 && (
          <span
            className={styles.discountBadge}
            aria-label={`${product.discount}% off`}
          >
            -{product.discount}%
          </span>
        )}

        {product.isNew && <span className={styles.newBadge}>NEW</span>}

        <div className={styles.overlay}>
          <Button
            className={`${styles.actionBtn} ${isInWishlist ? styles.active : ""}`}
            onClick={handleToggleWishlist}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            type="button"
            variant="ghost"
            size="small"
          >
            <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
          </Button>
          <Link
            href={`/products/${product.id}`}
            className={styles.actionBtn}
            aria-label={`View details for ${product.name}`}
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>

      <div className={styles.info}>
        <Link href={`/products/${product.id}`} className={styles.name}>
          {product.name}
        </Link>
        <div
          className={styles.rating}
          aria-label={`Rating: ${product.rating} out of 5`}
        >
          <span className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={
                  i < product.rating ? styles.starFilled : styles.starEmpty
                }
              >
                ★
              </span>
            ))}
          </span>
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>
        <div className={styles.pricing}>
          <span className={styles.price}>${product.price}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              ${product.originalPrice}
            </span>
          )}
        </div>
        <Button
          className={styles.addToCart}
          onClick={() => onAddToCart?.(product as Product)}
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart`}
          fullWidth
          variant="primary"
        >
          <ShoppingCart size={16} aria-hidden="true" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </article>
  );
}
