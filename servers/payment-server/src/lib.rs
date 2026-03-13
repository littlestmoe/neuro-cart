use spacetimedb::CaseConversionPolicy;

#[spacetimedb::settings]
const CASE_CONVERSION_POLICY: CaseConversionPolicy = CaseConversionPolicy::None;

pub mod models;
pub mod reducers;
