use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn add_to_cart(
    ctx: &ReducerContext,
    user_id: String,
    product_id: String,
    product_name: String,
    product_image: String,
    unit_price: f64,
    quantity: i32,
    selected_color: Option<String>,
    selected_size: Option<String>,
) {
    let now = ctx.timestamp;
    let id = generate_id("ci", ctx);

    ctx.db.cart_item().insert(CartItem {
        id,
        user_id,
        product_id,
        product_name,
        product_image,
        unit_price,
        quantity,
        selected_color,
        selected_size,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
pub fn remove_from_cart(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.cart_item().id().find(&id) {
        ctx.db.cart_item().id().delete(&existing.id);
    }
}

#[reducer]
pub fn update_cart_quantity(ctx: &ReducerContext, id: String, quantity: i32) {
    if let Some(mut existing) = ctx.db.cart_item().id().find(&id) {
        existing.quantity = quantity;
        existing.updated_at = ctx.timestamp;
        ctx.db.cart_item().id().update(existing);
    }
}

#[reducer]
pub fn clear_user_cart(ctx: &ReducerContext, user_id: String) {
    let items: Vec<CartItem> = ctx.db.cart_item().iter().filter(|i| i.user_id == user_id).collect();
    for item in items {
        ctx.db.cart_item().id().delete(&item.id);
    }
}
