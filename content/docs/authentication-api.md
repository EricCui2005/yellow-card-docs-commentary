---
title: "Authentication"
excerpt: "Learn how to authenticate your API requests using API keys."
---

# Request signature

Authenticated requests must include a `X-YC-Timestamp` header with the current timestamp in **ISO8601** format and an `Authorization` header in the `YcHmacV1` scheme, `Scheme {apikey}:{signature}`, where the scheme is `YcHmacV1`, `apikey` is the api key in use and `signature` is a signed message using the secret key associated with the api key in use.

**Example** `Authorization` header, `YcHmacV1 aenifaieubgpa:fakno+9epoa/obe=`.

The message to sign is a concatenation of:

  * The current datetime in **ISO8601** format

  * The request path(only path data, excluding host), e.g `/business/payments/accept`

  * The request method in caps, e.g _POST_

  * For _POST_ and _PUT_ requests a **base64** encoded **sha256** hash of the request body

**Example** message to sign, `2022-01-11T15:48:37.424Z/paymentPOSTuisbibf/sadf+==`.


# IP address whitelist

In production environment, you're required to share with us your production server static IP address for whitelisting as we authorize requests from whitelisted IP addresses in production. We support whitelisting of IP range for both IPv4 and IPv6 addresses.
