"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { UserButton } from "@clerk/nextjs";
import { Sparkles, Shield, Sun, Moon } from "lucide-react";
import Button from "@neuro-cart/ui/Button";
import styles from "./AdminNavbar.module.css";

export default function AdminNavbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const routeLabels: Record<string, string> = {
    "/": t("dashboard"),
    "/users": t("users"),
    "/products": t("products"),
    "/orders": t("orders"),
    "/analytics": t("analytics"),
    "/moderation": t("moderation"),
    "/ai-tools": "AI Tools",
    "/settings": t("settings"),
  };

  const title = routeLabels[pathname] || t("dashboard");

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      <div className={styles.actions}>
        {mounted && (
          <Button
            className={styles.iconBtn}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label={
              resolvedTheme === "dark" ? t("lightMode") : t("darkMode")
            }
            type="button"
            variant="ghost"
            size="small"
          >
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        )}
        <span className={styles.aiHint}>
          <Sparkles size={14} aria-hidden="true" /> AI
        </span>
        <span className={styles.shield}>
          <Shield size={14} aria-hidden="true" /> ✓
        </span>
        <div className={styles.userWrap}>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
