use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn add_category(ctx: &ReducerContext, name: String, icon: String) {
    let now = ctx.timestamp;
    let id = generate_id("cat", ctx);

    ctx.db.category().insert(Category {
        id,
        name,
        icon,
        product_count: 0,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
pub fn update_category(ctx: &ReducerContext, id: String, name: String, icon: String) {
    if let Some(existing) = ctx.db.category().id().find(&id) {
        let updated = Category {
            id: existing.id,
            name,
            icon,
            product_count: existing.product_count,
            created_at: existing.created_at,
            updated_at: ctx.timestamp,
        };
        ctx.db.category().id().update(updated);
    }
}

#[reducer]
pub fn delete_category(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.category().id().find(&id) {
        ctx.db.category().id().delete(&existing.id);
    }
}
