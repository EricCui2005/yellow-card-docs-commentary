### Guides

#### Getting Started

**Going Live**
* "Once you have completed testing in sandbox, our team will need to review and sign off before providing you with your live credentials. This can include a recording of your solution end-to-end or a 1:1 run through session with our engineering team with some completed sandbox transaction IDs for Bank and Mobile Money transactions."
	* Human review of production credentials is industry standard for KYB / risk reasons (Stripe, Adyen, Paystack all do this). What shouldn't be manual: collecting the sandbox transaction IDs, replaying canonical test flows, assembling the review packet.
		* *Self-serve "Ready to go live" dashboard that auto-collects the review artifacts so the human reviewer starts pre-assembled.*
* Legacy "Making a Collection" text in the What's Next link at the bottom of the page (destination page is now titled "Making a Receive").
* **Production Testing**
	* "You have thoroughly tested your use case internally and with Yellow Card." Vague to the point of being non-actionable. Every other checklist item is verifiable (whitelist IP, fund wallet, share launch date); this one is a vibe.
		* *Replace with a concrete acceptance criterion, e.g. "N successful sandbox sends and N successful sandbox receives across each channel you plan to use in production."*

#### The Basics

**Making a Send**
* Per-country required fields (France IBAN, Cambodia `businessAddress`, Sri Lanka `phoneNumber + businessId`, Ecuador `phoneNumber + taxId + bankAccountType`) are documented in prose only. No client-side helper, no exported schema. Integrators hand-build the `destination` object and let the API reject malformed requests at runtime.
	* *Publish per-country JSON Schema (or TypeScript types) for the `destination` object so integrators get IDE / compile-time validation instead of 400s.*

#### Use Cases

**Send Cross-Border Remittances**
* **Broken Links** (all use legacy versioned URLs, e.g. `v1.0.29_revamped`)
	* "Step 1: Receive Fiat A from your customer":
		* `Get Rates`
		* `Submit Receive Request`
		* `Accept Receive request`
	* "Step 2: Send Fiat B to recipient":
		* `Get Rates`
		* `Submit a Send Request`
		* `Accept Send request`
* Legacy `PAYMENT.COMPLETE` text in "Step 2: Send Fiat B to recipient" (Sends are no longer called Payments per the Updated Terminology callout on `submit-payment`).

**Pay Global Suppliers & Invoices**
* **Broken Links** (all use legacy versioned URLs)
	* `Submitting a Receive Request` in "Step 1: Create a Receive Request"
	* `Submitting a Send Request` in "Step 3: Create Send to Your Supplier"
	* `Lookup Receive` and `Lookup Send` in "Step 5: Handle Send Reconciliation"
* **Legacy Text**
	* `COLLECTION.COMPLETE` in "Step 2: Monitor Receive Completion" (Receives are no longer called Collections).
	* `PAYMENT.COMPLETE` in "Step 4: Payment Completion Confirmation".

**Accept Stablecoin Payments**
* **Broken Links** (both use legacy versioned URLs, e.g. `v1.1.0`)
	* `Create Vault API Reference` in "Step 1: Create a vault"
	* `Generate Address Reference` in "Step 2: Generate receive address"
* **Legacy Text** in "Step 3: Listen to webhook events"
	* `PAYMENT.PENDING_SETTLEMENT`
	* `PAYMENT.SETTLEMENT_PROCESSING`

**Accept Local Currency Payments**
* Broken `Accept the Receive Request` link in "Step 2: Customer Makes Payment" (legacy versioned URL).
* Legacy `COLLECTION.COMPLETE` text in "Step 3: Get Payment Confirmation Webhook".
* Step numbering jumps from "Step 3" to "Step 5: Send to External Crypto Wallet (Optional)". No Step 4 exists.
* **Send to External Crypto Wallet (Optional)**
	* Guide describes a manual Treasury Portal flow only, but the Custody API already exposes `POST /custody/sends` and Crypto Sends already exposes `POST Submit Crypto Send Request`. The capability exists; the guide just doesn't link it.
		* *Cross-reference the existing programmatic endpoints from this guide so integrators don't conclude this is portal-only.*

**Enable Customers to Buy & Sell Digital Assets**
* **Broken Links**
	* Both `here` links (point to `docs/settle-your-customers-in-crypto-direct-settlement`, which does not resolve).
	* `Submitting a Send Request` in the Sell flow (legacy versioned URL).
* Legacy `COLLECTION.*` event names in the first "Step 2: Listen to webhook events" (Buy flow).
* Legacy `PAYMENT.*` event names in the second "Step 2: Listen to webhook events" (Sell flow).

**Enable Full Digital Asset Wallet Functionality**
* **Broken Links** (all use legacy versioned URLs)
	* `Create Vault API Reference`
	* `Get Asset Config Reference`
	* `Generate Address Reference`
	* `Send Transaction Reference`

