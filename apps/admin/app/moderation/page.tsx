"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import Button from "@neuro-cart/ui/Button";
import styles from "./page.module.css";

import { useModeration } from "@neuro-cart/shared/hooks";
import type { FlagStatus } from "@neuro-cart/shared/hooks";

export default function AdminModerationPage() {
  const { flags, updateStatus } = useModeration();
  const [statusFilter, setStatusFilter] = useState<FlagStatus | "all">("all");
  const tc = useTranslations("common");

  const filtered = flags.filter(
    (f) => statusFilter === "all" || f.status === statusFilter,
  );
  const pendingCount = flags.filter((f) => f.status === "pending").length;

  return (
    <main className={styles.page} aria-label="Moderation queue">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Moderation Queue</h1>
          <p className={styles.subtitle}>{pendingCount} items pending review</p>
        </div>
      </div>

      <div
        className={styles.filters}
        role="group"
        aria-label="Filter by status"
      >
        {(["all", "pending", "resolved", "dismissed"] as const).map((s) => (
          <Button
            key={s}
            className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter(s)}
            type="button"
            variant={statusFilter === s ? "primary" : "secondary"}
            size="small"
          >
            {s === "all"
              ? `${tc("search")} (${flags.length})`
              : `${s.charAt(0).toUpperCase() + s.slice(1)} (${flags.filter((f) => f.status === s).length})`}
          </Button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map((flag) => (
          <article
            key={flag.id}
            className={styles.card}
            aria-label={`Flag: ${flag.target}`}
          >
            <div className={styles.cardHeader}>
              <span
                className={`${styles.typeBadge} ${
                  flag.type === "spam"
                    ? styles.typeSpam
                    : flag.type === "inappropriate"
                      ? styles.typeInappropriate
                      : flag.type === "counterfeit"
                        ? styles.typeCounterfeit
                        : styles.typeMisleading
                }`}
              >
                <AlertTriangle size={12} /> {flag.type}
              </span>
              <span
                className={`${styles.statusBadge} ${styles[`status${flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}`]}`}
              >
                {flag.status === "pending" && <Clock size={12} />}
                {flag.status === "resolved" && <CheckCircle size={12} />}
                {flag.status === "dismissed" && <XCircle size={12} />}
                {flag.status}
              </span>
            </div>

            <h3 className={styles.cardTarget}>{flag.target}</h3>
            <p className={styles.cardMeta}>
              {flag.targetType} · Reported by {flag.reporter} · {flag.date}
            </p>
            <p className={styles.cardReason}>{flag.reason}</p>

            {flag.aiSuggestion && (
              <div className={styles.aiBox}>
                <div className={styles.aiHeader}>
                  <Sparkles size={14} /> AI Analysis
                </div>
                <p className={styles.aiText}>{flag.aiSuggestion}</p>
              </div>
            )}

            {flag.status === "pending" && (
              <div className={styles.cardActions}>
                <Button
                  className={styles.resolveBtn}
                  onClick={() => updateStatus(flag.id, "resolved")}
                  type="button"
                  variant="primary"
                  size="small"
                >
                  <CheckCircle size={14} /> {tc("resolve")}
                </Button>
                <Button
                  className={styles.dismissBtn}
                  onClick={() => updateStatus(flag.id, "dismissed")}
                  type="button"
                  variant="ghost"
                  size="small"
                >
                  <XCircle size={14} /> {tc("dismiss")}
                </Button>
              </div>
            )}
          </article>
        ))}
        {filtered.length === 0 && (
          <p className={styles.empty}>No items in the moderation queue.</p>
        )}
      </div>
    </main>
  );
}
