import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

import { UserRole } from "./types";

export default {
  clerkId: __t.string(),
  email: __t.string(),
  firstName: __t.string(),
  lastName: __t.string(),
  get role() {
    return UserRole;
  },
};
