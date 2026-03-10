import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Seller Dashboard | Neuro Cart",
    template: "%s | Neuro Cart Seller",
  },
  description:
    "Manage your products, orders, and analytics with AI-powered insights on Neuro Cart.",
};

import Sidebar from "../components/Sidebar/Sidebar";
import SellerNavbar from "../components/SellerNavbar/SellerNavbar";
import styles from "@neuro-cart/shared/src/styles/dashboardLayout.module.css";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${dmSans.variable} ${playfair.variable}`}
        suppressHydrationWarning
      >
        <body suppressHydrationWarning>
          <Providers locale={locale} messages={messages}>
            <div className={styles.layout}>
              <Sidebar />
              <div className={styles.content}>
                <SellerNavbar />
                <div style={{ flex: 1 }}>{children}</div>
              </div>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
