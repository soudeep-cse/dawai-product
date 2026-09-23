# 📱 OTP SMS Setup Guide

The Dawai platform supports **4 SMS providers** for sending OTP codes during login. Choose the one that works best for your region.

---

## 🔧 Available Providers

### 1. **Twilio** (International - Recommended for reliability)
Best for: Global coverage, reliable, good documentation

#### Setup:
1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign up or login
3. Get your **Account SID** and **Auth Token**
4. Buy a phone number (for sending SMS)

#### Environment Variables:
```env
SMS_PROVIDER="twilio"
SMS_API_KEY="AccountSID:AuthToken"
SMS_SENDER_ID="+1234567890"  # Your Twilio phone number
```

#### Example:
```env
SMS_API_KEY="AC1234567890abcdef1234567890abcd:auth_token_here"
SMS_SENDER_ID="+14155552671"
```

#### Cost: $0.0075-0.015 per SMS

---

### 2. **bKash** (Bangladesh - Lowest cost)
Best for: Bangladesh operations, lowest cost

#### Setup:
1. Contact bKash Business: https://business.bkash.com/
2. Request SMS API access
3. Get your **API Key** and **API Secret**

#### Environment Variables:
```env
SMS_PROVIDER="bkash"
SMS_API_KEY="your-bkash-api-key"
SMS_SENDER_ID="DAWAI"  # Your sender name (max 11 chars)
```

#### Cost: ৳0.30-1 per SMS (very cheap!)

---

### 3. **Nexmo/Vonage** (International alternative)
Best for: Good rates, reliable

#### Setup:
1. Go to [Vonage Dashboard](https://dashboard.vonage.com)
2. Sign up and verify
3. Get your **API Key** and **API Secret**

#### Environment Variables:
```env
SMS_PROVIDER="nexmo"
SMS_API_KEY="your-nexmo-api-key"
SMS_API_SECRET="your-nexmo-api-secret"
SMS_SENDER_ID="DAWAI"
```

#### Cost: Varies by country (~$0.05-0.10 per SMS)

---

### 4. **Mock/Development Mode** (Testing only)
Best for: Local development, testing

When `SMS_PROVIDER="mock"`, OTP codes are **logged to console** instead of being sent.

#### Environment:
```env
SMS_PROVIDER="mock"
SMS_API_KEY="mock-key"
SMS_SENDER_ID="DAWAI"
```

#### Usage:
- Check server logs or console to see generated OTP
- Great for development and testing
- Do NOT use in production!

---

## 🚀 Quick Start

### For Development (Testing locally)

```env
SMS_PROVIDER="mock"
SMS_API_KEY="mock-key"
SMS_SENDER_ID="DAWAI"
```

**Test it:**
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"01712345678"}'
```

Check console output for OTP code, then:
```bash
curl -X POST http://localhost:3000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"01712345678","otp":"123456"}'
```

### For Production

1. **Choose a provider** (recommended: Twilio or bKash for Bangladesh)
2. **Get API credentials**
3. **Update `.env.local` on your VPS:**
   ```bash
   ssh ubuntu@your-vps-ip
   cd /opt/dawai-website
   nano .env.local
   # Update SMS_PROVIDER and SMS_API_KEY
   docker compose -f docker-compose.vps.yml restart app
   ```
4. **Test with real phone:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/otp/send \
     -H "Content-Type: application/json" \
     -d '{"phone":"your-phone-number"}'
   ```

---

## 🧪 Test OTP API

### Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"01712345678"
  }'
```

**Response (success):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "01712345678",
    "expiresIn": 600
  }
}
```

### Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"01712345678",
    "otp":"123456"
  }'
```

**Response (success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "customerId": "...",
    "phone": "01712345678",
    "name": null
  }
}
```

---

## 📊 Recommended Provider Comparison

| Provider | Cost | Setup Time | Region | Reliability |
|----------|------|-----------|--------|------------|
| **Twilio** | $0.01/SMS | 5 min | Global | ⭐⭐⭐⭐⭐ |
| **bKash** | ৳0.30/SMS | 1-2 days | Bangladesh | ⭐⭐⭐⭐ |
| **Nexmo** | ~$0.05/SMS | 10 min | Global | ⭐⭐⭐⭐ |
| **Mock** | Free | 0 min | Local only | ⭐⭐⭐ |

---

## 🇧🇩 Recommendation for Bangladesh

**Use bKash SMS** if available:
- Cheapest option (৳0.30-1 per SMS)
- Fast local delivery
- Supports Bangladesh mobile networks

**Fallback to Twilio** if bKash isn't available:
- Reliable global service
- Easy setup
- Good customer support

---

## ⚠️ Common Issues

### OTP not sending
1. Check `.env` has correct `SMS_PROVIDER` and `SMS_API_KEY`
2. Verify provider credentials are correct
3. Check API key has permission to send SMS
4. Check phone number format is correct (01xxxxxxxxx for BD)

### OTP verification fails
1. Check OTP matches exactly (case-sensitive)
2. Check OTP hasn't expired (10 minutes)
3. Make sure phone number is the same for send and verify

### Wrong phone format
- **Accept:** `01712345678` (Bangladesh format)
- **Convert from:** `+880171234567` (international) → remove +880, add 0

---

## 🔒 Security Notes

- OTP codes are hashed (SHA-256) before storage
- OTP expires after 10 minutes
- Codes are 6 random digits (100,000 - 999,999)
- One OTP per phone at a time
- Phone numbers must pass validation (01xx xxx xxxxx)

---

## 📞 Support

For SMS provider-specific help:
- **Twilio:** https://support.twilio.com/
- **bKash:** https://business.bkash.com/support
- **Nexmo:** https://developer.vonage.com/en/

For Dawai platform issues, check the console logs:
```bash
# On VPS
docker compose -f docker-compose.vps.yml logs -f app | grep -i sms
```
