import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export const Order = __t.object("Order", {
  id: __t.string(),
  userId: __t.string(),
  sellerId: __t.string(),
  total: __t.f64(),
  subtotal: __t.f64(),
  tax: __t.f64(),
  shippingCost: __t.f64(),
  get status() {
    return OrderStatus;
  },
  shippingAddress: __t.string(),
  billingAddress: __t.string(),
  paymentId: __t.option(__t.string()),
  notes: __t.option(__t.string()),
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type Order = __Infer<typeof Order>;

export const OrderItem = __t.object("OrderItem", {
  id: __t.string(),
  orderId: __t.string(),
  productId: __t.string(),
  productName: __t.string(),
  quantity: __t.i32(),
  unitPrice: __t.f64(),
  totalPrice: __t.f64(),
  selectedColor: __t.option(__t.string()),
  selectedSize: __t.option(__t.string()),
  createdAt: __t.timestamp(),
});
export type OrderItem = __Infer<typeof OrderItem>;

export const OrderStatus = __t.enum("OrderStatus", {
  Pending: __t.unit(),
  Processing: __t.unit(),
  Shipped: __t.unit(),
  Delivered: __t.unit(),
  Cancelled: __t.unit(),
  Refunded: __t.unit(),
});
export type OrderStatus = __Infer<typeof OrderStatus>;
