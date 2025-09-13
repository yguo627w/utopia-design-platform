import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image_url } = await request.json()

    console.log("[场景分析API] 接收到请求:", { image_url })

    if (!image_url) {
      console.error("[场景分析API] 缺少必需参数: image_url")
      return NextResponse.json({ error: "缺少必需参数: image_url" }, { status: 400 })
    }

    try {
      // 场景分析的prompt
      const prompt = `角色设定： 你是一名专业的室内设计顾问，擅长发现家装设计中的问题，并提供实用、美观、经济的改进建议。 任务要求： 分析输入的居家场景。 识别当前家装布局与配色中的缺陷（包括空间利用、动线、灯光、家具比例、色彩搭配、风格统一性等方面）。 给出简单的可执行的优化建议，既要考虑美学，也要兼顾实用性和预算可行性。 输出格式： 当前问题总结：简洁一句话说明。 改进建议：一句话概括提升居家氛围的核心思路。 整体字数在100字以内。`

      console.log("[场景分析API] 发送请求到场景分析API:", { prompt, image_url })
      
      // 调用场景分析API - 使用GET请求和URL查询参数格式
      const url = new URL("http://competitor-cy.bcc-szth.baidu.com:80/home_analysis")
      url.searchParams.append('prompt', prompt)
      url.searchParams.append('image_url', image_url)
      
      console.log("[场景分析API] 最终请求URL:", url.toString())
      
      // 使用AbortController实现超时
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
      
      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[场景分析API] 场景分析API错误:", response.status, errorText)
        
        // 返回详细的错误信息给前端
        return NextResponse.json({
          success: false,
          error: `外部API服务错误: ${response.status}`,
          details: errorText,
          status: response.status
        }, { status: response.status })
      }

      const result = await response.json()
      console.log("[场景分析API] 场景分析API响应:", result)

      // 检查API是否返回错误
      if (result.code && result.code !== 'success') {
        console.log("[场景分析API] API返回错误:", result.message)
        return NextResponse.json({ 
          success: false,
          error: result.message || "API调用失败",
          fullResponse: result
        })
      }

      // 解析返回的信息
      let content = ""
      
      // 处理choices数组格式的响应
      if (result.choices && result.choices.length > 0) {
        content = result.choices[0].message?.content || ""
      } else if (result.content) {
        content = result.content
      }
      
      console.log("[场景分析API] 从API获取的原始内容:", content)
      
      return NextResponse.json({ 
        success: true,
        content: content,
        fullResponse: result // 添加完整响应用于调试
      })

    } catch (apiError) {
      console.error("[场景分析API] 场景分析错误:", apiError)
      throw apiError
    }
  } catch (error) {
    console.error("[场景分析API] 错误:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
