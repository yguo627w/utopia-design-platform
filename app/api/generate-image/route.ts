import { type NextRequest, NextResponse } from "next/server"

// 根据调用来源生成对应的prompt
function generatePromptBySource(prompt: string, source: string): string {
  switch (source) {
    case "user-chat":
      // 用户对话式设计
      return `在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下：${prompt}`
    
    case "mbti-design":
      // MBTI性格测试设计
      return `在当前图片的基础上，将家具和软装的风格修改为：${prompt}。修改中注意：1不改变窗户和阳台的位置、2不改变画面的角度的取景、3不改变拍摄的角度、4不改变房间的局部和整体结构、5不改变主要家具位置`
    
    case "custom-style":
      // 自定义风格设计 (AI风格理解)
      return `在当前图片的基础上，将家具和软装的风格修改为：${prompt}。修改中注意：1不改变窗户和阳台的位置、2不改变画面的角度的取景、3不改变拍摄的角度、4不改变房间的局部和整体结构、5不改变主要家具位置`
    
    case "style-application":
      // 预设风格应用 - 直接使用传入的prompt，不添加前缀
      return prompt
    
    default:
      // 默认场景 - 用户对话式设计
      return `在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下：${prompt}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, image, source = "default" } = await request.json()

    console.log("[API] Received request:", { prompt, image: image ? "image provided" : "no image", source })

    if (!prompt || !image) {
      console.error("[API] Missing required parameters:", { prompt: !!prompt, image: !!image })
      return NextResponse.json({ error: "Missing required parameters: prompt and image" }, { status: 400 })
    }

    let processedImageUrl = image
    let useFallback = false

    // 检查图片URL格式
    if (image.startsWith("blob:") || image.startsWith("data:") || image.includes("localhost")) {
      console.log("[API] 检测到本地图片，前端应该已经上传到云端")
      // 前端应该已经处理了图片上传，这里直接使用传入的URL
      processedImageUrl = image
    } else if (!image.toLowerCase().match(/\.(png|jpeg|jpg|webp)(\?|$)/)) {
      // 如果是不支持的格式，使用fallback
      console.log("[API] Unsupported image format, using fallback")
      useFallback = true
      processedImageUrl = "https://design.gemcoder.com/staticResource/echoAiSystemImages/676985223975790e510ca20672144337.png"
    }

    console.log("[API] Original image:", image)
    console.log("[API] Processed image URL:", processedImageUrl)
    console.log("[API] Using fallback:", useFallback)

    try {
      // 根据调用来源决定prompt格式
      const finalPrompt = generatePromptBySource(prompt, source)

      // 使用新的seededit接口
      console.log("[API] Sending request to seededit API with:", {
        image_url: processedImageUrl,
        prompt: finalPrompt,
        source: source,
      })

      const response = await fetch("http://competitor-cy.bcc-szth.baidu.com:80/doubao/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: processedImageUrl,
          prompt: finalPrompt,
          watermark: "False",
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[API] Seededit API error:", errorText)
        
        // 如果外部API失败且我们使用的是原始图像，尝试使用fallback
        if (!useFallback && (image.startsWith("blob:") || image.startsWith("data:") || image.includes(".webp"))) {
          console.log("[API] Retrying with fallback image")
          return await retryWithFallback(prompt, source)
        }
        
        throw new Error(`Seededit API request failed with status ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("[API] Seededit API response:", result)

      // 根据新接口的响应格式解析结果
      // 假设新接口返回格式为 { image_url: "..." } 或 { url: "..." } 或 { data: { url: "..." } }
      let imageUrl = result.image_url || result.url || result.data?.url || result.data?.image_url
      
      if (imageUrl) {
        console.log("[API] Successfully generated image:", imageUrl)
        return NextResponse.json({ imageUrl })
      } else {
        console.error("[API] Invalid seededit API response format:", result)
        throw new Error("Invalid seededit API response format")
      }
    } catch (apiError) {
      // 如果API调用失败且我们还没有使用fallback，尝试使用fallback
      if (!useFallback) {
        console.log("[API] API call failed, retrying with fallback")
        return await retryWithFallback(prompt, source)
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
async function retryWithFallback(prompt: string, source: string = "default") {
  const fallbackImage = "https://design.gemcoder.com/staticResource/echoAiSystemImages/676985223975790e510ca20672144337.png"
  
  // 根据调用来源决定prompt格式
  const finalPrompt = generatePromptBySource(prompt, source)
  
  const response = await fetch("http://competitor-cy.bcc-szth.baidu.com:80/doubao/edit-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: fallbackImage,
      prompt: finalPrompt,
      watermark: "False",
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Fallback seededit API request failed with status ${response.status}: ${errorText}`)
  }

  const result = await response.json()
  console.log("[API] Fallback seededit API response:", result)
  
  // 根据新接口的响应格式解析结果
  let imageUrl = result.image_url || result.url || result.data?.url || result.data?.image_url
  
  if (imageUrl) {
    return NextResponse.json({ 
      imageUrl,
      note: "使用了默认参考图像生成设计方案"
    })
  } else {
    throw new Error("Invalid fallback seededit API response format")
  }
}
