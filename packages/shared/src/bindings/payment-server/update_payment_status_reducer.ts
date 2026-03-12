import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

import { PaymentStatus } from "./types";

export default {
  id: __t.string(),
  get status() {
    return PaymentStatus;
  },
  transactionRef: __t.option(__t.string()),
};
