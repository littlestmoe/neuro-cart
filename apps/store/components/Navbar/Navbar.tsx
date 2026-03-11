"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Button from "@neuro-cart/ui/Button";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
    },
    [searchQuery],
  );

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.logo} aria-label="Neuro Cart home">
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>Neuro Cart</span>
        </Link>

        <form
          className={styles.searchForm}
          onSubmit={handleSearch}
          role="search"
        >
          <Search className={styles.searchIcon} size={18} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={tc("search")}
          />
        </form>

        <div className={styles.actions}>
          {mounted && (
            <Button
              className={styles.iconBtn}
              onClick={toggleTheme}
              aria-label={
                resolvedTheme === "dark" ? tc("lightMode") : tc("darkMode")
              }
              type="button"
              variant="ghost"
              size="small"
            >
              {resolvedTheme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </Button>
          )}

          <Link
            href="/wishlist"
            className={styles.iconBtn}
            aria-label={tc("wishlist")}
          >
            <Heart size={20} />
          </Link>

          <Link href="/cart" className={styles.iconBtn} aria-label={tc("cart")}>
            <ShoppingCart size={20} />
          </Link>

          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button
                className={styles.iconBtn}
                aria-label={tc("login")}
                type="button"
                variant="ghost"
                size="small"
              >
                <User size={20} />
              </Button>
            </SignInButton>
          )}

          <Button
            className={styles.menuBtn}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? tc("close") : "Menu"}
            type="button"
            variant="ghost"
            size="small"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {menuOpen && (
          <div
            id="mobile-menu"
            className={styles.mobileMenu}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <Link href="/" className={styles.mobileLink} onClick={toggleMenu}>
              {tc("home")}
            </Link>
            <Link
              href="/search?q="
              className={styles.mobileLink}
              onClick={toggleMenu}
            >
              {tc("search")}
            </Link>
            <Link
              href="/wishlist"
              className={styles.mobileLink}
              onClick={toggleMenu}
            >
              {tc("wishlist")}
            </Link>
            <Link
              href="/cart"
              className={styles.mobileLink}
              onClick={toggleMenu}
            >
              {tc("cart")}
            </Link>
            <Link
              href="/account"
              className={styles.mobileLink}
              onClick={toggleMenu}
            >
              {tc("account")}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
