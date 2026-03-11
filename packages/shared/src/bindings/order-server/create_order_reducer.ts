import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default {
  userId: __t.string(),
  sellerId: __t.string(),
  subtotal: __t.f64(),
  tax: __t.f64(),
  shippingCost: __t.f64(),
  shippingAddress: __t.string(),
  billingAddress: __t.string(),
  notes: __t.option(__t.string()),
};
