---
title: "Webhooks"
excerpt: "Receive real-time notifications for virtual account status changes, receives, and sends."
---

## Overview

Virtual account operations are asynchronous. Webhook events are sent to notify you of changes to account status, received funds, and sent funds. Configure your webhook endpoint to receive these notifications and keep your systems in sync.

## Account Status Webhooks (VIBAN)

Since virtual account creation is asynchronous, webhook events are sent whenever an account's status changes. These events use the `VIBAN` prefix.

Event| Description  
---|---  
`VIBAN.PENDING`| Account has been requested and is awaiting provisioning  
`VIBAN.ACTIVE`| Account has been provisioned and is ready to receive and send payments  
`VIBAN.CLOSED`| Account has been closed  
`VIBAN.FROZEN`| Account has been frozen  
  
These events are sent for both primary wallet virtual accounts and custom wallet virtual accounts.

### Example Webhook Event

JSON

    {
      "accountId": "fa19be59-571d-4e9d-ac35-ddee805a5b22",
      "accountName": "Primary Account Number",
      "accountNumber": "1234567890",
      "bankAddress": "",
      "bankName": "Erebor Bank",
      "currency": "USD",
      "event": "VIBAN.PENDING",
      "executedAt": 1770368203203,
      "id": "fa19be59-571d-4e9d-ac35-ddee805a5b22",
      "routingNumber": "125108405",
      "status": "PENDING",
      "subwalletId": "54640e36-466a-5bb0-a47b-5044b28b416e",
      "swiftCode": "PCBBUS66XXX",
      "userId": "d7fbe40a-6d50-4607-8648-9827a54947c3"
    }
    
    
    {
      "accountId": "fa19be59-571d-4e9d-ac35-ddee805a5b22",
      "accountName": "Primary Account Number",
      "accountNumber": "1234567890",
      "bankAddress": "",
      "bankName": "Erebor Bank",
      "currency": "USD",
      "event": "VIBAN.ACTIVE",
      "executedAt": 1770368203203,
      "id": "fa19be59-571d-4e9d-ac35-ddee805a5b22",
      "routingNumber": "125108405",
      "status": "PENDING",
      "subwalletId": "54640e36-466a-5bb0-a47b-5044b28b416e",
      "swiftCode": "PCBBUS66XXX",
      "userId": "d7fbe40a-6d50-4607-8648-9827a54947c3"
    }

Field| Description  
---|---  
`accountId`| Virtual account unique identifier  
`accountName`| Account holder name  
`accountNumber`| Bank account number  
`bankName`| Bank name  
`currency`| Account currency code  
`event`| The webhook event type (e.g., `VIBAN.PENDING`)  
`executedAt`| Unix timestamp (ms) when the event occurred  
`id`| Event identifier  
`routingNumber`| Bank routing number (if applicable)  
`status`| Current account status  
`subwalletId`| Associated custom wallet ID (if applicable)  
`swiftCode`| SWIFT code (if applicable)  
`userId`| Partner identifier who owns the account  
  
## Receive Webhooks

Webhook events are sent when funds are received into your virtual accounts. All deposits are processed as **receives** , and receive webhook events are fired for both primary and custom wallet virtual accounts.

## Send Webhooks

When you send funds from a virtual account using the Payments API, **payment** webhook events are sent to notify you of the payment status.

## Payment Webhook Events

For detailed information on receive and send webhook event types and statuses, refer to the [Webhooks](</docs/webhooks-api>) and [Events](</docs/events-api>) pages.
