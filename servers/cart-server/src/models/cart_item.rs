use spacetimedb::{Timestamp, table};

#[table(accessor = cart_item, public)]
pub struct CartItem {
    #[primary_key]
    pub id: String,
    pub user_id: String,
    pub product_id: String,
    pub product_name: String,
    pub product_image: String,
    pub unit_price: f64,
    pub quantity: i32,
    pub selected_color: Option<String>,
    pub selected_size: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
