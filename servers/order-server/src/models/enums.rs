use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Clone, Debug)]
pub enum OrderStatus {
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Refunded,
}
