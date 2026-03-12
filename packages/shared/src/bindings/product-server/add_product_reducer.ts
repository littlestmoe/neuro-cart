import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

import { ProductCondition } from "./types";

export default {
  name: __t.string(),
  price: __t.f64(),
  originalPrice: __t.option(__t.f64()),
  discount: __t.option(__t.i32()),
  image: __t.string(),
  images: __t.array(__t.string()),
  categoryId: __t.string(),
  colors: __t.array(__t.string()),
  sizes: __t.array(__t.string()),
  description: __t.option(__t.string()),
  stock: __t.i32(),
  sellerId: __t.string(),
  get condition() {
    return ProductCondition;
  },
  tags: __t.array(__t.string()),
};
