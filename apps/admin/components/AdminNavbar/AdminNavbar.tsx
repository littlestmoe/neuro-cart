"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { UserButton } from "@clerk/nextjs";
import { Sparkles, Shield, Sun, Moon, Menu, X } from "lucide-react";
import Button from "@neuro-cart/ui/Button";
import { LanguageToggle } from "@neuro-cart/shared/components";
import styles from "./AdminNavbar.module.css";

interface AdminNavbarProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export default function AdminNavbar({
  onMenuToggle,
  menuOpen,
}: AdminNavbarProps) {
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

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <header className={styles.navbar} role="banner">
      <div className={styles.left}>
        {onMenuToggle && (
          <button
            className={styles.hamburger}
            onClick={onMenuToggle}
            aria-label={menuOpen ? t("close") || "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      <div className={styles.actions}>
        {mounted && (
          <Button
            className={styles.iconBtn}
            onClick={toggleTheme}
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
        <LanguageToggle />
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
