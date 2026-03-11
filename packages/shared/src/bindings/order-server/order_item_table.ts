import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default __t.row({
  id: __t.string().primaryKey(),
  orderId: __t.string().name("order_id"),
  productId: __t.string().name("product_id"),
  productName: __t.string().name("product_name"),
  quantity: __t.i32(),
  unitPrice: __t.f64().name("unit_price"),
  totalPrice: __t.f64().name("total_price"),
  selectedColor: __t.option(__t.string()).name("selected_color"),
  selectedSize: __t.option(__t.string()).name("selected_size"),
  createdAt: __t.timestamp().name("created_at"),
});
