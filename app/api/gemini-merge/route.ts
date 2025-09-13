import { NextRequest, NextResponse } from 'next/server'

// 家具分类名称到英文的映射
const furnitureTypeMapping: { [key: string]: string } = {
  "床": "bed",
  "沙发": "sofa", 
  "柜子": "cabinet",
  "椅子": "chair",
  "桌子": "table",
  "茶几": "coffee table",
  "灯具": "lamp",
  "装饰": "decoration",
  "收纳": "storage",
  "其他": "furniture",
  "衣柜": "wardrobe",
  "书桌": "desk",
  "餐桌": "dining table",
  "床头柜": "nightstand",
  "电视柜": "TV stand",
  "鞋柜": "shoe cabinet",
  "书架": "bookshelf",
  "梳妆台": "dressing table",
  "酒柜": "wine cabinet",
  "储物柜": "storage cabinet"
}

// 生成合并图片的prompt
function generateMergePrompt(furnitureType: string): string {
  const englishFurnitureType = furnitureTypeMapping[furnitureType] || "furniture"
  
  return `Replace the ${englishFurnitureType} in the indoor scene image with the ${englishFurnitureType} in the furniture image while keeping the image size ratio unchanged. Keep the original indoor background unchanged. Ensure that the proportion of ${englishFurnitureType} in the room is appropriate, aligned with the original position of ${englishFurnitureType}, and seamlessly integrated into the scene through the correct perspective, lighting, and shadows.`
}

export async function POST(request: NextRequest) {
  try {
    const { image1_url, image2_url, furniture_type } = await request.json()

    console.log("[Gemini API] Received request:", { 
      image1_url: image1_url ? "image1 provided" : "no image1",
      image2_url: image2_url ? "image2 provided" : "no image2",
      furniture_type: furniture_type || "no furniture_type"
    })

    if (!image1_url || !image2_url || !furniture_type) {
      console.error("[Gemini API] Missing required parameters:", { 
        image1_url: !!image1_url, 
        image2_url: !!image2_url, 
        furniture_type: !!furniture_type 
      })
      return NextResponse.json({ 
        error: "Missing required parameters: image1_url, image2_url, and furniture_type" 
      }, { status: 400 })
    }

    // 生成prompt
    const prompt = generateMergePrompt(furniture_type)
    console.log("[Gemini API] Generated prompt:", prompt)

    console.log("[Gemini API] Sending request to Gemini API with:", {
      image1_url,
      image2_url,
      furniture_type,
      prompt
    })

    const response = await fetch("http://competitor-cy.bcc-szth.baidu.com:80/gemini/multi-image-merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image1_url,
        image2_url,
        prompt
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Gemini API] Gemini API error:", errorText)
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log("[Gemini API] Gemini API response:", result)

    // 根据Gemini接口的响应格式解析结果
    let imageUrl = result.url || result.image_url || result.data?.url || result.data?.image_url

    if (imageUrl) {
      console.log("[Gemini API] Successfully generated merged image:", imageUrl)
      return NextResponse.json({ 
        success: true,
        imageUrl,
        message: "图片合并成功"
      })
    } else {
      console.error("[Gemini API] Invalid Gemini API response format:", result)
      throw new Error("Invalid Gemini API response format")
    }

  } catch (error) {
    console.error("[Gemini API] Error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      },
      { status: 500 },
    )
  }
}

