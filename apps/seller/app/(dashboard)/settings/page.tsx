"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun, Globe, Bell, Store } from "lucide-react";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

export default function SellerSettingsPage() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [notifications, setNotifications] = useState({
    orders: true,
    stock: true,
    reviews: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.sections}>
        <section className={styles.card} aria-labelledby="appearance-heading">
          <div className={styles.cardHeader}>
            <Sun size={20} className={styles.cardIcon} aria-hidden="true" />
            <h2 id="appearance-heading" className={styles.cardTitle}>
              {t("appearance")}
            </h2>
          </div>
          <div
            className={styles.themeOptions}
            role="group"
            aria-label={t("appearance")}
          >
            {(["light", "dark", "system"] as const).map((opt) => (
              <Button
                key={opt}
                className={`${styles.themeBtn} ${theme === opt ? styles.themeBtnActive : ""}`}
                onClick={() => setTheme(opt)}
                variant="ghost"
                aria-pressed={theme === opt}
              >
                {opt === "light" && <Sun size={18} />}
                {opt === "dark" && <Moon size={18} />}
                {opt === "system" && <Globe size={18} />}
                {opt === "light"
                  ? tc("lightMode")
                  : opt === "dark"
                    ? tc("darkMode")
                    : tc("systemTheme")}
              </Button>
            ))}
          </div>
        </section>

        <section
          className={styles.card}
          aria-labelledby="notifications-heading"
        >
          <div className={styles.cardHeader}>
            <Bell size={20} className={styles.cardIcon} aria-hidden="true" />
            <h2 id="notifications-heading" className={styles.cardTitle}>
              {t("notifications")}
            </h2>
          </div>
          <div className={styles.toggleList}>
            {[
              {
                key: "orders" as const,
                label: t("newOrders"),
                desc: t("newOrdersDesc"),
              },
              {
                key: "stock" as const,
                label: t("lowStock"),
                desc: t("lowStockDesc"),
              },
              {
                key: "reviews" as const,
                label: t("newReviews"),
                desc: t("newReviewsDesc"),
              },
              {
                key: "marketing" as const,
                label: t("marketing"),
                desc: t("marketingDesc"),
              },
            ].map((item) => (
              <div key={item.key} className={styles.toggleRow}>
                <div>
                  <p className={styles.toggleLabel}>{item.label}</p>
                  <p className={styles.toggleDesc}>{item.desc}</p>
                </div>
                <button
                  className={`${styles.toggle} ${notifications[item.key] ? styles.toggleOn : ""}`}
                  onClick={() =>
                    setNotifications((n) => ({
                      ...n,
                      [item.key]: !n[item.key],
                    }))
                  }
                  role="switch"
                  aria-checked={notifications[item.key]}
                  aria-label={item.label}
                  type="button"
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card} aria-labelledby="store-heading">
          <div className={styles.cardHeader}>
            <Store size={20} className={styles.cardIcon} aria-hidden="true" />
            <h2 id="store-heading" className={styles.cardTitle}>
              {t("storeInfo")}
            </h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Input
                id="storeName"
                label={t("storeName")}
                defaultValue="My Neuro Cart Store"
              />
            </div>
            <div className={styles.formGroup}>
              <Input
                id="storeEmail"
                type="email"
                label={t("storeEmail")}
                defaultValue="store@example.com"
              />
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.label} htmlFor="storeDesc">
                {t("storeDescription")}
              </label>
              <textarea
                id="storeDesc"
                className={styles.textarea}
                rows={3}
                defaultValue="Premium products for modern living."
              />
            </div>
          </div>
        </section>
      </div>

      {saved && (
        <p role="status" aria-live="polite" className={styles.savedMsg}>
          {t("saved")}
        </p>
      )}
      <div className={styles.actions}>
        <Button onClick={handleSave} variant="primary">
          {tc("save")}
        </Button>
      </div>
    </main>
  );
}
