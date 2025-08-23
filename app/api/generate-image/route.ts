import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, image } = await request.json()

    console.log("[API] Received request:", { prompt, image: image ? "image provided" : "no image" })

    if (!prompt || !image) {
      console.error("[API] Missing required parameters:", { prompt: !!prompt, image: !!image })
      return NextResponse.json({ error: "Missing required parameters: prompt and image" }, { status: 400 })
    }

    let processedImage = image
    let useFallback = false

    // 改进的图像格式处理逻辑
    if (image.startsWith("blob:") || image.startsWith("data:")) {
      // 对于blob URL和data URL，记录日志但继续处理
      console.log("[API] Received blob/data URL, attempting to process:", image.substring(0, 50) + "...")
      // 不立即使用fallback，让外部API尝试处理
    } else if (image.includes(".webp")) {
      // WebP格式现在也尝试处理，而不是直接拒绝
      console.log("[API] Received WebP image, attempting to process")
      // 不立即使用fallback
    } else if (!image.toLowerCase().match(/\.(png|jpeg|jpg|webp)(\?|$)/)) {
      // 如果是不支持的格式，使用fallback
      console.log("[API] Unsupported image format, using fallback")
      useFallback = true
      processedImage =
        "https://design.gemcoder.com/staticResource/echoAiSystemImages/676985223975790e510ca20672144337.png"
    }

    console.log("[API] Original image:", image)
    console.log("[API] Processed image:", processedImage)
    console.log("[API] Using fallback:", useFallback)

    // 从环境变量获取API密钥，如果没有设置则返回错误
    const apiKey = process.env.AI_IMAGE_GENERATION_API_KEY
    if (!apiKey) {
      console.error("[API] Missing API key in environment variables")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    try {
      console.log("[API] Sending request to external API with:", {
        model: "doubao-seededit-3-0-i2i-250628",
        prompt,
        image: processedImage.substring(0, 100) + (processedImage.length > 100 ? "..." : ""),
        response_format: "url",
        size: "adaptive",
        seed: 21,
        guidance_scale: 5.5,
        watermark: true,
      })

      const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "doubao-seededit-3-0-i2i-250628",
          prompt: "在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下：" + prompt,
          image: processedImage,
          response_format: "url",
          size: "adaptive",
          seed: 10,
          guidance_scale: 5.5,
          watermark: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[API] External API error:", errorText)
        
        // 如果外部API失败且我们使用的是原始图像，尝试使用fallback
        if (!useFallback && (image.startsWith("blob:") || image.startsWith("data:") || image.includes(".webp"))) {
          console.log("[API] Retrying with fallback image")
          return await retryWithFallback(prompt, apiKey)
        }
        
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("[API] External API response:", result)

      if (result.data && result.data[0] && result.data[0].url) {
        console.log("[API] Successfully generated image:", result.data[0].url)
        return NextResponse.json({ imageUrl: result.data[0].url })
      } else {
        console.error("[API] Invalid API response format:", result)
        throw new Error("Invalid API response format")
      }
    } catch (apiError) {
      // 如果API调用失败且我们还没有使用fallback，尝试使用fallback
      if (!useFallback) {
        console.log("[API] API call failed, retrying with fallback")
        return await retryWithFallback(prompt, apiKey)
      }
      throw apiError
    }
  } catch (error) {
    console.error("[API] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

// 使用fallback图像重试的函数
async function retryWithFallback(prompt: string, apiKey: string) {
  const fallbackImage = "https://design.gemcoder.com/staticResource/echoAiSystemImages/676985223975790e510ca20672144337.png"
  
  const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "doubao-seededit-3-0-i2i-250628",
      prompt: "在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下：" + prompt,
      image: fallbackImage,
      response_format: "url",
      size: "adaptive",
      seed: 10,
      guidance_scale: 5.5,
      watermark: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Fallback API request failed with status ${response.status}: ${errorText}`)
  }

  const result = await response.json()
  if (result.data && result.data[0] && result.data[0].url) {
    return NextResponse.json({ 
      imageUrl: result.data[0].url,
      note: "使用了默认参考图像生成设计方案"
    })
  } else {
    throw new Error("Invalid fallback API response format")
  }
}
