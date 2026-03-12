import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

export const AccountStatus = __t.enum("AccountStatus", {
  Active: __t.unit(),
  Suspended: __t.unit(),
  Deactivated: __t.unit(),
});
export type AccountStatus = __Infer<typeof AccountStatus>;

export const SellerProfile = __t.object("SellerProfile", {
  id: __t.string(),
  userId: __t.string(),
  storeName: __t.string(),
  storeDescription: __t.option(__t.string()),
  logo: __t.option(__t.string()),
  banner: __t.option(__t.string()),
  rating: __t.f64(),
  totalSales: __t.i32(),
  totalProducts: __t.i32(),
  get status() {
    return AccountStatus;
  },
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type SellerProfile = __Infer<typeof SellerProfile>;

export const UserProfile = __t.object("UserProfile", {
  id: __t.string(),
  clerkId: __t.string(),
  email: __t.string(),
  firstName: __t.string(),
  lastName: __t.string(),
  phone: __t.option(__t.string()),
  address: __t.option(__t.string()),
  avatar: __t.option(__t.string()),
  get role() {
    return UserRole;
  },
  get status() {
    return AccountStatus;
  },
  createdAt: __t.timestamp(),
  updatedAt: __t.timestamp(),
});
export type UserProfile = __Infer<typeof UserProfile>;

export const UserRole = __t.enum("UserRole", {
  Buyer: __t.unit(),
  Seller: __t.unit(),
  Admin: __t.unit(),
});
export type UserRole = __Infer<typeof UserRole>;
