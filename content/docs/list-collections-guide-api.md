---
title: "List Receive"
excerpt: "Get a list of receive requests"
---

You can get a historical list of receive requests using the list receive endpoint, this endpoint takes query parameters for filtering and pagination.

### Data Filtering

Parameter| Description| Default  
---|---|---  
startDate| a date string in ISO format (_2023-02-13T10:08:57.307Z_)| 24 hours ago  
endDate| a date string in ISO format (_2023-02-13T10:08:57.307Z_)| Current date  
startAt| a number indicating the where the pagination should start from| -  
perPage| a number indicating the number of items per page| 100  
rangeBy| a string indicating the field to which the start and end date are applied - either 'createdAt' or 'updatedAt'| createdAt  
sortBy| a string indicating the field on which to sort by - either 'createdAt' or 'updatedAt'| createdAt  
orderBy| a string indicating how to order the results - either 'asc' or 'desc'| desc  
  
> 📘
> 
> ### 
> 
> Working with Pagination
> 
> Note for clarification: if `perPage` is 10 for example, then to get items on page 2, `startAt` will have to be 11 as items 1 to 10 will be on page 1.  
>  Both `startDate` and `endDate` have to be provided else the default is used.

### Fields Description

Field| Description  
---|---  
id| Unique receive identifier  
sequenceId| Represents a unique id for the transaction from your end  
channelId| The identifier of the specific channel to execute payment through  
currency| Fiat currency collected.  
country| Country where payment is collected from  
status| Receive status  
recipient| Receive recipient info  
recipient.name| Recipient's full name  
recipient.country| Recipient's country  
recipient.phone| Recipient's phone number  
recipient.address| Recipient's address  
recipient.dob| Recipient's date of birth  
recipient.email| Recipient's email address  
recipient.idNumber| Recipient's identity number  
recipient.idType| Recipient's identity type  
recipient.additionalIdType| Recipient's additional identity type  
recipient.additionalIdNumber| Recipient's additional identity number  
source| Receive source info - account making fiat payment for receive request  
source.accountNumber| Payer's bank account number or mobile money phone number  
source.accountBank| Payer's bank name  
source.networkId| The identifier of the specific network to execute payment through (not required for bank receives)  
source.networkName| Payer's mobile money network name  
source.accountType| The type of account ('bank' or 'momo')  
source.accountName| Payer's bank account name  
reference| Receive unique reference, expected to be added by custumer to their bank payment reference  
amount| Amount in USD to transact  
convertedAmount| The amount in local currency to transact.  
rate| FX rate used for calculating converted amount  
depositId| Unique id for YC internal deposit transaction for receive processing  
withdrawalId| Unique id for YC internal withdrawal transaction for refund processing  
bankInfo| YC / P2P bank details for receiving receive. User's expected to make payment into this account  
bankInfo.name| YC / P2P bank name  
bankInfo.accountNumber| YC / P2P bank account number  
bankInfo.accountName| YC / P2P bank account name  
bankInfo.branchCode| YC / P2P bank's branch code  
refundRetry| Number of times refund was retried  
refundSessionId| Receiving bank's sessionId for successful refunds, this is what refund recipient uses to make complaints at the bank if they're yet to receive the refund.  
expiresAt| A date string in ISO format indicating when receive is meant to expire  
createdAt| A date string in ISO format indicating when receive record was created  
updatedAt| A date string in ISO format indicating when receive record was last updated
