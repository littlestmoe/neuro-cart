use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn create_payment(
    ctx: &ReducerContext,
    order_id: String,
    user_id: String,
    amount: f64,
    method: PaymentMethod,
) {
    let now = ctx.timestamp;
    let id = generate_id("pay", ctx);

    ctx.db.payment().insert(Payment {
        id,
        order_id,
        user_id,
        amount,
        method,
        status: PaymentStatus::Pending,
        transaction_ref: None,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
pub fn update_payment_status(
    ctx: &ReducerContext,
    id: String,
    status: PaymentStatus,
    transaction_ref: Option<String>,
) {
    if let Some(mut existing) = ctx.db.payment().id().find(&id) {
        existing.status = status;
        existing.transaction_ref = transaction_ref.or(existing.transaction_ref);
        existing.updated_at = ctx.timestamp;
        ctx.db.payment().id().update(existing);
    }
}
