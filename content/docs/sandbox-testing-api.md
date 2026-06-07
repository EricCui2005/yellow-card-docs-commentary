---
title: "Sandbox Testing"
excerpt: "A quick guide on how to complete an end-to-end test in the sandbox environment"
---

The sandbox environment is where you can test payment flows without conducting real money movements. We've made end to end testing easy in the sandbox environment using test account numbers. You can use a success account number to get a `complete` status on your receive/send while a failure account results in a `failed` status.

### Test account numbers

  * success bank account number - 1111111111
  * failure account number - 0000000000
  * success mobile money account number - +{countryCode}1111111111. e.g. +2341111111111
  * failure mobile money account number - +{countryCode}0000000000. e.g. +2340000000000


### Send

Here's an example of what your destination object will look like for a bank send request `failed` simulation

JSON
    
    
    "destination": {  
        "accountName": "Regina Phalenge",  
        "accountNumber": "0000000000",  
        "accountType": "bank",  
        "networkId": "5f1af11b-305f-4420-8fce-65ed2725a409"  
     }

### Receive

Here's an example of what your source object will look like for a Mobile Money receive request `complete` simulation

JSON
    
    
    "source": {
      "accountNumber": "+2341111111111",
      "accountType": "momo",
      "networkId": "20823163-f55c-4fa5-8cdb-d59c5289a137"
    }

  


## Simulating Crypto Send Transactions (Success & Failure)

To simulate **successful** and **failed** crypto send transactions in the sandbox use the following guide. This applies to **B2B API`directSettlement`** transactions. To simulate a specific result, set the **receiving address** on the transaction to one of the sandbox simulation addresses below.

> ⚠️
> 
> #### 
> 
> These addresses are **sandbox-only**. Do **not** use them on mainnet or with real funds.

* * *

### Sandbox Simulation Addresses

#### 

✅ Success Addresses

Use one of these receiving addresses to simulate a **successful** crypto send:

  * **ERC20:** `0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe`
  * **TRON:** `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
  * **BTC:** `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq`
  * **SOLANA:** `So11111111111111111111111111111111111111112`
  * **LIGHTNING:** `SuccessfulbtcLightningNetworkssssss`


Here's an example of what your settlementInfo object will look like for a receive request `settlement_complete` simulation

JSON
    
    
    "settlementInfo": {
        "walletAddress": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        "cryptoCurrency": "USDT",
        "cryptoNetwork": "TRC20"
      }

#### 

❌ Failure Addresses

Use one of these receiving addresses to simulate a **failed** crypto send:

  * **ERC20:** `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`
  * **TRON:** `TFvde3D6NQrjXrjqUsdwLTCvVhdPDYEBRV`
  * **BTC:** `bc1qf2kdgu2vlctqlnlxk4smkxd68grl5q2we8dzfd`
  * **SOLANA:** `Vote111111111111111111111111111111111111111`
  * **LIGHTNING:** `FailbtcLightningNetworkffffff`


Here's an example of what your settlementInfo object will look like for a receive request `failed` simulation

JSON
    
    
    "settlementInfo": {
        "walletAddress": "TFvde3D6NQrjXrjqUsdwLTCvVhdPDYEBRV",
        "cryptoCurrency": "USDT",
        "cryptoNetwork": "TRC20"
      }

## 

💰 Simulating Crypto Receive Transactions (Success & Failure)

You can simulate **crypto receive** outcomes in the sandbox — this determines whether the crypto portion of a **B2B API`directSettlement`** transaction succeeds or fails.

These simulations are based on the **sender or user name** provided in the request or KYC data.

* * *

#### 

✅ Simulating a Successful Receive

To simulate a **successful** crypto receive:

  * For **B2B API`directSettlement`** transactions: Include `Successful` anywhere in the sender’s name.

  


#### 

❌ Simulating a Failed Receive

To simulate a **failed** crypto receive in the sandbox:

  * For **B2B API`directSettlement`** transactions: Include `Failure` anywhere in the sender’s name.
