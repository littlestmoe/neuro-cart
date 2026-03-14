import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { UserSyncWrapper } from "../components/UserSyncWrapper";
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
    default: "Neuro Cart, AI-Driven Commerce",
    template: "%s | Neuro Cart",
  },
  description:
    "AI-driven commerce platform that adapts to your shopping instincts in real time. Discover personalized recommendations, smart search, and a seamless checkout experience.",
  keywords: ["ecommerce", "ai shopping", "smart recommendations", "neuro cart"],
};

export default async function RootLayout({
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
            <UserSyncWrapper>{children}</UserSyncWrapper>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
