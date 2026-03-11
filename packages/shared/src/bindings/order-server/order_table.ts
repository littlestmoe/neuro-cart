import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
import { OrderStatus } from "./types";

export default __t.row({
  id: __t.string().primaryKey(),
  userId: __t.string().name("user_id"),
  sellerId: __t.string().name("seller_id"),
  total: __t.f64(),
  subtotal: __t.f64(),
  tax: __t.f64(),
  shippingCost: __t.f64().name("shipping_cost"),
  get status() {
    return OrderStatus;
  },
  shippingAddress: __t.string().name("shipping_address"),
  billingAddress: __t.string().name("billing_address"),
  paymentId: __t.option(__t.string()).name("payment_id"),
  notes: __t.option(__t.string()),
  createdAt: __t.timestamp().name("created_at"),
  updatedAt: __t.timestamp().name("updated_at"),
});
