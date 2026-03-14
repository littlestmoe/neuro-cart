"use client";

import { useTranslations } from "next-intl";
import { Sparkles, ShieldAlert, BarChart } from "lucide-react";
import Button from "@neuro-cart/ui/Button";
import styles from "./page.module.css";
import { useAITools } from "@neuro-cart/shared/hooks";
import {
  analyzeContent,
  generatePlatformInsights,
  detectFraud,
} from "../actions/ai";

export default function AIToolsPage() {
  const t = useTranslations("aiTools");
  const { logs, activeTasks, runTask } = useAITools();

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <ShieldAlert size={24} />
            </div>
            <h2>{t("autoModeration")}</h2>
          </div>
          <p>{t("autoModerationDesc")}</p>
          <div className={styles.actions}>
            <Button
              variant="primary"
              type="button"
              onClick={() =>
                runTask(t("autoModeration"), t("configure"), () =>
                  analyzeContent(
                    "Sample product listing for moderation analysis",
                    "product",
                  ),
                )
              }
              disabled={activeTasks[t("autoModeration")]}
            >
              {activeTasks[t("autoModeration")]
                ? t("processing")
                : t("configure")}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() =>
                runTask(t("autoModeration"), t("viewLogs"), () =>
                  analyzeContent(
                    "Review content check for spam and policy violations",
                    "review",
                  ),
                )
              }
            >
              {t("viewLogs")}
            </Button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <Sparkles size={24} />
            </div>
            <h2>{t("productSuggestions")}</h2>
          </div>
          <p>{t("productSuggestionsDesc")}</p>
          <div className={styles.actions}>
            <Button
              variant="primary"
              type="button"
              onClick={() =>
                runTask(t("productSuggestions"), t("tuneModel"), () =>
                  generatePlatformInsights(
                    "Products: 150 active, Orders: 340 total, Revenue: $45K this month",
                  ),
                )
              }
              disabled={activeTasks[t("productSuggestions")]}
            >
              {activeTasks[t("productSuggestions")]
                ? t("processing")
                : t("tuneModel")}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() =>
                runTask(t("productSuggestions"), t("analytics"), () =>
                  generatePlatformInsights(
                    "Top categories: Electronics 42%, Fashion 28%, Home 15%",
                  ),
                )
              }
            >
              {t("analytics")}
            </Button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <BarChart size={24} />
            </div>
            <h2>{t("demandForecasting")}</h2>
          </div>
          <p>{t("demandForecastingDesc")}</p>
          <div className={styles.actions}>
            <Button
              variant="primary"
              type="button"
              onClick={() =>
                runTask(t("demandForecasting"), t("viewForecasts"), () =>
                  detectFraud(
                    "Transaction pattern: 3 high-value orders from same IP in 5 minutes",
                  ),
                )
              }
              disabled={activeTasks[t("demandForecasting")]}
            >
              {activeTasks[t("demandForecasting")]
                ? t("processing")
                : t("viewForecasts")}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() =>
                runTask(t("demandForecasting"), t("settings"), () =>
                  detectFraud(
                    "User behavior: multiple account creations from single device",
                  ),
                )
              }
            >
              {t("settings")}
            </Button>
          </div>
        </div>
      </div>

      {logs.length > 0 && (
        <div className={styles.logSection}>
          <h2 className={styles.logTitle}>{t("recentActivity")}</h2>
          <div className={styles.logList}>
            {logs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <div className={styles.logMeta}>
                  <span className={styles.logTool}>{log.tool}</span>
                  <span className={styles.logAction}>{log.action}</span>
                </div>
                <div className={styles.logStatusWrap}>
                  <span className={styles.logTime}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`${styles.logStatus} ${styles[`status${log.status}`]}`}
                  >
                    {log.status}
                  </span>
                </div>
                {log.result && (
                  <pre className={styles.logResult}>{log.result}</pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
