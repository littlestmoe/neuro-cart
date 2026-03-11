import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default {
  orderId: __t.string(),
  productId: __t.string(),
  productName: __t.string(),
  quantity: __t.i32(),
  unitPrice: __t.f64(),
  selectedColor: __t.option(__t.string()),
  selectedSize: __t.option(__t.string()),
};
