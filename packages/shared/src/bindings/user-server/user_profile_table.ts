import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
import { UserRole, AccountStatus } from "./types";

export default __t.row({
  id: __t.string().primaryKey(),
  clerkId: __t.string().name("clerk_id"),
  email: __t.string(),
  firstName: __t.string().name("first_name"),
  lastName: __t.string().name("last_name"),
  phone: __t.option(__t.string()),
  address: __t.option(__t.string()),
  avatar: __t.option(__t.string()),
  get role() {
    return UserRole;
  },
  get status() {
    return AccountStatus;
  },
  createdAt: __t.timestamp().name("created_at"),
  updatedAt: __t.timestamp().name("updated_at"),
});
