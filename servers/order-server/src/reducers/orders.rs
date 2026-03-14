use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn create_order(
    ctx: &ReducerContext,
    user_id: String,
    seller_id: String,
    subtotal: f64,
    tax: f64,
    shipping_cost: f64,
    shipping_address: String,
    billing_address: String,
    notes: Option<String>,
) {
    let now = ctx.timestamp;
    let order_id = generate_id("ord", ctx);
    let total = subtotal + tax + shipping_cost;

    ctx.db.order().insert(Order {
        id: order_id,
        user_id,
        seller_id,
        total,
        subtotal,
        tax,
        shipping_cost,
        status: OrderStatus::Pending,
        shipping_address,
        billing_address,
        payment_id: None,
        notes,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn add_order_item(
    ctx: &ReducerContext,
    order_id: String,
    product_id: String,
    product_name: String,
    quantity: i32,
    unit_price: f64,
    selected_color: Option<String>,
    selected_size: Option<String>,
) {
    let now = ctx.timestamp;
    let item_id = generate_id("oi", ctx);
    ctx.db.order_item().insert(OrderItem {
        id: item_id,
        order_id,
        product_id,
        product_name,
        quantity,
        unit_price,
        total_price: unit_price * quantity as f64,
        selected_color,
        selected_size,
        created_at: now,
    });
}

#[reducer]
pub fn update_order_status(ctx: &ReducerContext, id: String, status: OrderStatus) {
    if let Some(mut existing) = ctx.db.order().id().find(&id) {
        existing.status = status;
        existing.updated_at = ctx.timestamp;
        ctx.db.order().id().update(existing);
    }
}

#[reducer]
pub fn cancel_order(ctx: &ReducerContext, id: String) {
    if let Some(mut existing) = ctx.db.order().id().find(&id) {
        existing.status = OrderStatus::Cancelled;
        existing.updated_at = ctx.timestamp;
        ctx.db.order().id().update(existing);
    }
}
