# Cosmospay - Neutron Powered On-Chain Cosmos Payment Gateway

Cosmos Pay is a standard protocol and set of reference implementations that enable developers or store owners to incorporate decentralized payments into their apps and services with Cosmos Pay module.

## Concept
![https://cdn.discordapp.com/attachments/1110616153518264421/1160153561167052831/Untitled-2023-09-18-1026.png?ex=6533a033&is=65212b33&hm=13382ecaa0f207a7d6845fa0c51b5670512e850a8e2b0a432c98a0aeeece844d&]()




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
