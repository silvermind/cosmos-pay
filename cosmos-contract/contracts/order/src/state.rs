use cosmwasm_schema::cw_serde;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Coin, Uint128};
use cw_storage_plus::Item;

pub const FACTORY: Item<Addr> = Item::new("factory");

pub const ORDER_ID: Item<String> = Item::new("order_id");

pub const NTRN_PAYMENT: Item<Uint128> = Item::new("ntrn_payment");

pub const USDC_PAYMENT: Item<Uint128> = Item::new("usdc_payment");
