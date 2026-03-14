"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun, Globe, Bell, Shield, Cog } from "lucide-react";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import Select from "@neuro-cart/ui/Select";
import styles from "./page.module.css";

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [notifications, setNotifications] = useState({
    newUsers: true,
    flaggedContent: true,
    systemAlerts: true,
    reports: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.sections}>
        <section className={styles.card} aria-labelledby="theme-heading">
          <div className={styles.cardHeader}>
            <Sun size={20} className={styles.cardIcon} aria-hidden="true" />
            <h2 id="theme-heading" className={styles.cardTitle}>
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

        <section className={styles.card} aria-labelledby="notif-heading">
          <div className={styles.cardHeader}>
            <Bell size={20} className={styles.cardIcon} aria-hidden="true" />
            <h2 id="notif-heading" className={styles.cardTitle}>
              {t("notifications")}
            </h2>
          </div>
          <div className={styles.toggleList}>
            {[
              {
                key: "newUsers" as const,
                label: t("newUsers"),
                desc: t("newUsersDesc"),
              },
              {
                key: "flaggedContent" as const,
                label: t("flaggedContent"),
                desc: t("flaggedContentDesc"),
              },
              {
                key: "systemAlerts" as const,
                label: t("systemAlerts"),
                desc: t("systemAlertsDesc"),
              },
              {
                key: "reports" as const,
                label: t("weeklyReports"),
                desc: t("weeklyReportsDesc"),
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

        <section className={styles.card} aria-labelledby="platform-heading">
          <div className={styles.cardHeader}>
            <Cog size={20} className={styles.cardIcon} aria-hidden="true" />
            <h2 id="platform-heading" className={styles.cardTitle}>
              {t("platform")}
            </h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Input
                id="platformName"
                label={t("platformName")}
                defaultValue="Neuro Cart"
              />
            </div>
            <div className={styles.formGroup}>
              <Input
                id="supportEmail"
                type="email"
                label={t("supportEmail")}
                defaultValue="support@neurocart.com"
              />
            </div>
            <div className={styles.formGroup}>
              <Input
                id="commission"
                type="number"
                label={t("commission")}
                defaultValue="10"
                min={0}
                max={100}
              />
            </div>
            <div className={styles.formGroup}>
              <Select
                id="currency"
                label={t("defaultCurrency")}
                options={[
                  { value: "USD", label: "USD ($)" },
                  { value: "EUR", label: "EUR (€)" },
                  { value: "GBP", label: "GBP (£)" },
                  { value: "AED", label: "AED (د.إ)" },
                ]}
                defaultValue="USD"
              />
            </div>
          </div>
        </section>

        <section className={styles.card} aria-labelledby="security-heading">
          <div className={styles.cardHeader}>
            <Shield size={20} className={styles.cardIcon} aria-hidden="true" />
            <h2 id="security-heading" className={styles.cardTitle}>
              {t("security")}
            </h2>
          </div>
          <div className={styles.toggleList}>
            {[
              {
                key: "2fa",
                label: t("require2fa"),
                desc: t("require2faDesc"),
                checked: true,
              },
              {
                key: "aimod",
                label: t("aiModeration"),
                desc: t("aiModerationDesc"),
                checked: true,
              },
              {
                key: "fraud",
                label: t("fraudDetection"),
                desc: t("fraudDetectionDesc"),
                checked: false,
              },
            ].map((item) => (
              <div key={item.key} className={styles.toggleRow}>
                <div>
                  <p className={styles.toggleLabel}>{item.label}</p>
                  <p className={styles.toggleDesc}>{item.desc}</p>
                </div>
                <button
                  className={`${styles.toggle} ${item.checked ? styles.toggleOn : ""}`}
                  role="switch"
                  aria-checked={item.checked}
                  aria-label={item.label}
                  type="button"
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>
            ))}
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
