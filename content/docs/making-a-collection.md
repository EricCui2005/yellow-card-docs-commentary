---
title: "Making a Receive"
excerpt: "A comprehensive guide for building an effortless user experience to enable you to receive local fiat from your customers."
---

# Receive Steps & API Overview

A user journey guide for receiving fiat from your customers, including the API reference at each step.

![](https://files.readme.io/37418dd2f2dbdca06e746da496897d623ab8e9ac94f5ae466ed7603375a25e72-image.png)   


<table>
<thead>
<tr>
<th>User journey step</th>
<th>What to show on the UX</th>
<th>What to ask the user for</th>
<th>API reference</th>
<th>What's returned from the API</th>
</tr>
</thead>
<tbody>
<tr>
<td><ol><li>Payment screen</li></ol></td>
<td>A place for the user to view the amount to pay</td>
<td>n/a</td>
<td>
<ul>
<li><a href="https://docs.yellowcard.engineering/reference/get-channels">Get Channels</a> to retrieve all supported payment methods</li>
<li><a href="https://docs.yellowcard.engineering/reference/get-rates">Get Rates</a> to retrieve rates for the supported countries</li>
</ul>
</td>
<td>
<ul>
<li>Limits for a given payment channel</li>
<li>Rate of local fiat/ USD</li>
</ul>
</td>
</tr>
<tr>
<td><ol start="2"><li>Chooses a preferred payment channel</li></ol></td>
<td>List of payment channels available to them eg: Bank Transfer, Mobile Money, P2P transfer</td>
<td>Their preference of payment method</td>
<td><a href="https://docs.yellowcard.engineering/reference/get-channels">Get Channels</a></td>
<td>A list of available payment options for the given country</td>
</tr>
<tr>
<td><ol start="2"><li>a. IF they chose Mobile Money: Provide Mobile Money Details screen</li></ol></td>
<td>Input fields for customer to enter beneficiary details:
<ul>
<li>First name</li>
<li>Last name</li>
<li>mobile number (country code + string)</li>
<li>Select provider (mobile network)</li>
</ul>
</td>
<td>Please add mobile money details:</td>
<td>Mobile provider = <a href="https://docs.yellowcard.engineering/reference/get-networks">Get Networks</a></td>
<td>A list of available networks</td>
</tr>
<tr>
<td><ol start="3"><li>Enter reason for sending</li></ol></td>
<td>Ask the user the reason for their transaction</td>
<td>To choose from a list of reasons</td>
<td>Reason for sending = <a href="/docs/payment-reasons-api">Payment Reasons</a></td>
<td>Pre-defined list of reasons to select.</td>
</tr>
<tr>
<td><ol start="4"><li>Review payment details</li></ol></td>
<td>Transaction details including:
<ul>
<li>Payment Option</li>
<li>Payment channel</li>
<li>Payment Network</li>
<li>Account number/ Mobile number</li>
<li>Total amount</li>
<li>Rate (if req)</li>
</ul>
</td>
<td>To confirm the payment.</td>
<td><a href="https://docs.yellowcard.engineering/reference/submit-collection-request">Submit Receive Request</a></td>
<td>A quote to make the receive transaction</td>
</tr>
<tr>
<td><ol start="5"><li>Initiate payment</li></ol></td>
<td>Confirmation the transaction is being processed</td>
<td>n/a</td>
<td><a href="https://docs.yellowcard.engineering/reference/accept-collection-request">Accept Receive request</a><br/><a href="https://docs.yellowcard.engineering/reference/deny-collection-request">Deny Receive Request</a></td>
<td>Confirmation or rejection of the transaction</td>
</tr>
<tr>
<td><ol start="6"><li>Payment successful</li></ol></td>
<td>Confirmation that payment was successful.</td>
<td>n/a</td>
<td>n/a<br/><a href="https://docs.yellowcard.engineering/docs/webhooks-api">Webhooks</a> to determine status of transaction</td>
<td>n/a</td>
</tr>
<tr>
<td><ol start="7"><li>Retrieve information about a specific payment</li></ol></td>
<td>View of transaction details</td>
<td>View transaction details</td>
<td><a href="https://docs.yellowcard.engineering/reference/lookup-payment-copy">Lookup Receive</a></td>
<td>Information about a specific payment</td>
</tr>
</tbody>
</table>
  


## Receiving in Latin America

Latin American currencies (MXN, BRL, COP, ARS) require a virtual account before a receive can be submitted. Create one via `POST /virtual-accounts` with the desired `fiat` currency and an `alias`. The account starts in a `pending` state and becomes `active` asynchronously.

Once active, submit the receive as normal with `recipient.alias` set to the virtual account alias. The receive response includes a `bankInfo` object with local bank details to share with the customer so they can initiate the transfer: SPEI/CLABE for MXN, PIX key for BRL, and local bank transfer details for COP and ARS.
