"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileImage, ArrowRight } from "lucide-react"
import Navigation from "@/components/navigation"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (window.location.hash === "#upload" && uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      // Add a subtle highlight effect
      uploadSectionRef.current.classList.add("ring-2", "ring-primary/50", "ring-offset-2")
      setTimeout(() => {
        uploadSectionRef.current?.classList.remove("ring-2", "ring-primary/50", "ring-offset-2")
      }, 2000)
    }
  }, [])

  const sampleFloorPlans = [
    {
      id: 1,
      title: "极简风卧室",
      style: "温馨风",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250823/806565301.png",
      description: "充满简约的卧室设计，以木质色系为主为主",
    },
    {
      id: 2,
      title: "北欧风客厅",
      style: "北欧风",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250823/3667326276.jpg",
      description: "简洁明亮的空间设计，以白色和浅灰色为主调，搭配原木元素增添温暖感",
    },
    {
      id: 3,
      title: "工业风厨房",
      style: "工业风",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/6d83ac26770968679d97fa2e1b198b7a.png",
      description: "使用砖墙，搭配金属元素，打造出独特的工业风厨房，既实用又有个性",
    },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)

    try {
      // 文件类型验证
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setToastMessage(`不支持的文件类型：${file.type}。请上传PNG、JPEG或WebP格式的图片。`)
        setShowToast(true)
        setIsLoading(false)
        return
      }

      // 文件大小验证（10MB限制）
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setToastMessage(`文件过大：${(file.size / 1024 / 1024).toFixed(1)}MB。请上传小于10MB的图片。`)
        setShowToast(true)
        setIsLoading(false)
        return
      }

      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file)

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store the image in sessionStorage to pass to design page
      sessionStorage.setItem("uploadedImage", imageUrl)
      sessionStorage.setItem("uploadedImageName", file.name)

      // Navigate to design page
      router.push("/design")
    } catch (error) {
      console.error("File upload error:", error)
      setToastMessage("文件上传失败，请重试")
      setShowToast(true)
      setIsLoading(false)
    }
  }

  const handleStyleSelect = async (style: (typeof sampleFloorPlans)[0]) => {
    setIsLoading(true)

    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store the selected style image in sessionStorage
    sessionStorage.setItem("selectedStyleImage", style.image)
    sessionStorage.setItem("selectedStyleTitle", style.title)
    sessionStorage.setItem("selectedStyleType", style.style)

    // Navigate to design page
    router.push("/design")
  }

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Component */}
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="text-center mb-4">
            <div className="text-sm text-muted-foreground">步骤 1/4: 上传户型图</div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">上传你的实景照片或户型图片片或户型图片</h1>
            <p className="text-xl text-muted-foreground">支持户型图、实景照片，AI将为你生成3D模型</p>
          </div>

          {/* Upload Section */}
          <Card className="mb-12" ref={uploadSectionRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                上传文件
              </CardTitle>
              <CardDescription>支持 JPG、PNG 格式，文件大小不超过 10MB</CardDescription>
            </CardHeader>
            <CardContent>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {isLoading ? (
                <div className="border-2 border-dashed border-primary rounded-lg p-12 text-center bg-primary/5">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg font-medium text-primary">加载中...</p>
                    <p className="text-sm text-muted-foreground">正在处理您的图片</p>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={handleUploadAreaClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileImage className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium mb-2">拖拽文件到此处，或点击选择文件</p>
                      <p className="text-sm text-muted-foreground">推荐上传清晰的户型图或房间照片</p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={(e) => {
                        e.stopPropagation()
                        handleUploadAreaClick()
                      }}>
                        <Upload className="mr-2 h-4 w-4" />
                        选择文件
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Floor Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">或选择示范风格空间开始体验</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {sampleFloorPlans.map((plan) => (
                <Card key={plan.id} className="cursor-pointer hover:shadow-lg transition-all duration-300 group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={plan.image || "/placeholder.svg"}
                      alt={plan.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{plan.style}</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{plan.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => handleStyleSelect(plan)} disabled={isLoading}>
                      {isLoading ? "加载中..." : "使用此风格"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">上传小贴士</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">户型图要求：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 图片清晰，标注尺寸更佳</li>
                    <li>• 包含房间布局和门窗位置</li>
                    <li>• 建议使用开发商提供的标准户型图</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">实景照片要求：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 光线充足，避免过暗或过亮</li>
                    <li>• 尽量拍摄房间全景</li>
                    <li>• 多角度拍摄效果更好</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
