---
title: "Errors"
excerpt: "The Yellow Card API returns clear, structured error responses to help you quickly diagnose issues during integration or in production. Errors follow a consistent format and include an HTTP status code, an Internal error code and a descriptive message.  Use this section as a reference when handling errors."
---

API error's are returned with the following schema.

```json
{
    "code": "The error code",
    "message": "The error message"
}
```

Code: A machine-readable Yellow Card error code.
Message: Human-readable explanation of the error.

* * *

**Authentication Errors**

| Code | HTTP Status | Description |
| --- | --- | --- |
| AuthenticationError | 401 | Invalid API key or Signature; authentication failed. |
| PermissionError | 403 | API key lacks the required permission for the requested endpoint. |

**Request Validation Errors**

| Code | HTTP Status | Description |
| --- | --- | --- |
| PaymentValidationError | 400 | Invalid request payload (e.g. missing required fields or metadata) In particular this can occur if full KYC/metadata is required but not provided. |
| InvalidRequestBody | 400 | Returned when an invalid body is passed in resolve bank Account API |
| InvalidPhoneNumberFormat | 400 | Phone number in the request is not in international format (e.g. missing "+234" prefix) |
| ResolveAccountError | 400 | Failed to resolve the bank account number (no match for the provided bank account number on the selected bank) |

**Transaction Errors**

| Code | HTTP Status | Description |
| --- | --- | --- |
| PaymentExpired | 400 | On approve or Deny. (payment request has expired) |
| PaymentInvalidState | 400 | Payment is in an invalid state for the requested operation |
| PaymentNotFound | 404 | The payment with the given id does not exist. |
| CollectionNotFoundError | 404 | Failed to resolve the bank account number (no match for the provided bank account number on the selected bank) |
