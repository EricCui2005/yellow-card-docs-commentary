---
title: "Cancellation & Refunds: Receive Requests"
excerpt: ""
---

Cancellation and refunds are available for receive requests in Nigeria through Peer to Peer bank transfers.

> 📘
> 
> ### 
> 
> This is only available in Nigeria for receive requests

# Refund flow

  1. Endpoint to refund receive


a. endpoint /receive/{id}/refund - path param `id` is the `id` returned from submit receive request
    
    
    POST {baseUrl}/receive/{id}/refund

b. with a status `200` if the receive is in the right state ( `complete` or `cancelled` status)  
c. `200` response means refund is being processed.  
d. expect a `400` validation error or `500` otherwise.

  2. Refund Statuses


Status| Description  
---|---  
`pending_refund`| Refund request is received and is currently being processed, waiting for feedback from payment provider.  
`refunded`| Refund is complete, fund has been received by the customer.  
`refund_failed`| We’ve tried to refund the payment 5 times and it still failed, advisable to retry after a few hours.  
  
> 🚧
> 
> ### 
> 
> Failed Refund
> 
> If we get a failed response from the refund request, we will retry for 5 attempts to get a refunded state. If however refund fails after then it is advisable to try again after a couple of hours. If you continuously receive a refund_failed state after your third attempt, we advise reaching out to our team. This will mostly occur if there are banking network issues in Nigeria on the customers side.

# Cancelled Flow

1 Endpoint to cancel receive

a. endpoint /receive/{id}/cancel - path param id is the id returned from submit collection request
    
    
    POST {baseUrl}/receive/{id}/cancel

b. with a status` 200` if the receive is in the right status  
c. `200` response indicates the receive request is cancelled  
d. status updated to `cancelled`  
e. if after the payment has been cancelled we eventually receive the receive (assuming the customer has proceeded to make the deposit payment within the expiry time) we’ll then trigger the refund process.

2 Cancelled Statuses

Status| Description  
---|---  
`cancelled`| Receive request has been cancelled and would be refunded if we receive the receive.
