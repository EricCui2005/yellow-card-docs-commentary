---
title: "Channels"
excerpt: "Understand our channels"
---

A channel is a specific financial mechanism that is used to facilitate a payment. Each channel has exactly one country, one currency, one channel type and one ramp type associated.

The importance of channels for an integrator is the ability to see what fiat ramps are available in our system at a given time. This endpoint that enables the ability to see a list of all channels and their status as well as determine which countries and currencies are currently supported. Please see the table below of all enabled channels.

> 📘
> 
> ### 
> 
> Minimum and Maximum Transaction Amounts
> 
> Each provider, and therefore channel, may provide a minimum and maximum transactable amount. This is indicated on the channel object in the response of the `GET Channels` endpoint. The minimums and maximums are indicated in the channel's local currency. **If the maximum is 0, then it implies that there is no maximum specified by the provider. Where the provider has not specified a maximum, we have implemented a maximum of 20 000 USD on our API.**

### Using Channel Type Instead of Channel ID

You can now use channelType as an alternative to specifying a channelId in your SubmitReceive and SubmitSend API requests. When you provide a channel type, the system will automatically select an appropriate active channel for your transaction.

Available Channel Types:

  * momo
  * bank


ℹ️ Note: If you provide both channelType and channelId, channelType takes precedence.

Benefits

  * Simplified integration without needing to track specific channel IDs
  * Automatic selection from available channels
  * More resilient to channel availability changes

  


## Receives

Country| Payment Method| Payment Type| Settlement Time| Channel Type| Channel ID  
---|---|---|---|---|---  
Botswana| Bank Transfer| Manual| 24-48hrs| `bank`| `602060c6-b4af-49a4-b8fd-2fdd0dbf13ce`  
Botswana| Mobile Money| Instant| Instant| `momo`| `bf831f9d-75d2-4ee7-a44e-7c95be028bab`  
Benin| Mobile Money| Instant| Instant| `momo`| `37b63794-284f-4a09-863d-9b74a3f621e1`  
Cameroon| Mobile money| Instant| Instant| `momo`| `79da4d6e-1c42-4aac-ae7d-422730528f96`  
Congo Brazzaville| Bank Transfer| Manual| 24-48hrs| `bank`| `5968d5d4-103b-4333-98e2-b400968c6927`  
Ivory Coast| Mobile money| Instant| Instant| `momo`| `b621bf4f-0c60-4884-88a1-75f7a56b1938`  
Gabon| Bank Transfer| Manual| 24-48hrs| `bank`| `0cc05476-c25a-46c4-9c71-23c39ed87348`  
Malawi| Bank Transfer| Manual| 24-48hrs| `bank`| `158f471c-62ac-469f-9127-012b3bc648e1`  
Malawi| Mobile Money| Instant| Instant| `momo`| `b7b89a56-b0a1-479b-8514-5cf60a8ce975`  
Nigeria| Bank Transfer| Instant| Instant| `bank`| `af944f0c-ba70-47c7-86dc-1bad5a6ab4e4`  
Rwanda| Bank Transfer| Manual| 24-48hrs| `bank`| `71764ae2-6620-4e9d-9474-4c94877366b9`  
Rwanda| Mobile Money| Instant| Instant| `momo`| 0e378f46-4c75-4894-ac1a-886b4110396d  
South Africa| EFT| Instant| Instant| `bank`| `643d2ec2-16ee-48e2-ad8c-4f095cdd55d2`  
Tanzania| Bank Transfer| Manual| 24-48hrs| `bank`| `fc7a5bc2-9100-473e-8c01-df563494ee73`  
Togo| Mobile Money| Instant| Instant| `momo`| `d8ccc9bf-4ab0-4cf5-a9d9-1a70a0cc9d60`  
Uganda| Bank Transfer| Manual| 24-48hrs| `bank`| `5de46c23-6461-4950-871f-a971490772cf`  
Uganda| Mobile money| Instant| Instant| `momo`| `e167def0-c4f0-46e2-aaa9-50046f13b0a7`  
Zambia| Bank Transfer| Manual| 24-48hrs| `bank`| `f436afb5-d034-4d18-b9d5-e8125e6ddfe4`  
Zambia| Mobile Money| Instant| Instant| `momo`| `3137dba1-9856-4880-80c0-3ec43d50d3f6`  
  
