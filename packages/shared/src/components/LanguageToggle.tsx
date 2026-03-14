"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import styles from "./LanguageToggle.module.css";

export default function LanguageToggle() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("common");

  const toggleLocale = useCallback(() => {
    const next = locale === "en" ? "ar" : "en";
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    router.refresh();
  }, [locale, router]);

  return (
    <button
      className={styles.toggle}
      onClick={toggleLocale}
      aria-label={t("switchLanguage")}
      type="button"
    >
      <Globe size={16} aria-hidden="true" />
      <span className={styles.label}>{locale === "en" ? "عربي" : "EN"}</span>
    </button>
  );
}
