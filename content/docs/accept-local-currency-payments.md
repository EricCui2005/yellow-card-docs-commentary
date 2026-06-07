---
title: "Accept Local Currency Payments"
excerpt: "Collect local payments while holding value in stable assets"
---

![](https://files.readme.io/93d55282673a449c85f68bbcb7d28d8ffd9116577dbd9344a9a1e5d35d885290-image.png)   


## Overview

Collect payments from customers in their local currency while automatically protecting your revenue from currency volatility. Yellow Card's local currency receive infrastructure lets you generate payment wallets that accept payments in 50+ currencies, automatically convert to Stablecoins, and give you the flexibility to hold stable value and send to external crypto wallets.

### How it works:

Customer pays in local currency → Automatically converts to USD Stablecoins → Your balance held in stable assets → Send to crypto wallet on demand.

### Key Benefits:

  * **Currency protection:** Shield revenue from local currency devaluation and volatility
  * **Flexible withdrawals:** Send to any crypto wallet
  * **Multiple payment methods:** Bank transfers, mobile money, and more
  * **Automatic conversion:** No manual intervention needed - payments convert to USD Stablecoins instantly
  * **Real-time tracking:** Monitor receives and conversions in your portal
  * **50+ currencies supported:** Accept payments across Africa and emerging markets
  * **Instant liquidity:** Access funds immediately after conversion

  


### Who This Is For

  * **Merchants in volatile currency markets** wanting to protect revenue from inflation
  * **Subscription services** collecting recurring payments across multiple countries
  * **E-commerce platforms** accepting local payments while holding stable value
  * **Digital service providers** (SaaS, education, media) serving emerging markets
  * **Marketplaces** collecting from local buyers and holding revenue in stable assets
  * **Gaming and entertainment platforms** monetizing across multiple currencies
  * **NGOs and nonprofits** accepting donations in local currencies

  


## Step-by-Step Guide to Accept Local Currency Payments

  


### Step 1: Create a Receive Request

To receive local currency funds from your customer, create a [Receive Request](<https://docs.yellowcard.engineering/reference/submit-collection-request>) to create a quote for the amount. A receive request collects the funds and auto converts into your primary USD wallet.

### Step 2: Customer Makes Payment

Your customer pays local currency using their preferred method (bank transfer, mobile money, etc.) using the provided payment reference. You will [Accept the Receive Request](<https://docs.yellowcard.engineering/v1.0.29_revamped/reference/accept-collection-request>) to confirm the transaction

### Step 3: Get Payment Confirmation Webhook

Get notified when payment is received and converted via [webhooks](</docs/webhooks-api#/>).

> `COLLECTION.COMPLETE` \- webhook event means we've successfully collected local currency payment from your customer and credited your Stablecoin balance.

### Step 5: Send to External Crypto Wallet (Optional)

The collected fiat has now been converted and credited to your USD primary wallet and you're welcome to send it to an external Stablecoin wallet.

  1. Log into the Treasury Portal
  2. Navigate to **Balance**
  3. Click **Withdraw balance**
  4. Enter in the amount and choose your destination address
