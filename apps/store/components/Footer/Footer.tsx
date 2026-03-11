"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "@neuro-cart/ui/Button";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          <section className={styles.brand}>
            <h2 className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span> Neuro Cart
            </h2>
            <p className={styles.tagline}>{t("subscribeDesc")}</p>
            <div className={styles.newsletter}>
              <label
                htmlFor="newsletter-email"
                className={styles.newsletterLabel}
              >
                {t("subscribeDesc")}
              </label>
              <form className={styles.newsletterForm}>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={t("enterEmail")}
                  className={styles.newsletterInput}
                  aria-label={t("enterEmail")}
                />
                <Button
                  type="submit"
                  className={styles.newsletterBtn}
                  variant="primary"
                  size="small"
                >
                  {t("subscribe")}
                </Button>
              </form>
            </div>
          </section>

          <nav className={styles.links} aria-label={t("quickLinks")}>
            <h3 className={styles.heading}>{t("quickLinks")}</h3>
            <Link href="/">{tc("home")}</Link>
            <Link href="/search?q=">{tc("search")}</Link>
            <Link href="/cart">{tc("cart")}</Link>
            <Link href="/wishlist">{tc("wishlist")}</Link>
            <Link href="/account">{tc("account")}</Link>
          </nav>

          <nav className={styles.links} aria-label="Categories">
            <h3 className={styles.heading}>Categories</h3>
            <Link href="/search?category=electronics">Electronics</Link>
            <Link href="/search?category=fashion">Fashion</Link>
            <Link href="/search?category=gaming">Gaming</Link>
            <Link href="/search?category=furniture">Furniture</Link>
          </nav>

          <section className={styles.contact}>
            <h3 className={styles.heading}>{t("contact")}</h3>
            <address className={styles.address}>
              <p>
                <MapPin size={14} aria-hidden="true" /> 123 AI Boulevard, Tech
                City
              </p>
              <p>
                <Phone size={14} aria-hidden="true" /> +1 (555) 123-4567
              </p>
              <p>
                <Mail size={14} aria-hidden="true" /> support@neurocart.ai
              </p>
            </address>
          </section>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Neuro Cart.</p>
        </div>
      </div>
    </footer>
  );
}
