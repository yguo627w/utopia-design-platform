import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log(`[API] 检测请求开始 - ${new Date().toISOString()}`)
  
  try {
    const { imageUrl } = await request.json()
    console.log(`[API] 接收到的图片URL类型: ${imageUrl ? (imageUrl.startsWith('data:image/') ? 'base64' : 'URL') : '空'}`)
    
    if (!imageUrl) {
      console.log('[API] 错误: 图片URL为空')
      return NextResponse.json(
        { error: '图片URL不能为空' },
        { status: 400 }
      )
    }

    let finalImageUrl: string
    
    // 检查是否是base64格式的图片或本地地址
    if (imageUrl.startsWith('data:image/') || imageUrl.startsWith('blob:') || imageUrl.includes('localhost')) {
      console.log('[API] 检测到本地图片，需要先上传到云端')
      
      // 先上传图片到云端
      const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: imageUrl }),
      })
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}))
        throw new Error(`图片上传失败: ${uploadResponse.status} - ${errorData.error || '未知错误'}`)
      }
      
      const uploadData = await uploadResponse.json()
      finalImageUrl = uploadData.imageUrl
      console.log(`[API] 图片上传成功，云端URL: ${finalImageUrl}`)
      
    } else {
      // 使用用户提供的真实图片URL
      console.log(`[API] 使用真实图片URL: ${imageUrl.substring(0, 100)}...`)
      finalImageUrl = imageUrl
    }
    
    // 调用外部检测API
    const apiUrl = `http://172.26.218.196:5001/image_detection?image_url=${encodeURIComponent(finalImageUrl)}&confidence_threshold=0.25`
    console.log(`[API] 外部API URL: ${apiUrl}`)
    
    // 添加超时和重试机制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    }).catch(error => {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('检测API请求超时')
      }
      throw new Error(`检测API网络错误: ${error.message}`)
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`检测API请求失败: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[API] 外部API返回数据: ${JSON.stringify(data, null, 2)}`)
    
    // 家具名称翻译映射
    const furnitureTranslation: { [key: string]: string } = {
      'bed': '床',
      'chair': '椅子',
      'sofa': '沙发',
      'couch': '沙发',
      'table': '桌子',
      'desk': '书桌',
      'dining table': '餐桌',
      'coffee table': '茶几',
      'wardrobe': '衣柜',
      'cabinet': '柜子',
      'bookshelf': '书架',
      'lamp': '灯具',
      'ceiling fan': '吊扇',
      'tv': '电视',
      'refrigerator': '冰箱',
      'microwave': '微波炉',
      'oven': '烤箱',
      'toaster': '烤面包机',
      'sink': '水槽',
      'toilet': '马桶',
      'bathtub': '浴缸',
      'potted plant': '盆栽',
      'vase': '花瓶',
      'clock': '时钟',
      'mirror': '镜子',
      'scissors': '剪刀',
      'cup': '杯子',
      'teddy bear': '泰迪熊',
      'hair drier': '吹风机',
      'toothbrush': '牙刷'
    }

    // 处理检测结果，翻译家具名称
    const processedItems = data.all_items?.map((item: any) => ({
      ...item,
      chineseName: furnitureTranslation[item.name] || item.name
    })) || []
    
    console.log(`[API] 处理后的家具列表: ${JSON.stringify(processedItems, null, 2)}`)
    console.log(`[API] 检测请求完成，耗时: ${Date.now() - startTime}ms`)

    return NextResponse.json({
      success: true,
      items: processedItems,
      message: '检测成功'
    })

  } catch (error) {
    console.error(`[API] 图片检测错误: ${error}`)
    console.log(`[API] 检测请求失败，耗时: ${Date.now() - startTime}ms`)
    return NextResponse.json(
      { error: '图片检测失败，请稍后重试' },
      { status: 500 }
    )
  }
}
