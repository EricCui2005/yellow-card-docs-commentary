---
title: "Virtual Accounts"
excerpt: "Receive and send USD, EUR, GBP and other local currencies through dedicated bank accounts."
---

## Overview

Our Virtual Accounts product provides partners with dedicated bank accounts for sending and receiving funds in USD, EUR, GBP, and local currencies.

Once onboarded, virtual accounts are automatically created for your business in each supported market. Funds received into your virtual account are credited to your balance, giving you immediate access. You can also send funds directly from your virtual accounts using either the Treasury Portal or the API.

  


### How it works:

  1. Contact our team to get onboarded.
  2. Virtual accounts are created for your business in onboarded markets.
  3. Share your virtual account details with customers/clients.
  4. Funds received are automatically credited to your balance.
  5. Send funds from your virtual account using the treasury portal or API.

  


### Key Features:

  * **Automatic account provisioning:** Virtual accounts are created for your business upon successful onboarding in each market
  * **Receive funds:** Funds received into your virtual account are automatically credited to your balance
  * **Send funds:** Send payments directly from your virtual accounts via the treasury portal or payments API
  * **Multi-currency support:** Operate across USD, EUR, and local currency markets (NGN, KES, etc)
  * **Multiple payment rails:** USD accounts support ACH, Wire, and SWIFT transfers; EUR accounts support SEPA; GBP accounts support Faster Payments
  * **Custom wallets:** Create additional virtual accounts linked to custom wallets for segregated fund management

  


### Who This Is For

  * Payment platforms that need to send and receive funds across emerging markets
  * Marketplaces managing payments to sellers and receiving funds from buyers
  * Remittance services sending and receiving local currency
  * Businesses that need dedicated accounts per market for sending and receiving funds
  * Treasury teams managing payments across multiple currencies

  


## Step-by-Step Guide

### Step 1: Get Onboarded

Contact our team to initiate the virtual bank onboarding process for your business. Once onboarding is complete, virtual accounts are automatically created for your business in the onboarded markets.

You can check your onboarding status across different markets at any time by calling the [Get Onboarding Status](</reference-link/get-onboarding-status>) endpoint:

Sample Response
    
    
    {
      "onboardings": [ 
        {
          "provider": "erebor",
          "currencies": ["USD"],
          "status": "SUCCESSFUL",
          "type": "business",
          "onboardedAt": "2025-01-20T14:00:00.000Z"
        }
      ]
    }

Onboarding statuses:

  * **SUCCESSFUL** : Onboarding is complete, virtual accounts have been created in the supported currencies
  * **PENDING** : Onboarding is in progress
  * **INACTIVE** Onboarding has been deactivated

  


### Step 2: View Your Virtual Accounts

After successful onboarding, [List Virtual Accounts](</reference-link/list-virtual-accounts>) to see the accounts that have been created for your business in each onboarded market.

Sample Response
    
    
    {
      "virtualAccounts": [
        {
          "id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
          "currency": "USD",
          "accountNumber": "0123456789",
          "routingNumber": "058",
          "swiftCode": "FVBKPRSX",
          "accountName": "YC / Acme Corp",
          "bankName": "Erebor",
          "bankAddress": "",
          "status": "ACTIVE",
          "createdAt": "2025-01-20T14:00:00.000Z",
          "updatedAt": "2025-01-20T14:00:00.000Z"
        },
        {
          "id": "a2b3c4d5-e6f7-8901-bcde-f12345678901",
          "userId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
          "currency": "NGN",
          "accountNumber": "9876543210",
          "routingNumber": "",
          "accountName": "YC / Acme Corp",
          "bankName": "Bank name",
          "bankAddress": "",
          "status": "ACTIVE",
          "createdAt": "2025-01-15T10:30:00.000Z",
          "updatedAt": "2025-01-15T10:30:00.000Z"
        }
      ],
      "pagination": {
        "pageSize": 15,
        "total": 2
      }
    }

You can filter your virtual accounts using the following query parameters:

  * `currency` — filter by currency code (e.g., `NGN`, `USD`, `KES`)
  * `status` — filter by account status (`PENDING`, `ACTIVE`, `CLOSED`, `FROZEN`)
  * `pageSize` — number of results per page (default: 15, max: 100)
  * `cursor` — pagination cursor returned as `nextCursor` in a previous response


Share the `accountNumber`, `bankName`, and `accountName`. Funds received into these accounts are automatically credited to your balance.

#### Supported Payment Rails

Currency| Payment Rails  
---|---  
**USD**|  ACH, Wire, SWIFT  
**EUR**|  SEPA  
**GBP**|  Faster Payments  
**Local currencies** (NGN, KES, ZAR, UGX)| Local bank transfer  
  
  


### Step 3: Receive Funds

