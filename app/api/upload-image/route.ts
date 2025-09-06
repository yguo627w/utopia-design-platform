import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log(`[图片上传] 上传请求开始 - ${new Date().toISOString()}`)
  
  try {
    const { imageData } = await request.json()
    console.log(`[图片上传] 接收到的图片数据类型: ${imageData ? (imageData.startsWith('data:image/') ? 'base64' : 'URL') : '空'}`)
    
    if (!imageData) {
      console.log('[图片上传] 错误: 图片数据为空')
      return NextResponse.json(
        { error: '图片数据不能为空' },
        { status: 400 }
      )
    }

    let imageUrl: string

    // 检查是否是base64格式的图片
    if (imageData.startsWith('data:image/')) {
      console.log('[图片上传] 处理base64图片')
      
      // 将base64转换为Buffer
      const base64Data = imageData.split(',')[1]
      const imageBuffer = Buffer.from(base64Data, 'base64')
      
      // 生成唯一文件名
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileName = `furniture-detection-${timestamp}-${randomId}.jpg`
      
      // 这里我们需要将图片上传到云端存储服务
      // 为了演示，我们先使用一个临时的解决方案
      // 实际项目中应该使用阿里云OSS、腾讯云COS、AWS S3等
      
      // 临时方案：将图片保存到public目录（仅用于演示）
      const fs = require('fs')
      const path = require('path')
      
      const publicDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }
      
      const filePath = path.join(publicDir, fileName)
      fs.writeFileSync(filePath, imageBuffer)
      
      // 生成可访问的URL
      imageUrl = `${request.nextUrl.origin}/uploads/${fileName}`
      console.log(`[图片上传] 图片已保存到: ${filePath}`)
      console.log(`[图片上传] 生成的可访问URL: ${imageUrl}`)
      
    } else if (imageData.startsWith('blob:') || imageData.includes('localhost')) {
      console.log('[图片上传] 检测到blob或localhost地址，需要前端先转换为base64')
      return NextResponse.json(
        { error: '请提供base64格式的图片数据，blob URL需要先转换为base64' },
        { status: 400 }
      )
      
    } else {
      // 如果已经是外网可访问的URL，直接返回
      console.log(`[图片上传] 检测到外网URL: ${imageData}`)
      imageUrl = imageData
    }
    
    console.log(`[图片上传] 上传完成，耗时: ${Date.now() - startTime}ms`)
    
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      message: '图片上传成功'
    })

  } catch (error) {
    console.error(`[图片上传] 上传错误: ${error}`)
    console.log(`[图片上传] 上传失败，耗时: ${Date.now() - startTime}ms`)
    return NextResponse.json(
      { error: '图片上传失败，请稍后重试' },
      { status: 500 }
    )
  }
}
