use crate::models::enums::{AccountStatus, UserRole};
use spacetimedb::{Timestamp, table};

#[table(accessor = user_profile, public)]
pub struct UserProfile {
    #[primary_key]
    pub id: String,
    pub clerk_id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub avatar: Option<String>,
    pub role: UserRole,
    pub status: AccountStatus,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
