---
title: "Using Rates Data"
excerpt: "Understanding our Rates"
---

# Getting rates from the API

The results from the rates API will look as follows:

json
    
    
    {
        "rates": [
    				{
              "buy": 569.48,
              "sell": 579.48,
              "locale": "NG",
              "rateId": "naira",
              "code": "NGN",
              "updatedAt": "2021-12-30T09:13:54.544Z"
            }
        ]
    }

The `buy`and `sell` fields indicate the rate at which the end user will buy and sell the given currency at. **This rate is always the local currency to the United States Dollar.**
