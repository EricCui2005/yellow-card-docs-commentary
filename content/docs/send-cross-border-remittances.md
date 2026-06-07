---
title: "Send Cross-Border Remittances"
excerpt: "Let your customers send money internationally at lower costs"
---

![](https://files.readme.io/d7e14b82c351e51232bf0b8f152610ba47cd2ad35e9aa8f8f70dd87cec7b9c89-image.png)   


## Overview

Enable your customers to send money internationally quickly and affordably. Yellow Card's remittance infrastructure lets you build cross-border transfer services where senders pay in their local currency, funds move instantly via Stablecoins, and recipients receive money in their local currency - all at a fraction of traditional remittance costs.

  


### How it works:

Sender pays in local currency (e.g., KES) and stipulates the recipients details → Converts to USD stablecoins → Transfers instantly → Converts to recipient's local currency (e.g., NGN) → Recipient withdraws locally.

### Key Benefits:

  * Lower costs: 2-3% vs 8-12% with traditional providers
  * Faster transfers: Minutes instead of days
  * Local payment methods: Bank transfers & mobile money
  * Real-time tracking: You and your customer can see transfer status instantly

  


### Who This Is For

  * **Remittance** **startups**
  * **Neobanks** adding cross-border transfer features
  * **Diaspora-focused platforms** connecting migrants with home countries
  * **Payroll services** paying remote workers internationally
  * **Fintech apps** expanding into international money transfers

  


## Step-by-step guide to facilitate cross-border transactions with Yellow Card

### Step 1: Receive Fiat A from your customer

  1. Your customer initiates their intent to send funds to another country within your platform. They choose how much they want to send. At this stage you'll need to [Get Channels](<https://docs.yellowcard.engineering/reference/get-channels#/>) which enables Yellow Card to provide the appropriate payment methods, and [Get Rates](<https://docs.yellowcard.engineering/v1.0.29_revamped/reference/get-rates#/>) to retrieve the rates for the supported countries.
  2. You'll then post a [Submit Receive Request](<https://docs.yellowcard.engineering/v1.0.29_revamped/reference/submit-collection-request>) which provides you a quote to make the collection.
  3. [Accept Receive request](<https://docs.yellowcard.engineering/v1.0.29_revamped/reference/accept-collection-request>) to initiate the collection.
  4. [Webhooks](</docs/webhooks-api#/>) enable you to track the status of the transaction.
  5. The received amount gets converted to your primary USD wallet.


### Step 2: Send Fiat B to recipient

  1. You're now ready to send out fiat to the recipient. You'll need to [Get Channels](<https://docs.yellowcard.engineering/reference/get-channels#/>) which enables Yellow Card to provide the appropriate payment methods, and [Get Rates](<https://docs.yellowcard.engineering/v1.0.29_revamped/reference/get-rates#/>) to retrieve the rates for the supported countries.
  2. You'll then [Submit a Send Request](<https://docs.yellowcard.engineering/v1.0.29_revamped/reference/submit-payment#/>) which provides you a quote to make a payment.
  3. [Accept Send request](<https://docs.yellowcard.engineering/v1.0.29_revamped/reference/accept-payment-request#/>) to initiate the payment.
  4. `PAYMENT.COMPLETE`event indicates successful local currency payment after we've conducted internal fraud and compliance checks.
  5. Your USD primary wallet gets debited, and the recipient receives the funds in their currency.
