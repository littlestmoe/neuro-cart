import { type Infer as __Infer } from "spacetimedb";

import CreatePaymentReducer from "../create_payment_reducer";
import UpdatePaymentStatusReducer from "../update_payment_status_reducer";

export type CreatePaymentParams = __Infer<typeof CreatePaymentReducer>;
export type UpdatePaymentStatusParams = __Infer<
  typeof UpdatePaymentStatusReducer
>;
