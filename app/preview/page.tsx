"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/navigation"
import StepIndicator from "@/components/step-indicator"
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Sun,
  Moon,
  Snowflake,
  Flower,
  ShoppingCart,
  Edit,
  Leaf,
  Cloud,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function PreviewPage() {
  const [previewImage, setPreviewImage] = useState("/nordic-living-room.png")
  const [zoomLevel, setZoomLevel] = useState(1)
  
  // 渲染效果状态管理
  const [selectedTime, setSelectedTime] = useState<"day" | "night">("day")
  const [selectedSeason, setSelectedSeason] = useState<"spring" | "summer" | "autumn" | "winter">("spring")
  
  // 渲染状态管理
  const [isRendering, setIsRendering] = useState(false)
  const [renderedImage, setRenderedImage] = useState<string | null>(null)
  const [renderError, setRenderError] = useState<string | null>(null)

  useEffect(() => {
    const storedImage = sessionStorage.getItem("previewImage")
    if (storedImage) {
      setPreviewImage(storedImage)
      sessionStorage.removeItem("previewImage")
    }
  }, [])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  // 渲染效果处理函数
  const handleTimeChange = (time: "day" | "night") => {
    setSelectedTime(time)
    console.log(`[Preview] 切换到${time === "day" ? "白天" : "夜晚"}效果`)
  }

  const handleSeasonChange = (season: "spring" | "summer" | "autumn" | "winter") => {
    setSelectedSeason(season)
    console.log(`[Preview] 切换到${season === "spring" ? "春季" : season === "summer" ? "夏季" : season === "autumn" ? "秋季" : "冬季"}效果`)
  }

  // 获取当前选中的效果描述
  const getCurrentEffectDescription = () => {
    const timeText = selectedTime === "day" ? "白天" : "夜晚"
    const seasonText = selectedSeason === "spring" ? "春季" : selectedSeason === "summer" ? "夏季" : selectedSeason === "autumn" ? "秋季" : "冬季"
    return `${timeText} + ${seasonText}效果`
  }

  // 根据选择的效果组合获取对应的prompt
  const getRenderingPrompt = () => {
    const time = selectedTime
    const season = selectedSeason
    
    const promptMap: { [key: string]: string } = {
      "day-spring": "修改为春季晴朗白天光照：模拟上午 9-11 点 / 下午 2-4 点漫射光（角度 30-40°，无直射），整体明亮通透（不曝光），家具受光均匀、纹理清晰；阴影浅灰自然，补漫射光避免死黑；色调暖白柔和，还原 '春日暖阳包裹家具' 的舒适感。",
      "day-summer": "修改为夏季晴朗正午光照：模拟 12-2 点直射 + 漫射混合光（角度近垂直，强炽热感），整体高亮锐利，金属 / 玻璃显清晰高光，布艺 / 木质纹理锐利；阴影对比强烈、边缘利落；色调热感暖黄，营造 '强光刺眼、明暗鲜明' 的炽热氛围。",
      "day-autumn": "修改为秋季晴朗白天光照：模拟上午 10-12 点 / 下午 3-4 点侧射光（角度 45-60°，温和清透），整体暖柔衰减，家具纹理细腻，金属 / 玻璃反光柔和；阴影浅暖灰、边缘微糊（带秋意轻霭）；色调暖棕橙黄，还原 '阳光覆琥珀光晕' 的温润感。",
      "day-winter": "修改为冬季晴朗白天光照：模拟上午 10-12 点冷漫射光（角度 30-45°，清冷感），整体明亮冷硬，家具显简洁锐利，金属 / 玻璃反光冷冽；阴影冷灰清晰（不带生硬）；色调冷白浅蓝，营造 '冷调光晕、家具素净' 的清透感。，但是不要过多改变图片整体的色调。",
      "night-spring": "修改为春季夜晚光照：模拟室内暖光 + 窗外朦胧月光（分散柔和），整体低亮温馨（重点区稍亮、其余渐暗），家具柔和显温馨，金属 / 玻璃反光朦胧；阴影暖灰过渡（带静谧感）；色调暖黄浅粉，还原 '春夜暖光包裹家具' 的温柔氛围。",
      "night-summer": "修改为夏季夜晚光照：模拟室内冷光 + 窗外霓虹微光（清凉活力），整体中亮偏冷（重点区清晰、其余带霓虹晕染），家具清爽显利落，金属 / 玻璃反光冷锐；阴影冷灰 + 暖光渐变（带都市感）；色调冷白浅紫，营造 '冷暖交织、现代活力' 的夏夜氛围。",
      "night-autumn": "修改为秋季夜晚光照：模拟室内暖棕光 + 窗外清冷月光（柔和怀旧），整体低亮偏暖（重点区温馨、其余渐暗带秋意），家具温润显厚重，木质纹理 / 布艺柔软；阴影暖棕灰、边缘朦胧（像落叶堆积）；色调暖棕橙红，还原 '怀旧光晕、秋夜厚重' 的氛围。",
      "night-winter": "修改为冬季夜晚光照：模拟室内冷白光 + 窗外冰蓝月光（锐利寒意），整体中亮冷硬（重点区清晰、其余带冷冽暗部），家具简洁素净，金属 / 玻璃反光冰感；阴影冷灰 + 冰蓝渐变（带严寒感）；色调冷白冰蓝，营造 '冷光素净、冬夜孤寂' 的清冽氛围。"
    }
    
    const key = `${time}-${season}`
    return promptMap[key] || "修改为选中的渲染效果"
  }

  // 开始渲染函数
  const handleStartRendering = async () => {
    if (!previewImage) {
      console.log("[Preview] 没有预览图片，无法开始渲染")
      return
    }

    setIsRendering(true)
    setRenderError(null) // 清除之前的错误
    console.log(`[Preview] 开始渲染，效果：${getCurrentEffectDescription()}`)
    console.log(`[Preview] 使用prompt：${getRenderingPrompt()}`)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: getRenderingPrompt(),
          image: previewImage,
        }),
      })

      if (!response.ok) {
        throw new Error(`渲染请求失败: ${response.status}`)
      }

      const data = await response.json()
      console.log("[Preview] API响应数据:", data)
      
      // 根据API响应结构获取图片URL
      let generatedImageUrl = null
      if (data.imageUrl) {
        // API返回imageUrl字段的情况
        generatedImageUrl = data.imageUrl
      } else if (data.url) {
        // 直接返回URL的情况
        generatedImageUrl = data.url
      } else if (data.data && data.data[0] && data.data[0].url) {
        // 嵌套在data数组中的情况
        generatedImageUrl = data.data[0].url
      }

      if (generatedImageUrl) {
        setRenderedImage(generatedImageUrl)
        console.log("[Preview] 渲染完成，图片URL:", generatedImageUrl)
      } else {
        const errorMsg = "渲染响应中没有图片URL"
        console.log("[Preview]", errorMsg)
        setRenderError(errorMsg)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "渲染过程中发生未知错误"
      console.log("[Preview] 渲染过程中发生错误:", errorMsg)
      setRenderError(errorMsg)
    } finally {
      setIsRendering(false)
    }
  }

  const designOptions = [
    {
      id: 1,
      name: "北欧简约风",
      description: "简洁、明亮、自然材质",
      thumbnail: "/nordic-living-room.png",
      rating: 4.9,
      likes: 1200,
      active: true,
    },
    {
      id: 2,
      name: "工业风",
      description: "粗犷、复古、金属元素",
      thumbnail: "/industrial-open-kitchen.png",
      rating: 4.7,
      likes: 896,
      active: false,
    },
    {
      id: 3,
      name: "日式传统风",
      description: "自然、简朴、禅意",
      thumbnail: "/japanese-zen-bedroom.png",
      rating: 4.6,
      likes: 754,
      active: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="design" />
      <StepIndicator currentStep={3} />

      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">渲染预览</h1>
              <Badge variant="outline">预览模式</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  // 保存当前图片到sessionStorage，供design页面恢复使用
                  const currentImage = renderedImage || previewImage
                  if (currentImage) {
                    sessionStorage.setItem("uploadedImage", currentImage)
                    console.log("[Preview] 保存图片到sessionStorage:", currentImage)
                  }
                  // 跳转到design页面
                  window.location.href = "/design"
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                返回编辑
              </Button>
              <Button size="sm" className="bg-primary" asChild>
                <Link href="/marketplace">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  去购买
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    {/* 一级按钮：时间效果 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">时间效果：</span>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant={selectedTime === "day" ? "default" : "outline"}
                          onClick={() => handleTimeChange("day")}
                          className="flex items-center gap-1"
                        >
                          <Sun className="h-4 w-4" />
                          白天效果
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedTime === "night" ? "default" : "outline"}
                          onClick={() => handleTimeChange("night")}
                          className="flex items-center gap-1"
                        >
                          <Moon className="h-4 w-4" />
                          夜晚效果
                        </Button>
                      </div>
                    </div>

                    {/* 二级按钮：季节效果 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">季节效果：</span>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant={selectedSeason === "spring" ? "default" : "outline"}
                          onClick={() => handleSeasonChange("spring")}
                          className="flex items-center gap-1"
                        >
                          <Flower className="h-4 w-4" />
                          春季效果
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedSeason === "summer" ? "default" : "outline"}
                          onClick={() => handleSeasonChange("summer")}
                          className="flex items-center gap-1"
                        >
                          <Sun className="h-4 w-4" />
                          夏季效果
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedSeason === "autumn" ? "default" : "outline"}
                          onClick={() => handleSeasonChange("autumn")}
                          className="flex items-center gap-1"
                        >
                          <Leaf className="h-4 w-4" />
                          秋季效果
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedSeason === "winter" ? "default" : "outline"}
                          onClick={() => handleSeasonChange("winter")}
                          className="flex items-center gap-1"
                        >
                          <Snowflake className="h-4 w-4" />
                          冬季效果
                        </Button>
                      </div>
                    </div>

                    {/* 当前效果显示 */}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        当前：{getCurrentEffectDescription()}
                      </Badge>
                    </div>
                  </div>

                  {/* 开始渲染按钮 */}
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleStartRendering}
                      disabled={isRendering}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                    >
                      {isRendering ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          渲染中...
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          开始渲染
                        </>
                      )}
                    </Button>
                    
                    {/* 重置按钮 - 当有渲染结果时显示 */}
                    {renderedImage && !isRendering && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setRenderedImage(null)
                          setRenderError(null)
                        }}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        重置
                      </Button>
                    )}
                  </div>

                  {/* 工具栏：旋转/缩放 */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground flex items-center px-2">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  <img
                    src={renderedImage || previewImage || "/placeholder.svg"}
                    alt="3D渲染效果图"
                    className="w-full h-[500px] object-cover transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "center top",
                    }}
                  />
                  
                  {/* 效果叠加层 */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
                      {renderedImage ? `渲染完成：${getCurrentEffectDescription()}` : getCurrentEffectDescription()}
                    </div>
                  </div>
                  
                  {/* 错误提示 */}
                  {renderError && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm max-w-xs">
                        <div className="font-medium">渲染失败</div>
                        <div className="text-xs opacity-90">{renderError}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* 渲染状态指示器 */}
                  {isRendering && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <div className="text-lg font-medium">渲染中...</div>
                        <div className="text-sm text-muted-foreground">正在应用{getCurrentEffectDescription()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">导出选项</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Download className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium">高清图片</div>
                      <div className="text-xs text-muted-foreground">4K分辨率</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Download className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium">3D模型</div>
                      <div className="text-xs text-muted-foreground">OBJ格式</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Share2 className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium">分享链接</div>
                      <div className="text-xs text-muted-foreground">在线预览</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Download className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium">全景图</div>
                      <div className="text-xs text-muted-foreground">360°视图</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Design Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">设计详情</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">当前方案</h4>
                  <p className="text-sm text-muted-foreground">温馨北欧风格</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      北欧风
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      温馨
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      明亮
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">空间信息</h4>
                  <div className="text-sm space-y-1">
                    <p>房间类型：卧室</p>
                    <p>面积：75㎡</p>
                    <p>朝向：南北通透</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">设计特点</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 浅色木质家具营造温馨感</li>
                    <li>• 大面积白色提升空间感</li>
                    <li>• 绿植点缀增加自然气息</li>
                    <li>• 充分利用自然采光</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Furniture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  购买家具
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">喜欢这个设计？购买相同款式的家具，让设计变为现实。</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src="/modern-sofa.png" alt="沙发" className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-medium text-sm">北欧风三人沙发</p>
                        <p className="text-xs text-muted-foreground">¥2,399</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src="/nordic-living-room.png" alt="茶几" className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-medium text-sm">实木茶几</p>
                        <p className="text-xs text-muted-foreground">¥899</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src="/cozy-bedroom.png" alt="落地灯" className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-medium text-sm">北欧落地灯</p>
                        <p className="text-xs text-muted-foreground">¥599</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/marketplace">查看全部商品</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
