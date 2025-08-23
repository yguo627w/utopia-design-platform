"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import { ArrowRight, Home, Users, MessageCircle, Upload, Camera, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const router = useRouter()

  const showcaseProjects = [
    {
      id: 1,
      title: "温馨北欧风客厅",
      description: "25㎡小户型改造",
      image: "/nordic-living-room.png",
      tags: ["北欧风", "小户型", "客厅"],
      likes: 128,
      views: 1200,
    },
    {
      id: 2,
      title: "现代简约卧室",
      description: "租房改造案例",
      image: "/minimalist-bedroom-plants.png",
      tags: ["现代", "卧室", "租房"],
      likes: 89,
      views: 890,
    },
    {
      id: 3,
      title: "工业风厨房",
      description: "开放式设计",
      image: "/industrial-open-kitchen.png",
      tags: ["工业风", "厨房", "开放式"],
      likes: 156,
      views: 1450,
    },
  ]

  const roomTypes = [
    { name: "客厅", image: "/modern-living-room.png" },
    { name: "卧室", image: "/cozy-bedroom.png" },
    { name: "厨房", image: "/modern-kitchen.png" },
    { name: "卫生间", image: "/modern-bathroom.png" },
  ]

  const testimonials = [
    {
      name: "李怡璇",
      role: "装修小白",
      content:
        "作为一个装修小白，以前想都不敢想自己设计房子。现在用'我的乌托邦'，上传照片，说一句'温馨北欧风'，AI就生成了我梦想中的家！太神奇了！",
      rating: 5,
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/1587899160.png",
    },
    {
      name: "郭宇华",
      role: "租房用户",
      content:
        "租的房子不想花太多钱装修，但又想住得舒服。用这个AI设计工具，花了不到2000块就把出租屋改造得焕然一新，朋友们都惊呆了！",
      rating: 5,
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/4220875564.png",
    },
    {
      name: "曹雨",
      role: "设计爱好者",
      content:
        "最让我惊喜的是以图搜物功能！看到喜欢的设计方案，直接点击家具就能比价购买，省去了到处找同款的麻烦，还省了不少钱！",
      rating: 5,
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/2775754103.png",
    },
    {
      name: "徐大淋",
      role: "新房业主",
      content: "'我的乌托邦'的实景渲染能力太强了，第一次看到我的房子搭配我想新买的灯具在不同场景和光照下的神奇效果",
      rating: 5,
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/1517810536.png",
    },
  ]

  const renterCases = [
    {
      title: "卧室改造",
      before: "/rental-bedroom-before.png",
      after: "/rental-bedroom-after.png",
      description: "10㎡出租屋卧室，温馨改造",
    },
    {
      title: "客厅改造",
      before: "/rental-living-before.png",
      after: "/rental-living-after.png",
      description: "小客厅空间最大化利用",
    },
    {
      title: "厨房改造",
      before: "/rental-kitchen-before.png",
      after: "/rental-kitchen-after.png",
      description: "狭窄厨房功能性提升",
    },
  ]

  const buyerCases = [
    {
      title: "新中式之家",
      before: "/buyer-chinese-before.png",
      after: "/buyer-chinese-after.png",
      description: "户型图到实景装修",
    },
    {
      title: "现代风设计",
      before: "/buyer-modern-before.png",
      after: "/buyer-modern-after.png",
      description: "简约现代三居室",
    },
    {
      title: "DIY温馨小屋",
      before: "/buyer-cozy-before.png",
      after: "/buyer-cozy-after.png",
      description: "亲手打造理想家园",
    },
  ]

  const styleCards = [
    {
      name: "简约风",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250823/3667326276.jpg",
    },
    {
      name: "温馨风",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250823/3179002496.jpg",
    },
    {
      name: "新中式",
      image: "https://b.bdstatic.com/searchbox/image/gcp/20250823/3939466376.jpg",
    },
    {
      name: "轻奢风",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/e92c83e291e5c683f509ebb453f71d93.png",
    },
  ]

  const handleStyleSelect = (style: { name: string; image: string }) => {
    sessionStorage.setItem("selectedStyleImage", style.image)
    sessionStorage.setItem("selectedStyleTitle", style.name)
    sessionStorage.setItem("selectedStyleType", "style")
    router.push("/design")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="home" />

      <section className="py-24 px-4 bg-gradient-to-br from-primary/8 to-accent/8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-balance">
                <span className="text-primary">AI助力，</span>
                <span className="text-foreground">秒建乌托邦</span>
              </h1>
              <p className="text-2xl text-primary font-medium mb-6">你的家，你定义！</p>
              <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
                只需上传房间照片或户型图，用自然语言描述改造需求，AI即可生成个性化设计方案，让每个空间成为自我的延伸
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" asChild className="text-xl px-16 py-8 font-semibold shadow-xl hover-lift">
                  <Link href="/upload">
                    开始设计 <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-xl px-10 py-8 bg-card/50 backdrop-blur-sm hover-lift"
                >
                  <Link href="/community">设计浏览</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-card">
                <div className="aspect-video relative">
                  <img
                    src="https://design.gemcoder.com/staticResource/echoAiSystemImages/676985223975790e510ca20672144337.png"
                    alt="AI设计演示"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-16">
                    <div className="max-w-xs">
                      <h3 className="font-semibold text-white text-xl mb-3">北欧风温馨客厅</h3>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        由AI根据'温馨北欧风客厅，有大窗户和绿植'生成
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full h-12 w-12 bg-white/90 hover:bg-white shadow-xl hover-scale"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    >
                      {isVideoPlaying ? (
                        <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                      ) : (
                        <div className="w-0 h-0 border-l-[6px] border-l-gray-700 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-balance">AI助力，让设计触手可及</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              结合前沿AI技术与专业设计理念，为每个人提供个性化的家居设计解决方案
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover-lift border-0 bg-gradient-to-br from-primary/8 to-transparent group p-4">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">自然语言交互</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      只需说出'温馨北欧风客厅'，AI即可理解并生成专业设计方案
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift border-0 bg-gradient-to-br from-accent/8 to-transparent group p-4">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">实景渲染</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      基于真实采光和GPS定位，生成1:1还原的日夜季节效果图
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift border-0 bg-gradient-to-br from-secondary/8 to-transparent group p-4">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">协作设计</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      邀请家人或设计师实时协作，共同打造理想家园
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">灵感案例</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              结合前沿AI技术与专业设计理念，为每个人提供个性化的家居设计解决方案
            </p>
          </div>

          {/* Renter Cases */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge className="text-lg px-6 py-2 mb-4">租房党</Badge>
              <h3 className="text-2xl font-bold text-primary">房子是租来的，但生活不是</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {renterCases.map((caseItem, index) => (
                <Card key={index} className="overflow-hidden hover-lift">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                      <div className="relative">
                        <img
                          src={caseItem.before || "/placeholder.svg"}
                          alt="改造前"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          改造前
                        </div>
                      </div>
                      <div className="relative">
                        <img
                          src={caseItem.after || "/placeholder.svg"}
                          alt="改造后"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                          改造后
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-1">{caseItem.title}</h4>
                      <p className="text-sm text-muted-foreground">{caseItem.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Buyer Cases */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <Badge className="text-lg px-6 py-2 mb-4">买房党</Badge>
              <h3 className="text-2xl font-bold text-primary">动手DIY的家，点滴凝聚温暖</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {buyerCases.map((caseItem, index) => (
                <Card key={index} className="overflow-hidden hover-lift">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                      <div className="relative">
                        <img
                          src={caseItem.before || "/placeholder.svg"}
                          alt="户型图"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          户型图
                        </div>
                      </div>
                      <div className="relative">
                        <img
                          src={caseItem.after || "/placeholder.svg"}
                          alt="实景图"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                          实景图
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-1">{caseItem.title}</h4>
                      <p className="text-sm text-muted-foreground">{caseItem.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild className="px-12 bg-transparent">
              <Link href="/community">查看更多案例</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Start Creating Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">开始创建你的梦想空间</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              上传房间照片或选择示范风格，让AI为你打造专属设计方案
            </p>
          </div>

          {/* Style Selection */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">选择风格，快速生成</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {styleCards.map((style, index) => (
                <Card key={index} className="group cursor-pointer hover-lift" onClick={() => handleStyleSelect(style)}>
                  <CardContent className="p-4 text-center">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={style.image || "/placeholder.svg"}
                        alt={style.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-semibold mb-3">{style.name}</h4>
                    <Button size="sm" className="w-full">
                      开始设计
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upload Section */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-dashed border-primary/30 bg-white/50 backdrop-blur-sm hover-lift">
              <CardContent className="p-12 text-center">
                <Upload className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">上传户型图开始设计</h3>
                <p className="text-muted-foreground mb-8">支持JPG、PNG格式，文件大小不超过10MB</p>
                <Button size="lg" asChild className="px-12">
                  <Link href="/upload#upload">上传图片开始设计</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Showcase Section */}

      <section className="py-24 px-4 bg-gradient-to-br from-muted/30 to-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-balance">用户怎么说</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">来自真实用户的使用体验和评价</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground mb-8 text-sm leading-relaxed line-clamp-3">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-balance">准备好打造你的梦想空间了吗？</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed">
            加入数万用户的设计之旅，让AI帮你实现理想家居
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-16 py-8 hover-lift shadow-xl">
              <Link href="/upload#upload">
                上传图片开始设计 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-16 py-8 border-white text-white hover:bg-white hover:text-primary bg-transparent hover-lift"
            >
              <Link href="/community">浏览案例</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">我的乌托邦</span>
              </div>
              <p className="text-gray-300 mb-4">让每个人都能轻松打造理想家园</p>
              <div className="flex gap-4">{/* Social media icons would go here */}</div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/upload" className="hover:text-white transition-colors">
                    开始设计
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    案例社区
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="hover:text-white transition-colors">
                    家具商城
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    帮助中心
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    联系我们
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    用户协议
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">关于</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    关于我们
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    加入我们
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    媒体报道
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 我的乌托邦. 保留所有权利.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="rounded-full h-16 w-16 shadow-2xl animate-float hover-scale" title="AI助手">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
