use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn add_to_wishlist(
    ctx: &ReducerContext,
    user_id: String,
    product_id: String,
    product_name: String,
    product_image: String,
    unit_price: f64,
) {
    let now = ctx.timestamp;
    let id = generate_id("wi", ctx);

    ctx.db.wishlist_item().insert(WishlistItem {
        id,
        user_id,
        product_id,
        product_name,
        product_image,
        unit_price,
        added_at: now,
    });
}

#[reducer]
pub fn remove_from_wishlist(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.wishlist_item().id().find(&id) {
        ctx.db.wishlist_item().id().delete(&existing.id);
    }
}
