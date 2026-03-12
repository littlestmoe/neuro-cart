import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
import { ProductCondition, ProductStatus } from "./types";

export default __t.row({
  id: __t.string().primaryKey(),
  name: __t.string(),
  price: __t.f64(),
  originalPrice: __t.option(__t.f64()).name("original_price"),
  discount: __t.option(__t.i32()),
  rating: __t.f64(),
  reviewCount: __t.i32().name("review_count"),
  image: __t.string(),
  images: __t.array(__t.string()),
  categoryId: __t.string().name("category_id"),
  colors: __t.array(__t.string()),
  sizes: __t.array(__t.string()),
  description: __t.option(__t.string()),
  inStock: __t.bool().name("in_stock"),
  isNew: __t.bool().name("is_new"),
  isFeatured: __t.bool().name("is_featured"),
  stock: __t.i32(),
  soldCount: __t.i32().name("sold_count"),
  sellerId: __t.string().name("seller_id"),
  get condition() {
    return ProductCondition;
  },
  get status() {
    return ProductStatus;
  },
  tags: __t.array(__t.string()),
  createdAt: __t.timestamp().name("created_at"),
  updatedAt: __t.timestamp().name("updated_at"),
});
