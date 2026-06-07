---
title: "Initiate Sends"
excerpt: "Send local and international currencies directly from your virtual accounts."
---

## Overview

Sends are initiated from your virtual accounts using the [Submit Send Request](<https://docs.yellowcard.engineering/reference/submit-payment>) endpoint. You can send payments from your primary virtual account or from a custom wallet virtual account.

  


## Step 1: Get the Channel ID

Before initiating a send, retrieve the appropriate `channelId` by calling the [Channels](<https://docs.yellowcard.engineering/reference/get-channels>) endpoint. Filter the results for:

  * `channelType`: `virtualbank`
  * `country`: The country matching your virtual account (e.g., `US`, `NG`)
  * `currency`: The currency matching your virtual account (e.g., `USD`, `NGN`)


The returned `channelId` is required when submitting the send request.

> 📘
> 
> Manual Input Network Right now, the API doesn't have a list of all banks available in all countries. Manual Input network is available to help with this, when you call the Get Networks endpoint and you filter by your selected channelId, you'll have one network left with network name "Manual Input". Pass this Network ID, alongside other destination input sent to the submit payment endpoint.

  


## Step 2: Submit the Send Request

Call the [Submit Send Request](<https://docs.yellowcard.engineering/reference/submit-payment>) endpoint with the `channelId`, sender details, destination details, and the payment amount.

### Supported Networks by Currency

Currency| Supported Networks  
---|---  
**USD**| `ACH`, `WIRE`, `SWIFT`  
**EUR**| `SEPA`, `SWIFT`  
**GBP**| `FASTER_PAYMENTS`, `SWIFT`  
  
### Common Destination Fields

All send requests require the following destination fields, regardless of the network type:

Field| Type| Required| Description  
---|---|---|---  
`accountNumber`| string| Yes| Recipient bank account number  
`accountName`| string| Yes| Recipient account holder name  
`accountType`| string| Yes| Set to `bank`  
`networkId`| string| Yes| Network identifier (the manual input network ID)  
`outboundTransactionType`| string| Yes| The transfer network: `ACH`, `WIRE`, `SWIFT`, `SEPA`, `FASTER_PAYMENTS`  
`bankAccountType`| string| Yes| `checking` or `savings`  
`bankName`| string| Yes| Recipient's bank name  
`bankAddress`| string| Yes| Recipient's bank address  
`bankCity`| string| Yes| Recipient's bank city  
`bankPostalCode`| string| Yes| Recipient's bank postal code  
`bankCountry`| string| Yes| Recipient's bank country code  
`city`| string| Yes| Recipient's city  
`postalCode`| string| Yes| Recipient's postal code  
`state`| string| Yes| Recipient's state/region  
`country`| string| Yes| Recipient's country code  
`address`| string| Yes| Recipient's address  
  
### Network-Specific Destination Fields

In addition to the common fields above, each network type requires specific additional fields:

#### ACH / WIRE (USD)

Field| Type| Required| Description  
---|---|---|---  
`routingNumber`| string| Yes| Bank routing number  
  
#### SWIFT (USD, EUR, GBP)

Field| Type| Required| Description  
---|---|---|---  
`swiftCode`| string| Yes| Bank SWIFT/BIC code  
`routingNumber`| string| Yes| Bank routing number  
  
#### SEPA (EUR)

Field| Type| Required| Description  
---|---|---|---  
`swiftCode`| string| Yes| Bank SWIFT/BIC code  
  
#### FASTER_PAYMENTS (GBP)

Field| Type| Required| Description  
---|---|---|---  
`sortCode`| string| Yes| UK bank sort code  
  
* * *

## Request Examples by Network

### ACH Send (USD)

Sample Request
    
    
    POST /business/payments
    
    {
      "source": {
        "accountType": "bank"
      },
      "channelId": "efff976c-a53b-4baa-b81b-ec26f2121c7d",
      "sequenceId": "ach-send-001",
      "sender": {
        "name": "Acme Corp",
        "country": "United States",
        "address": "100 Main St, New York, NY 10001",
        "dob": "01/01/1990",
        "email": "finance@acmecorp.com",
        "idNumber": "RC123456",
        "idType": "passport"
      },
      "destination": {
        "accountNumber": "123456789",
        "networkId": "28281f21-4705-431f-a752-9a485628c76a9",
        "accountType": "bank",
        "accountName": "Jane Smith",
        "outboundTransactionType": "ACH",
        "routingNumber": "021000021",
        "bankAccountType": "checking",
        "bankName": "Chase Bank",
        "bankAddress": "270 Park Ave",
        "bankCity": "New York",
        "bankPostalCode": "10017",
        "bankCountry": "US",
        "city": "New York",
        "postalCode": "10001",
        "state": "NY",
        "country": "US",
        "address": "200 Broadway"
      },
      "amount": 100,
      "reason": "services",
      "forceAccept": true
    }

### WIRE Send (USD)

Sample Request
    
    
    POST /business/payments
    
    {
      "source": {
        "accountType": "bank"
      },
      "channelId": "efff976c-a53b-4baa-b81b-ec26f2121c7d",
      "sequenceId": "wire-send-001",
      "sender": {
        "name": "Acme Corp",
        "country": "United States",
        "address": "100 Main St, New York, NY 10001",
        "dob": "01/01/1990",
        "email": "finance@acmecorp.com",
        "idNumber": "RC123456",
        "idType": "passport"
      },
      "destination": {
        "accountNumber": "123456789",
        "networkId": "28281f21-4705-431f-a752-9a485628c76a9",
        "accountType": "bank",
        "accountName": "Jane Smith",
        "outboundTransactionType": "WIRE",
        "routingNumber": "021000021",
        "bankAccountType": "checking",
        "bankName": "Chase Bank",
        "bankAddress": "270 Park Ave",
        "bankCity": "New York",
        "bankPostalCode": "10017",
        "bankCountry": "US",
        "city": "New York",
        "postalCode": "10001",
        "state": "NY",
        "country": "US",
        "address": "200 Broadway"
      },
      "amount": 500,
      "reason": "services",
      "forceAccept": true
    }

### SWIFT Send (USD)

Sample Request
    
    
    POST /business/payments
    
    {
      "source": {
        "accountType": "bank"
      },
      "channelId": "efff976c-a53b-4baa-b81b-ec26f2121c7d",
      "sequenceId": "swift-send-001",
      "sender": {
        "name": "Acme Corp",
        "country": "United States",
        "address": "100 Main St, New York, NY 10001",
        "dob": "01/01/1990",
        "email": "finance@acmecorp.com",
        "idNumber": "RC123456",
        "idType": "passport"
      },
      "destination": {
        "accountNumber": "DE89370400440532013000",
        "networkId": "28281f21-4705-431f-a752-9a485628c76a",
        "accountType": "bank",
        "accountName": "Acme GmbH",
        "outboundTransactionType": "SWIFT",
        "swiftCode": "COBADEFFXXX",
        "routingNumber": "021000021",
        "bankAccountType": "checking",
        "bankName": "Commerzbank",
        "bankAddress": "Friedrichstraße 100",
        "bankCity": "Berlin",
        "bankPostalCode": "10115",
        "bankCountry": "DE",
        "city": "Berlin",
        "postalCode": "10115",
        "state": "Berlin",
        "country": "DE",
        "address": "Friedrichstraße 100"
      },
      "amount": 50,
      "reason": "services",
      "forceAccept": true
    }

### SEPA Send (EUR)

Sample Request
    
    
    POST /business/payments
    
    {
      "source": {
        "accountType": "bank"
      },
      "channelId": "efff976c-a53b-4baa-b81b-ec26f2121c7d",
      "sequenceId": "sepa-send-001",
      "sender": {
        "name": "Acme Corp",
        "country": "France",
        "address": "12 Rue de Rivoli, 75001 Paris",
        "dob": "01/01/1990",
        "email": "finance@acmecorp.com",
        "idNumber": "RC123456",
        "idType": "passport"
      },
      "destination": {
        "accountNumber": "FR7630006000011234567890189",
        "networkId": "28281f21-4705-431f-a752-9a485628c76a",
        "accountType": "bank",
        "accountName": "Marie Dupont",
        "outboundTransactionType": "SEPA",
        "swiftCode": "BNPAFRPPXXX",
        "bankAccountType": "checking",
        "bankName": "BNP Paribas",
        "bankAddress": "16 Boulevard des Italiens",
        "bankCity": "Paris",
        "bankPostalCode": "75009",
        "bankCountry": "FR",
        "city": "Paris",
        "postalCode": "75001",
        "state": "Île-de-France",
        "country": "FR",
        "address": "12 Rue de Rivoli"
      },
      "amount": 200,
      "reason": "services",
      "forceAccept": true
    }

### FASTER_PAYMENTS Send (GBP)

Sample Request
    
    
    POST /business/payments
    
    {
      "source": {
        "accountType": "bank"
      },
      "channelId": "efff976c-a53b-4baa-b81b-ec26f2121c7d",
      "sequenceId": "fp-send-001",
      "sender": {
        "name": "Acme Corp",
        "country": "United Kingdom",
        "address": "10 Downing Street, London SW1A 2AA",
        "dob": "01/01/1990",
        "email": "finance@acmecorp.com",
        "idNumber": "RC123456",
        "idType": "passport"
      },
      "destination": {
        "accountNumber": "12345678",
        "networkId": "28281f21-4705-431f-a752-9a485628c76a",
        "accountType": "bank",
        "accountName": "James Wilson",
        "outboundTransactionType": "FASTER_PAYMENTS",
        "sortCode": "200000",
        "bankAccountType": "checking",
        "bankName": "Barclays",
        "bankAddress": "1 Churchill Place",
        "bankCity": "London",
        "bankPostalCode": "E14 5HP",
        "bankCountry": "GB",
        "city": "London",
        "postalCode": "SW1A 1AA",
        "state": "London",
        "country": "GB",
        "address": "10 Downing Street"
      },
      "amount": 150,
      "reason": "services",
      "forceAccept": true
    }

  


## Sends from Custom Wallet Virtual Accounts

To initiate a send from a custom wallet virtual account instead of your primary virtual account wallet, include the `walletId` field in the request. The `walletId` is the `id` of the custom wallet returned when you created it.

Sample Request
    
    
    POST /business/payments
    
    {
      "source": {
        "accountType": "bank"
      },
      "walletId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "channelId": "efff976c-a53b-4baa-b81b-ec26f2121c7d",
      "sequenceId": "wallet-send-001",
      "sender": {
        "name": "John Doe",
        "country": "France",
        "address": "12 North Street, 100001 Paris",
        "dob": "02/01/1997",
        "email": "john@test.com",
        "idNumber": "12345567",
        "idType": "license"
      },
      "destination": {
        "accountNumber": "DE89370400440532013000",
        "networkId": "28281f21-4705-431f-a752-9a485628c76a",
        "accountType": "bank",
        "accountName": "Acme GmbH",
        "outboundTransactionType": "SWIFT",
        "swiftCode": "COBADEFFXXX",
        "routingNumber": "021000021",
        "bankAccountType": "checking",
        "bankName": "Commerzbank",
        "bankAddress": "Friedrichstraße 100",
        "bankCity": "Berlin",
        "bankPostalCode": "10115",
        "bankCountry": "DE",
        "city": "Berlin",
        "postalCode": "10115",
        "state": "Berlin",
        "country": "DE",
        "address": "Friedrichstraße 100"
      },
      "amount": 10,
      "reason": "other",
      "forceAccept": true
    }

> The only difference from a standard send is the addition of the `walletId` field, which directs the send to be paid from the specified custom wallet's virtual account.

## Payment Webhooks

Payment webhook events are sent as the send progresses through its lifecycle. For details on send webhook event types and statuses, refer to the [Webhooks](</docs/webhooks-api>) and [Events](</docs/events-api>) page.
