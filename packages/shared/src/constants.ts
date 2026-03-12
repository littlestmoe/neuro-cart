export const APP_NAME = "Neuro Cart";
export const APP_DESCRIPTION =
  "AI-driven commerce platform that adapts to your shopping instincts in real time";

export const SPACETIMEDB_MODULES = {
  product: "neuro-cart-products",
  order: "neuro-cart-orders",
  user: "neuro-cart-users",
  payment: "neuro-cart-payments",
  review: "neuro-cart-reviews",
  cart: "neuro-cart-cart",
} as const;

export const PORTS = {
  store: 3000,
  seller: 3001,
  admin: 3002,
} as const;

export const CURRENCY = {
  code: "USD",
  symbol: "$",
  locale: "en-US",
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  bank_transfer: "Bank Transfer",
  digital_wallet: "Digital Wallet",
};

export const PRODUCT_CATEGORIES = [
  { id: "phones", name: "Phones", icon: "Smartphone" },
  { id: "computers", name: "Computers", icon: "Monitor" },
  { id: "smartwatch", name: "SmartWatch", icon: "Watch" },
  { id: "camera", name: "Camera", icon: "Camera" },
  { id: "headphones", name: "HeadPhones", icon: "Headphones" },
  { id: "gaming", name: "Gaming", icon: "Gamepad2" },
  { id: "fashion", name: "Fashion", icon: "Shirt" },
  { id: "furniture", name: "Furniture", icon: "Sofa" },
] as const;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat(CURRENCY.locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};
