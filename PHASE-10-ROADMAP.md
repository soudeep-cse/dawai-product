# 📋 Phase 10: Map Integration & Enhancements

**Status:** Planned for future  
**Priority:** Medium  
**Complexity:** Medium (2-3 hours)  
**Date Planned:** After Phase 9 completion + initial feedback

---

## 🗺️ **Map Integration Feature**

### Overview
Add Google Maps integration to allow customers to select delivery addresses visually on a map instead of (or in addition to) manual entry.

### User Flow
```
Customer Checkout
    ↓
Address Selection
    ↓
Two Options:
    A) Manual Entry (current)
    B) Map Selection (new)
       ├── Click "My Location" button
       ├── Browser requests geolocation
       ├── Map opens centered on user location
       ├── User clicks on map or drags marker
       ├── Address auto-filled from coordinates
       └── User confirms address
    ↓
Address Saved with Coordinates
```

### Features
- ✅ Google Maps API integration
- ✅ Geolocation permission request
- ✅ Interactive map with marker
- ✅ Drag marker to select address
- ✅ Reverse geocoding (coordinates → address)
- ✅ Address auto-fill from map click
- ✅ Delivery zone validation (check if within service area)
- ✅ Multiple address save with map preview

### Benefits
- Better UX for customers
- Accurate location data
- Fewer delivery errors
- Validation against service zones
- Analytics on customer locations

---

## 🛠️ **Implementation Plan**

### 1. Setup Google Maps API
```bash
# Get API key from:
# https://console.cloud.google.com/
# Enable:
# - Maps JavaScript API
# - Geocoding API
# - Places API (optional for autocomplete)

# Add to .env:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy..."
```

### 2. Install Dependencies
```bash
npm install @react-google-maps/api
npm install -S @types/google.maps
```

### 3. Create Map Component
```typescript
// components/AddressMap.tsx
- MapContainer with Google Maps
- Marker for selected location
- Geolocation button
- Drag-to-select functionality
- Address display from coordinates
```

### 4. Integrate with Address Form
```typescript
// Update: app/account/page.tsx
// Add Map component to address selection
// Toggle between manual/map modes
// Save coordinates along with address
```

### 5. Backend Updates
```typescript
// Update: prisma/schema.prisma
// Add: latitude, longitude to Address model

// Update: app/api/customers/addresses/route.ts
// Store coordinates
// Validate zone coverage
// Calculate delivery fee based on distance
```

### 6. Delivery Zone Validation
```typescript
// Check if selected location is within service zones:
// Gazipur → Mymensingh corridor
// Show message if outside service area
```

---

## 📊 **Effort Estimate**

| Task | Time |
|------|------|
| API Setup | 15 min |
| Component Development | 60 min |
| Integration | 30 min |
| Testing | 20 min |
| Documentation | 15 min |
| **Total** | **~2.5 hours** |

---

## 🎯 **Success Criteria**

- [ ] Google Maps loads correctly
- [ ] Geolocation works on device
- [ ] Marker can be dragged
- [ ] Address auto-fills from coordinates
- [ ] Coordinates saved to database
- [ ] Service zone validation works
- [ ] Mobile responsive
- [ ] Works offline gracefully
- [ ] Error handling for permission denied
- [ ] Location coordinates stored in DB

---

## 🔗 **Dependencies**

```json
{
  "@react-google-maps/api": "^2.20.0",
  "@types/google.maps": "^3.55.0"
}
```

---

## 📝 **Notes**

- Google Maps API has pricing after free tier (check billing)
- Geolocation requires HTTPS in production
- User permission required for location access
- Fallback to manual entry if geolocation denied
- Consider caching address lookups
- Add address history for quick re-selection

---

## 🚀 **When to Implement**

After:
1. ✅ Phase 1-9 complete (DONE)
2. ✅ Local testing verified
3. ✅ VPS deployment successful
4. ✅ Initial user feedback collected
5. ✅ Basic features stable

---

## 💡 **Alternative Options**

1. **Mapbox** - More features, moderate cost
2. **OpenStreetMap** - Free but less accurate
3. **Geolocation Only** - Just get user location, no map
4. **Autocomplete** - Google Places autocomplete for address

---

## 📞 **Integration Notes**

- Coordinates (lat, lng) need to be stored
- Delivery zone calculation based on distance
- Dynamic delivery fee calculation
- Map preview in order confirmation
- Delivery partner navigation integration

---

**Created:** 2026-09-22  
**Status:** Planned  
**Ready to implement:** After Phase 9 completion

---

**Decision:** Keep current manual address system for now. Add map integration as Phase 10 enhancement after live deployment and user feedback.
