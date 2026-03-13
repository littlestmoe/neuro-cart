use spacetimedb::{Timestamp, table};

#[table(accessor = order_item, public)]
pub struct OrderItem {
    #[primary_key]
    pub id: String,
    pub order_id: String,
    pub product_id: String,
    pub product_name: String,
    pub quantity: i32,
    pub unit_price: f64,
    pub total_price: f64,
    pub selected_color: Option<String>,
    pub selected_size: Option<String>,
    pub created_at: Timestamp,
}
