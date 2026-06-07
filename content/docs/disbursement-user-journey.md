---
title: "Making a Send"
excerpt: "A comprehensive guide for building an effortless user experience to enable you to send local fiat to your customers."
---

# Send Steps & API Overview

A user journey guide for making a send to your customers, including the API reference at the right time.

![](https://files.readme.io/1d1708bc059815197a9c3541c98c2985692ddcd3961463868ddf39e6b6ba0b63-image.png)   


<table>
<thead>
<tr>
<th>API reference</th>
<th>What's returned from the API</th>
<th>User journey step</th>
<th>What to show on the UX</th>
<th>What to ask the user for</th>
</tr>
</thead>
<tbody>
<tr>
<td><ol><li>Retrieve <a href="https://docs.yellowcard.engineering/reference/get-channels">Get Channels</a></li></ol></td>
<td>A list of available payment channels for the given country including limits</td>
<td>User chooses a preferred payment channel</td>
<td>List of payment channels available to them eg: Bank Transfer, mobile money, P2P transfer</td>
<td>Their preference of payment method</td>
</tr>
<tr>
<td><ol start="2"><li><a href="https://docs.yellowcard.engineering/reference/get-rates">Get Rates</a></li></ol></td>
<td>
<ul>
<li>Limits for a given payment channel</li>
<li>Rate of USD/ Fiat currency conversion</li>
</ul>
</td>
<td>User confirms amount to be paid out to them</td>
<td>Confirmation of amount user to receive</td>
<td>Confirmation</td>
</tr>
<tr>
<td><ol start="3"><li><a href="https://docs.yellowcard.engineering/reference/get-networks">Get Networks</a><br/>Reason for sending = <a href="/docs/payment-reasons-api">Payment Reasons</a></li></ol></td>
<td>A list of available networks (i.e Bank or Mobile Money)<br/>Payment Reasons - Pre-defined list of reasons to select.</td>
<td>Enter receiving details &amp; reason for sending</td>
<td>
<ul>
<li>Bank transfer/ P2P
<ul>
<li>Bank name (Select the bank of the beneficiary)</li>
<li>Account holder name</li>
<li>Account number</li>
</ul>
</li>
<li>Mobile Money
<ul>
<li>First name</li>
<li>Last name</li>
<li>Mobile number (code +string)</li>
<li>Mobile provider</li>
</ul>
</li>
</ul>
</td>
<td>Please provide account details and select the reason for sending:</td>
</tr>
<tr>
<td><ol start="4"><li><a href="https://docs.yellowcard.engineering/reference/submit-payment">Submit Send Request</a></li></ol></td>
<td>A quote to make the send</td>
<td>Confirm send amount &amp; details</td>
<td>Show Transaction details including:
<ul>
<li>Payment Channel</li>
<li>Payment Network</li>
<li>Recipient details entered</li>
<li>Total amount</li>
<li>Rate</li>
<li>Ability to confirm or cancel.</li>
</ul>
</td>
<td>To confirm or cancel the requested transaction.</td>
</tr>
<tr>
<td><ol start="5"><li><a href="https://docs.yellowcard.engineering/reference/accept-payment-request">Accept Send Request</a> <a href="https://docs.yellowcard.engineering/reference/deny-payment-request">Deny Send Request</a></li></ol></td>
<td>Confirmation or cancellation of the transaction</td>
<td>End of flow confirmation</td>
<td>Confirmation the send is being processed / cancelled</td>
<td>n/a</td>
</tr>
<tr>
<td><ol start="6"><li>n/a<br/><a href="https://docs.yellowcard.engineering/docs/webhooks-api">Webhooks</a> to determine status of transaction</li></ol></td>
<td>n/a</td>
<td>Customer receives local fiat in bank account or mobile wallet.</td>
<td>n/a</td>
<td>n/a</td>
</tr>
<tr>
<td><ol start="7"><li><a href="https://docs.yellowcard.engineering/reference/lookup-payment">Lookup Send</a></li></ol></td>
<td>Information about a specific send</td>
<td>Retrieve information about a specific send</td>
<td>View transaction details</td>
<td>View transaction details</td>
</tr>
</tbody>
</table>
  


## Making a send in Latin America

Outbound sends to Latin America follow the same steps above and support MXN (Mexico via SPEI), BRL (Brazil via PIX), COP (Colombia), and ARS (Argentina). For COP and ARS, standard local bank account details apply.

  


## Making a USD/EUR send

Making a USD/EUR send is supported in select Asian, European, African, and South American countries. The request body contains fields that are specific to USD/EUR payments.

  


### Required Fields

#### All Countries

The following fields are required on every USD/EUR send, regardless of country.

**Top-level request:**

Field| Type| Description  
---|---|---  
customerType| string| Must be "institution"  
purposeOfRemittance| string| See [Payment Reasons](<https://docs.yellowcard.engineering/v1.0.34/update/docs/payment-reasons-api>)  
  
  


**Sender object:**

Field| Type| Description  
---|---|---  
businessName| string| Legal name of the sending business  
businessId| string| Business registration or tax ID  
  
  


**Destination object:**

Field| Type| Description  
---|---|---  
accountName| string| Name of the account holder  
accountNumber| string| Bank account number  
accountType| string| Must be "bank"  
networkId| string| YC network ID for the receiving bank  
businessName| string| Legal name of the receiving business  
documentReferenceNumber| string| Reference document number (e.g. invoice number)  
  
* * *

#### Country-Specific Fields

* * *

**France (FR) — EUR**

Field| Location| Description  
---|---|---  
accountNumber| destination| Must be a valid IBAN (e.g. FR7630006000011234567890189)  
  
* * *

**Cambodia (KH) — USD**

Field| Location| Description  
---|---|---  
businessAddress| destination| Full business address of the recipient  
  
* * *

**Sri Lanka (LK)— USD**

Field| Location| Description  
---|---|---  
phoneNumber| destination| Recipient phone number in international format  
businessId| destination| Business registration ID of the recipient  
  
* * *

**Ecuador (EC)— USD**

Field| Location| Description  
---|---|---  
phoneNumber| destination| Recipient phone number in international format  
taxId| destination| Recipient tax identification number  
bankAccountType| destination| Account type ("SAVINGS", "CHECKING", "DEPOSIT", "OTHERS")
