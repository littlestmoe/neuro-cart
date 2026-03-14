use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn add_product(
    ctx: &ReducerContext,
    name: String,
    price: f64,
    original_price: Option<f64>,
    discount: Option<i32>,
    image: String,
    images: Vec<String>,
    category_id: String,
    colors: Vec<String>,
    sizes: Vec<String>,
    description: Option<String>,
    stock: i32,
    seller_id: String,
    condition: ProductCondition,
    tags: Vec<String>,
) {
    let now = ctx.timestamp;
    let id = generate_id("prod", ctx);

    ctx.db.product().insert(Product {
        id,
        name,
        price,
        original_price,
        discount,
        rating: 0.0,
        review_count: 0,
        image,
        images,
        category_id,
        colors,
        sizes,
        description,
        in_stock: stock > 0,
        is_new: true,
        is_featured: false,
        stock,
        sold_count: 0,
        seller_id,
        condition,
        status: ProductStatus::Active,
        tags,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn update_product(
    ctx: &ReducerContext,
    id: String,
    name: String,
    price: f64,
    original_price: Option<f64>,
    discount: Option<i32>,
    image: String,
    images: Vec<String>,
    category_id: String,
    colors: Vec<String>,
    sizes: Vec<String>,
    description: Option<String>,
    stock: i32,
    is_featured: bool,
    status: ProductStatus,
    tags: Vec<String>,
) {
    let now = ctx.timestamp;

    if let Some(existing) = ctx.db.product().id().find(&id) {
        let updated = Product {
            id: existing.id,
            name,
            price,
            original_price,
            discount,
            rating: existing.rating,
            review_count: existing.review_count,
            image,
            images,
            category_id,
            colors,
            sizes,
            description,
            in_stock: stock > 0,
            is_new: existing.is_new,
            is_featured,
            stock,
            sold_count: existing.sold_count,
            seller_id: existing.seller_id,
            condition: existing.condition,
            status,
            tags,
            created_at: existing.created_at,
            updated_at: now,
        };
        ctx.db.product().id().update(updated);
    }
}

#[reducer]
pub fn delete_product(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.product().id().find(&id) {
        ctx.db.product().id().delete(&existing.id);
    }
}

#[reducer]
pub fn update_product_stock(ctx: &ReducerContext, id: String, quantity_change: i32) {
    if let Some(mut existing) = ctx.db.product().id().find(&id) {
        existing.stock += quantity_change;
        existing.in_stock = existing.stock > 0;
        if existing.stock <= 0 {
            existing.status = ProductStatus::OutOfStock;
        }
        existing.updated_at = ctx.timestamp;
        ctx.db.product().id().update(existing);
    }
}
