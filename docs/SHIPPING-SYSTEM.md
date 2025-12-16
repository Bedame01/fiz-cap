# Dynamic Shipping System Documentation

## Overview

Fiz Cap uses a state-based dynamic shipping calculation system for Nigeria. Shipping costs are calculated in real-time based on the customer's state, cart weight, and order value.

## Features

### 1. Zone-Based Pricing
Nigeria is divided into 7 shipping zones with different rates:

- **Lagos Metro**: ₦2,000 base + ₦300/kg (1-2 days)
- **Southwest**: ₦2,500 base + ₦400/kg (2-3 days)
- **South-South**: ₦3,000 base + ₦500/kg (3-4 days)
- **Southeast**: ₦3,000 base + ₦500/kg (3-4 days)
- **North Central**: ₦3,500 base + ₦600/kg (4-5 days)
- **Northwest**: ₦4,000 base + ₦700/kg (5-6 days)
- **Northeast**: ₦4,000 base + ₦700/kg (5-6 days)

### 2. Weight-Based Calculation
- Each cap is estimated at 0.2kg
- Final shipping = Base rate + (Per kg rate × Total weight)
- Example: 5 caps to Lagos = ₦2,000 + (₦300 × 1kg) = ₦2,300

### 3. Free Shipping
- Orders over ₦50,000 qualify for free shipping
- Threshold configurable in admin settings

### 4. Real-Time Calculation
- Shipping cost updates automatically when customer selects their state
- Shows estimated delivery time
- Displays shipping zone name

## Technical Implementation

### Database Schema

**Table: `shipping_zones`**
\`\`\`sql
- id: uuid (Primary Key)
- zone_name: text (e.g., "Lagos Metro")
- states: text[] (Array of state names)
- base_rate: numeric (Base shipping cost)
- per_kg_rate: numeric (Cost per kilogram)
- estimated_days: text (Delivery estimate)
\`\`\`

### API Endpoint

**POST /api/shipping/calculate**

Request:
\`\`\`json
{
  "state": "Lagos",
  "subtotal": 25000,
  "itemCount": 3
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "shipping": {
    "cost": 2180,
    "zone_name": "Lagos Metro",
    "estimated_days": "1-2 business days",
    "is_free": false
  }
}
\`\`\`

### Cart Context Integration

The cart now includes:
- **Availability checking**: Prevents adding more items than available
- **Availability warnings**: Shows alert when quantity is limited
- **Return value from addItem**: Returns info about items added vs requested

### Checkout Flow

1. Customer enters shipping address
2. Selects state from dropdown (populated from shipping zones)
3. Shipping cost calculates automatically
4. Shows zone name and delivery estimate
5. Total updates with shipping included
6. Payment processes with final amount

## Admin Management

### Managing Shipping Zones

Admins can update shipping rates in the database:

\`\`\`sql
UPDATE shipping_zones
SET base_rate = 2500, per_kg_rate = 400
WHERE zone_name = 'Lagos Metro';
\`\`\`

### Setting Free Shipping Threshold

\`\`\`sql
UPDATE store_settings
SET free_shipping_threshold = 60000;
\`\`\`

## Customer Experience

### Cart Page
- Shows "Calculated at checkout" for shipping
- Displays note about free shipping threshold
- Shows availability warnings if stock is limited

### Checkout Page
- State dropdown with all Nigerian states
- Real-time shipping calculation on state selection
- Visual shipping info card showing:
  - Zone name
  - Shipping cost
  - Estimated delivery time
- Pay button disabled until state is selected

### Availability Warnings
When customers try to add more items than available:
- Red alert appears in cart drawer and cart page
- Shows exact number of items added
- Auto-dismisses after 5 seconds
- Prevents checkout with unavailable items

## Best Practices

1. **Regular Rate Updates**: Review and update shipping rates quarterly
2. **Weight Accuracy**: Update average cap weight if product mix changes
3. **Zone Optimization**: Monitor delivery times and adjust zones as needed
4. **Free Shipping Strategy**: Adjust threshold based on average order value
5. **Stock Management**: Keep inventory quantities accurate to prevent overselling

## Troubleshooting

### Shipping Not Calculating
- Check if state is in shipping_zones table
- Verify customer selected a state
- Check browser console for API errors

### Wrong Shipping Cost
- Verify zone rates in database
- Check average cap weight constant
- Ensure free shipping threshold is correct

### State Not in Dropdown
- Run SQL script to populate shipping zones
- Check if states array is properly formatted
- Verify API is fetching zones correctly
