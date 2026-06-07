---
title: "Webhooks"
excerpt: "Notifications for Transaction events"
---

Webhooks will be sent out on the specified event during the webhook creation. This way, you can have different webhook URLs to handle each event or one url for all events.

A signature is sent in a `X-YC-Signature` header for verification of the webhook request data.

The signature is a `base64` encoded `sha256` hash of the request body using the `secretkey` of the `apiKey` the initial request was made with. The `apiKey` is also available in the request payload.

> 📘
> 
> ### 
> 
> Static IP
> 
> Webhooks are sent from a static IP on production which we will provide. We recommend whitelisting and only accepting webhook data from this IP, to prevent any security risks.

**EVENTS**

See list of all events and descriptions [here](</docs/events-api>)

  


> 📘
> 
> Note that when creating webhooks, you will need to prepend `RECEIVE.` or `SEND.` to the event state to differentiate webhooks for both receives and sends.
> 
> For example, to create a webhook for receives in the `COMPLETE` state, the correct state is `RECEIVE.COMPLETE`.

> ⚠️
> 
> ### 
> 
> Updated Webhook Terminology - Migration Recommended
> 
> We are deprecating legacy webhook event names. We recommend migrating to v2 event names in your webhook handlers.
> 
> **What's changing:**
> 
> Legacy (deprecated)| v2 (current)  
> ---|---  
> `PAYMENT.*`| `SEND.*`  
> `COLLECTION.*`| `RECEIVE.*`  
> `SETTLEMENT.*`| `CRYPTO_SEND.*` / `CRYPTO_RECEIVE.*` / `CONVERT.*`  
>   
>  **What you need to do:**
> 
>   1. Update your webhook code to recognize the new v2 event names (e.g., `PAYMENT.COMPLETE` → `SEND.COMPLETE`, `COLLECTION.FAILED` → `RECEIVE.FAILED`)
>   2. On your dashboard, set existing webhooks to **both** while you transition — this sends events in both formats so nothing breaks during the update
>   3. Once your code handles v2 events, switch the version to **v2**
> 

> 
> New webhooks default to v2 already.
> 
> **Settlement events in v2 are now more specific:**
> 
>   * `CRYPTO_SEND.*` — crypto payouts
> 
>   * `CRYPTO_RECEIVE.*` — crypto deposits
> 
>   * `CONVERT.*` — fiat-to-crypto conversions (widget, direct settlement)
> 
> 

> 
> Legacy events will continue to work during the transition period, but will be removed in a future release.

# Creating Webhooks

You can use the API to create webhooks for specific events or for all events.

When creating the webhook, if you omit the `state` field, it will execute for all events.  
Example: Creating a webhook for all events

JSON
    
    
    {"url": "https://example.com/webhook",
      "active": true}

  


Example: Creating a specific event webhook  
To subscribe only to, say, receive completion events, include the appropriate state value (with prefix RECEIVE. or SEND.

JSON
    
    
    { "url": "https://example.com/webhook",
      "state": "RECEIVE.COMPLETE",
      "active": true
    }

This creates a webhook that only triggers on the RECEIVE.COMPLETE event.

# Webhook Data

The events will POST data to the webhooks in the following format

json
    
    
    {
      "id": "00e97bc4-1429-4ce7-acb5-841f9d9ed059",
      "sequenceId": "1a051f68-5c55-44c8-b4a0-366800daaf19",
      "status": "failed",
      "apiKey": "513fc4c3aaeb2a8f292a740ea178d830",
      "event": "RECEIVE.FAILED",
      "errorCode": "REFUSED",
      "sessionId":"a4cf97cd-8f1a-4e38-842b-e9597affb199",
      "executedAt": "2023-02-20T14:25:30.459Z"
    }

The Payload includes:  
**Status** — the current status of the event  
**Event** — the specific webhook event fired  
**ErrorCode** (optional) — appears only when the operation fails  
**ExecutedAt** — timestamp of the event  
Other identifiers such as id, apiKey, sessionId, and sequenceId

  


The event data contains the payment information, as well as the current `event` being fired, and the time at which it was executed.
