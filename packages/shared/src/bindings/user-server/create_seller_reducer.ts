import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default {
  userId: __t.string(),
  storeName: __t.string(),
  storeDescription: __t.option(__t.string()),
};
