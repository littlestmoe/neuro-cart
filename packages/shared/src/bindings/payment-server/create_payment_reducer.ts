import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

import { PaymentMethod } from "./types";

export default {
  orderId: __t.string(),
  userId: __t.string(),
  amount: __t.f64(),
  get method() {
    return PaymentMethod;
  },
};
