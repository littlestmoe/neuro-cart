import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default __t.row({
  id: __t.string().primaryKey(),
  productId: __t.string().name("product_id"),
  userId: __t.string().name("user_id"),
  userName: __t.string().name("user_name"),
  rating: __t.i32(),
  comment: __t.string(),
  helpfulCount: __t.i32().name("helpful_count"),
  createdAt: __t.timestamp().name("created_at"),
  updatedAt: __t.timestamp().name("updated_at"),
});
