import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default {
  userId: __t.string(),
  productId: __t.string(),
  productName: __t.string(),
  productImage: __t.string(),
  unitPrice: __t.f64(),
  quantity: __t.i32(),
  selectedColor: __t.option(__t.string()),
  selectedSize: __t.option(__t.string()),
};
