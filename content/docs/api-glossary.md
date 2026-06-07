---
title: "API Glossary"
excerpt: "Understand our terminology"
---

Term| Definition  
---|---  
**Account Balance**|  The stablecoin balance in a partner’s Yellow Card account, representing funds available for transactions. Businesses must top up this balance (via USD Stablecoins) via the provided wallet address before initiating sends.  
**API**|  Application Programming Interface. Yellow Card’s API is a stablecoin-powered interface for businesses to integrate local fiat on/off-ramp payment services.  
**API Endpoint**|  A specific URL path of the API for a particular function. For example, GET /business/channels retrieves all supported payment channels (bank, mobile money, etc.).  
**API Key**|  A unique public identifier (token) is assigned to each partner. It is included in the request’s Authorization header and, along with a secret key, is used to sign and authenticate API requests.  
**Authentication**|  Verifying the identity of the client. Yellow Card requires each API request to be signed using HMAC, include a X-YC-Timestamp header and an Authorization: YcHmacV1 `{apikey}`:`{signature}` header. The signature is generated using the secret key over the timestamp, request path, method, and body hash.  
**Authorization Header**|  The HTTP header containing authentication credentials. Yellow Card uses the Authorization header with scheme YcHmacV1. It has the format YcHmacV1 `{API_KEY}`:`{SIGNATURE}`, where the signature is an HMAC hash of the request.  
**Bank Transfer**|  A payment channel using traditional banking rails to move money. Yellow Card supports bank transfer channels in many countries (e.g. local bank payments as a ramp).  
**Channel (Payment Channel)**|  The type of payment method or “ramp” used. Examples include Bank Transfer, Mobile Money. Channels indicate how funds are sent or received.  
**Receive**|  An inbound transaction where a customer pays money into the merchant’s account (i.e “receiving”). It’s the process of receiving local fiat from a user into the Yellow Card system.  
**Receive Request**|  An API call that initiates a collection from a customer. Submitting a receive request locks in an exchange rate for the funds and awaits approval. Upon success, the customer’s local payment is converted to Stablecoins credited to the partner’s account.  
**Receive Refund**|  An API call to return funds to the customer for a previously collected payment. This effectively refunds a completed or cancelled collection transaction.  
**Crypto (Cryptocurrency)**|  Digital assets used for value transfer. Yellow Card primarily uses Stablecoins (cryptocurrencies pegged 1:1 to USD) such as USDT, USDC, Etc.  
**Disbursement**|  An outbound transaction where the business pays local currency to a customer (i.e a “send”). Yellow Card converts Stablecoins from the partner’s balance into local fiat for the recipient.  
**Error Code**|  A machine-readable code in the API response indicating why a transaction failed. For send/receive objects, examples include EXPIRED (timed out), INVALID_NETWORK, INSUFFICIENT_BALANCE, etc.  
**Error Message**|  The human-readable text returned by the API explaining an error. In an error response (JSON), the message field describes what went wrong.  
**Rate (Exchange Rate)**|  the rate is the local currency amount equivalent of 1 USD in our rates API, and is locked in when a send/receive is accepted  
**HTTP Method**|  The type of HTTP request (e.g. GET, POST). In the API, GET is used to retrieve information (e.g. listing channels), and POST is used to create actions (e.g. submit a send).  
**HTTP Status Code**|  A Numeric code in an API response indicating the outcome. For example, 200 OK means success, 400 Bad Request indicates invalid input, 401 Unauthorized means an auth error, 404 Not Found if an ID doesn’t exist, and 500 Internal Server Error for unknown issues.  
**IP Whitelist**|  In production, partners must provide their static IP addresses. Yellow Card will only accept API requests coming from these whitelisted IPs.  
**KYC Metadata (Know Your Customer)**|  Customer identity information required on each transaction for compliance. This includes fields like name, address, ID number, etc. All receive and send requests must include KYC data for the sender or recipient. (E.g., name, country, phone, address, dob, email, ID number/type).  
**KYB (Know Your Business)**|  The verification process for a partner organization. Before going live, businesses must complete KYB onboarding(submitting company documents) to prove legitimacy.  
**Partner**|  The business or organization integrating Yellow Card’s API to process payments for its customers. Yellow Card often refers to merchants or partners as the clients using its B2B services.  
**Mobile Money**|  A mobile phone–based payment service popular in many African countries. It’s a type of payment channel (like MTN Mobile Money) supported by Yellow Card for collections and disbursements.  
**Network**|  A specific financial network used in a payment channel. For example, it can be a bank (Stanbic Bank Kenya) or a mobile network operator (MTN Ghana). The Get Networks API lists available networks under each channel.  
**Treasury Portal**|  A Yellow Card web dashboard for business partners . Partners use this dashboard to top up balances, initiate payouts, whitelist wallet addresses, view transactions, manage webhooks, and add other members. It also has a role-based access control that includes read-only, treasury and admin.  
**Send Request**|  An API call to create a disbursement. Submitting a sendrequest (POST /business/sends) locks in an exchange rate for the desired amount and must be accepted (or it auto-expires).  
**Sandbox**|  A test environment for integration. In the sandbox, no real money moves. Yellow Card provides test endpoints (e.g. <https://sandbox.api.yellowcard.io/business>) and test account numbers to simulate success or failure.  
**Sequence ID**|  The sequence ID is a unique ID a partner generates for transactions on their end; it's what we use as an idempotency key (to prevent duplicate transactions).  
**Settlement**|  The process of finalising and moving funds after transactions. For example, using the Settlement endpoint, a partner can settle their USD balance by paying it out to their business wallet address. This is how surplus Stablecoins are converted back to local currency for the partner.  
**Payout Wallet**|  The partner’s USD-denominated Stablecoin wallet. When customers deposit , the received USD value is credited to this wallet. Partners can view and manage this wallet via the dashboard. E.g., Yellow Card “credits partners’ USDT/USDC settlement wallet” after a collection.  
**Signature**|  The cryptographic HMAC signature is calculated for each request using the secret key. Included in the Authorization header.  
**Webhook**|  A server-to-server callback from Yellow Card notifying of an event (e.g. payment accepted, KYC status change). Partners can register a webhook URL to receive JSON notifications. Each webhook request includes an X-YC-Signature header (HMAC-SHA256 of the payload) to verify authenticity.  
**Wallet (Address)**|  A crypto/Stablecoin account address. Partners have wallet addresses for top-ups and payouts. For example, Yellow Card provides each partner with a Stablecoin wallet address for funding (top-ups). A “business wallet” address (pre-registered and whitelisted) is used to receive payouts.  
**Top-up Wallet Address**|  Yellow Card provides each partner with a Stablecoin wallet address for funding (top-ups). This wallet address will be associated with the respective Stablecoin to make balance top-ups.  
**Payout Wallet address**|  Our submit settlement endpoint allows you to programmatically pay out your balance to a pre-screened and saved wallet address. Before implementing this, please ensure that you have sent the required wallet addresses to our team to conduct screening and whitelist ahead of you paying out the balance to this address.
