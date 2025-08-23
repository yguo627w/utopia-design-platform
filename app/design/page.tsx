"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/navigation"
import StepIndicator from "@/components/step-indicator"
import {
  MessageCircle,
  Send,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  Search,
  Plus,
  Star,
  Heart,
  ChevronRight,
  ShoppingCart,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"

interface ChatMessage {
  type: "ai" | "user"
  content: string
  avatar?: string
  time: string
  image?: string
}

export default function DesignPage() {
  const [selectedRoom, setSelectedRoom] = useState("卧室")
  const [selectedFurnitureType, setSelectedFurnitureType] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [chatImages, setChatImages] = useState<Array<{ id: string; url: string; name: string }>>([])
  const [activeTab, setActiveTab] = useState("inspiration")
  const [roomImage, setRoomImage] = useState(
    "https://design.gemcoder.com/staticResource/echoAiSystemImages/676985223975790e510ca20672144337.png",
  )
  const [selectedStyleTitle, setSelectedStyleTitle] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: "ai",
      content:
        "你好！我是你的AI设计助手，请上传户型图或描述装修需求，例如'温馨北欧风客厅'，我会为你生成个性化设计方案。",
      avatar: "/woman-designer-avatar.png",
      time: "09:30",
    },
    {
      type: "user",
      content: "我想要这个卧室改成现代简约风格，主色调要灰色和白色，需要一个大衣柜",
      time: "09:32",
    },
    {
      type: "ai",
      content:
        "根据你的需求，我为你设计了现代简约风格方案，主色调为：\n\n• 灰色系三人沙发，搭配蓝色靠垫\n• 白色墙体和天花，带来通透感\n• 墙面可用浅灰色乳胶漆，营造层次感\n• 暖色立体设计简约书架，提供储物空间",
      avatar: "/woman-designer-avatar.png",
      time: "09:35",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { addToCart } = useCart()

  // 创建适配useCart hook的购物车添加函数
  const handleAddToCart = (productId: number, productName: string, productPrice?: string, productImage?: string) => {
    // 改进的价格解析逻辑
    let parsedPrice = 0
    if (productPrice) {
      // 移除所有非数字字符（除了小数点），然后转换为数字
      const cleanPrice = productPrice.replace(/[¥,\s]/g, "")
      parsedPrice = parseFloat(cleanPrice) || 0
      
      // 如果解析失败，记录警告
      if (parsedPrice === 0 && cleanPrice !== "0") {
        console.warn(`[v0] Failed to parse price: "${productPrice}" -> "${cleanPrice}" -> ${parsedPrice}`)
      }
    }

    // 调用useCart hook的addToCart函数
    addToCart({
      id: productId,
      name: productName,
      price: parsedPrice,
      image: productImage || "/placeholder.svg",
      quantity: 1,
      source: "design" as const,
    })

    setToastMessage("添加成功，稍后可在商城结算")
    setShowToast(true)
  }

  useEffect(() => {
    const uploadedImage = sessionStorage.getItem("uploadedImage")
    const selectedStyleImage = sessionStorage.getItem("selectedStyleImage")
    const styleTitle = sessionStorage.getItem("selectedStyleTitle")
    const styleType = sessionStorage.getItem("selectedStyleType")

    if (uploadedImage) {
      setRoomImage(uploadedImage)
      // 清理所有上传相关的sessionStorage数据
      sessionStorage.removeItem("uploadedImage")
      sessionStorage.removeItem("uploadedImageName")
      console.log("[v0] Loaded uploaded image and cleaned sessionStorage")
    } else if (selectedStyleImage) {
      setRoomImage(selectedStyleImage)
      if (styleTitle) {
        setSelectedStyleTitle(styleTitle)
      }
      // 清理所有风格选择相关的sessionStorage数据
      sessionStorage.removeItem("selectedStyleImage")
      sessionStorage.removeItem("selectedStyleTitle")
      sessionStorage.removeItem("selectedStyleType")
      console.log("[v0] Loaded selected style and cleaned sessionStorage")
    }
  }, [])

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const designStyles = [
    {
      name: "现代简约风",
      description: "简约而不简单的空间设计，注重功能性与美观性的完美结合",
      image: "/modern-minimalist-room.png",
      likes: "1.2k",
      rating: 4.8,
      tag: "热门",
    },
    {
      name: "新中式风",
      description: "融合传统中式元素与现代设计，营造典雅东方韵味",
      image: "/chinese-style-room.png",
      likes: "896",
      rating: 4.7,
      tag: "推荐",
    },
    {
      name: "轻奢风",
      description: "以简约为基础，融入金属、皮革等元素，打造精致奢华感",
      image: "/luxury-room.png",
      likes: "754",
      rating: 4.6,
    },
    {
      name: "北欧风",
      description: "崇尚自然的空间美学，原木元素营造温馨舒适的居住环境",
      image: "/nordic-living-room.png",
      likes: "1k",
      rating: 4.8,
    },
    {
      name: "工业风",
      description: "粗犷质感的空间格调，以原始色彩和粗犷金属为主要元素",
      image: "/industrial-room.png",
      likes: "623",
      rating: 4.6,
    },
  ]

  const roomCategories = [
    { name: "卧室", active: selectedRoom === "卧室" },
    { name: "客厅", active: selectedRoom === "客厅" },
    { name: "餐厅", active: selectedRoom === "餐厅" },
    { name: "卫浴", active: selectedRoom === "卫浴" },
    { name: "户外", active: selectedRoom === "户外" },
  ]

  const getFurnitureTypes = () => {
    if (selectedRoom === "卧室") {
      return [
        { name: "衣柜", count: "3个产品", icon: "🚪" },
        { name: "床单", count: "3个产品", icon: "🛏️" },
        { name: "挂画", count: "3个产品", icon: "🖼️" },
      ]
    }
    return [
      { name: "沙发", count: "3个产品", icon: "🛋️" },
      { name: "茶几", count: "3个产品", icon: "🪑" },
      { name: "花瓶", count: "3个产品", icon: "🏺" },
      // { name: "储物柜", count: "9个产品", icon: "🗄️" },
      // { name: "灯具灯饰", count: "11个产品", icon: "💡" },
      // { name: "装饰品", count: "14个产品", icon: "🎨" },
    ]
  }

  const wardrobeProducts = [
    {
      id: 101,
      name: "现代简约衣柜",
      image: "https://malexa.bj.bcebos.com/Utopia/%E8%A1%A3%E6%9F%9C.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E8%A1%A3%E6%9F%9C%E4%BF%AE%E6%94%B91.jpg",
      price: "¥2,899",
      rating: 4.8,
      reviews: 128,
    }
  ]

  const sofaProducts = [
    {
      id: 201,
      name: "条纹三人沙发",
      image: "https://malexa.bj.bcebos.com/Utopia/%E6%B2%99%E5%8F%911.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E6%B2%99%E5%8F%91%E4%BF%AE%E6%94%B91.jpg",
      price: "¥4,299",
      rating: 4.8,
      reviews: 156,
    }
  ]

  const coffeeTableProducts = [
    {
      id: 301,
      name: "现代简约茶几",
      image: "https://malexa.bj.bcebos.com/Utopia/%E8%8C%B6%E5%87%A01.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E8%8C%B6%E5%87%A0%E4%BF%AE%E6%94%B91.jpg",
      price: "¥1,899",
      rating: 4.8,
      reviews: 89,
    },
  ]

  const vaseProducts = [
    {
      id: 401,
      name: "现代简约花瓶",
      image: "https://malexa.bj.bcebos.com/Utopia/%E8%8A%B1%E7%93%B62.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E8%8A%B1%E7%93%B6%E4%BF%AE%E6%94%B92.jpg",
      price: "¥299",
      rating: 4.8,
      reviews: 89,
    },
  ]

  // 卧室家具产品数据
  const bedSheetProducts = [
    {
      id: 501,
      name: "现代简约床单",
      image: "https://malexa.bj.bcebos.com/Utopia/%E5%BA%8A%E5%8D%951.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E5%BA%8A%E5%8D%95%E4%BF%AE%E6%94%B91.jpg",
      price: "¥299",
      rating: 4.8,
      reviews: 89,
    }
  ]

  const wallArtProducts = [
    {
      id: 601,
      name: "现代简约挂画",
      image: "https://malexa.bj.bcebos.com/Utopia/%E6%8C%82%E7%94%BB1.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E6%8C%82%E7%94%BB%E4%BF%AE%E6%94%B91.jpg",
      price: "¥299",
      rating: 4.8,
      reviews: 89,
    },
  ]

  const getKeyFurniture = () => {
    if (selectedStyleTitle === "北欧风客厅") {
      return [
        { name: "沙发", icon: "🛋️" },
        { name: "茶几", icon: "🪑" },
        { name: "花瓶", icon: "🏺" },
        { name: "落地灯", icon: "💡" },
      ]
    }
    if (selectedStyleTitle === "极简风卧室") {
      return [
        { name: "衣柜", icon: "🚪" },
        { name: "床单", icon: "🛏️" },
        { name: "挂画", icon: "🖼️" },
        { name: "台灯", icon: "💡" },
      ]
    }
    return [
      { name: "衣柜", icon: "🚪" },
      { name: "床单", icon: "🛏️" },
      { name: "挂画", icon: "🖼️" },
      { name: "台灯", icon: "💡" },
    ]
  }



  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        // 文件类型验证
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
          setToastMessage(`不支持的文件类型：${file.type}。请上传PNG、JPEG或WebP格式的图片。`)
          setShowToast(true)
          return
        }

        // 文件大小验证（10MB限制）
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          setToastMessage(`文件过大：${(file.size / 1024 / 1024).toFixed(1)}MB。请上传小于10MB的图片。`)
          setShowToast(true)
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            name: file.name,
          }
          setChatImages((prev) => [...prev, newImage])
          sessionStorage.setItem("uploadedImage", e.target?.result as string)
          sessionStorage.setItem("uploadedImageName", file.name)
          
          setToastMessage(`已添加图片：${file.name}`)
          setShowToast(true)
        }
        reader.onerror = () => {
          setToastMessage(`读取文件失败：${file.name}`)
          setShowToast(true)
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleAddToChat = (productName: string, productImage?: string) => {
    console.log(`[v0] Adding ${productName} to AI chat`)
    if (productImage) {
      const newImage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: productImage,
        name: productName,
      }
      setChatImages((prev) => [...prev, newImage])
    }
  }

  const handleQuickReplace = (productId: number, productName: string, productImage?: string) => {
    console.log(`[v0] Quick replacing with ${productName}`)
    if (productImage) {
      // 查找对应的产品，获取修改后的图片
      const sofaProduct = sofaProducts.find(product => product.id === productId)
      const wardrobeProduct = wardrobeProducts.find(product => product.id === productId)
      const coffeeTableProduct = coffeeTableProducts.find(product => product.id === productId)
      const vaseProduct = vaseProducts.find(product => product.id === productId)
      const bedSheetProduct = bedSheetProducts.find(product => product.id === productId)
      const wallArtProduct = wallArtProducts.find(product => product.id === productId)
      
      // 根据产品名称确定产品类型，避免ID冲突
      let modifiedImage = null
      if (productName.includes('沙发')) {
        modifiedImage = sofaProduct?.modifiedImage
      } else if (productName.includes('衣柜')) {
        modifiedImage = wardrobeProduct?.modifiedImage
      } else if (productName.includes('茶几')) {
        modifiedImage = coffeeTableProduct?.modifiedImage
      } else if (productName.includes('花瓶')) {
        modifiedImage = vaseProduct?.modifiedImage
      } else if (productName.includes('床单')) {
        modifiedImage = bedSheetProduct?.modifiedImage
      } else if (productName.includes('挂画')) {
        modifiedImage = wallArtProduct?.modifiedImage
      }
      
      // 如果有修改后的图片，直接更新房间主图片
      if (modifiedImage) {
        setRoomImage(modifiedImage)
        
        // 显示提示信息
        setToastMessage(`已将房间中的${productName}替换为修改后的效果`)
        setShowToast(true)
      } else {
        // 如果没有修改后的图片，使用原产品图片
        setRoomImage(productImage)
        
        // 显示提示信息
        setToastMessage(`已将房间中的${productName}替换为选中的产品`)
        setShowToast(true)
      }
    }
  }

  const handleRemoveImage = (imageId: string) => {
    setChatImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleFurnitureClick = (furnitureName: string) => {
    const furnitureMapping: { [key: string]: { room: string; type: string } } = {
      床: { room: "卧室", type: "床" },
      衣柜: { room: "卧室", type: "衣柜" },
      床单: { room: "卧室", type: "床单" },
      挂画: { room: "卧室", type: "挂画" },
      台灯: { room: "卧室", type: "灯具" },
      沙发: { room: "客厅", type: "沙发" },
      茶几: { room: "客厅", type: "茶几" },
      花瓶: { room: "客厅", type: "花瓶" },
      椅子: { room: "客厅", type: "椅子" },
      柜子: { room: "客厅", type: "储物柜" },
      落地灯: { room: "客厅", type: "灯具灯饰" },
    }

    const mapping = furnitureMapping[furnitureName]
    if (mapping) {
      setActiveTab("furniture")
      setSelectedRoom(mapping.room)
      setSelectedFurnitureType(mapping.type)
      
      // 滚动到家具推荐区域
      setTimeout(() => {
        const furnitureSection = document.querySelector('[data-furniture-section]')
        if (furnitureSection) {
          furnitureSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const keyFurniture = getKeyFurniture()

  const convertImageToUrl = async (imageData: string): Promise<string | null> => {
    console.log("[v0] Converting image URL:", imageData)

    if (!imageData) {
      console.log("[v0] No image data provided")
      return null
    }

    // 如果是HTTP/HTTPS URL，直接返回
    if (imageData.startsWith("http://") || imageData.startsWith("https://")) {
      console.log("[v0] Valid HTTP/HTTPS URL:", imageData)
      return imageData
    }

    // 如果是blob URL，尝试转换为data URL
    if (imageData.startsWith("blob:")) {
      console.log("[v0] Converting blob URL to data URL")
      try {
        const response = await fetch(imageData)
        const blob = await response.blob()
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
        console.log("[v0] Converted blob to data URL successfully")
        return dataUrl
      } catch (error) {
        console.error("[v0] Failed to convert blob URL:", error)
        return null
      }
    }

    // 如果是data URL，直接返回
    if (imageData.startsWith("data:")) {
      console.log("[v0] Valid data URL")
      return imageData
    }

    // 如果是本地文件路径，尝试转换为data URL
    if (imageData.startsWith("/")) {
      console.log("[v0] Local file path, converting to full URL")
      return `${window.location.origin}${imageData}`
    }

    console.log("[v0] No valid image URL found")
    return null
  }

  const callImageGenerationAPI = async (prompt: string, imageUrl: string) => {
    try {
      console.log("[v0] Calling image generation API with:", {
        prompt,
        imageUrl: imageUrl.substring(0, 100) + (imageUrl.length > 100 ? "..." : "")
      })

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          image: imageUrl,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API response not ok:", response.status, errorText)
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("[v0] API Response:", result)

      if (result.imageUrl) {
        console.log("[v0] Successfully generated image:", result.imageUrl)
        return result.imageUrl
      } else if (result.error) {
        console.error("[v0] API returned error:", result.error)
        throw new Error(result.error)
      } else {
        console.error("[v0] Invalid API response format:", result)
        throw new Error("Invalid API response format")
      }
    } catch (error) {
      console.error("[v0] API Error:", error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const currentTime = new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // 保存用户输入的消息内容，因为后面会清空inputMessage
    const userInputMessage = inputMessage.trim()

    // Add user message to chat
    const userMessage: ChatMessage = {
      type: "user",
      content: userInputMessage,
      time: currentTime,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Convert current room image to valid URL
      const imageUrl = await convertImageToUrl(roomImage)

      if (!imageUrl) {
        throw new Error("无法获取有效的图片URL。请确保：\n• 已上传房间照片或户型图\n• 图片格式为PNG、JPEG、JPG或WebP\n• 图片大小不超过10MB")
      }

      console.log("[v0] Sending API request with:", {
        prompt: userInputMessage,
        image: imageUrl
      })

      // Call the API with the saved user message
      const generatedImageUrl = await callImageGenerationAPI(userInputMessage, imageUrl)

      // Add AI response with generated image
      const aiMessage: ChatMessage = {
        type: "ai",
        content: `根据您的需求"${userInputMessage}"，我为您生成了新的设计方案：`,
        avatar: "/woman-designer-avatar.png",
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        image: generatedImageUrl,
      }

      setChatMessages((prev) => [...prev, aiMessage])

      // Update the room image with the generated result
      setRoomImage(generatedImageUrl)
    } catch (error) {
      console.error("[v0] Error in handleSendMessage:", error)

      // 提供更友好的错误信息
      let errorContent = "抱歉，处理您的请求时出现了问题。"
      
      if (error instanceof Error) {
        if (error.message.includes("API configuration error")) {
          errorContent = "系统配置错误，请联系客服。"
        } else if (error.message.includes("API request failed")) {
          errorContent = "AI服务暂时不可用，请稍后重试。"
        } else if (error.message.includes("无法获取有效的图片URL")) {
          errorContent = error.message
        } else {
          errorContent = `错误详情：${error.message}`
        }
      }

      // Add error message
      const errorMessage: ChatMessage = {
        type: "ai",
        content: errorContent,
        avatar: "/woman-designer-avatar.png",
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }

      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleRenderEffect = () => {
    // Store current room image for preview page
    sessionStorage.setItem("previewImage", roomImage)
    // Navigate to preview page
    router.push("/preview")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="design" />
      <StepIndicator currentStep={2} />

      <div className="px-4 py-3 border-b border-border bg-card/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">设计工作台</h1>
            <Badge variant="outline">编辑模式</Badge>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="text-sm bg-transparent">
              协作模式
            </Button>
            <Button
              size="sm"
              className="text-sm font-semibold bg-primary hover:bg-primary/90"
              onClick={handleRenderEffect}
            >
              渲染效果
            </Button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right">
          {toastMessage}
        </div>
      )}

      <div className="flex h-[calc(100vh-73px-65px-48px)] max-h-[calc(100vh-73px-65px-48px)]">
        <div className="w-80 xl:w-96 2xl:w-[400px] border-r border-border bg-card/30 overflow-y-auto flex-shrink-0 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0 flex-shrink-0">
              <TabsTrigger value="inspiration">设计灵感</TabsTrigger>
              <TabsTrigger value="furniture">家具推荐</TabsTrigger>
            </TabsList>

            <TabsContent value="inspiration" className="p-4 space-y-4 flex-1 overflow-y-auto">
              {designStyles.map((style, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={style.image || "/placeholder.svg"}
                      alt={style.name}
                      className="w-full h-32 object-cover"
                    />
                    {style.tag && (
                      <Badge className="absolute top-2 left-2 bg-primary text-white text-xs">{style.tag}</Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{style.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{style.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{style.likes}人选择</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{style.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="furniture" className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索家具、材质或品牌..." className="pl-10" />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">按房间分类</h3>
                  <div className="flex flex-wrap gap-2">
                    {roomCategories.map((room, index) => (
                      <Button
                        key={index}
                        variant={room.active ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setSelectedRoom(room.name)
                          setSelectedFurnitureType("")
                        }}
                      >
                        {room.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div data-furniture-section>
                  <h3 className="text-sm font-medium mb-3">家具分类</h3>
                  <div className="space-y-2">
                    {getFurnitureTypes().map((furniture, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${
                          selectedFurnitureType === furniture.name ? "bg-primary/10 border border-primary/20" : ""
                        }`}
                        onClick={() => setSelectedFurnitureType(furniture.name)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{furniture.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{furniture.name}</div>
                            <div className="text-xs text-muted-foreground">{furniture.count}</div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                {selectedFurnitureType === "衣柜" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">衣柜推荐</h3>
                    <div className="space-y-3">
                      {wardrobeProducts.map((product) => (
                        <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="text-xs font-medium mb-1">{product.name}</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-primary">{product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">({product.reviews})</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleAddToChat(product.name, product.image)}
                              >
                                添加到对话
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleQuickReplace(product.id, product.name, product.image)}
                              >
                                🔄 一键更换
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs h-7 flex-shrink-0"
                                onClick={() => handleAddToCart(product.id, product.name, product.price, product.image)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                加购物车
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFurnitureType === "床单" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">床单推荐</h3>
                    <div className="space-y-3">
                      {bedSheetProducts.map((product) => (
                        <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="text-xs font-medium mb-1">{product.name}</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-primary">{product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">({product.reviews})</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleAddToChat(product.name, product.image)}
                              >
                                添加到对话
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleQuickReplace(product.id, product.name, product.image)}
                              >
                                🔄 一键更换
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs h-7 flex-shrink-0"
                                onClick={() => handleAddToCart(product.id, product.name, product.price, product.image)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                加购物车
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFurnitureType === "挂画" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">挂画推荐</h3>
                    <div className="space-y-3">
                      {wallArtProducts.map((product) => (
                        <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="text-xs font-medium mb-1">{product.name}</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-primary">{product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">({product.reviews})</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleAddToChat(product.name, product.image)}
                              >
                                添加到对话
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleQuickReplace(product.id, product.name, product.image)}
                              >
                                🔄 一键更换
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs h-7 flex-shrink-0"
                                onClick={() => handleAddToCart(product.id, product.name, product.price, product.image)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                加购物车
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFurnitureType === "沙发" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">沙发推荐</h3>
                    <div className="space-y-3">
                      {sofaProducts.map((product) => (
                        <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="text-xs font-medium mb-1">{product.name}</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-primary">{product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">({product.reviews})</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleAddToChat(product.name, product.image)}
                              >
                                添加到对话
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleQuickReplace(product.id, product.name, product.image)}
                              >
                                🔄 一键更换
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs h-7 flex-shrink-0"
                                onClick={() => handleAddToCart(product.id, product.name, product.price, product.image)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                加购物车
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFurnitureType === "茶几" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">茶几推荐</h3>
                    <div className="space-y-3">
                      {coffeeTableProducts.map((product) => (
                        <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="text-xs font-medium mb-1">{product.name}</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-primary">{product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">({product.reviews})</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleAddToChat(product.name, product.image)}
                              >
                                添加到对话
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleQuickReplace(product.id, product.name, product.image)}
                              >
                                🔄 一键更换
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs h-7 flex-shrink-0"
                                onClick={() => handleAddToCart(product.id, product.name, product.price, product.image)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                加购物车
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFurnitureType === "花瓶" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">花瓶推荐</h3>
                    <div className="space-y-3">
                      {vaseProducts.map((product) => (
                        <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="text-xs font-medium mb-1">{product.name}</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-primary">{product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">({product.reviews})</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleAddToChat(product.name, product.image)}
                              >
                                添加到对话
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent flex-shrink-0"
                                onClick={() => handleQuickReplace(product.id, product.name, product.image)}
                              >
                                🔄 一键更换
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs h-7 flex-shrink-0"
                                onClick={() => handleAddToCart(product.id, product.name, product.price, product.image)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                加购物车
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFurnitureType === "床" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">床推荐</h3>
                    <div className="space-y-3">{/* Bed products will be added here */}</div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">热门品牌推荐</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["宜家", "MUJI", "HAY", "造作", "梵几", "吱音"].map((brand) => (
                      <Button key={brand} variant="outline" size="sm" className="text-xs bg-transparent">
                        {brand}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 relative flex flex-col h-full min-w-0">
          <div className="flex-1 bg-gradient-to-br from-muted/20 to-background overflow-hidden h-full">
            <div className="w-full h-full flex items-center justify-center p-6 xl:p-8">
              <div className="relative w-full max-w-6xl xl:max-w-7xl h-full max-h-full bg-card rounded-lg shadow-lg overflow-hidden">
                <img
                  src={roomImage || "/placeholder.svg"}
                  alt="设计房间"
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center top" }}
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Move3D className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                    <span className="text-xs text-muted-foreground">缩放: {Math.round(zoomLevel * 100)}%</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                    <div className="text-xs text-muted-foreground mb-1">房间中的关键家具：</div>
                    <div className="flex flex-col gap-1">
                      {keyFurniture.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-primary/10 cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-200"
                          onClick={() => handleFurnitureClick(item.name)}
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 xl:w-96 2xl:w-[400px] border-l border-border bg-card/30 flex flex-col h-full flex-shrink-0">
          <div className="p-4 xl:p-5 border-b border-border flex-shrink-0">
            <h2 className="text-lg xl:text-xl font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI设计助手
            </h2>
            <p className="text-xs xl:text-sm text-muted-foreground mt-1">用自然语言描述你的设计需求</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 xl:p-5 space-y-4 min-h-0 max-h-full">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                {message.type === "ai" && (
                  <Avatar className="h-8 w-8 xl:h-9 xl:w-9 flex-shrink-0">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-white text-xs">AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 xl:p-4 rounded-lg ${
                      message.type === "user" ? "bg-primary text-white" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm xl:text-base whitespace-pre-line">{message.content}</p>
                    {message.image && (
                      <div className="mt-2">
                        <img
                          src={message.image || "/placeholder.svg"}
                          alt="Generated design"
                          className="max-w-full h-auto rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{message.time}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 xl:h-9 xl:w-9 flex-shrink-0">
                  <AvatarImage src="/woman-designer-avatar.png" />
                  <AvatarFallback className="bg-primary text-white text-xs">AI</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="bg-muted p-3 xl:p-4 rounded-lg">
                    <p className="text-sm xl:text-base">正在生成设计方案...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 xl:p-5 border-t border-border flex-shrink-0">
            {chatImages.length > 0 && (
              <div className="mb-3">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {chatImages.map((image) => (
                    <div key={image.id} className="relative flex-shrink-0">
                      <div className="w-16 h-16 xl:w-18 xl:h-18 rounded-lg overflow-hidden border-2 border-border bg-muted">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs hover:bg-destructive/80"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="描述你的设计需求..."
                className="flex-1 xl:text-base"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage()
                  }
                }}
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button size="sm" variant="outline" className="px-2 xl:px-3 bg-transparent">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="sm"
                className="bg-primary xl:px-4"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {["温馨北欧风", "现代简约", "更换衣柜", "调整采光"].map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="text-xs xl:text-sm cursor-pointer hover:bg-primary/10"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
