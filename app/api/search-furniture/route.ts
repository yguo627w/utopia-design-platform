import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image_url } = await request.json()
    
    if (!image_url) {
      return NextResponse.json({
        success: false,
        error: "缺少图片URL参数"
      })
    }

    console.log("[Search Furniture] Searching furniture for image:", image_url)

    // 调用外部家具查询接口
    const searchUrl = `http://competitor-cy.bcc-szth.baidu.com:80/search_furniture?image_url=${encodeURIComponent(image_url)}`
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error("[Search Furniture] External API error:", response.status, response.statusText)
      return NextResponse.json({
        success: false,
        error: `家具查询接口调用失败: ${response.status}`
      })
    }

    const result = await response.json()
    console.log("[Search Furniture] External API result:", result)

    // 检查API是否返回错误
    if (result.code && result.code !== 'success') {
      console.log("[Search Furniture] API returned error:", result.message)
      return NextResponse.json({
        success: false,
        error: result.message || "家具查询失败",
        fullResponse: result
      })
    }

    // 处理成功响应
    if (result.results && result.results.length > 0) {
      // 从results中提取type（取第一个结果的type作为主要分类）
      const mainType = result.results[0].type || "未知分类"
      
      return NextResponse.json({
        success: true,
        data: {
          type: mainType,
          results: result.results
        },
        fullResponse: result
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "未找到匹配的家具",
        fullResponse: result
      })
    }

  } catch (error) {
    console.error("[Search Furniture] Error:", error)
    return NextResponse.json({
      success: false,
      error: "家具查询服务异常"
    })
  }
}
