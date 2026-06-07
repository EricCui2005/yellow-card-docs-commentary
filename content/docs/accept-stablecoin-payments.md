---
title: "Accept Stablecoin payments"
excerpt: "Let customers pay you directly in cryptocurrency"
---

![](https://files.readme.io/8b26b63eb95c90f09346e2957b1a408cbfdfec4ab9bdb9668053872a846638bb-image.png)   


## Overview

Enable your customers to pay you directly in Stablecoins (USDT, USDC, and more) across 30+ blockchains. Yellow Card's digital asset infrastructure lets you generate wallets to accept cryptocurrency payments from customers worldwide, then gives you complete flexibility to withdraw to external wallets, convert to local fiat currency, or hold in Stablecoins - all through one simple API.

### How it works:

Customer sends Stablecoins to your wallet → Payment confirmed on blockchain → Hold in Stablecoins, withdraw to external wallet, or convert to fiat currency.

### Key Benefits:

  * **Global reach:** Accept payments from anyone, anywhere with crypto
  * **30+ blockchains supported:** Ethereum, Tron, Solana, Polygon, and more
  * **Multiple Stablecoins:** USDT, USDC, PYUSD, CUSD, and others
  * **Near-instant settlement:** Blockchain confirmations in minutes
  * **Flexible off-ramping:** Convert to 50+ fiat currencies or withdraw to any wallet
  * **Compliance built-in:** AML & Transactional Monitoring checks handled automatically

  


### Who This Is For

  * **Web3-native businesses** serving crypto holders
  * **International SaaS companies** accepting crypto for purchases
  * **Digital goods sellers** (software, courses, subscriptions)
  * **Freelancers and agencies** accepting global payments
  * **NFT marketplaces** collecting platform fees
  * **Gaming platforms** accepting crypto for in-game purchases
  * **E-commerce stores** targeting crypto-savvy customers
  * **Crypto exchanges** and wallet providers

  


## Step-by-Step Guide to Accept Stablecoin Payments

To accept Stablecoin payments from your customers, you'll need to create create a vault, assign addresses to your customer. When there's a crypto deposit to the address, you'll get a webhook notification that notifies you on status of the crypto deposit.

### Step 1: Create a vault

A Vault is the primary organizational containers for managing digital assets. To create digital asset wallets for your customers, you need to first create and assign a vault to the customer.

[Create Vault API Reference](<https://docs.yellowcard.engineering/v1.1.0/reference/post_vaults#/>)

### Step 2: Generate receive address

You can generate a receive address for each supported crypto asset in a vault you have created and assigned to your customer.

Your customer will be able to send digital assets from any external wallet to these addresses.

[Generate Address Reference](<https://docs.yellowcard.engineering/v1.1.0/reference/post_addresses#/>)

### Step 3: Listen to webhook events

You can use [webhook](</docs/webhooks-api#/>) events to track the transaction status of when crypto on-chain collection is complete.

`PAYMENT.PENDING_SETTLEMENT` \- event indicates transaction quote has been approved and we're now awaiting customer's crypto payment.

`PAYMENT.SETTLEMENT_PROCESSING` event indicates on-chain processing of the customer's fiat payment.
