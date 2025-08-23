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
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function PreviewPage() {
  const [previewImage, setPreviewImage] = useState("/nordic-living-room.png")
  const [zoomLevel, setZoomLevel] = useState(1)

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

  const handleReset = () => {
    setZoomLevel(1)
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
              <Button variant="outline" size="sm" asChild>
                <Link href="/design">
                  <Edit className="mr-2 h-4 w-4" />
                  返回编辑
                </Link>
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
                  <div className="flex items-center gap-2">
                    <Tabs defaultValue="day" className="w-auto">
                      <TabsList className="bg-card">
                        <TabsTrigger value="day" className="flex items-center gap-1">
                          <Sun className="h-4 w-4" />
                          白天效果
                        </TabsTrigger>
                        <TabsTrigger value="night" className="flex items-center gap-1">
                          <Moon className="h-4 w-4" />
                          夜晚效果
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="flex gap-1">
                      <Button size="sm" className="bg-primary text-white">
                        <Flower className="h-4 w-4 mr-1" />
                        春季氛围
                      </Button>
                      <Button size="sm" variant="outline">
                        <Sun className="h-4 w-4 mr-1" />
                        夏季氛围
                      </Button>
                      <Button size="sm" variant="outline">
                        <Flower className="h-4 w-4 mr-1" />
                        秋季氛围
                      </Button>
                      <Button size="sm" variant="outline">
                        <Snowflake className="h-4 w-4 mr-1" />
                        冬季氛围
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
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
                    src={previewImage || "/placeholder.svg"}
                    alt="3D渲染效果图"
                    className="w-full h-[500px] object-cover transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "center top",
                    }}
                  />
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
                    <p>户型：两居室</p>
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
