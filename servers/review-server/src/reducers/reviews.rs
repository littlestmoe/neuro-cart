use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn add_review(
    ctx: &ReducerContext,
    product_id: String,
    user_id: String,
    user_name: String,
    rating: i32,
    comment: String,
) {
    let now = ctx.timestamp;
    let id = generate_id("rev", ctx);

    ctx.db.review().insert(Review {
        id,
        product_id,
        user_id,
        user_name,
        rating,
        comment,
        helpful_count: 0,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
pub fn update_review(ctx: &ReducerContext, id: String, rating: i32, comment: String) {
    if let Some(mut existing) = ctx.db.review().id().find(&id) {
        existing.rating = rating;
        existing.comment = comment;
        existing.updated_at = ctx.timestamp;
        ctx.db.review().id().update(existing);
    }
}

#[reducer]
pub fn delete_review(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.review().id().find(&id) {
        ctx.db.review().id().delete(&existing.id);
    }
}

#[reducer]
pub fn mark_review_helpful(ctx: &ReducerContext, id: String) {
    if let Some(mut existing) = ctx.db.review().id().find(&id) {
        existing.helpful_count += 1;
        existing.updated_at = ctx.timestamp;
        ctx.db.review().id().update(existing);
    }
}
