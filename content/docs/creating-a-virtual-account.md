---
title: "Create Virtual Accounts"
excerpt: "Create and manage virtual bank accounts for your business."
---

## Overview

Virtual accounts are automatically created for your business in each currency where you have been successfully onboarded with a banking provider. You can also create additional virtual accounts by linking them to custom wallets for segregated fund management.

## Default Virtual Accounts

When your onboarding is successful, virtual accounts are provisioned for your business in the supported currencies for that provider. These are your **primary virtual accounts** and are immediately available once active.

You can view your primary virtual accounts by calling the [List Virtual Accounts](</reference-link/list-virtual-accounts>) endpoint:

CoffeeScript
    
    
    GET /custody/virtual-accounts

## Creating Additional Virtual Accounts

You can create additional virtual accounts by calling the [Create Wallet](</reference-link/create-wallet>) endpoint and passing `createVirtualAccount: true` in the request body. This creates a custom wallet with a linked virtual account, useful for segregating funds by client, use case, or business unit.

Sample Request
    
    
    POST /custody/sub-wallets
    
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
        "bankName": "Bank Name",
        "bankAddress": "",
        "status": "PENDING",
        "createdAt": "2025-02-10T12:00:00.000Z",
        "updatedAt": "2025-02-10T12:00:00.000Z"
      }
    }

## Account Creation is Asynchronous

Virtual account creation is an **asynchronous operation**. When a virtual account is created, it starts in `PENDING` status and transitions to `ACTIVE` once the banking provider has fully provisioned the account. Webhook notifications are sent for each status change — see the [Webhooks](</docs/webhooks>) page for details.

### Account Statuses

Status| Description  
---|---  
`PENDING`| Account has been requested but is not yet open  
`ACTIVE`| Account is active and ready to receive and send sends  
`FROZEN`| Account is temporarily frozen for compliance review  
`CLOSED`| Account is closed  
  
You can check the current status of a virtual account at any time by calling the [Get Virtual Account by ID](</reference-link/get-virtual-account-by-id>) endpoint:

Sample Request
    
    
    GET /custody/virtual-accounts/c3d4e5f6-a7b8-9012-cdef-345678901234

Sample Response
    
    
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
      "userId": "9ecf5248-17e7-4a2b-b5a8-3bd58ff0fe01",
      "subwalletId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "currency": "NGN",
      "accountNumber": "1122334455",
      "routingNumber": "",
      "accountName": "YC / Acme Corp",
      "bankName": "Bank Name",
      "bankAddress": "",
      "status": "ACTIVE",
      "createdAt": "2025-02-10T12:00:00.000Z",
      "updatedAt": "2025-02-10T12:01:30.000Z"
    }

## Receiving Funds

When funds are received into a virtual account, they are processed as **receives** and credited to the associated balance. Webhook events are sent when funds are received. You can check the status of a receive by calling the [Lookup Receive](</reference-link/lookup-collection>) endpoint.
