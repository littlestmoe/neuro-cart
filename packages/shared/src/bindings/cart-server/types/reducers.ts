import { type Infer as __Infer } from "spacetimedb";

import AddToCartReducer from "../add_to_cart_reducer";
import AddToWishlistReducer from "../add_to_wishlist_reducer";
import ClearUserCartReducer from "../clear_user_cart_reducer";
import RemoveFromCartReducer from "../remove_from_cart_reducer";
import RemoveFromWishlistReducer from "../remove_from_wishlist_reducer";
import UpdateCartQuantityReducer from "../update_cart_quantity_reducer";

export type AddToCartParams = __Infer<typeof AddToCartReducer>;
export type AddToWishlistParams = __Infer<typeof AddToWishlistReducer>;
export type ClearUserCartParams = __Infer<typeof ClearUserCartReducer>;
export type RemoveFromCartParams = __Infer<typeof RemoveFromCartReducer>;
export type RemoveFromWishlistParams = __Infer<
  typeof RemoveFromWishlistReducer
>;
export type UpdateCartQuantityParams = __Infer<
  typeof UpdateCartQuantityReducer
>;
