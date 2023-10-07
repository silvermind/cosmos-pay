# Cosmospay - Neutron Powered On-Chain Cosmos Payment Gateway

Cosmos Pay is a standard protocol and set of reference implementations that enable developers or store owners to incorporate decentralized payments into their apps and services with Cosmos Pay module.

## Concept
![Uploading Untitled-2023-09-18-1026.png…]()




## Contract Reference

- **`Create Order`** <br/>
  Platform will create the order for user with a given `order_id` and `price` information.

```js
await client.execute(
    walletAddress,
    "neutron1ndqt9wmlkjkgazudrfx6mptfsp3pzkmxv5f8a0vtqyy9y6xfhutsl5td3v",
    {
        create_order: {
            order_id: "1234",
            price: "12020000"
        }
    },
    'auto'
)
```
  
- **`Check Payment`** <br/>
  Platform will ping the contract to verify the item price amount is sent to the contract.

```js
let valid_payment = await client.queryContractSmart(
    order.address,
    { check_payment: { } },
    'auto'
)
```

- **`Confirm Payment`** <br/>
  Platform will confirm the payment and release the tokens to itself. User will be redirected to the success page.

```js
await client.execute(
    walletAddress,
    "neutron1ndqt9wmlkjkgazudrfx6mptfsp3pzkmxv5f8a0vtqyy9y6xfhutsl5td3v",
    {
        confirm_payment: {
            order_id: "1234"
        }
    },
    'auto'
)
```
