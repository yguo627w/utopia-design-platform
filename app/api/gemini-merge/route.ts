import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image1_url, image2_url, prompt } = await request.json()

    console.log("[Gemini API] Received request:", { 
      image1_url: image1_url ? "image1 provided" : "no image1",
      image2_url: image2_url ? "image2 provided" : "no image2",
      prompt: prompt ? prompt.substring(0, 50) + "..." : "no prompt"
    })

    if (!image1_url || !image2_url || !prompt) {
      console.error("[Gemini API] Missing required parameters:", { 
        image1_url: !!image1_url, 
        image2_url: !!image2_url, 
        prompt: !!prompt 
      })
      return NextResponse.json({ 
        error: "Missing required parameters: image1_url, image2_url, and prompt" 
      }, { status: 400 })
    }

    console.log("[Gemini API] Sending request to Gemini API with:", {
      image1_url,
      image2_url,
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

