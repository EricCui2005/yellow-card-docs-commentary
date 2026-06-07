---
title: "Convert Currencies"
excerpt: "Receive and send in local currency or crypocurrency in one transaction"
---

### What is convert currency

Convert currency is a transaction type where we handle the cryptocurrency send and receive as part of one transaction. For example customers can send in local currency, and receive cryptocurrency, or send in cryptocurrency and receive local currency.

  


### Receive Request and Response

For receive the following fields should be included in the [receive request](</reference-link/submit-collection-request>)

  * `forceAccept` \- set to true
  * `directSettlement` \- set to true
  * `settlementInfo` \- crypto destination object


Sample RequestSample Response
    
    
    {
      "recipient": {
        "name": "John Doe",
        "country": "Nigeria",
        "phone": "+2349092916898",
        "address": "Home Address, Sea of tranquility, Moon",
        "dob": "02/01/1997",
        "idNumber": "314159",
        "idType": "license"
      },
      "source": {
        "accountType": "bank",
        "accountNumber": "1111111111" // only needed in sandbox to simulate success 
      },
      "channelId": "af944f0c-ba70-47c7-86dc-1bad5a6ab4e4",
      "sequenceId": "53f7c7fa-f2bb-450c-8f6d-9ff0000f99",
      "amount": 50,
      "currency": "NGN",
      "country": "NG",
      "reason": "other",
      "forceAccept": true,
      "directSettlement": true,
      "settlementInfo": {
        "walletAddress": "TFtbBrsWw5DGHoKQE8VY2WzTY3VnanQ2hz", // destination address
        "cryptoCurrency": "USDT",
    //  "walletTag": "123456" wallet tag is only required for USDC - XLM destination addresses
        "cryptoNetwork": "TRC20"
      }
    }
    
    
    {
      "currency": "NGN",
        "settlementInfo": {
          "cryptoNetwork": "TRC20",
          "cryptoLocalRate": 1617.3,
          "cryptoUSDRate": 1,
          "walletAddress": "TFtbBrsWw5DGHoKQE8VY2WzTY3VnanQ2hz", 
          "cryptoAmount": 48.36654808,
          "cryptoCurrency": "USDT"
       },
       "status": "processing",
       "networkFeeAmountUSD": 1.13, // network fee 
       "serviceFeeAmountUSD": 0.5,
       "partnerFeeAmountLocal": 0,
       "country": "NG",
       "reference": "JJ5275168",
       "recipient": {
       "country": "Nigeria",
       "address": "Home Address",
       "idType": "license",
       "phone": "+23490XXXXXXXX",
       "dob": "02/01/1997",
       "name": "John Doe",
       "idNumber": "314159"
       },
       "expiresAt": "2024-11-26T21:05:13.393Z",
       "requestSource": "api",
       "directSettlement": true,
       "refundRetry": 0,
       "id": "0a89dce0-d8d2-59a6-ab9d-1d9d8b4593e2",
       "partnerId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
       "rate": 1617.3,
       "bankInfo": {  // bank account for deposit
         "name": "PAGA",
         "accountNumber": "4550440202",
         "accountName": "Ken Adams"
       },
       "createdAt": "2024-11-26T20:55:13.393Z",
       "forceAccept": true,
       "source": {
         "accountNumber": "1111111111",
         "accountType": "bank"
       },
       "sequenceId": "53f7c7fa-f2bb-450c-8f6d-9ff0000f7",
       "reason": "other",
       "networkFeeAmountLocal": 1833.13,
       "convertedAmount": 80865,
       "channelId": "af944f0c-ba70-47c7-86dc-1bad5a6ab4e4",
       "serviceFeeAmountLocal": 808.65,
       "updatedAt": "2024-11-26T20:55:17.487Z",
       "partnerFeeAmountUSD": 0,
       "amount": 50,
       "depositId": "a29e596a-0ae5-4386-b2a3-eacf9fc70575"
    }

### Send Request and Response

The following fields need to be included in the [Send Request](</reference-link/submit-payment>)

  * `directSettlement` \- set to `true`
  * `forceAccept` \- set to `true`
  * `settlementInfo` \- info for receive crypto currency and network


If the send fails and the transaction is a convert currency, the received crypto can be automatically refunded. Supply one of the following fields in `settlementInfo`:

  * `refundAddress` \- an explicit crypto address to receive the refund on payment failure.
  * `refundToSourceAddress` \- when `true`, the refund is sent to the address in `senderAddress`. Takes precedence over `refundAddress` if both are supplied.