When someone sends funds to your virtual account, the payment is automatically processed as a collection and credited to your balance. No additional API calls are required to receive funds.

  


### Step 4: Create Additional Virtual Accounts (Optional)

You can create additional virtual accounts by creating a [custom wallet](</reference-link/create-wallet>) with `createVirtualAccount` set to `true`. This is useful when you need segregated accounts for different clients, use cases, or business units.

Sample Request
    
    
    POST /sub-wallets
    
    {
      "name": "Merchant Collection - Acme Corp",
      "sequenceId": "merchant-acme-001",
      "currency": "NGN",
      "createVirtualAccount": true
    }

Sample Response
    
    
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "partnerId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
      "sequenceId": "merchant-acme-001",
      "name": "Merchant Collection - Acme Corp",
      "currency": "NGN",
      "status": "active",
      "availableBalance": 0,
      "createdAt": "2025-02-10T12:00:00.000Z",
      "updatedAt": "2025-02-10T12:00:00.000Z",
      "virtualAccount": {
        "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
        "userId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
        "subwalletId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "currency": "NGN",
        "accountNumber": "1122334455",
        "routingNumber": "",
        "accountName": "YC / Acme Corp",
        "bankName": "Bank name",
        "bankAddress": "",
        "status": "PENDING",
        "createdAt": "2025-02-10T12:00:00.000Z",
        "updatedAt": "2025-02-10T12:00:00.000Z"
      }
    }

You can also list your custom wallets with their linked virtual accounts using the `withVirtualAccount` query parameter:

CoffeeScript
    
    
    GET /sub-wallets?withVirtualAccount=true

### Step 5: Send Funds

Send funds from your primary wallet or from a custom wallet using the [Submit Send Request](</reference-link/submit-payment>). Pass the `channelId` of the virtual bank provider in the request alongside the destination details.

Sample Request
    
    
    POST /business/payments
    
    {
      "source": {
        "accountType": "bank"
      },
      "channelId": "af944f0c-ba70-47c7-86dc-1bad5a6ab4e4",
      "sequenceId": "payout-001",
      "sender": {
        "name": "Acme Corp",
        "country": "Nigeria",
        "address": "123 Business Ave, Lagos",
        "dob": "01/01/1990",
        "email": "finance@acmecorp.com",
        "idNumber": "RC123456",
        "idType": "passport"
      },
      "destination": {
        "accountNumber": "0400440532013000",
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
      "reason": "services"
    }

> The `channelId` identifies the virtual bank provider channel. Use the channels endpoint to retrieve the appropriate `channelId` for virtual bank sends in your market.

### Step 6: Get a Specific Virtual Account

[Retrieve the details](</reference-link/get-virtual-account-by-id>) for a specific virtual account by its ID.

Sample Request
    
    
    GET /virtual-accounts/f9e8d7c6-b5a4-3210-fedc-ba0987654321

Sample Response
    
    
    {
      "id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "userId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
      "currency": "NGN",
      "accountNumber": "0123456789",
      "routingNumber": "058",
      "accountName": "YC / Acme Corp",
      "bankName": "GTBank",
      "bankAddress": "Lagos, Nigeria",
      "status": "ACTIVE",
      "createdAt": "2025-01-20T14:00:00.000Z",
      "updatedAt": "2025-01-20T14:00:00.000Z"
    }

## Virtual Account Statuses

Status| Description  
---|---  
`PENDING`| Account has been requested but is not yet open  
`ACTIVE`| Account is active and ready to receive and send payments  
`FROZEN`| Account is temporarily frozen for compliance review  
`CLOSED`| Account is closed  
  
## Virtual Account Object

Field| Type| Description  
---|---|---  
`id`| string| Virtual account unique identifier  
`userId`| string| Partner identifier who owns the account  
`subwalletId`| string| Associated custom wallet identifier (only for custom wallet virtual accounts)  
`currency`| string| Account currency code (e.g., NGN, USD, KES)  
`accountNumber`| string| Bank account number  
`routingNumber`| string| Bank routing number  
`accountName`| string| Account holder name  
`bankName`| string| Bank name  
`bankAddress`| string| Bank physical address  
`swiftCode`| string| SWIFT code (if applicable, typically for USD/EUR/GBP accounts)  
`status`| string| Account status: `PENDING`, `ACTIVE`, `CLOSED`, `FROZEN`  
`createdAt`| string| ISO 8601 timestamp when the account was created  
`updatedAt`| string| ISO 8601 timestamp when the account was last updated  
  
  * For more information on creating additional virtual accounts, visit [Create Virtual Accounts](</docs/creating-a-virtual-account>)
  * For a guide on how to send funds from virtual accounts, visit [Send Funds](</docs/initiating-payouts>)
  * For understanding virtual account webhooks and events, visit [Webhooks](</docs/webhooks>)
