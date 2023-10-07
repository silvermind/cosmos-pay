use cosmwasm_std::{DivideByZeroError, StdError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Instantiate error")]
    InstantiateError {},

    #[error("{0}")]
    DivideByZeroError(#[from] DivideByZeroError),
}
