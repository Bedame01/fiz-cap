import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt, style, color, material, displayMode, modelType } = await request.json()

    // Build a detailed prompt for cap image generation
    const fullPrompt = buildCapPrompt({ prompt, style, color, material, displayMode, modelType })

    // Use Pollinations AI - free image generation API (no API key required)
    // Documentation: https://pollinations.ai
    const encodedPrompt = encodeURIComponent(fullPrompt)
    const seed = Math.floor(Math.random() * 1000000)

    // Pollinations AI endpoint with parameters
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`

    // Verify the image is accessible by making a HEAD request
    try {
      const checkResponse = await fetch(imageUrl, { method: "HEAD" })
      if (checkResponse.ok) {
        return NextResponse.json({
          success: true,
          imageUrl,
          isPlaceholder: false,
          prompt: fullPrompt,
          message: "Image generated successfully with Pollinations AI",
        })
      }
    } catch {
      // If HEAD request fails, still return the URL as Pollinations generates on-demand
    }

    // Return the Pollinations URL - it generates images on-demand
    return NextResponse.json({
      success: true,
      imageUrl,
      isPlaceholder: false,
      prompt: fullPrompt,
      message: "Image generated with Pollinations AI (free tier)",
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({
      success: false,
      imageUrl: `/placeholder.svg?height=1024&width=1024&query=stylish cap product photo`,
      isPlaceholder: true,
      message: "Image generation failed. Using placeholder.",
    })
  }
}

function buildCapPrompt({
  prompt,
  style,
  color,
  material,
  displayMode,
  modelType,
}: {
  prompt?: string
  style?: string
  color?: string
  material?: string
  displayMode?: "product" | "model" | "lifestyle"
  modelType?: "male" | "female" | "neutral"
}) {
  const styleText = style?.replace("-", " ") || "cap"
  const colorText = color?.toLowerCase() || ""
  const materialText = material?.toLowerCase() || ""

  let basePrompt = ""

  switch (displayMode) {
    case "model":
      // Generate image with a model wearing the cap
      const modelDescription =
        modelType === "female"
          ? "young stylish woman"
          : modelType === "male"
            ? "young stylish man"
            : "young stylish person"
      basePrompt = `Professional fashion photography of a ${modelDescription} wearing a ${colorText} ${materialText} ${styleText} hat, urban street style, confident pose, soft natural lighting, shallow depth of field, fashion editorial style, high-end fashion magazine quality`
      break

    case "lifestyle":
      // Generate lifestyle/context image
      basePrompt = `Lifestyle photography featuring a ${colorText} ${materialText} ${styleText} hat in an urban outdoor setting, aesthetic composition, natural daylight, trendy street fashion context, Instagram-worthy shot, professional quality`
      break

    case "product":
    default:
      // Clean product shot
      basePrompt = `Professional e-commerce product photography of a ${colorText} ${materialText} ${styleText} hat, clean white background, studio lighting, high detail, crisp focus on texture and stitching, commercial product shot, 45-degree angle view`
      break
  }

  // Add custom details if provided
  if (prompt) {
    basePrompt += `, ${prompt}`
  }

  // Add quality enhancers
  basePrompt += ", 8k resolution, photorealistic, detailed"

  return basePrompt
}
