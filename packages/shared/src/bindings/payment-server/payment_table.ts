import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
import { PaymentMethod, PaymentStatus } from "./types";

export default __t.row({
  id: __t.string().primaryKey(),
  orderId: __t.string().name("order_id"),
  userId: __t.string().name("user_id"),
  amount: __t.f64(),
  get method() {
    return PaymentMethod;
  },
  get status() {
    return PaymentStatus;
  },
  transactionRef: __t.option(__t.string()).name("transaction_ref"),
  createdAt: __t.timestamp().name("created_at"),
  updatedAt: __t.timestamp().name("updated_at"),
});
