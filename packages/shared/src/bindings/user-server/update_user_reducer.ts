import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export default {
  id: __t.string(),
  firstName: __t.string(),
  lastName: __t.string(),
  phone: __t.option(__t.string()),
  address: __t.option(__t.string()),
  avatar: __t.option(__t.string()),
};
