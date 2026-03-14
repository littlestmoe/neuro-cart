use spacetimedb::{Timestamp, table};

#[table(accessor = review, public)]
pub struct Review {
    #[primary_key]
    pub id: String,
    pub product_id: String,
    pub user_id: String,
    pub user_name: String,
    pub rating: i32,
    pub comment: String,
    pub helpful_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
