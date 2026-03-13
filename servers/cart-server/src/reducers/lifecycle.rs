use spacetimedb::{ReducerContext, reducer};

#[reducer(init)]
pub fn init(_ctx: &ReducerContext) {
    log::info!("neuro-cart cart-server initialized");
}
