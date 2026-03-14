"use client";

import { useState, useCallback } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import { UserSyncWrapper } from "./UserSyncWrapper";
import styles from "@neuro-cart/shared/src/styles/dashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMobileMenuOpen((p) => !p), []);

  return (
    <UserSyncWrapper>
      <div className={styles.layout}>
        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className={styles.content}>
          <AdminNavbar onMenuToggle={toggleMenu} menuOpen={mobileMenuOpen} />
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </UserSyncWrapper>
  );
}
