use spacetimedb::ReducerContext;

pub fn generate_id(prefix: &str, ctx: &ReducerContext) -> String {
    let ts = ctx.timestamp.to_duration_since_unix_epoch().unwrap().as_micros();
    format!("{}_{}", prefix, ts)
}
