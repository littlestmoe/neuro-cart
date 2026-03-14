"use client";

import { useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import SellerNavbar from "../../components/SellerNavbar/SellerNavbar";
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
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className={styles.content}>
          <SellerNavbar onMenuToggle={toggleMenu} menuOpen={mobileMenuOpen} />
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </UserSyncWrapper>
  );
}
