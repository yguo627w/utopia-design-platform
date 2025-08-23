import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "我的乌托邦 - AI家装设计平台",
  description: "AI助力，秒建乌托邦。用自然语言描述改造需求，AI即可生成个性化设计方案",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
