use cosmwasm_schema::cw_serde;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Timestamp, Uint128};
use cw_storage_plus::{Item, Map};

pub const ADMIN: Item<Addr> = Item::new("admin");

#[cw_serde]
pub struct Order {
    pub address: Addr,
    pub timestamp: Timestamp,
}

// order_id -> Order
pub const ORDERS: Map<String, Order> = Map::new("orders");
