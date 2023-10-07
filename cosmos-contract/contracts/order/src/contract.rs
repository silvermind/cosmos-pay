#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    coin, to_binary, BankMsg, Binary, CosmosMsg, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, PaymentInfo, QueryMsg};
use crate::state::{FACTORY, NTRN_PAYMENT, ORDER_ID, USDC_PAYMENT};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cosmospay_order";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

const NTRN_DENOM: &str = "untrn";
const USDC_DENOM: &str = "IBC/dsadasdsa";

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    ORDER_ID.save(deps.storage, &msg.order_id)?;

    NTRN_PAYMENT.save(deps.storage, &msg.ntrn_amount)?;

    USDC_PAYMENT.save(deps.storage, &msg.usdc_amount)?;

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
        ExecuteMsg::ReleasePayment {} => execute_release_payment(deps, env, info),
    }
}

fn execute_release_payment(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
) -> Result<Response, ContractError> {
    let factory_address = FACTORY.load(deps.storage)?;

    let balance = deps
        .querier
        .query_balance(env.contract.address.to_string(), NTRN_DENOM)?;
    let ntrn_balance = balance.amount;

    let balance = deps
        .querier
        .query_balance(env.contract.address.to_string(), USDC_DENOM)?;
    let usdc_balance = balance.amount;

    let mut msgs: Vec<BankMsg> = vec![];

    if !ntrn_balance.is_zero() {
        msgs.push(BankMsg::Send {
            to_address: factory_address.to_string(),
            amount: vec![coin(ntrn_balance.u128(), NTRN_DENOM)],
        });
    }

    if !usdc_balance.is_zero() {
        msgs.push(BankMsg::Send {
            to_address: factory_address.to_string(),
            amount: vec![coin(usdc_balance.u128(), USDC_DENOM)],
        });
    }

    Ok(Response::default().add_messages(msgs))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::OrderId {} => to_binary(&ORDER_ID.load(deps.storage)?),
        QueryMsg::CheckPayment {} => to_binary(&check_payment(deps, env)?),
        QueryMsg::PaymentInfo {} => to_binary(&PaymentInfo {
            ntrn_amount: NTRN_PAYMENT.load(deps.storage)?,
            usdc_amount: USDC_PAYMENT.load(deps.storage)?,
        }),
    }
}

pub fn check_payment(deps: Deps, env: Env) -> StdResult<bool> {
    let ntrn_payment = NTRN_PAYMENT.load(deps.storage)?;
    let usdc_payment = USDC_PAYMENT.load(deps.storage)?;

    let balance = deps
        .querier
        .query_balance(env.contract.address.to_string(), NTRN_DENOM)?;
    let ntrn_balance = balance.amount.u128();

    let balance = deps
        .querier
        .query_balance(env.contract.address.to_string(), USDC_DENOM)?;
    let usdc_balance = balance.amount.u128();

    Ok(ntrn_balance >= ntrn_payment.u128() || usdc_balance >= usdc_payment.u128())
}
