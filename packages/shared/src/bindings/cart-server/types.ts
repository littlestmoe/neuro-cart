import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export const CartItem = __t.object("CartItem", {
  id: __t.string(),
  userId: __t.string(),
  productId: __t.string(),
  productName: __t.string(),
  productImage: __t.string(),
  unitPrice: __t.f64(),
  quantity: __t.i32(),
  selectedColor: __t.option(__t.string()),
  selectedSize: __t.option(__t.string()),
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type CartItem = __Infer<typeof CartItem>;

export const WishlistItem = __t.object("WishlistItem", {
  id: __t.string(),
  userId: __t.string(),
  productId: __t.string(),
  productName: __t.string(),
  productImage: __t.string(),
  unitPrice: __t.f64(),
  addedAt: __t.timestamp(),
});
export type WishlistItem = __Infer<typeof WishlistItem>;
