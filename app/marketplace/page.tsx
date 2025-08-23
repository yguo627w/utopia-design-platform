"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Navigation from "@/components/navigation"
import StepIndicator from "@/components/step-indicator"
import { Search, Filter, ShoppingCart, Heart, Star, Grid, List, X, Plus, Minus } from "lucide-react"

export default function MarketplacePage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const loadCartFromStorage = () => {
      const sharedCart = JSON.parse(localStorage.getItem("sharedCart") || "[]")
      const defaultCart = [
        {
          id: 1001,
          name: "北欧风三人布艺沙发",
          price: 2399,
          image: "/nordic-fabric-sofa.png",
          quantity: 1,
          source: "marketplace",
          addedAt: Date.now(),
        },
      ]

      // 合并默认购物车和从设计页面添加的商品
      const mergedCart = [...defaultCart, ...sharedCart]
      
      // 按添加时间排序，最新的在底部
      mergedCart.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0))
      
      setCartItems(mergedCart)
      console.log("[Marketplace] Loaded cart:", mergedCart)
    }

    loadCartFromStorage()

    const handleStorageChange = () => {
      console.log("[Marketplace] Storage changed, reloading cart")
      loadCartFromStorage()
    }

    const handleCartUpdated = (event: CustomEvent) => {
      console.log("[Marketplace] Cart updated event received:", event.detail)
      loadCartFromStorage()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", handleCartUpdated as EventListener)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdated as EventListener)
    }
  }, [])

  const addToCart = (product: any) => {
    console.log("[v0] Adding product to cart:", product)
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      console.log("[v0] Product already exists, updating quantity")
      // If item already exists, increase quantity
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      console.log("[v0] Adding new product to cart")
      // Add new item to cart
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        source: "marketplace",
        addedAt: Date.now(),
      }

      const updatedCart = [...cartItems, newItem]
      setCartItems(updatedCart)
      console.log("[v0] Updated cart:", updatedCart)

      // Update localStorage for shared cart items
      const sharedItems = updatedCart.filter((item) => item.source === "design")
      localStorage.setItem("sharedCart", JSON.stringify(sharedItems))
    }
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    console.log("[v0] Updating quantity for product", id, "to", newQuantity)
    let updatedCart
    if (newQuantity <= 0) {
      console.log("[v0] Removing product from cart")
      updatedCart = cartItems.filter((item) => item.id !== id)
    } else {
      console.log("[v0] Updating product quantity")
      updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    }

    setCartItems(updatedCart)
    console.log("[v0] Cart after quantity update:", updatedCart)

    const sharedItems = updatedCart.filter((item) => item.source === "design")
    localStorage.setItem("sharedCart", JSON.stringify(sharedItems))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const products = [
    {
      id: 1,
      name: "北欧风三人布艺沙发",
      brand: "简约现代家具",
      price: 2399,
      originalPrice: 2999,
      image: "/nordic-fabric-sofa.png",
      rating: 4.8,
      reviews: 128,
      tags: ["热销"],
      discount: "限时特惠",
    },
    {
      id: 2,
      name: "现代简约茶几",
      brand: "客厅专家",
      price: 899,
      originalPrice: 1299,
      image: "/wooden-coffee-table.png",
      rating: 4.6,
      reviews: 86,
      tags: ["新品"],
      discount: "免运费",
    },
    {
      id: 3,
      name: "轻奢风落地灯",
      brand: "客厅灯具专家",
      price: 599,
      originalPrice: 799,
      image: "/modern-floor-lamp.png",
      rating: 4.7,
      reviews: 215,
      tags: ["以旧换新"],
      discount: "以旧换新",
    },
    {
      id: 4,
      name: "新中式实木餐桌组合",
      brand: "家用小户型4人6人饭桌子",
      price: 3599,
      originalPrice: 4299,
      image: "/chinese-dining-table-set.png",
      rating: 4.5,
      reviews: 76,
      tags: ["热销"],
      discount: "免运费",
    },
    {
      id: 5,
      name: "工业风多层书架",
      brand: "客厅书房置物架展示架",
      price: 1299,
      originalPrice: 1599,
      image: "/placeholder-vyzr9.png",
      rating: 4.4,
      reviews: 156,
      tags: ["热销"],
      discount: "限时特惠",
    },
    {
      id: 6,
      name: "现代简约双人床架",
      brand: "1.8米主卧软包靠背床",
      price: 3899,
      originalPrice: 4599,
      image: "/modern-bed-frame.png",
      rating: 4.6,
      reviews: 98,
      tags: ["以旧换新"],
      discount: "以旧换新",
    },
  ]

  const filters = {
    priceRanges: ["¥0-500", "¥500-1000", "¥1000-3000", "¥3000+"],
    styles: ["北欧风", "现代简约", "轻奢", "新中式", "工业风"],
    brands: ["宜家", "MUJI", "造作", "梵几"],
    promotions: ["以旧换新", "满减优惠", "新品特惠"],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="marketplace" />
      <StepIndicator currentStep={4} />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">家居商城</h1>
            <p className="text-muted-foreground">从设计到购买，一站式打造你的理想空间</p>
          </div>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 max-w-xs">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary text-sm mb-1">寻找专业施工服务？</h3>
                  <p className="text-xs text-muted-foreground">一键获取本地报价</p>
                </div>
                <Button size="sm" className="ml-3 text-xs px-3 py-1">
                  立即咨询
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="font-semibold">筛选条件</span>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">价格范围</h4>
                  <div className="space-y-2">
                    {filters.priceRanges.map((range) => (
                      <div key={range} className="flex items-center space-x-2">
                        <Checkbox id={range} />
                        <label htmlFor={range} className="text-sm cursor-pointer">
                          {range}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div>
                  <h4 className="font-medium mb-3">风格</h4>
                  <div className="space-y-2">
                    {filters.styles.map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox id={style} />
                        <label htmlFor={style} className="text-sm cursor-pointer">
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <h4 className="font-medium mb-3">品牌</h4>
                  <div className="space-y-2">
                    {filters.brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={brand} />
                        <label htmlFor={brand} className="text-sm cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promotions */}
                <div>
                  <h4 className="font-medium mb-3">优惠</h4>
                  <div className="space-y-2">
                    {filters.promotions.map((promo) => (
                      <div key={promo} className="flex items-center space-x-2">
                        <Checkbox id={promo} />
                        <label htmlFor={promo} className="text-sm cursor-pointer">
                          {promo}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">应用筛选</Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Search and Sort */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索家具、装饰或品牌..." className="pl-10" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">排序方式：</span>
                <Button variant="outline" size="sm">
                  推荐
                </Button>
                <Button variant="ghost" size="sm">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                共找到 <span className="font-medium text-primary">128</span> 件商品
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover-lift cursor-pointer">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90">{product.discount}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="absolute bottom-3 left-3 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">¥{product.price}</span>
                          <span className="text-sm text-muted-foreground line-through">¥{product.originalPrice}</span>
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => addToCart(product)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        加入购物车
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full shadow-lg" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          购物车
          <Badge className="ml-2 bg-white text-primary">{getTotalItems()}</Badge>
        </Button>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">购物车</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">购物车为空</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-primary font-bold">¥{item.price}</p>
                        {item.source === "design" && (
                          <Badge variant="outline" className="text-xs mt-1">
                            设计中添加
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">¥{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">总计：</span>
                  <span className="text-2xl font-bold text-primary">¥{getTotalPrice()}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    继续购物
                  </Button>
                  <Button className="flex-1">去结算</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
