use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Clone, Debug)]
pub enum UserRole {
    Buyer,
    Seller,
    Admin,
}

#[derive(SpacetimeType, Clone, Debug)]
pub enum AccountStatus {
    Active,
    Suspended,
    Deactivated,
}
