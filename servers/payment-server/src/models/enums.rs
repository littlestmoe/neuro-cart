use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Clone, Debug)]
pub enum PaymentStatus {
    Pending,
    Completed,
    Failed,
    Refunded,
}

#[derive(SpacetimeType, Clone, Debug)]
pub enum PaymentMethod {
    CreditCard,
    DebitCard,
    BankTransfer,
    DigitalWallet,
}
