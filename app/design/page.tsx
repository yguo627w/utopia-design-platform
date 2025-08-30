"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Navigation from "@/components/navigation"
import StepIndicator from "@/components/step-indicator"
import {
  MessageCircle,
  Send,
  ZoomIn,
  ZoomOut,
  Search,
  Plus,
  Star,
  Heart,
  ChevronRight,
  ShoppingCart,
  Loader2,
  Upload,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Users,
  Baby,
  Dog,
  Cat,
  Heart as HeartIcon,
  User,
  Plus as PlusIcon,
  X,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useCart } from "@/hooks/use-cart"

interface ChatMessage {
  type: "ai" | "user"
  content: string
  avatar?: string
  time: string
  image?: string
}

interface DesignStyle {
  id: string
  name: string
  description: string
  image: string
  likes: string
  rating: number
  tag?: string
  keywords: string[]
  familyTags: string[]
  features: string[]
}

interface FamilyMember {
  id: string
  name: string
  icon: React.ReactNode
  selected: boolean
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
  
  // 新增AI风格设计相关状态
  const [showStyleDesignDialog, setShowStyleDesignDialog] = useState(false)
  const [styleDesignLoading, setStyleDesignLoading] = useState(false)
  const [styleUnderstandingLoading, setStyleUnderstandingLoading] = useState(false)
  const [styleConfirmationDialog, setStyleConfirmationDialog] = useState(false)
  const [styleKeywords, setStyleKeywords] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [customStyleSelected, setCustomStyleSelected] = useState(false)
  
