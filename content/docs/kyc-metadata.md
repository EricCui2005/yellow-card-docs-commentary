---
title: "KYC Metadata"
excerpt: "To adhere to regulation we are required to collect the KYC metadata of the recipient (receives) and sender (sends). These customer details are only used for any official regulatory reasons."
---

It is a requirement for all partners to ensure that their customers are undergoing KYC screening on their platform.

KYC metadata is required to be collected for all receive and send requests. Hard copies of the KYC details will not be required and only requested if there are any official cases opened up on a customer.

The following KYC metadata is required for every send recipient or sender(excluding Nigeria).
    
    
    name: "Sample Name",  
    country: "US",  
    phone: "+12222222222",  
    address: "Sample Address",  
    dob: "mm/dd/yyyy",  
    email: "email@domain.com",  
    idNumber: "0123456789",  
    idType: "license"

#### Special use-case: Nigeria

Due to the extra regulatory requirements in Nigeria, the following KYC metadata is required for Nigerian payment recipients and senders.
    
    
    name: "Sample Name",  
    country: "NG",  
    phone: "+12222222222",  
    address: "Sample Address",  
    dob: "mm/dd/yyyy",  
    email: "email@domain.com",  
    idNumber: "0123456789",  
    idType: "NIN",
    additionalIdType: "BVN",
    additionalIdNumber: "0123456789"

For recipients and senders in Nigeria, both NIN and BVN numbers are required.

  


## 

🔐 Reduced KYC (Tier 0) Support

We support **reduced KYC (Tier 0)** for eligible **retail** transactions under specific conditions. This allows the passing of reduced KYC metadata.

### 

🎯 Eligibility Criteria

A transaction qualifies for **Reduced KYC (Tier 0)** only if **all** of the following conditions are met:

  1. A **`customerUID`** field (string) is passed in the request payload for **both send and receive** requests.
  2. The fiat currency is _**not**_ one of:
     * `ZAR` (South African Rand)
     * `BWP` (Botswana Pula)
     * `NGN` (Nigerian Naira)
  3. The transaction amount is **less than $20 USD** (or local equivalent).


### 

✅ Required Metadata for Tier 0

If all criteria are satisfied, only the following KYC metadata is required:

JSON
    
    
    {  
      "name": "Sample Name",  
      "country": "KE",  
      "email": "email@domain.com"  
    }

> 🔒
> 
> ### 
> 
> **Note:** Even if a transaction qualifies for Tier 0, you must still ensure that the provided information is accurate and consistent with your internal KYC policies.

### 

📈 Lifetime Limit Enforcement

We will track the **lifetime cumulative transaction amount** for each `customerUID` that uses reduced KYC. Once the total amount of Tier 0 transactions reaches **$200 USD** , **full KYC** becomes mandatory for all future transactions.

If a Tier 0 transaction is attempted after the limit is reached, the following error is returned:

Code| Status Code| Description  
---|---|---  
**PaymentValidationError**|  _400_|  Full KYC information is required for the transaction  
  
### 

🔁 Bypassing Tier 0 Tracking

If full KYC information is submitted for a transaction that would otherwise qualify for Tier 0:

  * The transaction **is not counted** toward the Tier 0 lifetime limit.
  * No error is thrown.
  * Full KYC is validated, and the transaction proceeds as normal.
