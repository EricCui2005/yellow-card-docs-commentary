---
title: "Events"
excerpt: "Events for the lifecycle of a payment"
---

| Event | Description |
| --- | --- |
| CREATED | Sends / Receive request has been submitted and is undergoing initial validation. It will automatically be moved to **PENDING_APPROVAL**. No action needed. |
| PENDING_APPROVAL | Sends / Receive request is pending action from client to accept/deny the returned request. If denied, payment will be marked as **FAILED**. If request is not acted upon within 5m (_10m in sandbox environment)_, the transaction will be marked as **EXPIRED** |
| PROCESS | Sends / Receive has been accepted and put up for processing, where we do some final checks on the transaction. This typically lasts a second, before being updated to **PROCESSING** |
| PROCESSING | Sends / Receive is being broadcasted on the selected channel, on successful broadcast transaction will be marked as **PENDING**, otherwise it will retry until it goes through or eventually mark itself as **FAILED**. |
| PENDING_LIQUIDITY | Send has not been accepted for processing yet, due to low balance on your account, once balance top-up is complete, payment is automatically moved to **PROCESSING**, if not it moves to **FAILED** state after 2 hours in this state. |
| PENDING | Sends / Receive is no longer an internal Yellow Card transaction, has been broadcasted on the channel, and is awaiting results to finalize. |
| COMPLETE | Sends / Receive has succeeded on sending to the destination and is at the end state. |
| FAILED | Sends / Receive has failed on sending to the destination and is at the end state. |
| PENDING_REFUND | Receive refund request is received and is queued for processing. |
| REFUND_PROCESSING | Receive refund request is being processed, waiting for feedback from payment provider. |
| REFUND_FAILED | We've tried to refund the receive 5 times and it failed from provider's end, advisable to resend a refund request after a few hours. |
| REFUNDED | Receive refund is complete, refund has been received by the customer. |
| CANCELLED | Receive request has been cancelled and would be refunded if we receive payment for the receive. |
| EXPIRED | Sends / Receive was not accepted/denied within expiry timeframe and is at the end state. |
