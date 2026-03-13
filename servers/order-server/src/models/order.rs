use crate::models::enums::OrderStatus;
use spacetimedb::{Timestamp, table};

#[table(accessor = order, public)]
pub struct Order {
    #[primary_key]
    pub id: String,
    pub user_id: String,
    pub seller_id: String,
    pub total: f64,
    pub subtotal: f64,
    pub tax: f64,
    pub shipping_cost: f64,
    pub status: OrderStatus,
    pub shipping_address: String,
    pub billing_address: String,
    pub payment_id: Option<String>,
    pub notes: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
