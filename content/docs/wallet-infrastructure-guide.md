---
title: "Wallet Infrastructure Guide"
excerpt: "Create and manage Stablecoin vaults"
---

# Our Wallet Custody Offering

Our wallet infrastructure is an API-first solution that enables you to programmatically create and manage segregated Stablecoin vaults. These vaults can be used for a variety of purposes, including providing individual wallets to end-users (e.g., merchants), managing corporate treasury, or facilitating payment flows.

# Features

  * **Create wallets** \- Enable the issuance of wallets for your business and treasury needs
  * **Create Custom wallets** \- Create custom wallets for your sub accounts or end-users for a wide range of applications
  * **Send/Receive Funds** \- Move funds from your wallets and custom wallets without worrying about the blockchain complexities
  * **Query wallet balances** \- Track asset holdings across your wallets and custom wallets


# Features

Here are some features you can build with our wallet solution.

## Customer Receive address

Accept crypto deposits from customers with automatic tracking and reconciliation.

  * UTXO chains (BTC, LTC): Generate unique deposit address per customer
  * Track which customer sent funds based on receive addresses
  * Enhanced privacy and clear attribution
  * Account-based chains (ETH, BSC): One address per vault
  * Monitor incoming transactions via webhooks
  * Support for multiple blockchains simultaneously


## Crypto Send Capability

Send crypto to customers, vendors, or counterparties with proper controls and compliance.

  * Send processing: Customer-initiated sends from platform.
  * Bulk payouts: Batch multiple sends in single operation.
  * Policy enforcement: Whitelisting destination addresses.
  * Internal Sweeps: Send crypto between vaults you manage.


## OTC Trading desk

  * Client segregated vaults (one per institutional customer)
  * Settlement vault (for post-trade processing)


## Treasury management

Manage corporate digital asset holdings across multiple assets, chains, and use cases.

**Multi-Vault Strategy:**

  * Operating vault: Day-to-day transaction needs
  * Reserve vault: Medium-term holdings with higher security
  * Collection vault: Consolidate customer collections
  * Payment vault: Dedicated for supplier/vendor payments


# Wallet terms and definitions

## Vaults

Vaults are the primary organizational containers for managing digital assets.

They serve as:

  * Segregated wallets that hold multiple blockchain accounts and assets
  * Organizational units that can represent different business functions or use cases such as treasury management, and end customer deposit addresses assignment


## Account-Based Tokens

Account-based tokens exist on blockchains that use an account model for tracking balances (similar to traditional bank accounts).

**Characteristics:**

  * Single persistent address per asset within a vault
  * Balance is maintained as a state variable on the blockchain
  * Transactions modify the account balance directly
  * Nonce-based transaction ordering


**Examples:**

  * Ethereum (ETH) and all ERC-20 tokens
  * Stellar, EOS, Tron


**Key behavior:** You use the same address repeatedly for receiving funds.

## UTXO-Based Tokens

UTXO (Unspent Transaction Output) based tokens exist on blockchains that track individual "coins" or transaction outputs rather than account balances.

**Characteristics:**

  * Multiple addresses can be generated for receiving funds
  * Transactions consume specific UTXOs (inputs) and create new UTXOs (outputs)
  * No account balance concept—wallet balance is the sum of all unspent outputs
  * Enhanced privacy through address rotation


**Examples:**

  * Bitcoin (BTC)
  * Litecoin (LTC)


**Key behavior:** Each transaction can use a new receiving address for improved privacy and tracking.

## Memo-Based Assets

Memo-based assets (also called destination tag assets) use a shared address model where a single blockchain address is combined with a unique identifier (tag/memo) to route funds to specific recipients.

**Characteristics:**

  * One address per asset within a vault, shared across all deposits
  * Unique tag/memo required for each deposit to identify the recipient
  * Tag is included in transaction metadata, not the address itself
  * Commonly used by exchanges and custodians for operational efficiency


**Examples:**

  * XRP (Ripple) - uses destination tags
  * Stellar (XLM) - uses memo fields


**Key behavior:** When sending to a tag-based address, both the address AND the tag must be specified, or funds may be **lost** or misallocated (especially when sending to exchanges / custodians).

# Best Practices

  * For account based-tokens, assign all addresses in a vault to the same customer.
  * Customer deposit management: Sweep customer deposit into a separate collection vault for easier management.
  * For memo-based and UTXO tokens, create a single vault and generate unique deposit addresses for each of your customer from the main vault
