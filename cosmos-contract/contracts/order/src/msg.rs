use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;

#[cw_serde]
pub struct InstantiateMsg {
    pub order_id: String,
    pub ntrn_amount: Uint128,
    pub usdc_amount: Uint128,
}

#[cw_serde]
pub enum ExecuteMsg {
    ReleasePayment {},
}

#[cw_serde]
pub struct PaymentInfo {
    pub ntrn_amount: Uint128,
    pub usdc_amount: Uint128,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(bool)]
    CheckPayment {},
    #[returns(String)]
    OrderId {},
    #[returns(PaymentInfo)]
    PaymentInfo {},
}
