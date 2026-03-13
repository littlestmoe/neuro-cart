use crate::models::enums::{PaymentMethod, PaymentStatus};
use spacetimedb::{Timestamp, table};

#[table(accessor = payment, public)]
pub struct Payment {
    #[primary_key]
    pub id: String,
    pub order_id: String,
    pub user_id: String,
    pub amount: f64,
    pub method: PaymentMethod,
    pub status: PaymentStatus,
    pub transaction_ref: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
