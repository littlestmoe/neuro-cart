import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default __t.row({
  id: __t.string().primaryKey(),
  userId: __t.string().name("user_id"),
  productId: __t.string().name("product_id"),
  productName: __t.string().name("product_name"),
  productImage: __t.string().name("product_image"),
  unitPrice: __t.f64().name("unit_price"),
  addedAt: __t.timestamp().name("added_at"),
});