### Supporting Documentation

**Authentication**
* Signing flow is described, but no SDK or helper is shipped anywhere on the site. Integrators must hand-roll the ISO8601 timestamp + path + method + base64(sha256(body)) concatenation and sign it themselves. Stripe, Plaid, and Paystack all ship language SDKs.
	* *Publish a TypeScript and Python signing helper (~50 lines each) on npm and PyPI. Cheapest meaningful DX win available.*

**Sandbox Testing**
* **Simulating Crypto Send Transactions (Success & Failure)**: Success and Failure JSON examples both show only the `settlementInfo` object, and the only field that differs is `walletAddress`. Show the full request payload, or at least call out that `walletAddress` is the only difference.
* **Simulating Crypto Receive Transactions (Success & Failure)** has no JSON examples. The integrator is told to "Include `Successful` anywhere in the sender's name" but isn't shown where in the request body that goes. Add example payloads matching the shape used in the Send section.

**Coverage Map 🌍**
* Europe page lists only France (EUR / IBAN). Almost certainly a licensing constraint rather than a tech one (France gives broad SEPA + IBAN coverage and a French entity unlocks EEA PSP passporting). The interesting question isn't *why France first* but *what's gating the rest of the EU launch*, which is probably country-by-country licensing.

**Transaction Limits**
* `Min Limit` / `Max Limit` cells are denominated in the row's `Currency` value, but neither the column header nor the cell calls that out.
	* *Suffix each cell with the currency code (e.g. `1,000,000 BWP` instead of `1,000,000`). Adding a parallel USD column would help cross-row comparison but introduces FX staleness, so it would need a rendered-at timestamp or a live rate lookup.*

**Channels**
* "If the maximum is 0, then it implies that there is no maximum specified by the provider. Where the provider has not specified a maximum, we have implemented a maximum of 20 000 USD on our API."
	* Forces every integrator to special-case `0`. Hard-coding the equivalent local-currency value into the field would be wrong though, since the cap is USD and the field is local, so any baked-in value goes stale with FX.
		* *Return `null` (or omit the field) when no provider max is set, and add a separate `effectiveMaximumUSD: 20000` field. Document the rule directly in the field description on `GET Channels`, not just in this callout.*

**Networks**
* **Manual Input Network**
	* "Right now, the API doesn't have a list of all banks available in all countries." Probably reflects aggregator architecture (NIBSS in Nigeria, etc.) rather than a Yellow Card data gap. The clearing partner accepts any valid bank code, so YC may not have a clean per-bank list to surface.
	* Current Manual Input flow forces customers to free-type their bank name, which is bad UX and a fat-finger risk for irreversible payouts. That said, every payout that succeeds via Manual Input is implicit evidence that a given bank works.
		* *Cheap: crowdsourced bank discovery, dropdown sourced from the set of banks YC has historically cleared payments to.*
		* *Better: integrate a third-party bank-code dataset per country (ISO 9362, national BIN / sort-code registries).*

**KYC Metadata**
* "Due to the extra regulatory requirements in Nigeria, the following KYC metadata is required for Nigerian payment recipients and senders." Same hand-build-then-validate pattern as the per-country Send fields above; would benefit from the same JSON Schema export.
* "If a Tier 0 transaction is attempted after the limit is reached, the following error is returned:" → `PaymentValidationError` 400 with message `Full KYC information is required for the transaction`. This same string almost certainly also fires when KYC fields are simply missing on a non-Tier-0 request. Two very different problems (collect more KYC vs. user has burned through their $200 lifetime Tier 0 allowance), same error string, indistinguishable from the response.
	* *Introduce a distinct error code, e.g. `Tier0LimitExceeded` (that's exactly what the `code` field is for). Include `tier0LimitUsdRemaining: 0` in the payload so integrators can render meaningful UI.*

**List Receive**
* `recipient.additionalIdType` and `recipient.additionalIdNumber` only carry meaning for Nigerian recipients (NIN + BVN). Doc doesn't show whether non-Nigerian responses return `null`, omit the fields, or return empty strings. `null` is the worst of the three: it forces integrators to write `if (x != null)` for a field that cannot meaningfully exist outside one country. Omit them entirely instead.

### Security

**Integration Security Guide**
* Doc recommends "Regular Rotation of API Keys and Secrets" but ships no mechanism. Rotation is left as an exercise for the integrator.
	* *Self-serve key rotation flow: create new key, mark old key as expiring in N days (rotate without outage).*
	* *Active-keys list with last-used timestamps so dead keys can be safely revoked.*
	* *Scoped keys (read-only, send-only). The Going Live page hints at "specific permissions" but no UI or API for managing them is documented.*
