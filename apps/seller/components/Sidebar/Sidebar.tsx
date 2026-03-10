"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useCallback } from "react";
import Button from "@neuro-cart/ui/Button";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("common");
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = useCallback(() => setCollapsed((prev) => !prev), []);

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: t("dashboard") },
    { href: "/products", icon: Package, label: t("products") },
    { href: "/orders", icon: ShoppingBag, label: t("orders") },
    { href: "/analytics", icon: BarChart3, label: t("analytics") },
    { href: "/ai-tools", icon: Sparkles, label: "AI Tools" },
    { href: "/settings", icon: Settings, label: t("settings") },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      role="navigation"
      aria-label="Seller navigation"
    >
      <div className={styles.brand}>
        <span className={styles.logoIcon}>⚡</span>
        {!collapsed && <span className={styles.logoText}>Seller Hub</span>}
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userSection}>
          <UserButton />
        </div>
        <Button
          className={styles.collapseBtn}
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
          variant="ghost"
          size="small"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </aside>
  );
}
