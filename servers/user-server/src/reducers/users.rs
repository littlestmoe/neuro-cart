use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn create_user(
    ctx: &ReducerContext,
    clerk_id: String,
    email: String,
    first_name: String,
    last_name: String,
    role: UserRole,
) {
    let now = ctx.timestamp;
    let id = generate_id("usr", ctx);

    ctx.db.user_profile().insert(UserProfile {
        id,
        clerk_id,
        email,
        first_name,
        last_name,
        phone: None,
        address: None,
        avatar: None,
        role,
        status: AccountStatus::Active,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
pub fn update_user(
    ctx: &ReducerContext,
    id: String,
    first_name: String,
    last_name: String,
    phone: Option<String>,
    address: Option<String>,
    avatar: Option<String>,
) {
    if let Some(mut existing) = ctx.db.user_profile().id().find(&id) {
        existing.first_name = first_name;
        existing.last_name = last_name;
        existing.phone = phone;
        existing.address = address;
        existing.avatar = avatar;
        existing.updated_at = ctx.timestamp;
        ctx.db.user_profile().id().update(existing);
    }
}

#[reducer]
pub fn update_user_status(ctx: &ReducerContext, id: String, status: AccountStatus) {
    if let Some(mut existing) = ctx.db.user_profile().id().find(&id) {
        existing.status = status;
        existing.updated_at = ctx.timestamp;
        ctx.db.user_profile().id().update(existing);
    }
}
