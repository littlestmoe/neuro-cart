use crate::models::enums::{ProductCondition, ProductStatus};
use spacetimedb::{Timestamp, table};

#[table(accessor = product, public)]
pub struct Product {
    #[primary_key]
    pub id: String,
    pub name: String,
    pub price: f64,
    pub original_price: Option<f64>,
    pub discount: Option<i32>,
    pub rating: f64,
    pub review_count: i32,
    pub image: String,
    pub images: Vec<String>,
    pub category_id: String,
    pub colors: Vec<String>,
    pub sizes: Vec<String>,
    pub description: Option<String>,
    pub in_stock: bool,
    pub is_new: bool,
    pub is_featured: bool,
    pub stock: i32,
    pub sold_count: i32,
    pub seller_id: String,
    pub condition: ProductCondition,
    pub status: ProductStatus,
    pub tags: Vec<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
