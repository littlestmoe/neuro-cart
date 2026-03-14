use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Clone, Debug)]
pub enum ProductStatus {
    Active,
    Draft,
    Archived,
    OutOfStock,
}

#[derive(SpacetimeType, Clone, Debug)]
pub enum ProductCondition {
    New,
    Refurbished,
    Used,
}
