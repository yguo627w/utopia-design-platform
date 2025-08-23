import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface NavigationProps {
  currentPage?: string
}

export default function Navigation({ currentPage }: NavigationProps) {
  const navItems = [
    { name: "首页", href: "/", key: "home" },
    { name: "设计", href: "/upload", key: "design" },
    { name: "灵感", href: "/community", key: "inspiration" },
    { name: "商城", href: "/marketplace", key: "marketplace" },
  ]

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">我的乌托邦</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === item.key ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          
          

          <Link href="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>我</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
