# AI Product Image Generation

CAPHAUS includes a powerful AI image generation feature that allows admins to create professional product images without needing photography equipment or expensive photo shoots.

## Features

### Completely Free
- Uses **Pollinations AI** - a free, open-source AI image generation service
- **No API key required** - works out of the box
- No usage limits or credits to manage
- High-quality 1024x1024 images

### Three Display Modes

#### 1. Product Shot
Clean, professional e-commerce style photography:
- White background studio lighting
- Perfect for product listings
- Shows cap details and texture clearly
- 45-degree angle view

#### 2. Model Wearing
Generate images of models wearing the cap:
- Choose model type: Male, Female, or Neutral
- Urban street style photography
- Fashion editorial quality
- Great for lifestyle marketing

#### 3. Lifestyle Shot
Contextual images in real-world settings:
- Outdoor/urban environments
- Aesthetic Instagram-worthy compositions
- Natural lighting
- Perfect for social media marketing

### Customization Options

| Option | Description |
|--------|-------------|
| **Style** | Snapback, Fitted, Dad Hat, Trucker, Beanie, Bucket, Visor |
| **Color** | 12 color options including Black, White, Navy, Camo, etc. |
| **Material** | Cotton, Polyester, Wool, Leather, Denim, and more |
| **Custom Details** | Add any additional details like "embroidered logo", "vintage wash", etc. |

### Batch Generation
- Generate **1 image** for quick results
- Generate **4 variations** to choose the best option
- Select and use individual images or use all at once

## How to Use

1. Navigate to **Admin > Products > Add New Product**
2. In the Images section, click **"Generate with AI"**
3. Select your preferred **Display Mode**:
   - Product Shot (clean e-commerce)
   - Model Wearing (with virtual model)
   - Lifestyle (contextual setting)
4. If using "Model Wearing", select the **Model Type**
5. Choose **Style**, **Color**, and **Material**
6. Optionally add **Custom Details** for more specific results
7. Click **"Generate 1 Image"** or **"Generate 4 Variations"**
8. Select your preferred image(s)
9. Click **"Use Selected"** or **"Use All Images"**

## Technical Details

### API Endpoint
\`\`\`
POST /api/generate-cap-image
\`\`\`

### Request Body
\`\`\`json
{
  "prompt": "optional custom details",
  "style": "snapback",
  "color": "Black",
  "material": "Cotton",
  "displayMode": "product" | "model" | "lifestyle",
  "modelType": "male" | "female" | "neutral"
}
\`\`\`

### Response
\`\`\`json
{
  "success": true,
  "imageUrl": "https://image.pollinations.ai/prompt/...",
  "isPlaceholder": false,
  "prompt": "Generated prompt text",
  "message": "Image generated successfully"
}
\`\`\`

### Pollinations AI Parameters
- **width**: 1024px
- **height**: 1024px
- **seed**: Random for variation
- **nologo**: true (removes watermark)
- **enhance**: true (improves quality)

## Best Practices

### For Product Shots
- Use specific colors and materials
- Keep custom details minimal
- Best for catalog/listing images

### For Model Images
- Select appropriate model type for your brand
- Add details like "confident pose" or "urban background"
- Great for hero images and banners

### For Lifestyle Shots
- Add context like "outdoor", "street", "cafe"
- Use for social media and marketing
- Combine with seasonal themes ("summer vibes", "winter style")

## Prompt Engineering Tips

The AI responds well to specific descriptive terms:

**Good Examples:**
- "vintage distressed wash, worn-in look"
- "embroidered floral pattern on front"
- "neon lighting, cyberpunk aesthetic"
- "golden hour lighting, beach setting"

**Quality Enhancers (automatically added):**
- "8k resolution"
- "photorealistic"
- "detailed"

## Troubleshooting

### Images Not Loading
- Pollinations generates images on-demand
- First load may take 5-15 seconds
- Refresh if image doesn't appear after 30 seconds

### Quality Issues
- Be more specific in your prompts
- Try generating multiple variations
- Use the "enhance" feature (enabled by default)

### Rate Limiting
- Pollinations is free but may have temporary rate limits
- Wait a few seconds between batch generations
- Try again if generation fails

## Future Enhancements

Planned features for future releases:
- Image editing/refinement
- Background removal
- Multiple angle generation
- Brand logo overlay
- Batch processing for product catalogs
