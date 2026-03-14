use spacetimedb::{Timestamp, table};

#[table(accessor = category, public)]
pub struct Category {
    #[primary_key]
    pub id: String,
    pub name: String,
    pub icon: String,
    pub product_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
