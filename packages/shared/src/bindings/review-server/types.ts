import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export const Review = __t.object("Review", {
  id: __t.string(),
  productId: __t.string(),
  userId: __t.string(),
  userName: __t.string(),
  rating: __t.i32(),
  comment: __t.string(),
  helpfulCount: __t.i32(),
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type Review = __Infer<typeof Review>;
