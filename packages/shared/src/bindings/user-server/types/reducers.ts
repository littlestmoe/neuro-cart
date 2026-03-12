import { type Infer as __Infer } from "spacetimedb";

import CreateSellerReducer from "../create_seller_reducer";
import CreateUserReducer from "../create_user_reducer";
import UpdateSellerReducer from "../update_seller_reducer";
import UpdateUserReducer from "../update_user_reducer";
import UpdateUserStatusReducer from "../update_user_status_reducer";

export type CreateSellerParams = __Infer<typeof CreateSellerReducer>;
export type CreateUserParams = __Infer<typeof CreateUserReducer>;
export type UpdateSellerParams = __Infer<typeof UpdateSellerReducer>;
export type UpdateUserParams = __Infer<typeof UpdateUserReducer>;
export type UpdateUserStatusParams = __Infer<typeof UpdateUserStatusReducer>;