## Sends

Country| Payment Method| Payment Type| Settlement Time| Channel Type| Channel ID  
---|---|---|---|---|---  
Botswana| Bank Transfer| Manual| 24-48hrs| `bank`| `1239227d-f33a-4d7a-8520-0a0cf41988fb`  
Botswana| Mobile Money| Instant| Instant| `momo`| `7423710d-6fa3-440f-9023-27d54426bce6`  
Cameroon| Mobile money| Instant| Instant| `momo`| c9efb5bf-122a-465b-bf8d-5927ac597cd2  
Congo Brazzaville| Bank Transfer| Manual| 24-48hrs| `bank`| `6fef21a2-b8f3-4515-bef5-63597ea0307f`  
Gabon| Bank Transfer| Manual| 24-48hrs| `bank`| `65a69867-81e2-44c7-a97b-fcaaf5f38359`  
Kenya| Bank Transfer| Manual| 24-48hrs| `bank`| `b7140c26-0c93-460b-85cf-bdb53af66ca0`  
Malawi| Bank Transfer| Manual| 24-48hrs| `bank`| `aa11c087-d0c8-4f8d-b566-3625a7581a1f`  
Malawi| Mobile Money| Instant| Instant| `momo`| `88c80c44-23a8-4729-9e36-7be766effefb`  
Nigeria| Bank Transfer| Instant| Instant| `bank`| `fe8f4989-3bf6-41ca-9621-ffe2bc127569`  
Rwanda| Bank Transfer| Manual| 24-48hrs| `bank`| `05ec29bc-a6c0-4045-8ef1-8701fa991d12`  
Rwanda| Mobile Money| Instant| Instant| `momo`| 609c5ea9-8f4d-4212-b55f-66bd88e2b135  
Senegal| Mobile Money| Instant| Instant| `momo`| cc374d7e-2193-4bee-bab2-978d57ae6a04  
South Africa| Bank Transfer| Automated Batched Payment| 6-48 hours| `bank`| `81018280-e320-4c81-9b2f-6f636c2239d8`  
South Africa| EFT| Instant| Instant| `bank`| `5c2736d2-baa4-4712-b79f-1f20236fc1c9`  
Tanzania| Bank Transfer| Manual| 24-48hrs| `bank`| `12b6d583-b5ad-440f-8185-02c67259b17d`  
Uganda| Bank Transfer| Manual| 24-48hrs| `bank`| `48f72484-f2a5-4bef-8bc1-f57ccd1c837d`  
Uganda| Mobile Money| Instant| Instant| `momo`| `e573694c-d9d2-4511-8dec-aa633baf19f3`  
Zambia| Bank Transfer| Manual| 24-48hrs| `bank`| `ddc30e71-58e4-4bb4-a22b-ef0293f176e4`  
Zambia| Mobile Money| Instant| Instant| `momo`| `de392cbe-9826-45e1-aede-69ad2be6e3a0`  
Mali| Mobile Money| Instant| Instant| `momo`| `4da264c2-080b-4cb6-9401-da68ea93bcf5`  
Togo| Mobile Money| Instant| Instant| `momo`| `3955a441-fa81-4bee-a3ce-f958a530be80`  
Burkina Faso| Mobile Money| Instant| Instant| `momo`| `fbd1276a-8709-44e0-ac1d-9b41656591cd`  
Benin| Mobile Money| Instant| Instant| `momo`| `1997a129-32f1-4aa7-8f2a-edaf3a0bb0a5`  
Ivory Coast| Mobile Money| Instant| Instant| `momo`| `33a82864-6460-43d7-9fc0-911f9bd8d50a`
