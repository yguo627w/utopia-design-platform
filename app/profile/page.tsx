import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Eye, MessageCircle, Share2, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

export default function ProfilePage() {
  const myProjects = [
    {
      id: 1,
      title: "温馨北欧客厅改造",
      description: "75㎡两居室设计方案",
      image: "/nordic-living-room.png",
      createdAt: "2024-01-15",
      likes: 128,
      views: 1200,
      status: "已完成",
    },
    {
      id: 2,
      title: "现代简约卧室",
      description: "主卧室装修设计",
      image: "/minimalist-bedroom-plants.png",
      createdAt: "2024-01-10",
      likes: 89,
      views: 890,
      status: "设计中",
    },
  ]

  const communityPosts = [
    {
      id: 1,
      title: "小户型收纳神器分享",
      author: "设计师小王",
      avatar: "/young-woman-avatar.png",
      image: "/modern-kitchen.png",
      likes: 256,
      comments: 45,
      tags: ["收纳", "小户型", "实用"],
    },
    {
      id: 2,
      title: "2024年家装流行色彩趋势",
      author: "色彩搭配师",
      avatar: "/middle-aged-man-avatar.png",
      image: "/cozy-bedroom.png",
      likes: 189,
      comments: 32,
      tags: ["色彩", "趋势", "搭配"],
    },
    {
      id: 3,
      title: "DIY改造出租房全记录",
      author: "租房达人",
      avatar: "/woman-designer-avatar.png",
      image: "/modern-living-room.png",
      likes: 342,
      comments: 67,
      tags: ["DIY", "租房", "改造"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/woman-designer-avatar.png" />
            <AvatarFallback>用户</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">设计爱好者</h1>
            <p className="text-muted-foreground mb-4">热爱家居设计，追求生活美学 | 已完成 2 个设计项目</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">128</span>
                <span className="text-muted-foreground">获赞</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">2.1K</span>
                <span className="text-muted-foreground">浏览</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">45</span>
                <span className="text-muted-foreground">关注</span>
              </div>
            </div>
          </div>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            编辑资料
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">我的方案</TabsTrigger>
            <TabsTrigger value="favorites">收藏</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>

          {/* My Projects */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">我的设计方案</h2>
              <Button asChild>
                <Link href="/upload">
                  <Plus className="mr-2 h-4 w-4" />
                  新建方案
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={project.status === "已完成" ? "default" : "secondary"}>{project.status}</Badge>
                    </div>
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>创建于 {project.createdAt}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {project.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {project.views}
                        </span>
                      </div>
                      <Button size="sm" asChild>
                        <Link href="/design">继续编辑</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-2xl font-bold">我的收藏</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>

                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{post.author}</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">账户设置</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>个人信息</CardTitle>
                  <CardDescription>管理你的个人资料和偏好设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    编辑个人资料
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    修改密码
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    隐私设置
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>通知设置</CardTitle>
                  <CardDescription>管理你的通知偏好</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    邮件通知
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    推送通知
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    社区互动
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
