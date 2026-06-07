---
title: "Send and Receive Error Codes"
excerpt: ""
---

The table below describes the meaning of the value of the `errorCode` field for send and receive objects.

errorCode| Meaning  
---|---  
EXPIRED| If the transaction expired due to customer not making payment to the provided bank details  
INVALID_RECIPIENT| If the destination fails any checks e.g phone number prefix checks  
VALIDATION_FAILED| If the transaction failed any validation prior to processing  
INVALID_NETWORK| If the transaction fails due to an invalid momo or bank network  
INVALID_CURRENCY| Currency is invalid or not supported for that country  
INSUFFICIENT_BALANCE| If the transaction failed due to liquidity or low balance  
REFUSED| If the customer failed to approve the deposit (momo, EFT payment link, etc)  
GATEWAY_TIMEOUT| 504 gateway timeout error from our payment provider during processing  
PROVIDER_ERROR| Any unexpected upstream error on our payment provider during processing  
POSSIBLE_DUPLICATE| For scenarios where a provider fails a transaction due to it being flagged as a possible duplicate either due to the amount, recipient or burst of transactions in a short timeframe  
NAME_MISMATCH| The transaction failed because the customer's name on record does not match the name of the payer, applies in Nigeria only.  
OTHER_ERROR| This is the default. Generally for errors that haven't been classified yet or an error we don't want to expose  
FRAUD_CHECK| The transaction was flagged by our internal KYT and transaction monitoring systems
