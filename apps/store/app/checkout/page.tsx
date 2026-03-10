"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@neuro-cart/shared/hooks";
import { useProducts } from "@neuro-cart/shared/hooks";
import { useOrders } from "@neuro-cart/shared/hooks";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

type PaymentMethod = "card" | "cod" | "paypal" | "bank";

interface BillingFields {
  firstName: string;
  lastName: string;
  company: string;
  streetAddress: string;
  apartment: string;
  townCity: string;
  phone: string;
  email: string;
  saveInfo: boolean;
}

const emptyBilling: BillingFields = {
  firstName: "",
  lastName: "",
  company: "",
  streetAddress: "",
  apartment: "",
  townCity: "",
  phone: "",
  email: "",
  saveInfo: true,
};

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");
  const { user } = useUser();
  const userId = user?.id ?? "";
  const {
    cartItems,
    clearUserCart,
    connected: cartConnected,
  } = useCart(userId);
  const { products } = useProducts();
  const { createOrder, addOrderItem } = useOrders();

  const [billing, setBilling] = useState<BillingFields>(emptyBilling);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [errors, setErrors] = useState<
    Partial<Record<keyof BillingFields, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const enrichedItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return { ...item, product };
      })
      .filter((i) => i.product);
  }, [cartItems, products]);

  const cartTotal = enrichedItems.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0,
  );
  const shipping = cartTotal > 140 ? 0 : 12;
  const total = cartTotal + shipping;

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!billing.firstName.trim()) errs.firstName = tc("loading");
    if (!billing.lastName.trim()) errs.lastName = tc("loading");
    if (!billing.streetAddress.trim()) errs.streetAddress = tc("loading");
    if (!billing.townCity.trim()) errs.townCity = tc("loading");
    if (!billing.phone.trim()) errs.phone = tc("loading");
    if (!billing.email.trim()) errs.email = tc("loading");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    field: keyof BillingFields,
    value: string | boolean,
  ) => {
    setBilling((b) => ({ ...b, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handlePlaceOrder = async () => {
    if (!validate() || enrichedItems.length === 0) return;
    setLoading(true);

    const sellerIds = [
      ...new Set(enrichedItems.map((i) => i.product?.sellerId).filter(Boolean)),
    ] as string[];
    const tax = Math.round(cartTotal * 0.08 * 100) / 100;
    const address = `${billing.streetAddress}, ${billing.apartment ? billing.apartment + ", " : ""}${billing.townCity}`;
    const billingAddr = `${billing.firstName} ${billing.lastName}, ${address}`;
    const generatedOrderId = `NC-${Date.now().toString(36).toUpperCase()}`;

    for (const sellerId of sellerIds) {
      const sellerItems = enrichedItems.filter(
        (i) => i.product?.sellerId === sellerId,
      );
      const sellerSubtotal = sellerItems.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0,
      );

      createOrder({
        userId,
        sellerId,
        subtotal: sellerSubtotal,
        tax: tax / sellerIds.length,
        shippingCost: shipping / sellerIds.length,
        shippingAddress: address,
        billingAddress: billingAddr,
        notes: undefined,
      });

      for (const item of sellerItems) {
        addOrderItem({
          orderId: generatedOrderId,
          productId: item.productId,
          productName: item.product!.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          selectedColor: item.selectedColor ?? undefined,
          selectedSize: item.selectedSize ?? undefined,
        });
      }
    }

    clearUserCart({ userId });
    setOrderId(generatedOrderId);
    setLoading(false);
  };

  const PAYMENT_OPTIONS: { id: PaymentMethod; label: string }[] = [
    { id: "card", label: t("creditCard") },
    { id: "paypal", label: t("paypal") },
    { id: "bank", label: t("bankTransfer") },
    { id: "cod", label: t("cashOnDelivery") },
  ];

  if (orderId) {
    return (
      <>
        <Navbar />
        <main id="main-content" className={styles.page}>
          <div
            className={styles.successWrap}
            aria-live="assertive"
            role="status"
          >
            <div className={styles.successIcon}>
              <CheckCircle size={44} />
            </div>
            <h1 className={styles.successTitle}>{t("orderSuccess")}</h1>
            <p className={styles.orderId}>
              {t("orderId")}: <span>{orderId}</span>
            </p>
            <p className={styles.successSub}>{t("successMessage")}</p>
            <div className={styles.successActions}>
              <Link href="/account" className={styles.ctaBtn}>
                {tc("account")}
              </Link>
              <Link href="/" className={styles.outlineBtn}>
                {tc("home")}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const renderField = (
    id: string,
    label: string,
    field: keyof BillingFields,
    opts?: {
      type?: string;
      placeholder?: string;
      optional?: boolean;
      fullWidth?: boolean;
    },
  ) => (
    <div className={opts?.fullWidth ? styles.formGroupFull : styles.formGroup}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {opts?.optional && (
          <span className={styles.labelOptional}>({tc("close")})</span>
        )}
      </label>
      <Input
        id={id}
        type={opts?.type || "text"}
        value={billing[field] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={opts?.placeholder}
        aria-required={!opts?.optional}
        error={errors[field]}
      />
      {errors[field] && (
        <span id={`${id}-error`} className={styles.errorMsg} role="alert">
          {errors[field]}
        </span>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className={styles.page}
        aria-label={tc("checkout")}
      >
        <h1 className={styles.title}>{tc("checkout")}</h1>

        {!cartConnected ? (
          <p>{tc("loading")}...</p>
        ) : enrichedItems.length === 0 ? (
          <div className={styles.successWrap}>
            <p>
              {tc("loading")}... <Link href="/">{tc("home")}</Link>
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            <section aria-labelledby="billing-heading">
              <div className={styles.billingCard}>
                <h2 className={styles.sectionTitle} id="billing-heading">
                  {t("billingDetails")}
                </h2>
                <div className={styles.formGrid}>
                  {renderField("firstName", t("firstName"), "firstName")}
                  {renderField("lastName", t("lastName"), "lastName")}
                  {renderField("company", t("companyName"), "company", {
                    optional: true,
                    fullWidth: true,
                    placeholder: t("companyNamePlaceholder"),
                  })}
                  {renderField(
                    "streetAddress",
                    t("streetAddress"),
                    "streetAddress",
                    {
                      fullWidth: true,
                      placeholder: t("streetAddressPlaceholder"),
                    },
                  )}
                  {renderField("apartment", t("apartment"), "apartment", {
                    optional: true,
                    fullWidth: true,
                    placeholder: t("apartmentPlaceholder"),
                  })}
                  {renderField("townCity", t("townCity"), "townCity", {
                    fullWidth: true,
                  })}
                  {renderField("phone", t("phone"), "phone", { type: "tel" })}
                  {renderField("email", t("email"), "email", { type: "email" })}
                  <div className={styles.formGroupFull}>
                    <label className={styles.saveLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={billing.saveInfo}
                        onChange={(e) =>
                          handleChange("saveInfo", e.target.checked)
                        }
                        aria-label={t("saveInfo")}
                      />
                      {t("saveInfo")}
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <aside aria-label={t("orderSummary")}>
              <div className={styles.summaryCard}>
                <h2 className={styles.sectionTitle}>{t("orderSummary")}</h2>
                <div className={styles.orderItems}>
                  {enrichedItems.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <Image
                        className={styles.orderItemImg}
                        src={item.product!.image}
                        alt={item.product!.name}
                        width={56}
                        height={56}
                      />
                      <span className={styles.orderItemName}>
                        {item.product!.name}{" "}
                        <span className={styles.orderItemQty}>
                          x{item.quantity}
                        </span>
                      </span>
                      <span className={styles.orderItemPrice}>
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <hr className={styles.divider} aria-hidden="true" />
                <div className={styles.summaryRow}>
                  <span>{t("subtotal")}:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>{t("shipping")}:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div
                  className={`${styles.summaryRow} ${styles.summaryRowTotal}`}
                >
                  <span>{t("total")}:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <h3 className={styles.paymentHeading}>{t("paymentMethod")}</h3>
                <div
                  className={styles.paymentMethods}
                  role="group"
                  aria-label={t("paymentMethod")}
                >
                  {PAYMENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`${styles.paymentOption} ${paymentMethod === opt.id ? styles.paymentOptionActive : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className={styles.paymentRadio}
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        aria-label={opt.label}
                      />
                      <span className={styles.paymentLabel}>{opt.label}</span>
                    </label>
                  ))}
                </div>

                <Button
                  className={styles.placeOrderBtn}
                  onClick={handlePlaceOrder}
                  disabled={loading || enrichedItems.length === 0}
                  loading={loading}
                  aria-label={t("placeOrder")}
                  fullWidth
                  variant="primary"
                >
                  {`${t("placeOrder")} · $${total.toFixed(2)}`}
                </Button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