  // 新增风格设计页面状态
  const [showStyleDetail, setShowStyleDetail] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null)
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<string[]>([])
  const [additionalRequirements, setAdditionalRequirements] = useState("")
  const [customFamilyTag, setCustomFamilyTag] = useState("")
  const [showCustomTagInput, setShowCustomTagInput] = useState(false)
  
  // 聊天容器引用，用于自动滚动
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
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
  // 新增状态：一键替换loading和对话式设计loading
  const [quickReplaceLoading, setQuickReplaceLoading] = useState(false)
  const [designAreaLoading, setDesignAreaLoading] = useState(false)
  const router = useRouter()
  const { addToCart } = useCart()

  // 家庭成员标签数据
  const familyMembers: FamilyMember[] = [
    { id: "dog", name: "小狗", icon: <Dog className="h-4 w-4" />, selected: false },
    { id: "cat", name: "小猫", icon: <Cat className="h-4 w-4" />, selected: false },
    { id: "baby", name: "小孩", icon: <Baby className="h-4 w-4" />, selected: false },
    { id: "elder", name: "老人", icon: <User className="h-4 w-4" />, selected: false },
    { id: "couple", name: "情侣", icon: <HeartIcon className="h-4 w-4" />, selected: false },
  ]

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

  // 监听聊天消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isLoading])

  const designStyles: DesignStyle[] = [
    {
      id: "modern-minimalist",
      name: "现代简约风",
      description: "简约而不简单的空间设计，注重功能性与美观性的完美结合",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250830/2690309388.jpg",
      likes: "1.2k",
      rating: 4.8,
      tag: "热门",
      keywords: ["简洁线条", "低饱和色彩", "实用功能", "极简装饰"],
      familyTags: ["情侣", "小孩", "老人"],
      features: ["开放式布局", "隐藏式收纳", "自然采光", "多功能家具"]
    },
    {
      id: "luxury-minimalist",
      name: "轻奢风",
      description: "以简约为基础，融入金属、皮革等元素，打造精致奢华感",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250830/555308476.jpg",
      likes: "890",
      rating: 4.7,
      tag: "推荐",
      keywords: ["金属元素", "高级质感", "精致细节", "简约奢华"],
      familyTags: ["情侣", "老人"],
      features: ["金属装饰", "皮革家具", "水晶灯具", "大理石台面"]
    },
    {
      id: "cream-style",
      name: "奶油风",
      description: "以柔和的奶油色系为主色调，营造出温馨、治愈且充满柔美感的空间氛围",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250830/2883885109.jpg",
      likes: "650",
      rating: 4.6,
      tag: "新晋",
      keywords: ["奶油色系", "柔和质感", "温馨治愈", "圆润造型"],
      familyTags: ["小孩", "老人", "情侣"],
      features: ["柔和色调", "圆润家具", "温暖照明", "舒适材质"]
    },
    {
      id: "wooden-style",
      name: "原木风",
      description: "以天然木材为核心元素，展现木材的自然纹理与质朴质感，打造清新、自然的空间",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250830/2932791773.jpg",
      likes: "1.1k",
      rating: 4.9,
      tag: "经典",
      keywords: ["天然木材", "浅木色调", "自然纹理", "清新质朴"],
      familyTags: ["小孩", "老人", "情侣"],
      features: ["实木家具", "自然纹理", "环保材质", "简约设计"]
    },
    {
      id: "new-chinese",
      name: "新中式",
      description: "融合传统中式元素与现代设计手法，既保留中式的禅意与雅致，又具备现代的舒适与实用",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250830/2240882579.jpg",
      likes: "780",
      rating: 4.5,
      tag: "传统",
      keywords: ["传统元素", "对称布局", "红木色调", "禅意雅致"],
      familyTags: ["老人", "情侣"],
      features: ["红木家具", "对称设计", "传统纹样", "现代舒适"]
    },
    {
      id: "american-style",
      name: "美式风",
      description: "带有复古做旧的质感，以深木色调和大气的线条为主，展现出自由、随性且富有历史感的空间氛围",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250830/2078910165.jpg",
      likes: "920",
      rating: 4.6,
      tag: "复古",
      keywords: ["复古做旧", "深木色调", "大气线条", "自由随性"],
      familyTags: ["情侣", "老人"],
      features: ["复古家具", "深色木材", "大气设计", "历史感装饰"]
    }
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
    },
    {
      id: 202,
      name: "现代布艺沙发",
      image: "https://malexa.bj.bcebos.com/Utopia/%E6%B2%99%E5%8F%912.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E6%B2%99%E5%8F%91%E4%BF%AE%E6%94%B92.png",
      price: "¥3,899",
      rating: 4.7,
      reviews: 203,
    },
    {
      id: 203,
      name: "北欧风沙发",
      image: "https://malexa.bj.bcebos.com/Utopia/%E6%B2%99%E5%8F%913.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E6%B2%99%E5%8F%91%E4%BF%AE%E6%94%B93.png",
      price: "¥5,199",
      rating: 4.9,
      reviews: 128,
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
    {
      id: 302,
      name: "北欧风茶几",
      image: "https://malexa.bj.bcebos.com/Utopia/%E8%8C%B6%E5%87%A02.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E8%8C%B6%E5%87%A0%E4%BF%AE%E6%94%B92.jpg",
      price: "¥2,299",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 303,
      name: "轻奢风茶几",
      image: "https://malexa.bj.bcebos.com/Utopia/%E8%8C%B6%E5%87%A03.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E8%8C%B6%E5%87%A0%E4%BF%AE%E6%94%B93.jpg",
      price: "¥3,199",
      rating: 4.9,
      reviews: 112,
    }
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
    {
      id: 402,
      name: "北欧风花瓶",
      image: "https://malexa.bj.bcebos.com/Utopia/%E8%8A%B1%E7%93%B63.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E8%8A%B1%E7%93%B6%E4%BF%AE%E6%94%B93.jpg",
      price: "¥399",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 403,
      name: "轻奢风花瓶",
      image: "https://malexa.bj.bcebos.com/Utopia/%E8%8A%B1%E7%93%B64.jpg",
      modifiedImage: "https://malexa.bj.bcebos.com/Utopia/%E8%8A%B1%E7%93%B6%E4%BF%AE%E6%94%B94.jpg",
      price: "¥599",
      rating: 4.9,
      reviews: 112,
    }
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
      // 设置一键替换loading状态
      setQuickReplaceLoading(true)
      
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
      
      // 3秒后显示修改后的图片
      setTimeout(() => {
        if (modifiedImage) {
          setRoomImage(modifiedImage)
          setToastMessage(`已将房间中的${productName}替换为修改后的效果`)
        } else {
          setRoomImage(productImage)
          setToastMessage(`已将房间中的${productName}替换为选中的产品`)
        }
        setShowToast(true)
        setQuickReplaceLoading(false)
      }, 3000)
    }
  }

  const handleRemoveImage = (imageId: string) => {
    setChatImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  // 自动滚动到聊天底部
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
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
    // 设置设计区域loading状态
    setDesignAreaLoading(true)

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
      // 清除设计区域loading状态
      setDesignAreaLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  // AI风格设计相关函数
  const handleStyleDesignBannerClick = () => {
    setShowStyleDesignDialog(true)
  }

  const handleReferenceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      const file = files[0]
      
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
        const imageUrl = e.target?.result as string
        setReferenceImage(imageUrl)
        setShowStyleDesignDialog(false)
        
        // 开始AI理解过程
        handleStyleUnderstanding(imageUrl)
      }
      reader.onerror = () => {
        setToastMessage(`读取文件失败：${file.name}`)
        setShowToast(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStyleUnderstanding = async (imageUrl: string) => {
    setStyleUnderstandingLoading(true)
    
    try {
      // 模拟AI理解过程（实际项目中这里应该调用真实的AI理解API）
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 模拟理解结果（实际项目中这里应该是AI返回的真实结果）
      // 使用与弹窗显示一致的详细风格信息
      const mockKeywords = "温馨复古风、主色调暖棕色家具，辅助米白色墙面，点缀墨绿色装饰"
      setStyleKeywords(mockKeywords)
      setStyleConfirmationDialog(true)
    } catch (error) {
      console.error("风格理解失败:", error)
      setToastMessage("风格理解失败，请重试")
      setShowToast(true)
    } finally {
      setStyleUnderstandingLoading(false)
    }
  }

  const handleConfirmStyleDesign = async () => {
    setStyleConfirmationDialog(false)
    setStyleDesignLoading(true)
    setCustomStyleSelected(true)
    
    try {
      if (!referenceImage) {
        throw new Error("没有参考图片")
      }

      // 调用豆包API进行风格设计
      // 按照要求构造prompt：『在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下：把房间修改为+：${styleKeywords}』
      const prompt = `在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下：把房间修改为+：${styleKeywords}`
      
      // 使用convertImageToUrl函数将当前房间图片转换为有效的URL
      // 这样可以确保本地上传的图片能够被豆包API正确识别和处理
      const targetImageUrl = await convertImageToUrl(roomImage)
      
      if (!targetImageUrl) {
        throw new Error("无法获取有效的图片URL，请确保已上传房间图片")
      }
      
      console.log("[AI风格设计] 转换后的图片URL:", targetImageUrl.substring(0, 100) + "...")
      
      // 同时传入转换后的图片URL和修改prompt
      // 这样AI就能基于当前房间图片，按照指定风格进行重新设计
      const generatedImageUrl = await callImageGenerationAPI(prompt, targetImageUrl)
      
      // 更新房间图片
      setRoomImage(generatedImageUrl)
      
      // 添加AI消息到对话
      const aiMessage: ChatMessage = {
        type: "ai",
        content: `根据您上传的参考图片，我为您生成了"${styleKeywords}"风格的设计方案：`,
        avatar: "/woman-designer-avatar.png",
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        image: generatedImageUrl,
      }
      setChatMessages((prev) => [...prev, aiMessage])
      
      setToastMessage("风格设计方案生成成功！")
      setShowToast(true)
    } catch (error) {
      console.error("风格设计失败:", error)
      setToastMessage("风格设计失败，请重试")
      setShowToast(true)
    } finally {
      setStyleDesignLoading(false)
    }
  }

  // 新增风格设计相关函数
  const handleStyleClick = (style: DesignStyle) => {
    setSelectedStyle(style)
    setShowStyleDetail(true)
    setSelectedFamilyMembers([])
    setAdditionalRequirements("")
    setCustomFamilyTag("")
    setShowCustomTagInput(false)
  }

  const handleBackToStyles = () => {
    setShowStyleDetail(false)
    setSelectedStyle(null)
  }

  const handleFamilyMemberToggle = (memberId: string) => {
    setSelectedFamilyMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleAddCustomFamilyTag = () => {
    if (customFamilyTag.trim()) {
      setSelectedFamilyMembers(prev => [...prev, customFamilyTag.trim()])
      setCustomFamilyTag("")
      setShowCustomTagInput(false)
    }
  }

  const handleRemoveFamilyMember = (memberId: string) => {
    setSelectedFamilyMembers(prev => prev.filter(id => id !== memberId))
  }

  const handleApplyStyle = async () => {
    if (!selectedStyle || !roomImage) {
      setToastMessage("请先选择风格和上传房间图片")
      setShowToast(true)
      return
    }

    setStyleDesignLoading(true)
    
    try {
      // 构建家庭成员标签描述
      const familyMemberDescriptions = selectedFamilyMembers.map(memberId => {
        const member = familyMembers.find(m => m.id === memberId)
        return member ? member.name : memberId
      }).join("、")

      // 构建风格应用设置的家具元素
      const styleFurnitureElements = selectedFamilyMembers.map(memberId => {
        switch (memberId) {
          case "dog":
            return "狗窝"
          case "cat":
            return "猫爬架"
          case "child":
            return "婴儿车"
          case "elderly":
            return "舒适躺椅"
          case "couple":
            return "温馨照片墙"
          default:
            return memberId
        }
      }).join("、")

      // 构建完整的prompt，按照指定结构
      const prompt = `在整体图片色调不发生明显变化、家具结构不改变的前提下，请按照以下输入进行图片修改：把房间修改为【${selectedStyle.name}】，关键词为【${selectedStyle.keywords.join("、")}】，在设计过程中注意增加【${styleFurnitureElements}】相关家具元素，并注意用户补充需求【${additionalRequirements || "无特殊要求"}】。`
      
      // 调用豆包API进行风格应用
      const targetImageUrl = await convertImageToUrl(roomImage)
      
      if (!targetImageUrl) {
        throw new Error("无法获取有效的图片URL，请确保已上传房间图片")
      }
      
      console.log("[风格应用] 应用风格:", prompt)
      console.log("[风格应用] 目标图片:", targetImageUrl.substring(0, 100) + "...")
      
      const generatedImageUrl = await callImageGenerationAPI(prompt, targetImageUrl)
      
      // 更新房间图片
      setRoomImage(generatedImageUrl)
      
      // 添加AI消息到对话
      const aiMessage: ChatMessage = {
        type: "ai",
        content: `已成功应用${selectedStyle.name}风格！我根据您选择的家庭成员标签（${familyMemberDescriptions}）和补充需求，为您生成了全新的设计方案。新的设计融合了${selectedStyle.keywords.join("、")}等风格特征，并特别考虑了${styleFurnitureElements}等家具元素的布局。`,
        avatar: "/woman-designer-avatar.png",
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        image: generatedImageUrl,
      }
      setChatMessages((prev) => [...prev, aiMessage])
      
      // 关闭风格详情页面
      setShowStyleDetail(false)
      setSelectedStyle(null)
      
      setToastMessage("风格应用成功！")
      setShowToast(true)
    } catch (error) {
      console.error("风格应用失败:", error)
      setToastMessage("风格应用失败，请重试")
      setShowToast(true)
    } finally {
      setStyleDesignLoading(false)
    }
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
        <div className="w-72 xl:w-80 2xl:w-[320px] border-r border-border bg-card/30 overflow-y-auto flex-shrink-0 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0 flex-shrink-0">
              <TabsTrigger value="inspiration">设计灵感</TabsTrigger>
              <TabsTrigger value="furniture">家具推荐</TabsTrigger>
            </TabsList>

            <TabsContent value="inspiration" className="p-4 space-y-3 flex-1 overflow-y-auto">
              {/* 返回按钮 - 仅在显示风格详情时显示 */}
              {showStyleDetail && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToStyles}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    返回风格列表
                  </Button>
                </div>
              )}

              {/* 风格详情页面 */}
              {showStyleDetail && selectedStyle ? (
                <div className="space-y-4">
                  {/* 风格头部信息 */}
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
                    <div className="relative">
                      <img
                        src={selectedStyle.image || "/placeholder.svg"}
                        alt={selectedStyle.name}
                        className="w-full h-48 object-cover"
                      />
                      {selectedStyle.tag && (
                        <Badge className="absolute top-3 left-3 bg-primary text-white text-xs">{selectedStyle.tag}</Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{selectedStyle.name}</h2>
                      <p className="text-sm text-muted-foreground mb-3">{selectedStyle.description}</p>
                      
                      {/* 风格关键词 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">风格关键词</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStyle.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* 统计数据 */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{selectedStyle.likes}人选择</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{selectedStyle.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 风格应用表单 */}
                  <div className="bg-card rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      风格应用设置
                    </h3>
                    
                    {/* 家庭成员标签 */}
                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">家庭成员标签（多选）</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {familyMembers.map((member) => (
                          <div
                            key={member.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                              selectedFamilyMembers.includes(member.id)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/50 border-border hover:bg-muted"
                            }`}
                            onClick={() => handleFamilyMemberToggle(member.id)}
                          >
                            {member.icon}
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* 自定义标签 */}
                      {showCustomTagInput ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="输入自定义标签"
                            className="flex-1"
                            value={customFamilyTag}
                            onChange={(e) => setCustomFamilyTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddCustomFamilyTag()
                              }
                            }}
                          />
                          <Button size="sm" onClick={handleAddCustomFamilyTag}>
                            添加
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowCustomTagInput(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCustomTagInput(true)}
                          className="flex items-center gap-2"
                        >
                          <PlusIcon className="h-4 w-4" />
                          添加自定义标签
                        </Button>
                      )}
                      
                      {/* 已选择的标签 */}
                      {selectedFamilyMembers.length > 0 && (
                        <div className="mt-3">
                          <Label className="text-sm font-medium mb-2 block">已选择的标签：</Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedFamilyMembers.map((memberId) => {
                              const member = familyMembers.find(m => m.id === memberId)
                              return member ? (
                                <Badge
                                  key={memberId}
                                  variant="default"
                                  className="flex items-center gap-1 cursor-pointer hover:bg-primary/80"
                                  onClick={() => handleRemoveFamilyMember(memberId)}
                                >
                                  {member.icon}
                                  {member.name}
                                  <X className="h-3 w-3 ml-1" />
                                </Badge>
                              ) : (
                                <Badge
                                  key={memberId}
                                  variant="default"
                                  className="flex items-center gap-1 cursor-pointer hover:bg-primary/80"
                                  onClick={() => handleRemoveFamilyMember(memberId)}
                                >
                                  {memberId}
                                  <X className="h-3 w-3 ml-1" />
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 补充需求 */}
                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-2 block">补充需求（可选）</Label>
                      <Textarea
                        placeholder="例如：想要更多原木色，需要充足的储物空间，希望有良好的采光..."
                        className="min-h-[80px]"
                        value={additionalRequirements}
                        onChange={(e) => setAdditionalRequirements(e.target.value)}
                      />
                    </div>

                    {/* 应用按钮 */}
                    <Button
                      onClick={handleApplyStyle}
                      disabled={styleDesignLoading}
                      className="w-full h-12 text-base font-semibold"
                    >
                      {styleDesignLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          AI智能设计中，正在为您的小家打造温暖角落，请稍后
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          一键应用
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* AI风格设计Banner */}
                  <div 
                    className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 cursor-pointer hover:from-primary/20 hover:to-primary/10 transition-all duration-200"
                    onClick={handleStyleDesignBannerClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 rounded-full p-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-primary mb-1">没有喜欢的风格？</h3>
                        <p className="text-xs text-muted-foreground">上传参考图AI帮你设计</p>
                      </div>
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* 自定义设计风格（选中态） */}
                  {customStyleSelected && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm text-primary">自定义设计风格</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{styleKeywords}</p>
                    </div>
                  )}

                  {/* 推荐设计风格列表 */}
                  {designStyles.map((style, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleStyleClick(style)}
                    >
                      <div className="relative">
                        <img
                          src={style.image || "/placeholder.svg"}
                          alt={style.name}
                          className="w-full h-28 object-cover"
                        />
                        {style.tag && (
                          <Badge className="absolute top-2 left-2 bg-primary text-white text-xs">{style.tag}</Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{style.name}</h3>
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
                </>
              )}
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

                {/* 家具推荐区域 - 使用双列布局 */}
                {selectedFurnitureType && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">{selectedFurnitureType}推荐</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(() => {
                        let products: any[] = []
                        switch (selectedFurnitureType) {
                          case "衣柜":
                            products = wardrobeProducts
                            break
                          case "沙发":
                            products = sofaProducts
                            break
                          case "茶几":
                            products = coffeeTableProducts
                            break
                          case "花瓶":
                            products = vaseProducts
                            break
                          case "床单":
                            products = bedSheetProducts
                            break
                          case "挂画":
                            products = wallArtProducts
                            break
                          default:
                            return null
                        }
                        
                        return products.map((product) => (
                          <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-20 object-cover"
                            />
                            <div className="p-2">
                              <h4 className="text-xs font-medium mb-1 line-clamp-1">{product.name}</h4>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-primary">{product.price}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{product.rating}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-6 bg-transparent flex-shrink-0"
                                  onClick={() => handleAddToChat(product.name, product.image)}
                                >
                                  添加到对话
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-6 bg-transparent flex-shrink-0"
                                  onClick={() => handleQuickReplace(product.id, product.name, product.image)}
                                >
                                  🔄 一键更换
                                </Button>
                                <Button
                                  size="sm"
                                  className="text-xs h-6 flex-shrink-0"
                                  onClick={() => handleAddToCart(product.id, product.name, product.price, product.image)}
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  加购物车
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      })()}
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
            {/* 顶部工具栏区域 */}
            <div className="absolute top-4 left-4 z-10 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              {/* 缩放控制 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">缩放</span>
                <Button size="sm" variant="secondary" onClick={handleZoomIn} className="h-7 w-7 p-0">
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="secondary" onClick={handleZoomOut} className="h-7 w-7 p-0">
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <span className="text-xs text-muted-foreground px-2 font-medium">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>
              
              {/* 关键家具信息 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg max-w-xs">
                <div className="text-xs text-muted-foreground mb-2 font-medium">房间中的关键家具</div>
                <div className="flex flex-wrap gap-1">
                  {keyFurniture.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-md hover:bg-primary/10 cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-200 bg-muted/50"
                      onClick={() => handleFurnitureClick(item.name)}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-full flex items-center justify-center p-6 xl:p-8">
              <div className="relative w-full max-w-6xl xl:max-w-7xl h-full max-h-full bg-card rounded-lg shadow-lg overflow-hidden">
                {/* 一键替换loading效果 */}
                {quickReplaceLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">AI智能设计中…</p>
                        <p className="text-sm text-gray-600 mt-1">正在为您生成设计方案，请稍候</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 对话式设计loading效果 */}
                {designAreaLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">AI智能设计中…</p>
                        <p className="text-sm text-gray-600 mt-1">正在根据您的需求生成设计方案</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI风格设计loading效果 */}
                {styleDesignLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">AI智能设计中…</p>
                        <p className="text-sm text-gray-600 mt-1">正在为您生成设计方案，请稍后</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI风格理解loading效果 */}
                {styleUnderstandingLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">AI智能理解中…</p>
                        <p className="text-sm text-gray-600 mt-1">正在为您生成设计方案，请稍候</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <img
                  src={roomImage || "/placeholder.svg"}
                  alt="设计房间"
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center top" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-72 xl:w-80 2xl:w-[320px] border-l border-border bg-card/30 flex flex-col h-full flex-shrink-0">
          <div className="p-4 xl:p-5 border-b border-border flex-shrink-0">
            <h2 className="text-lg xl:text-xl font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI设计助手
            </h2>
            <p className="text-xs xl:text-sm text-muted-foreground mt-1">用自然语言描述你的设计需求</p>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 xl:p-5 space-y-4 min-h-0 max-h-full">
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

      {/* AI风格设计上传对话框 */}
      <Dialog open={showStyleDesignDialog} onOpenChange={setShowStyleDesignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI风格设计
            </DialogTitle>
            <DialogDescription>
              上传您喜欢的家装风格参考图片，AI将为您生成个性化的设计方案
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleReferenceImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">点击上传参考图片</p>
                <p className="text-xs text-muted-foreground">支持 PNG、JPEG、WebP 格式，最大 10MB</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 风格确认对话框 */}
      <Dialog open={styleConfirmationDialog} onOpenChange={setStyleConfirmationDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              风格理解确认
            </DialogTitle>
            <DialogDescription>
              已经根据你上传的图片，理解家装风格关键词如下所示，请确认是否依据此风格进行设计
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-primary mb-3">识别到的风格信息：</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium">温馨复古风、主色调暖棕色家具，辅助米白色墙面，点缀墨绿色装饰</span></p>
              </div>
            </div>
            {referenceImage && (
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={referenceImage}
                  alt="参考图片"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStyleConfirmationDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmStyleDesign}>
              确认设计
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
