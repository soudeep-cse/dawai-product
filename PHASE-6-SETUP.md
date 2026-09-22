# 🚀 Phase 6: AI Prescription Setup Guide

## Quick Start

### 1. Get OpenAI API Key

1. **Sign up for OpenAI** at https://platform.openai.com/signup
2. **Go to API Keys** section: https://platform.openai.com/api-keys
3. **Create new secret key** and copy it
4. **Add to your `.env` file:**

```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2. Test the Setup

```bash
# Start your development server
npm run dev

# Visit the prescription upload page
# http://localhost:3000/prescriptions
```

### 3. Upload a Prescription

1. Navigate to `/prescriptions`
2. Enter a phone number (e.g., 01712345678)
3. Upload a prescription image (JPEG, PNG, GIF, or WebP)
4. Click "Upload Prescription"
5. AI will analyze the image in the background
6. Visit `/admin/prescriptions` to review

---

## 🏥 Testing with Sample Prescriptions

### Option 1: Use a Real Prescription
Take a photo of an actual prescription and upload it.

### Option 2: Create a Test Prescription
```
You can use:
- A screenshot of a prescription PDF
- A handwritten prescription photo
- A printed prescription image
- Any image with medicine names and dosages
```

### Option 3: Use Sample Image
Create a simple image with text like:
```
Date: 2026-09-22
Patient: John Doe

Paracetamol 500mg - 2 tablets twice daily - 7 days
Amoxicillin 250mg - 1 capsule three times daily - 7 days

Dr. Ahmed Hassan
Central Health Clinic
```

---

## 🔍 Admin Review Workflow

### Step 1: Upload (Customer)
Customer uploads prescription image at `/prescriptions`

### Step 2: AI Analysis (Automatic)
- System receives image
- OpenAI GPT-4 Vision analyzes it
- Extracts medicines, dosages, doctor info
- Creates prescription items
- Status changes to PENDING_REVIEW

### Step 3: Pharmacist Review (Admin)
1. Go to `/admin/prescriptions`
2. Select status tab "Pending Review"
3. Click a prescription to review
4. Check AI-extracted medicines
5. Verify or correct information
6. Add pharmacist notes (optional)
7. Click "Review" button
8. Select status (Approve/Reject/Clarification)
9. Submit

### Step 4: Customer Notification (Phase 7)
- Customer sees prescription status
- Can proceed to checkout if approved
- Receives clarification request if needed

---

## 📊 What AI Extracts

The AI analyzer extracts:

### Per Medicine
- ✅ Medicine name
- ✅ Dosage (e.g., 500mg, 2ml)
- ✅ Frequency (e.g., twice daily, 3x daily)
- ✅ Duration (e.g., 7 days, 1 month)
- ✅ Special instructions (with food, before bed, etc.)

### Per Prescription
- ✅ Doctor's name
- ✅ Clinic/hospital name
- ✅ Prescription date
- ✅ Special notes or allergies
- ✅ Confidence score for each extraction

### Confidence Levels
- **95%+** = Very confident, auto-match possible
- **80-95%** = Confident, verify recommended
- **70-80%** = Possible, manual review needed
- **<70%** = Low confidence, manual entry required

---

## 🔐 Security Notes

### API Key Safety
```bash
# ❌ NEVER commit API key to git
# ✅ Always use .env files (ignored by git)
# ✅ Keep your key private
# ✅ Rotate keys periodically
```

### File Validation
- File type checked (images only)
- File size limited to 10MB
- Base64 encoding validated
- No malicious file upload possible

### Data Privacy
- Prescription images not stored permanently
- Base64 processed and discarded
- Only extracted data stored in DB
- Pharmacist review required

---

## 💰 OpenAI Costs

### Pricing (as of 2026)
- **GPT-4 Vision:** ~$0.01-0.03 per image
- **Average cost:** $0.02 per prescription

### Cost Estimation
- 100 prescriptions/month = ~$2
- 1000 prescriptions/month = ~$20
- 10,000 prescriptions/month = ~$200

### Budget Control
Set API usage limits in OpenAI dashboard:
1. Go to https://platform.openai.com/account/billing/limits
2. Set monthly budget limit
3. Get email alerts

---

## 🐛 Troubleshooting

### Issue: "Failed to analyze prescription"
**Solution:** 
- Check OPENAI_API_KEY is set correctly
- Verify API key has active quota
- Check image file is valid
- Try with a clearer image

### Issue: "Low confidence extractions"
**Solution:**
- Use clearer, well-lit prescription photos
- Ensure all text is legible
- Upload from straight angle (not tilted)
- Use good lighting (natural light preferred)

### Issue: "Medicine not matched"
**Solution:**
- Check medicine name is spelled correctly
- Verify medicine exists in database
- Admin can manually override in review

### Issue: API key not working
**Solution:**
```bash
# 1. Verify key is in .env file
cat .env | grep OPENAI_API_KEY

# 2. Check key format (starts with sk-)
# 3. Verify key has permissions (not restricted)
# 4. Check key hasn't reached usage limit
# 5. Try creating a new key

# 6. Restart dev server
npm run dev
```

---

## 📖 API Examples

### Upload Prescription (Customer)
```bash
curl -X POST http://localhost:3000/api/prescriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerPhone": "01712345678",
    "imageBase64": "iVBORw0KGgoAAAANS...",
    "mediaType": "image/jpeg"
  }'
```

### Get Prescriptions (Customer)
```bash
curl http://localhost:3000/api/prescriptions?customerPhone=01712345678
```

### Review Prescription (Admin)
```bash
curl -X PATCH http://localhost:3000/api/admin/prescriptions \
  -H "Content-Type: application/json" \
  -d '{
    "prescriptionId": "prescription-123",
    "status": "APPROVED",
    "pharmacistId": "admin-456",
    "notes": "Approved. No contraindications found",
    "items": [{
      "itemId": "item-123",
      "medicineId": "med-789",
      "dosage": "500mg",
      "frequency": "twice daily",
      "isVerified": true
    }]
  }'
```

---

## 📚 Resources

### OpenAI Documentation
- https://platform.openai.com/docs/api-reference
- https://platform.openai.com/docs/guides/vision

### Prescription Data
- Medicine database: `prisma/schema.prisma`
- Models: Prescription, PrescriptionItem, Medicine

### Phase 6 Files
- AI Service: `lib/aiAnalyzer.ts`
- Upload API: `app/api/prescriptions/route.ts`
- Admin API: `app/api/admin/prescriptions/route.ts`
- Customer Page: `app/prescriptions/page.tsx`
- Admin Page: `app/admin/prescriptions/page.tsx`

---

## ✅ Verification Checklist

- [ ] OpenAI API key added to `.env`
- [ ] Dev server running (`npm run dev`)
- [ ] Can access `/prescriptions` page
- [ ] Can access `/admin/prescriptions` page
- [ ] Can upload test image
- [ ] AI analysis completes (check console)
- [ ] Prescription appears in admin review
- [ ] Can approve/reject prescription
- [ ] Confidence scores are displayed

---

## 🎯 Next Steps

After Phase 6 setup:
1. **Phase 7:** Customer authentication with OTP
2. **Phase 8:** Admin dashboard with analytics
3. **Phase 9:** Testing and performance optimization

---

## 💬 Support

For issues:
1. Check `.env` file has `OPENAI_API_KEY`
2. Review console for error messages
3. Check OpenAI API status page
4. Try with a different prescription image
5. Contact Anthropic support if needed

---

**Last Updated:** 2026-09-22  
**Status:** Phase 6 ✅ Ready for use  
**Next Phase:** Phase 7 - Customer Authentication
