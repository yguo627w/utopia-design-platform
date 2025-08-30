import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navigation from "@/components/navigation"
import { Search, Heart, MessageCircle, Bookmark, Plus } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const posts = [
    {
      id: 7,
      title: "新中式书房设计，传统与现代的完美融合",
      author: "李怡璇",
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/1587899160.png",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/020d64a79e10bf71640960c4d8ed2fab.png",
      likes: 1456,
      comments: 234,
      tags: ["新中式", "书房", "传统"],
    },
    {
      id: 11,
      title: "10㎡阳台变身空中花园，都市中的绿色角落",
      author: "徐大淋",
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/1517810536.png",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/81c6b5079485a40c3d1743ef84c1daf0.png",
      likes: 987,
      comments: 156,
      tags: ["阳台", "花园", "绿植"],
    },
    {
      id: 8,
      title: "500元改造出租屋客厅，从破旧到温馨的蜕变",
      author: "郭宇华",
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/4220875564.png",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/74f8802894c5430f9427cacce3e582f3.png",
      likes: 2134,
      comments: 456,
      tags: ["出租屋", "改造", "预算"],
    },
    {
      id: 10,
      title: "30㎡小户型卧室改造，极简风也能温馨舒适",
      author: "曹雨",
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/2775754103.png",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/8449924cde76a54a2f8e85ae7d7a191c.png",
      likes: 1234,
      comments: 189,
      tags: ["极简风", "小户型", "卧室改造"],
    },
    {
      id: 9,
      title: "北欧风客厅设计，温暖自然的居家氛围",
      author: "温瑞涵",
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/3050927499.png",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/ff7b560a584c999bc7299f871c66f3af.png",
      likes: 1789,
      comments: 312,
      tags: ["北欧风", "客厅", "温馨"],
    },
    {
      id: 12,
      title: "老房改造：工业风厨房设计，粗犷中带着精致",
      author: "叶文威",
      avatar: "https://b.bdstatic.com/searchbox/image/gcp/20250822/914581908.png",
      image: "https://design.gemcoder.com/staticResource/echoAiSystemImages/6d83ac26770968679d97fa2e1b198b7a.png",
      likes: 1567,
      comments: 278,
      tags: ["工业风", "厨房", "老房改造"],
    },
    {
      id: 3,
      title: "新中式茶室设计，传统与现代的完美融合",
      author: "茶室设计师",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/chinese-tea-room.png",
      likes: 567,
      comments: 78,
      tags: ["新中式", "茶室", "传统"],
    },
    {
      id: 4,
      title: "北欧风客厅设计，温暖自然的家居氛围",
      author: "北欧风爱好者",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/nordic-living-room.png",
      likes: 432,
      comments: 65,
      tags: ["北欧风", "客厅", "温暖"],
    },
    {
      id: 5,
      title: "日式风格卧室，打造禅意生活空间",
      author: "禅意生活",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/japanese-zen-bedroom.png",
      likes: 789,
      comments: 123,
      tags: ["日式", "卧室", "禅意"],
    },
    {
      id: 1,
      title: "30㎡小户型改造，极简风格温馨舒适",
      author: "设计师小美",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/minimalist-bedroom-plants.png",
      likes: 1234,
      comments: 89,
      tags: ["小户型", "极简", "改造"],
    },
    {
      id: 2,
      title: "老房改造：工业风客厅，粗犷中带着精致",
      author: "改造达人",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/industrial-open-kitchen.png",
      likes: 896,
      comments: 156,
      tags: ["工业风", "客厅", "老房改造"],
    },
    {
      id: 6,
      title: "1500元改造出租房，从简陋到温馨的蜕变",
      author: "租房改造师",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/rental-apartment-makeover.png",
      likes: 1567,
      comments: 234,
      tags: ["租房", "改造", "预算"],
    },
  ]

  const categories = ["最新", "热门", "小户型", "北欧风", "工业风", "日式", "新中式"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="community" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">探索设计社区</h1>
          <p className="text-muted-foreground mb-6">发现最新设计灵感和创意，与设计师们分享交流</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索设计方案、风格或设计师..." className="pl-10" />
            </div>
            <Button className="bg-primary hover:bg-primary/90">分享你的设计</Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
              <Badge
                key={category}
                variant={index === 0 ? "default" : "outline"}
                className={`cursor-pointer hover:bg-primary/10 ${index === 0 ? "bg-primary" : ""}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover-lift cursor-pointer group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{post.author}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            加载更多
          </Button>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">分享你的设计，获得更多灵感</h2>
          <p className="text-muted-foreground mb-8">加入设计师社区，与千万用户分享创意，让设计更有温度</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/upload">
                <Plus className="mr-2 h-4 w-4" />
                发布设计作品
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              加入设计师社群
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
