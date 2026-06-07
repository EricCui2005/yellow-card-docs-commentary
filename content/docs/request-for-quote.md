---
title: "Request for Quote (RFQ)"
excerpt: "Convert your USD Stablecoins balance to local currency or visa versa with a customised quote."
---

## Overview

Yellow Card's **Request for Quote (RFQ)** feature enables institutional partners to efficiently manage treasury balances and optimize liquidity across currencies. Get customized quotes to convert between USD Stablecoins and local currencies, and accept the quote to execute conversions seamlessly - helping you maintain optimal working capital and manage FX exposure.

  


### How it works:

Request a quote to convert your USD Stablecoin balance to Local currency (or visa versa) → Yellow Card returns your customised quote → You accept the quote → Conversion processes → Conversion completes. Your USD Stablecoin balance is deducted, and your Local currency balance is credited (or visa versa).

### Key Benefits:

  * **Treasury optimization:** Convert between Stablecoins and local currencies as needed
  * **Liquidity management:** Maintain optimal balance distribution across currencies
  * **Instant execution:** Conversions complete immediately upon acceptance
  * **FX risk mitigation:** Lock in rates to protect against volatility
  * **No slippage:** The quoted rate is guaranteed if accepted within the validity window
  * **Transparent pricing:** See exact conversion amounts and fees upfront
  * **Traceable lifecycle:** End-to-end tracking for reconciliation and audit
  * **Status updates via webhooks:** Get notified as the RFQ progresses

  


### Who This Is For

  * **Payment platforms** managing float across multiple currencies
  * **Remittance services** optimizing liquidity pools
  * **Treasury teams** managing multi-currency corporate holdings
  * **Institutional partners** with high-volume conversion needs
  * **Businesses hedging** against local currency volatility

  


## Step-by-Step Guide to Convert Currencies Using RFQ

### Step 1: Create an RFQ

[Create an RFQ](<https://docs.yellowcard.engineering/reference/create-rfq>) to request a customised quote for converting one currency into another. State your `source currency`, `destination currency` and `amount` in the Post.

### Step 2: Review the returned Quote

Yellow Card reviews the RFQ and responds with a customized quote (or declines it).

At this point, your RFQ will move into one of these directions:

  * **Quote ready** — a quote is available for review and acceptance
  * **Quote rejected** — the request is rejected
  * **Quote expired** — no response was provided within the allowed time window


### Step 3: Accept the Quote

Once the quote has been returned to you, [accept it](<https://docs.yellowcard.engineering/reference/accept-rfq>) to proceed with the conversion at the quoted rate.

### Step 4: Track Conversion Processing

After acceptance, the conversion will process and your balances will reflect accordingly.

### Track Status via Webhooks

Use [webhooks](</docs/webhooks-api#/>) to receive status updates as your RFQ progresses through its lifecycle.
