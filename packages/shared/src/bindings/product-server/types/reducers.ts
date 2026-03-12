import { type Infer as __Infer } from "spacetimedb";

import AddCategoryReducer from "../add_category_reducer";
import AddProductReducer from "../add_product_reducer";
import DeleteCategoryReducer from "../delete_category_reducer";
import DeleteProductReducer from "../delete_product_reducer";
import UpdateCategoryReducer from "../update_category_reducer";
import UpdateProductReducer from "../update_product_reducer";
import UpdateProductStockReducer from "../update_product_stock_reducer";

export type AddCategoryParams = __Infer<typeof AddCategoryReducer>;
export type AddProductParams = __Infer<typeof AddProductReducer>;
export type DeleteCategoryParams = __Infer<typeof DeleteCategoryReducer>;
export type DeleteProductParams = __Infer<typeof DeleteProductReducer>;
export type UpdateCategoryParams = __Infer<typeof UpdateCategoryReducer>;
export type UpdateProductParams = __Infer<typeof UpdateProductReducer>;
export type UpdateProductStockParams = __Infer<
  typeof UpdateProductStockReducer
>;
