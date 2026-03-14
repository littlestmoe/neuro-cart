use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn create_seller(
    ctx: &ReducerContext,
    user_id: String,
    store_name: String,
    store_description: Option<String>,
) {
    let now = ctx.timestamp;
    let id = generate_id("sel", ctx);

    ctx.db.seller_profile().insert(SellerProfile {
        id,
        user_id,
        store_name,
        store_description,
        logo: None,
        banner: None,
        rating: 0.0,
        total_sales: 0,
        total_products: 0,
        status: AccountStatus::Active,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
pub fn update_seller(
    ctx: &ReducerContext,
    id: String,
    store_name: String,
    store_description: Option<String>,
    logo: Option<String>,
    banner: Option<String>,
) {
    if let Some(mut existing) = ctx.db.seller_profile().id().find(&id) {
        existing.store_name = store_name;
        existing.store_description = store_description;
        existing.logo = logo;
        existing.banner = banner;
        existing.updated_at = ctx.timestamp;
        ctx.db.seller_profile().id().update(existing);
    }
}
