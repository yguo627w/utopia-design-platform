import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image_url, type = "furniture" } = await request.json()

    console.log("[API] Received detection request:", { image_url, type })

    if (!image_url) {
      console.error("[API] Missing required parameter: image_url")
      return NextResponse.json({ error: "Missing required parameter: image_url" }, { status: 400 })
    }

    try {
      // 根据type参数选择不同的prompt
      const prompt = type === "style" 
        ? `请分析我上传的家装照片，识别并总结关键风格元素。只需输出一句简短描述，包含整体风格、主色调、辅助色和点缀色。格式示例：【温馨复古风、主色调暖棕色家具，辅助米白色墙面，点缀墨绿色装饰】。`
        : `一、识别目标：请识别图片中的关键家具。
二、识别说明
1.优先返回大件家具（如：床、沙发、柜子、椅子、桌子）。
2.最后返回小件或装饰性物品（如：植物、小摆件）。
3.按照返回数量优先级，优先返回大件家具，后返回小装饰品，仅返回前4个家具信息。如没有大件家具可返回小装饰品。
4.可以返回的家具名称来源： ["床", "沙发", "柜子", "椅子", "桌子", "灯具", "装饰", "收纳", "其他"]
三、输出要求：
1.仅返回家具名称。如【床】【沙发】【柜子】【椅子】
2.无需返回思考信息`

      const requestBody = {
        prompt: prompt,
        image_url: image_url,
      }
      
      console.log("[API] Sending request to detection API:", requestBody)
      console.log("[API] Request type:", type)
      
      // 调用识别API - 使用URL查询参数格式
      const url = new URL("http://competitor-cy.bcc-szth.baidu.com:80//ai_search")
      url.searchParams.append('prompt', requestBody.prompt)
      url.searchParams.append('image_url', requestBody.image_url)
      
      console.log("[API] Final request URL:", url.toString())
      console.log("[API] Prompt length:", requestBody.prompt.length)
      console.log("[API] Image URL:", requestBody.image_url)
      
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[API] Furniture detection API error:", errorText)
        throw new Error(`Furniture detection API request failed with status ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("[API] Furniture detection API response:", result)

      // 解析返回的信息
      let furnitureNames: string[] = []
      let rawContent = ""
      
      // 处理choices数组格式的响应
      if (result.choices && result.choices.length > 0) {
        rawContent = result.choices[0].message?.content || ""
      } else if (result.content) {
        rawContent = result.content
      }
      
      console.log("[API] Raw content from API:", rawContent)
      
      if (type === "style") {
        // 风格理解模式：去掉【】符号后返回content内容
        const cleanedContent = rawContent.replace(/【|】/g, '')
        console.log("[API] Style detection result:", rawContent)
        console.log("[API] Cleaned content:", cleanedContent)
        
        return NextResponse.json({ 
          success: true,
          content: cleanedContent,
          fullResponse: result // 添加完整响应用于调试
        })
      } else {
        // 家具识别模式：解析家具名称
        if (rawContent) {
          // 解析content中的家具名称，格式如：【床】【沙发】【柜子】【椅子】
          const furnitureMatches = rawContent.match(/【([^】]+)】/g)
          if (furnitureMatches) {
            furnitureNames = furnitureMatches.map((match: string) => match.replace(/【|】/g, ''))
          }
        }

        console.log("[API] Parsed furniture names:", furnitureNames)
        
        return NextResponse.json({ 
          success: true,
          furnitureNames: furnitureNames,
          rawContent: rawContent,
          fullResponse: result // 添加完整响应用于调试
        })
      }
    } catch (apiError) {
      console.error("[API] Furniture detection error:", apiError)
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