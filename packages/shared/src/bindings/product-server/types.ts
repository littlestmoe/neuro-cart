import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export const Category = __t.object("Category", {
  id: __t.string(),
  name: __t.string(),
  icon: __t.string(),
  productCount: __t.i32(),
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type Category = __Infer<typeof Category>;

export const Product = __t.object("Product", {
  id: __t.string(),
  name: __t.string(),
  price: __t.f64(),
  originalPrice: __t.option(__t.f64()),
  discount: __t.option(__t.i32()),
  rating: __t.f64(),
  reviewCount: __t.i32(),
  image: __t.string(),
  images: __t.array(__t.string()),
  categoryId: __t.string(),
  colors: __t.array(__t.string()),
  sizes: __t.array(__t.string()),
  description: __t.option(__t.string()),
  inStock: __t.bool(),
  isNew: __t.bool(),
  isFeatured: __t.bool(),
  stock: __t.i32(),
  soldCount: __t.i32(),
  sellerId: __t.string(),
  get condition() {
    return ProductCondition;
  },
  get status() {
    return ProductStatus;
  },
  tags: __t.array(__t.string()),
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type Product = __Infer<typeof Product>;

export const ProductCondition = __t.enum("ProductCondition", {
  New: __t.unit(),
  Refurbished: __t.unit(),
  Used: __t.unit(),
});
export type ProductCondition = __Infer<typeof ProductCondition>;

export const ProductStatus = __t.enum("ProductStatus", {
  Active: __t.unit(),
  Draft: __t.unit(),
  Archived: __t.unit(),
  OutOfStock: __t.unit(),
});
export type ProductStatus = __Infer<typeof ProductStatus>;
