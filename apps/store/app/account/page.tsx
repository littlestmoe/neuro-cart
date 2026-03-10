"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  User,
  Package,
  X,
  Star,
  ChevronRight,
  ShoppingBag,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useOrders } from "@neuro-cart/shared/hooks";
import { useReviews } from "@neuro-cart/shared/hooks";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

type Section =
  | "profile"
  | "orders"
  | "cancellations"
  | "reviews"
  | "address"
  | "password";

export default function AccountPage() {
  const t = useTranslations("account");
  const tc = useTranslations("common");
  const { user } = useUser();
  const userId = user?.id ?? "";
  const { orders, cancelOrder, connected: ordersConnected } = useOrders(userId);
  const { reviews, connected: reviewsConnected } = useReviews(
    undefined,
    userId,
  );
  const { currentUser, updateUser } = useUserProfiles(userId);

  const [section, setSection] = useState<Section>("profile");
  const [editProfile, setEditProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    phone: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passForm, setPassForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const cancelledOrders = useMemo(() => {
    return orders.filter((o) => "Cancelled" in o.status);
  }, [orders]);

  const handleSave = () => {
    if (currentUser) {
      updateUser({
        id: currentUser.id,
        firstName: editProfile.firstName,
        lastName: editProfile.lastName,
        phone: editProfile.phone || undefined,
        address: editProfile.address || undefined,
        avatar: undefined,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const getStatusClass = (status: Record<string, unknown>) => {
    const keys = Object.keys(status);
    const tag = (keys[0] ?? "Unknown").toLowerCase();
    const map: Record<string, string | undefined> = {
      processing: styles.statusProcessing,
      shipped: styles.statusShipped,
      delivered: styles.statusDelivered,
      cancelled: styles.statusCancelled,
      pending: styles.statusProcessing,
    };
    return map[tag] ?? styles.statusProcessing;
  };

  const SIDEBAR = [
    {
      label: t("manageAccount"),
      items: [
        { id: "profile" as Section, label: t("myProfile"), icon: User },
        {
          id: "address" as Section,
          label: t("addressBook"),
          icon: ShoppingBag,
        },
        { id: "password" as Section, label: t("changePassword"), icon: Lock },
      ],
    },
    {
      label: t("myOrders"),
      items: [
        { id: "orders" as Section, label: t("myOrders"), icon: Package },
        {
          id: "cancellations" as Section,
          label: t("myCancellations"),
          icon: X,
        },
      ],
    },
    {
      label: t("myReviews"),
      items: [{ id: "reviews" as Section, label: t("myReviews"), icon: Star }],
    },
  ];

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className={styles.page}
        aria-label={tc("account")}
      >
        <nav aria-label={tc("search")} className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            {tc("home")}
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span>{t("title")}</span>
        </nav>

        <p className={styles.welcomeText}>
          {t("welcome")} <span>{user?.fullName ?? tc("loading")}</span>
        </p>

        <div className={styles.layout}>
          <nav className={styles.sidebar} aria-label={t("manageAccount")}>
            {SIDEBAR.map((group) => (
              <div key={group.label} className={styles.sidebarSection}>
                <p className={styles.sidebarLabel}>{group.label}</p>
                {group.items.map((item) => (
                  <Button
                    key={item.id}
                    className={`${styles.sidebarItem} ${section === item.id ? styles.sidebarItemActive : ""}`}
                    onClick={() => setSection(item.id)}
                    aria-current={section === item.id ? "page" : undefined}
                    type="button"
                    variant={section === item.id ? "primary" : "ghost"}
                    size="small"
                  >
                    <item.icon size={16} aria-hidden="true" />
                    {item.label}
                  </Button>
                ))}
              </div>
            ))}
          </nav>

          <div className={styles.content}>
            {section === "profile" && (
              <section aria-labelledby="profile-heading">
                <h2 id="profile-heading" className={styles.contentTitle}>
                  {t("editProfile")}
                </h2>
                <div
                  className={styles.avatarSection}
                  aria-label={t("myProfile")}
                >
                  <UserButton />
                  <div className={styles.avatarInfo}>
                    <p className={styles.avatarName}>
                      {user?.fullName ?? tc("loading")}
                    </p>
                    <p className={styles.avatarEmail}>
                      {user?.primaryEmailAddress?.emailAddress ?? ""}
                    </p>
                  </div>
                </div>
                <div className={styles.profileGrid}>
                  {[
                    {
                      id: "firstName",
                      label: t("firstName"),
                      value: editProfile.firstName,
                      field: "firstName" as const,
                    },
                    {
                      id: "lastName",
                      label: t("lastName"),
                      value: editProfile.lastName,
                      field: "lastName" as const,
                    },
                    {
                      id: "accountEmail",
                      label: t("email"),
                      value: editProfile.email,
                      field: "email" as const,
                      type: "email",
                    },
                    {
                      id: "accountPhone",
                      label: t("phone"),
                      value: editProfile.phone,
                      field: "phone" as const,
                      type: "tel",
                    },
                  ].map((f) => (
                    <div key={f.id} className={styles.formGroup}>
                      <Input
                        id={f.id}
                        type={f.type ?? "text"}
                        value={f.value}
                        onChange={(e) =>
                          setEditProfile((p) => ({
                            ...p,
                            [f.field]: e.target.value,
                          }))
                        }
                        label={f.label}
                      />
                    </div>
                  ))}
                  <div className={styles.formGroupFull}>
                    <Input
                      id="address"
                      value={editProfile.address}
                      onChange={(e) =>
                        setEditProfile((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                      label={t("addressBook")}
                      fullWidth
                    />
                  </div>
                </div>
                {saved && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={styles.savedMsg}
                  >
                    {tc("success")}
                  </p>
                )}
                <div className={styles.btnRow}>
                  <Button
                    className={styles.cancelBtn}
                    onClick={() =>
                      setEditProfile({
                        firstName: user?.firstName ?? "",
                        lastName: user?.lastName ?? "",
                        email: user?.primaryEmailAddress?.emailAddress ?? "",
                        phone: "",
                        address: "",
                      })
                    }
                    variant="ghost"
                  >
                    {tc("close")}
                  </Button>
                  <Button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    aria-label={tc("save")}
                    variant="primary"
                  >
                    {tc("save")}
                  </Button>
                </div>
              </section>
            )}

            {section === "orders" && (
              <section aria-labelledby="orders-heading">
                <h2 id="orders-heading" className={styles.contentTitle}>
                  {t("myOrders")}
                </h2>
                <div className={styles.tableWrap}>
                  {!ordersConnected ? (
                    <div className={styles.emptyState}>
                      <p>{tc("loading")}...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Package size={48} aria-hidden="true" />
                      <p>{tc("loading")}</p>
                      <Link href="/" className={styles.saveBtn}>
                        {tc("home")}
                      </Link>
                    </div>
                  ) : (
                    <table className={styles.table} aria-label={t("myOrders")}>
                      <thead className={styles.thead}>
                        <tr>
                          <th scope="col">{t("myOrders")}</th>
                          <th scope="col">{tc("total")}</th>
                          <th scope="col">{t("status")}</th>
                          <th scope="col">{tc("view")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className={styles.tr}>
                            <td className={styles.td}>
                              {order.id.slice(0, 10)}...
                            </td>
                            <td className={styles.td}>
                              ${order.total.toFixed(2)}
                            </td>
                            <td className={styles.td}>
                              <span
                                className={`${styles.statusBadge} ${getStatusClass(order.status as unknown as Record<string, unknown>)}`}
                              >
                                {Object.keys(order.status)[0] ?? "Unknown"}
                              </span>
                            </td>
                            <td className={styles.td}>
                              {"Pending" in order.status ||
                              "Processing" in order.status ? (
                                <Button
                                  className={styles.viewDetailsBtn}
                                  onClick={() => cancelOrder({ id: order.id })}
                                  aria-label={tc("delete")}
                                  variant="danger"
                                  size="small"
                                >
                                  {tc("cancel")}
                                </Button>
                              ) : (
                                <span className={styles.viewDetailsBtn}>-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            )}

            {section === "cancellations" && (
              <section aria-labelledby="cancel-heading">
                <h2 id="cancel-heading" className={styles.contentTitle}>
                  {t("myCancellations")}
                </h2>
                {cancelledOrders.length === 0 ? (
                  <div className={styles.emptyState} aria-live="polite">
                    <X size={48} aria-hidden="true" />
                    <p>{tc("loading")}</p>
                  </div>
                ) : (
                  <table
                    className={styles.table}
                    aria-label={t("myCancellations")}
                  >
                    <thead className={styles.thead}>
                      <tr>
                        <th scope="col">{t("myOrders")}</th>
                        <th scope="col">{tc("total")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cancelledOrders.map((order) => (
                        <tr key={order.id} className={styles.tr}>
                          <td className={styles.td}>
                            {order.id.slice(0, 10)}...
                          </td>
                          <td className={styles.td}>
                            ${order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            )}

            {section === "reviews" && (
              <section aria-labelledby="reviews-heading">
                <h2 id="reviews-heading" className={styles.contentTitle}>
                  {t("myReviews")}
                </h2>
                {!reviewsConnected || reviews.length === 0 ? (
                  <div className={styles.emptyState} aria-live="polite">
                    <Star size={48} aria-hidden="true" />
                    <p>{tc("loading")}</p>
                  </div>
                ) : (
                  <div>
                    {reviews.map((review) => (
                      <div key={review.id} className={styles.emptyState}>
                        <p>{review.comment}</p>
                        <p>Rating: {"⭐".repeat(review.rating)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {section === "address" && (
              <section aria-labelledby="address-heading">
                <h2 id="address-heading" className={styles.contentTitle}>
                  {t("addressBook")}
                </h2>
                <div className={styles.profileGrid}>
                  <div className={styles.formGroupFull}>
                    <Input
                      id="addr"
                      value={editProfile.address}
                      onChange={(e) =>
                        setEditProfile((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                      label={t("addressBook")}
                      fullWidth
                    />
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <Button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    variant="primary"
                  >
                    {tc("save")}
                  </Button>
                </div>
              </section>
            )}

            {section === "password" && (
              <section aria-labelledby="password-heading">
                <h2 id="password-heading" className={styles.contentTitle}>
                  {t("changePassword")}
                </h2>
                <div className={styles.passGrid}>
                  {[
                    {
                      id: "current",
                      label: t("currentPassword"),
                      key: "current" as const,
                    },
                    {
                      id: "newPass",
                      label: t("newPassword"),
                      key: "newPass" as const,
                    },
                    {
                      id: "confirm",
                      label: t("confirmPassword"),
                      key: "confirm" as const,
                    },
                  ].map((field) => (
                    <div key={field.id} className={styles.formGroup}>
                      <div className={styles.passInputWrap}>
                        <Input
                          id={field.id}
                          type={showPass ? "text" : "password"}
                          value={passForm[field.key]}
                          onChange={(e) =>
                            setPassForm((p) => ({
                              ...p,
                              [field.key]: e.target.value,
                            }))
                          }
                          label={field.label}
                        />
                        <button
                          className={styles.passToggle}
                          onClick={() => setShowPass((s) => !s)}
                          aria-label={showPass ? tc("view") : tc("view")}
                          type="button"
                        >
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.btnRow}>
                  <Button
                    className={styles.cancelBtn}
                    onClick={() =>
                      setPassForm({ current: "", newPass: "", confirm: "" })
                    }
                    variant="ghost"
                  >
                    {tc("close")}
                  </Button>
                  <Button
                    className={styles.saveBtn}
                    aria-label={tc("save")}
                    variant="primary"
                  >
                    {tc("save")}
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
