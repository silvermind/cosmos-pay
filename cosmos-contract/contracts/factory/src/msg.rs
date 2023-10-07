use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};

use cosmospay_order::msg::PaymentInfo;

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    CreateOrder { order_id: String, price: Uint128 },
    ConfirmPayment { order_id: String },
}

#[cw_serde]
pub struct OrderResponse {
    pub order_id: String,
    pub address: Addr,
    pub payment_info: PaymentInfo,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(OrderResponse)]
    Order { order_id: String },
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetCountResponse {
    pub count: i32,
}
