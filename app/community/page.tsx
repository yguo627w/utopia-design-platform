import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navigation from "@/components/navigation"
import { Search, Heart, MessageCircle, Bookmark, Plus, Hash } from "lucide-react"
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

  // 话题数据
  const topics = [
    { name: "租房改造避雷", color: "bg-red-100 text-red-700 hover:bg-red-200" },
    { name: "租房DIY指南", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { name: "家是我的能量场", color: "bg-green-100 text-green-700 hover:bg-green-200" },
    { name: "二手家具交易", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" }
  ]

  // 置顶消息数据
  const pinnedMessages = [
    {
      type: "求购",
      furniture: "电视支架",
      count: 7,
      users: ["@大淋大淋", "@caoyu19"]
    },
    {
      type: "出售", 
      furniture: "懒人沙发",
      count: 13,
      users: ["@怡璇errr", "@海淀机器人"]
    }
  ]

  // 讨论数据
  const discussions = [
    {
      id: 1,
      user: "北京租房小王",
      avatar: "/placeholder.svg",
      topic: "二手家具交易",
      content: "收一个二手电视支架~北京可以自提",
      time: "2小时前",
      likes: 12,
      comments: 3,
      type: "求购",
      location: "北京·海淀区"
    },
    {
      id: 2,
      user: "海淀家具达人",
      avatar: "/placeholder.svg", 
      topic: "二手家具交易",
      content: "出一个简易鞋柜，能放20双运动鞋，支持海淀自提",
      time: "4小时前",
      likes: 28,
      comments: 15,
      type: "出售",
      location: "北京·海淀区"
    },
    {
      id: 3,
      user: "朝阳改造师",
      avatar: "/placeholder.svg",
      topic: "租房改造避雷", 
      content: "家人们，千万别买隔音棉，真的一点用都没有用，与其这样不如买副耳机…",
      time: "6小时前",
      likes: 45,
      comments: 8,
      type: "分享",
      location: "北京·朝阳区"
    },
    {
      id: 4,
      user: "能量场设计师",
      avatar: "/placeholder.svg",
      topic: "家是我的能量场",
      content: "家里的植物真的能改变心情，推荐几款好养的绿植给大家",
      time: "8小时前", 
      likes: 67,
      comments: 22,
      type: "分享",
      location: "北京·朝阳区"
    }
  ]

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

        {/* 左右分区布局 */}
        <div className="flex gap-6">
          {/* 左侧：灵感图片展示 (2/3) */}
          <div className="flex-1 w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            
            {/* 加载更多按钮 */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                加载更多
              </Button>
            </div>
          </div>

          {/* 右侧：社区讨论整卡 (1/3) */}
          <div className="w-1/3">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  社区讨论
                </h3>
                
                {/* 置顶消息 */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">置顶消息</h4>
                  <div className="space-y-3">
                    {pinnedMessages.map((message, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm">
                              {message.type === "求购" ? (
                                <span className="text-blue-700">
                                  你想购买的「<span className="font-semibold">{message.furniture}</span>」有<span className="font-semibold text-orange-600">{message.count}</span>人在售：
                                </span>
                              ) : (
                                <span className="text-green-700">
                                  你想出手的「<span className="font-semibold">{message.furniture}</span>」有<span className="font-semibold text-orange-600">{message.count}</span>人在求购：
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex flex-wrap gap-1">
                                {message.users.map((user, userIndex) => (
                                  <span key={userIndex} className="text-xs bg-white px-2 py-1 rounded-full border border-blue-200 text-blue-600">
                                    {user}
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">…</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="ml-3 text-xs h-7 px-3">
                            去讨论
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 热门话题 */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">热门话题</h4>
                  <div className="space-y-2">
                    {topics.map((topic, index) => (
                      <div
                        key={topic.name}
                        className={`inline-block px-3 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${topic.color}`}
                      >
                        #{topic.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 热区讨论 */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">热区讨论</h4>
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <div key={discussion.id} className="border-b border-border/50 pb-4 last:border-b-0">
                        {/* 第一行：用户头像、用户昵称、发布时间 */}
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={discussion.avatar} />
                            <AvatarFallback>{discussion.user[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{discussion.user}</span>
                          <span className="text-xs text-muted-foreground">{discussion.time}</span>
                        </div>
                        
                        {/* 第二行：内容文案 */}
                        <p className="text-sm text-foreground mb-2 line-clamp-2">
                          {discussion.content}
                        </p>
                        
                        {/* 第三行：标签信息 */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {discussion.type === "求购" && (
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
                              附近的人求购中
                            </Badge>
                          )}
                          {discussion.type === "出售" && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
                              附近的人正在卖
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            #{discussion.topic}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            📌{discussion.location}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    查看更多讨论
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
