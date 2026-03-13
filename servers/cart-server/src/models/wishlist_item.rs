use spacetimedb::{Timestamp, table};

#[table(accessor = wishlist_item, public)]
pub struct WishlistItem {
    #[primary_key]
    pub id: String,
    pub user_id: String,
    pub product_id: String,
    pub product_name: String,
    pub product_image: String,
    pub unit_price: f64,
    pub added_at: Timestamp,
}
