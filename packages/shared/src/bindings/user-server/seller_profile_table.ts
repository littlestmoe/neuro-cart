import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
import { AccountStatus } from "./types";

export default __t.row({
  id: __t.string().primaryKey(),
  userId: __t.string().name("user_id"),
  storeName: __t.string().name("store_name"),
  storeDescription: __t.option(__t.string()).name("store_description"),
  logo: __t.option(__t.string()),
  banner: __t.option(__t.string()),
  rating: __t.f64(),
  totalSales: __t.i32().name("total_sales"),
  totalProducts: __t.i32().name("total_products"),
  get status() {
    return AccountStatus;
  },
  createdAt: __t.timestamp().name("created_at"),
  updatedAt: __t.timestamp().name("updated_at"),
});
