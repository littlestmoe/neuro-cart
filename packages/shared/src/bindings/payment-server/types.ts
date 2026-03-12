import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export const Payment = __t.object("Payment", {
  id: __t.string(),
  orderId: __t.string(),
  userId: __t.string(),
  amount: __t.f64(),
  get method() {
    return PaymentMethod;
  },
  get status() {
    return PaymentStatus;
  },
  transactionRef: __t.option(__t.string()),
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type Payment = __Infer<typeof Payment>;

export const PaymentMethod = __t.enum("PaymentMethod", {
  CreditCard: __t.unit(),
  DebitCard: __t.unit(),
  BankTransfer: __t.unit(),
  DigitalWallet: __t.unit(),
});
export type PaymentMethod = __Infer<typeof PaymentMethod>;

export const PaymentStatus = __t.enum("PaymentStatus", {
  Pending: __t.unit(),
  Completed: __t.unit(),
  Failed: __t.unit(),
  Refunded: __t.unit(),
});
export type PaymentStatus = __Infer<typeof PaymentStatus>;
