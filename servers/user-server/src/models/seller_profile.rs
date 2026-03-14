use crate::models::enums::AccountStatus;
use spacetimedb::{Timestamp, table};

#[table(accessor = seller_profile, public)]
pub struct SellerProfile {
    #[primary_key]
    pub id: String,
    pub user_id: String,
    pub store_name: String,
    pub store_description: Option<String>,
    pub logo: Option<String>,
    pub banner: Option<String>,
    pub rating: f64,
    pub total_sales: i32,
    pub total_products: i32,
    pub status: AccountStatus,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
