---
title: "Networks"
excerpt: "Understand our Networks"
---

A network is a specific financial institution that is used to facilitate a payment. A bank or a mobile money operator depending on the channel type.

A few examples could be:

  * Access Bank Nigeria
  * First National Bank (South Africa)
  * MTN Mobile Money


The network is selected by the customer on receive / send if a network is applicable, the customer is expected to be familiar with the network name when displayed to them.  
Example, a customer that banks with Access Bank will select that as the destination network for their disbursement.  
Another customer that wants to make payment from their MTN mobile money account would select MTN as the source network for their mobile money collection.

> 📘
> 
> ### 
> 
> Manual Input Network
> 
> Right now, the API doesn't have a list of all banks available in all countries. Manual Input network is available to help with this, when you call the Get Networks endpoint and you filter by your selected `channelId`, you'll have one network left with network name "Manual Input" the expectation here is you allow your customer enter their bank name which is to be passed as accountBank and account holder name to be passed as accountName in submit payment request destination object, alongside other destination input sent to the submit payment endpoint.
