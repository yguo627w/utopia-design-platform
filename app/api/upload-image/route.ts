import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log(`[图片上传] 上传请求开始 - ${new Date().toISOString()}`)
  
  try {
    const contentType = request.headers.get('content-type') || ''
    
    let file: File | null = null
    let imageData: string | null = null
    
    if (contentType.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData()
      file = formData.get('file') as File
      
      if (!file) {
        console.log('[图片上传] 错误: 没有接收到文件')
        return NextResponse.json(
          { error: '请选择要上传的文件' },
          { status: 400 }
        )
      }
      
      console.log(`[图片上传] 接收到文件: ${file.name}, 大小: ${file.size} bytes, 类型: ${file.type}`)
      
    } else if (contentType.includes('application/json')) {
      // 处理JSON格式的图片数据
      const body = await request.json()
      imageData = body.imageData
      
      if (!imageData) {
        console.log('[图片上传] 错误: 没有接收到图片数据')
        return NextResponse.json(
          { error: '请提供图片数据' },
          { status: 400 }
        )
      }
      
      console.log(`[图片上传] 接收到图片数据: ${imageData.substring(0, 50)}...`)
      
    } else {
      console.log('[图片上传] 错误: 不支持的Content-Type')
      return NextResponse.json(
        { error: '不支持的请求格式' },
        { status: 400 }
      )
    }

    let fileBuffer: Buffer
    let fileName: string
    let fileType: string
    let fileSize: number

    if (file) {
      // 处理文件上传
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        console.log('[图片上传] 错误: 文件类型不是图片')
        return NextResponse.json(
          { error: '只支持上传图片文件' },
          { status: 400 }
        )
      }

      // 检查文件大小 (限制为10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        console.log('[图片上传] 错误: 文件过大')
        return NextResponse.json(
          { error: '文件大小不能超过10MB' },
          { status: 400 }
        )
      }

      // 将文件转换为Buffer
      fileBuffer = Buffer.from(await file.arrayBuffer())
      fileName = file.name
      fileType = file.type
      fileSize = file.size
      
    } else if (imageData) {
      // 处理图片数据
      if (!imageData.startsWith('data:image/') && !imageData.startsWith('blob:')) {
        console.log('[图片上传] 错误: 不支持的图片数据格式')
        return NextResponse.json(
          { error: '只支持data:image/或blob:格式的图片数据' },
          { status: 400 }
        )
      }

      // 如果是blob URL，服务器端无法直接处理，需要前端先转换为data URL
      if (imageData.startsWith('blob:')) {
        console.error('[图片上传] 错误: 服务器端无法处理blob URL，请前端先转换为data URL')
        return NextResponse.json(
          { error: '服务器端无法处理blob URL，请使用data URL或直接上传文件' },
          { status: 400 }
        )
      } else {
        // 处理data URL
        const base64Data = imageData.split(',')[1]
        fileBuffer = Buffer.from(base64Data, 'base64')
        fileName = `uploaded-image-${Date.now()}.jpg`
        fileType = 'image/jpeg'
        fileSize = fileBuffer.length
      }
      
      // 检查文件大小 (限制为10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (fileSize > maxSize) {
        console.log('[图片上传] 错误: 文件过大')
        return NextResponse.json(
          { error: '文件大小不能超过10MB' },
          { status: 400 }
        )
      }
    } else {
      console.log('[图片上传] 错误: 没有接收到文件或图片数据')
      return NextResponse.json(
        { error: '请提供文件或图片数据' },
        { status: 400 }
      )
    }
    
    // 创建FormData对象
    const uploadFormData = new FormData()
    const blob = new Blob([fileBuffer], { type: fileType })
    uploadFormData.append('file', blob, fileName)

    // 调用云端上传服务
    const cloudUploadUrl = 'http://competitor-cy.bcc-szth.baidu.com:80/upload'
    console.log(`[图片上传] 开始上传到云端服务: ${cloudUploadUrl}`)
    
    const uploadResponse = await fetch(cloudUploadUrl, {
      method: 'POST',
      body: uploadFormData,
      headers: {
        // Let fetch automatically set multipart/form-data boundary
      }
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error(`[图片上传] 云端服务响应错误: ${uploadResponse.status} - ${errorText}`)
      return NextResponse.json(
        { error: `云端上传失败: ${uploadResponse.status} - ${errorText}` },
        { status: 500 }
      )
    }

    const uploadResult = await uploadResponse.json()
    console.log(`[图片上传] 云端服务响应:`, uploadResult)

    // 假设云端服务返回的格式包含URL字段
    const imageUrl = uploadResult.url || uploadResult.imageUrl || uploadResult.data?.url
    
    if (!imageUrl) {
      console.error(`[图片上传] 云端服务未返回有效的URL:`, uploadResult)
      return NextResponse.json(
        { error: '云端服务未返回有效的图片URL' },
        { status: 500 }
      )
    }

    console.log(`[图片上传] 上传完成，云端URL: ${imageUrl}`)
    console.log(`[图片上传] 上传完成，耗时: ${Date.now() - startTime}ms`)
    
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      message: '图片上传成功',
      originalFileName: fileName,
      fileSize: fileSize,
      fileType: fileType
    })

  } catch (error) {
    console.error(`[图片上传] 上传错误:`, error)
    console.log(`[图片上传] 上传失败，耗时: ${Date.now() - startTime}ms`)
    return NextResponse.json(
      { error: '图片上传失败，请稍后重试' },
      { status: 500 }
    )
  }
}
