import { type Infer as __Infer } from "spacetimedb";

import AddOrderItemReducer from "../add_order_item_reducer";
import CancelOrderReducer from "../cancel_order_reducer";
import CreateOrderReducer from "../create_order_reducer";
import UpdateOrderStatusReducer from "../update_order_status_reducer";

export type AddOrderItemParams = __Infer<typeof AddOrderItemReducer>;
export type CancelOrderParams = __Infer<typeof CancelOrderReducer>;
export type CreateOrderParams = __Infer<typeof CreateOrderReducer>;
export type UpdateOrderStatusParams = __Infer<typeof UpdateOrderStatusReducer>;