If neither field is provided, no automatic refund is attempted and the case is escalated internally for manual handling.

> 🚧
> 
> Automatic refunds on the Bitcoin Lightning Network are not currently available.

Sample RequestSample ResponseSample Request (Lightning)Sample Request (refundAddress)Sample Request (refundToSourceAddress)Sample Response (Lightning)
    
    
    {
        "sender": {
            "name": "Jimothy Charlamet",
            "country": "N",
            "address": "12dsa",
            "dob": "09/03/1987",
            "email": "johndoe@yellowcard.io",
            "idNumber": "123492992",
            "idType": "passport"
        },
        "destination": { // customer's bank account, where fiat is disbursed
            "accountName": "Héloïse D'arban",
            "accountNumber": "+26711111111",
            "accountType": "momo",
            "networkId": "7ea6df5c-6bba-46b2-a7e6-f511959e7edb"
        },
        "channelId": "a3f3a711-c50e-4e53-b867-7d1d148cd43b",
        "sequenceId": "00f000-0000002-000000-000002710",
        "currency": "KES",
        "country": "Kenya",
        "reason": "other",
        "forceAccept": true,
        "directSettlement": true,
        "settlementInfo": {
            "cryptoCurrency": "USDT",
            "cryptoNetwork": "TRC20",
             "cryptoAmount": 20 // amount in crypto,
             "refundAddress": "TKLpj49imXaKrmsziYQenbsy67cw98XUbR" // optional
        }
    }
    
    
    {
        "sender": {
            "name": "Jimothy Charlamet",
            "country": "N",
            "address": "12dsa",
            "dob": "09/03/1987",
            "email": "johndoe@yellowcard.io",
            "idNumber": "123492992",
            "idType": "passport"
        },
        "destination": {
            "accountName": "Héloïse D'arban",
            "accountNumber": "+26711111111",
            "accountType": "momo",
            "networkId": "7ea6df5c-6bba-46b2-a7e6-f511959e7edb",
            "networkName": "Mobile Wallet (M-PESA)"
        },
        "channelId": "a3f3a711-c50e-4e53-b867-7d1d148cd43b",
        "sequenceId": "00f000-0000002-000000-000002710",
        "currency": "KES",
        "country": "KE",
        "reason": "other",
        "forceAccept": true,
        "directSettlement": true,
        "settlementInfo": {
            "cryptoCurrency": "USDT",
            "cryptoNetwork": "TRC20",
            "cryptoAmount": 20,
            "walletAddress": "TCM1FNSZaKQhodGEfPfyZ7FdRT9vrMD677", // address for crypto receive
            "cryptoUSDRate": 1,
            "expiresAt": "2024-12-09T19:07:25.319Z"
        },
        "partnerId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
        "requestSource": "api",
        "id": "d9f031a8-f639-5a2a-b997-adbf8dc3a5e8",
        "attempt": 1,
        "status": "created",
        "convertedAmount": 1165,
        "rate": 116.5,
        "expiresAt": "2024-12-09T16:17:25.319Z",
        "createdAt": "2024-12-09T16:07:25.319Z",
        "updatedAt": "2024-12-09T16:07:25.319Z"
    }
    
    
    {
        "sender": {
            "name": "Jimothy Charlamet",
            "country": "N",
            "address": "12dsa",
            "dob": "09/03/1987",
            "email": "johndoe@yellowcard.io",
            "idNumber": "123492992",
            "idType": "passport"
        },
        "destination": { // customer's bank account, where fiat is disbursed
            "accountName": "Héloïse D'arban",
            "accountNumber": "+26711111111",
            "accountType": "momo",
            "networkId": "7ea6df5c-6bba-46b2-a7e6-f511959e7edb"
        },
        "channelId": "a3f3a711-c50e-4e53-b867-7d1d148cd43b",
        "sequenceId": "00f000-0000002-000000-000002710",
        "amount": 10,
        "currency": "KES",
        "country": "Kenya",
        "reason": "other",
        "forceAccept": true,
        "directSettlement": true,
        "settlementInfo": {
            "cryptoCurrency": "BTC",
            "cryptoNetwork": "LIGHTNING",
            "cryptoAmount": 0.0002 // amount in BTC
    
        }
    }
    
    
    {
        "sender": {
            "name": "Jimothy Charlamet",
            "country": "N",
            "address": "12dsa",
            "dob": "09/03/1987",
            "email": "johndoe@yellowcard.io",
            "idNumber": "123492992",
            "idType": "passport"
        },
        "destination": {
            "accountName": "Héloïse D'arban",
            "accountNumber": "+26711111111",
            "accountType": "momo",
            "networkId": "7ea6df5c-6bba-46b2-a7e6-f511959e7edb"
        },
        "channelId": "a3f3a711-c50e-4e53-b867-7d1d148cd43b",
        "sequenceId": "00f000-0000002-000000-000002710",
        "currency": "KES",
        "country": "Kenya",
        "reason": "other",
        "forceAccept": true,
        "directSettlement": true,
        "settlementInfo": {
            "cryptoCurrency": "USDT",
            "cryptoNetwork": "TRC20",
            "cryptoAmount": 20,
            "refundAddress": "TKLpj49imXaKrmsziYQenbsy67cw98XUbR" // crypto is refunded here if payment fails
        }
    }
    
    
    {
        "sender": {
            "name": "Jimothy Charlamet",
            "country": "N",
            "address": "12dsa",
            "dob": "09/03/1987",
            "email": "johndoe@yellowcard.io",
            "idNumber": "123492992",
            "idType": "passport"
        },
        "destination": {
            "accountName": "Héloïse D'arban",
            "accountNumber": "+26711111111",
            "accountType": "momo",
            "networkId": "7ea6df5c-6bba-46b2-a7e6-f511959e7edb"
        },
        "channelId": "a3f3a711-c50e-4e53-b867-7d1d148cd43b",
        "sequenceId": "00f000-0000002-000000-000002710",
        "currency": "KES",
        "country": "Kenya",
        "reason": "other",
        "forceAccept": true,
        "directSettlement": true,
        "settlementInfo": {
            "cryptoCurrency": "USDT",
            "cryptoNetwork": "TRC20",
            "cryptoAmount": 20,
            "senderAddress": "TKLpj49imXaKrmsziYQenbsy67cw98XUbR", // address the crypto was sent from
            "refundToSourceAddress": true // crypto is refunded back to senderAddress if payment fails
        }
    }
    
    
    {
        "sender": {
            "name": "Jimothy Charlamet",
            "country": "N",
            "address": "12dsa",
            "dob": "09/03/1987",
            "email": "johndoe@yellowcard.io",
            "idNumber": "123492992",
            "idType": "passport"
        },
        "destination": {
            "accountName": "Héloïse D'arban",
            "accountNumber": "+26711111111",
            "accountType": "momo",
            "networkId": "7ea6df5c-6bba-46b2-a7e6-f511959e7edb",
            "networkName": "Mobile Wallet (M-PESA)"
        },
        "channelId": "a3f3a711-c50e-4e53-b867-7d1d148cd43b",
        "sequenceId": "00f000-0000002-000000-000002710",
        "amount": 10,
        "currency": "KES",
        "country": "KE",
        "reason": "other",
        "forceAccept": true,
        "directSettlement": true,
        "settlementInfo": {
            "cryptoCurrency": "BTC",
            "cryptoNetwork": "LIGHTNING",
            "cryptoAmount": 0.0002 // amount in BTC
            "cryptoUSDRate": 1,
            "lnInvoice": "lntbs580u1pn4wyu0pp505xr4r6080nsh6tjdu9v9j7u2fdypzxr9lz2cxanevnnltvypsjsdzvt9p473z92p84xj25tu6nsve5xpjnwv3dv93njvpdxsex2vfd8p3rzvpdxp3xxctpxdjrwdp38q6qcqzzsxqyz5vqsp5g8qx2jqrwd96sgchvegm0u38gke5n8rqz6q4ccmzj3zhuh2zgqkq9qxpqysgqcsw64ec5stffa8v2an4799lf5hzwe7qughlgcpurz8789ne36lt8dngcyrtyacz3tlx7j26n9lw8c9un6st6t2qx52ut0yy63lgljksqs4fmdq"
            "expiresAt": "2024-12-09T19:07:25.319Z"
        },
        "partnerId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
        "requestSource": "api",
        "id": "d9f031a8-f639-5a2a-b997-adbf8dc3a5e8",
        "attempt": 1,
        "status": "created",
        "convertedAmount": 1165,
        "rate": 116.5,
        "expiresAt": "2024-12-09T16:17:25.319Z",
        "createdAt": "2024-12-09T16:07:25.319Z",
        "updatedAt": "2024-12-09T16:07:25.319Z"
    }

  


### Events

Convert currency transactions follow the normal Yellow Card [events](</docs/events-api>)
