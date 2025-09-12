import { NextRequest, NextResponse } from 'next/server'

// 检查是否为豆包URL（包含长参数）
function isDoubaoUrl(url: string): boolean {
  return url.includes('X-Tos-Algorithm') || url.includes('X-Tos-Credential') || url.includes('X-Tos-Signature')
}

// URL缓存，避免重复处理
const urlCache = new Map<string, { url: string, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 流式下载并重新上传到云端（性能优化版本）
async function downloadAndReuploadImage(imageUrl: string): Promise<string> {
  try {
    console.log("[Search Furniture] 检测到豆包URL，开始流式处理:", imageUrl)
    
    // 检查缓存
    const cached = urlCache.get(imageUrl)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("[Search Furniture] 使用缓存URL:", cached.url)
      return cached.url
    }
    
    // 确保URL有协议前缀
    let fullImageUrl = imageUrl
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      if (imageUrl.startsWith('images/')) {
        fullImageUrl = `https://competitor-cy.bcc-szth.baidu.com:80/${imageUrl}`
      } else {
        fullImageUrl = `https://${imageUrl}`
      }
    }
    
    console.log("[Search Furniture] 完整图片URL:", fullImageUrl)
    
    // 流式下载图片
    let imageResponse
    try {
      imageResponse = await fetch(fullImageUrl)
    } catch (fetchError: any) {
      console.error("[Search Furniture] fetch错误详情:", fetchError)
      throw new Error(`下载图片失败: ${fetchError.message}`)
    }
    
    if (!imageResponse.ok) {
      throw new Error(`下载图片失败: ${imageResponse.status} ${imageResponse.statusText}`)
    }
    
    // 检查图片大小，如果太大则压缩
    const contentLength = imageResponse.headers.get('content-length')
    const fileSize = contentLength ? parseInt(contentLength) : 0
    const maxSize = 2 * 1024 * 1024 // 2MB
    
    console.log(`[Search Furniture] 图片大小: ${fileSize} bytes`)
    
    const fileName = `doubao-image-${Date.now()}.jpg`
    
    // 使用优化的传统方式（支持缓存和压缩）
    console.log("[Search Furniture] 使用优化上传模式")
    const imageBuffer = await imageResponse.arrayBuffer()
    
    // 对于大图片，尝试压缩
    let processedBuffer = imageBuffer
    if (fileSize > maxSize) {
      console.log("[Search Furniture] 图片较大，尝试压缩")
      // 这里可以添加图片压缩逻辑
      // 暂时使用原图，后续可以集成sharp等压缩库
      processedBuffer = imageBuffer
    }
    
    // 创建FormData重新上传
    const formData = new FormData()
    const blob = new Blob([processedBuffer], { type: 'image/jpeg' })
    formData.append('file', blob, fileName)
    
    // 上传到云端
    const uploadResponse = await fetch('http://competitor-cy.bcc-szth.baidu.com:80/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error(`重新上传失败: ${uploadResponse.status} - ${errorText}`)
    }
    
    const uploadResult = await uploadResponse.json()
    const newImageUrl = uploadResult.url || uploadResult.imageUrl || uploadResult.data?.url
    
    if (!newImageUrl) {
      throw new Error('重新上传后未获得有效URL')
    }
    
    // 缓存结果
    urlCache.set(imageUrl, { url: newImageUrl, timestamp: Date.now() })
    
    console.log("[Search Furniture] 流式处理完成，新URL:", newImageUrl)
    return newImageUrl
    
  } catch (error) {
    console.error("[Search Furniture] 流式处理失败:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  const requestStartTime = Date.now()
  
  try {
    const { image_url } = await request.json()
    
    if (!image_url) {
      return NextResponse.json({
        success: false,
        error: "缺少图片URL参数"
      })
    }

    console.log("[Search Furniture] Searching furniture for image:", image_url)

    let finalImageUrl = image_url
    
    // 检查是否为豆包URL，如果是则先下载并重新上传
    if (isDoubaoUrl(image_url)) {
      try {
        console.log("[Search Furniture] 开始处理豆包URL，预计耗时3-5秒...")
        const startTime = Date.now()
        
        finalImageUrl = await downloadAndReuploadImage(image_url)
        
        const processingTime = Date.now() - startTime
        console.log(`[Search Furniture] 豆包URL处理完成，耗时: ${processingTime}ms`)
        
      } catch (error: any) {
        console.error("[Search Furniture] 处理豆包URL失败:", error)
        return NextResponse.json({
          success: false,
          error: `处理豆包URL失败: ${error.message}`,
          processingTime: Date.now() - requestStartTime
        })
      }
    }

    // 调用外部家具查询接口
    const searchUrl = `http://competitor-cy.bcc-szth.baidu.com:80/search_furniture?image_url=${encodeURIComponent(finalImageUrl)}`
    
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
      
      const totalTime = Date.now() - requestStartTime
      console.log(`[Search Furniture] 总耗时: ${totalTime}ms`)
      
      return NextResponse.json({
        success: true,
        data: {
          type: mainType,
          results: result.results
        },
        fullResponse: result,
        processingTime: totalTime
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "未找到匹配的家具",
        fullResponse: result,
        processingTime: Date.now() - requestStartTime
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
