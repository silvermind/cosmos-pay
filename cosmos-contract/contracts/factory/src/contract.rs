#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Addr, Binary, CosmosMsg, Deps, DepsMut, Env, MessageInfo, Reply, ReplyOn, Response,
    StdResult, SubMsg, Uint128, WasmMsg,
};
use cw2::set_contract_version;
use cw_utils::parse_reply_instantiate_data;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, OrderResponse, QueryMsg};
use crate::state::{Order, ADMIN, ORDERS};

use cosmospay_order::msg::{
    ExecuteMsg as OrderExecuteMsg, InstantiateMsg as OrderInstantiateMsg, PaymentInfo,
    QueryMsg as OrderQueryMsg,
};

use pyth_sdk_cw::{query_price_feed, PriceFeedResponse, PriceIdentifier};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cosmospay_factory";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    ADMIN.save(deps.storage, &info.sender)?;

    Ok(Response::new())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateOrder { order_id, price } => {
            execute_create_order(deps, env, info, order_id, price)
        }
        ExecuteMsg::ConfirmPayment { order_id } => execute_confirm_payment(deps, info, order_id),
    }
}

pub fn execute_create_order(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    order_id: String,
    price: Uint128,
) -> Result<Response, ContractError> {
    let admin = ADMIN.load(deps.storage)?;
    if info.sender != admin {
        return Err(ContractError::Unauthorized {});
    }

    let ntrn_price = query_ntrn_price(&deps)? as u128;

    let ntrn_amount = price.checked_div(Uint128::new(ntrn_price))?;

    let sub_msg: SubMsg = SubMsg {
        msg: WasmMsg::Instantiate {
            code_id: 10,
            msg: to_binary(&OrderInstantiateMsg {
                order_id: order_id.clone(),
                ntrn_amount,
                usdc_amount: price,
            })?,
            funds: vec![],
            admin: Some(env.contract.address.to_string()),
            label: format!("Create order {}", order_id),
        }
        .into(),
        id: 1,
        gas_limit: None,
        reply_on: ReplyOn::Success,
    };

    Ok(Response::new().add_submessage(sub_msg))
}

pub fn execute_confirm_payment(
    deps: DepsMut,
    info: MessageInfo,
    order_id: String,
) -> Result<Response, ContractError> {
    let admin = ADMIN.load(deps.storage)?;
    if info.sender != admin {
        return Err(ContractError::Unauthorized {});
    }

    let order = ORDERS.load(deps.storage, order_id.clone())?;

    let msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: order.address.to_string(),
        msg: to_binary(&OrderExecuteMsg::ReleasePayment {})?,
        funds: vec![],
    });

    Ok(Response::new().add_message(msg))
}

pub fn query_ntrn_price(deps: &DepsMut) -> Result<i64, ContractError> {
    let price_feed_response: PriceFeedResponse = query_price_feed(
        &deps.querier,
        Addr::unchecked("neutron15ldst8t80982akgr8w8ekcytejzkmfpgdkeq4xgtge48qs7435jqp87u3t"),
        PriceIdentifier::from_hex(
            "b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819",
        )
        .unwrap(),
    )?;
    let price_feed = price_feed_response.price_feed;

    let current_price = price_feed.get_price_unchecked();

    Ok(current_price.price)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Order { order_id } => to_binary(&query_order(deps, order_id)?),
    }
}

pub fn query_order(deps: Deps, order_id: String) -> StdResult<OrderResponse> {
    let order = ORDERS.load(deps.storage, order_id.clone())?;

    let payment_info: PaymentInfo = deps
        .querier
        .query_wasm_smart(order.address.to_string(), &OrderQueryMsg::PaymentInfo {})?;

    let response = OrderResponse {
        order_id,
        address: order.address,
        payment_info,
    };

    Ok(response)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, env: Env, msg: Reply) -> Result<Response, ContractError> {
    if msg.id != 1 {
        return Err(ContractError::Unauthorized {});
    };

    let reply = parse_reply_instantiate_data(msg);

    match reply {
        Ok(res) => {
            let order_id: String = deps
                .querier
                .query_wasm_smart(res.contract_address.clone(), &OrderQueryMsg::OrderId {})?;

            let order = Order {
                address: Addr::unchecked(res.contract_address),
                timestamp: env.block.time,
            };

            ORDERS.save(deps.storage, order_id, &order)?;

            Ok(Response::default())
        }
        Err(_) => Err(ContractError::InstantiateError {}),
    }
}
