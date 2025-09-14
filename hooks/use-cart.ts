"use client"

import { useState, useEffect, useCallback } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  source: 'design' | 'marketplace' | 'smart-recognition'
  addedAt: number
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 从localStorage加载购物车数据
  const loadCartFromStorage = useCallback(() => {
    try {
      const sharedCart = JSON.parse(localStorage.getItem("sharedCart") || "[]")
      
      // 检查是否已经初始化过默认商品
      const hasInitialized = localStorage.getItem("cartInitialized")
      const defaultItemRemoved = localStorage.getItem("defaultItemRemoved")
      
      let mergedCart: CartItem[] = [...sharedCart]
      
      // 只有在第一次加载且默认商品未被删除时才添加默认商品
      if (!hasInitialized && !defaultItemRemoved) {
        const defaultCart: CartItem[] = [
          {
            id: 1001,
            name: "北欧风三人布艺沙发",
            price: 239,
            image: "/nordic-fabric-sofa.png",
            quantity: 1,
            source: "marketplace",
            addedAt: Date.now() - 1000000, // 设置较早的时间，确保在底部
          },
        ]
        mergedCart = [...defaultCart, ...sharedCart]
        
        // 标记已经初始化
        localStorage.setItem("cartInitialized", "true")
      }
      
      // 按添加时间排序，最新的在底部
      mergedCart.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0))
      
      setCartItems(mergedCart)
      setIsLoading(false)
      console.log("[useCart] Loaded cart from storage:", mergedCart)
      return mergedCart
    } catch (error) {
      console.error("[useCart] Error loading cart from storage:", error)
      setIsLoading(false)
      return []
    }
  }, [])

  // 添加商品到购物车
  const addToCart = useCallback((item: Omit<CartItem, 'addedAt'>) => {
    const newItem: CartItem = {
      ...item,
      addedAt: Date.now(),
    }

    setCartItems(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id)
      let updatedCart: CartItem[]

      if (existingItemIndex >= 0) {
        // 如果商品已存在，增加数量
        updatedCart = prevCart.map((cartItem, index) => 
          index === existingItemIndex 
            ? { ...cartItem, quantity: cartItem.quantity + 1, addedAt: Date.now() }
            : cartItem
        )
      } else {
        // 添加新商品
        updatedCart = [...prevCart, newItem]
      }

      // 按添加时间排序
      updatedCart.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0))

      // 保存到localStorage（保存design和smart-recognition来源的商品）
      const sharedItems = updatedCart.filter(cartItem => 
        cartItem.source === "design" || cartItem.source === "smart-recognition"
      )
      localStorage.setItem("sharedCart", JSON.stringify(sharedItems))

      // 触发自定义事件通知其他组件购物车已更新
      window.dispatchEvent(new CustomEvent("cartUpdated", { 
        detail: { 
          cart: sharedItems,
          newItem: newItem,
          action: existingItemIndex >= 0 ? "updated" : "added"
        } 
      }))

      // 触发storage事件以确保跨标签页同步
      window.dispatchEvent(new StorageEvent("storage", {
        key: "sharedCart",
        newValue: JSON.stringify(sharedItems),
        oldValue: localStorage.getItem("sharedCart"),
        storageArea: localStorage
      }))

      console.log("[useCart] Added/updated item in cart:", updatedCart)
      return updatedCart
    })
  }, [])

  // 更新商品数量
  const updateQuantity = useCallback((id: number, newQuantity: number) => {
    setCartItems(prevCart => {
      let updatedCart: CartItem[]

      if (newQuantity <= 0) {
        // 移除商品
        updatedCart = prevCart.filter(item => item.id !== id)
      } else {
        // 更新数量
        updatedCart = prevCart.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      }

      // 保存到localStorage（保存design和smart-recognition来源的商品）
      const sharedItems = updatedCart.filter(item => 
        item.source === "design" || item.source === "smart-recognition"
      )
      localStorage.setItem("sharedCart", JSON.stringify(sharedItems))

      // 触发自定义事件通知其他组件购物车已更新
      window.dispatchEvent(new CustomEvent("cartUpdated", { 
        detail: { 
          cart: sharedItems,
          action: "updated"
        } 
      }))

      console.log("[useCart] Updated quantity in cart:", updatedCart)
      return updatedCart
    })
  }, [])

  // 移除商品
  const removeFromCart = useCallback((id: number) => {
    setCartItems(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== id)
      
      // 保存到localStorage（保存design和smart-recognition来源的商品）
      const sharedItems = updatedCart.filter(item => 
        item.source === "design" || item.source === "smart-recognition"
      )
      localStorage.setItem("sharedCart", JSON.stringify(sharedItems))

      // 如果删除的是默认商品（ID 1001），记录删除状态
      if (id === 1001) {
        localStorage.setItem("defaultItemRemoved", "true")
      }

      // 触发自定义事件通知其他组件购物车已更新
      window.dispatchEvent(new CustomEvent("cartUpdated", { 
        detail: { 
          cart: sharedItems,
          action: "removed"
        } 
      }))

      console.log("[useCart] Removed item from cart:", updatedCart)
      return updatedCart
    })
  }, [])

  // 清空购物车
  const clearCart = useCallback(() => {
    setCartItems([])
    localStorage.removeItem("sharedCart")
    
    // 触发自定义事件通知其他组件购物车已更新
    window.dispatchEvent(new CustomEvent("cartUpdated", { 
      detail: { 
        cart: [],
        action: "cleared"
      } 
    }))

    console.log("[useCart] Cleared cart")
  }, [])

  // 计算总价
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  // 计算总数量
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  // 获取指定来源的商品
  const getItemsBySource = useCallback((source: 'design' | 'marketplace' | 'smart-recognition') => {
    return cartItems.filter(item => item.source === source)
  }, [cartItems])

  useEffect(() => {
    // 初始加载
    loadCartFromStorage()

    // 监听storage事件（跨标签页同步）
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "sharedCart") {
        console.log("[useCart] Storage changed, reloading cart")
        // 使用 setTimeout 延迟状态更新，避免在渲染过程中同步更新
        setTimeout(() => {
          loadCartFromStorage()
        }, 0)
      }
    }

    // 监听自定义cartUpdated事件（同标签页同步）
    const handleCartUpdated = (event: CustomEvent) => {
      console.log("[useCart] Cart updated event received:", event.detail)
      if (event.detail && event.detail.cart) {
        // 使用 setTimeout 延迟状态更新，避免在渲染过程中同步更新
        setTimeout(() => {
          const sharedCart = event.detail.cart
          
          // 检查是否需要添加默认商品
          const hasInitialized = localStorage.getItem("cartInitialized")
          const defaultItemRemoved = localStorage.getItem("defaultItemRemoved")
          
          let mergedCart: CartItem[] = [...sharedCart]
          
          // 只有在第一次加载且默认商品未被删除时才添加默认商品
          if (!hasInitialized && !defaultItemRemoved) {
            const defaultCart: CartItem[] = [
              {
                id: 1001,
                name: "北欧风三人布艺沙发",
                price: 239,
                image: "/nordic-fabric-sofa.png",
                quantity: 1,
                source: "marketplace",
                addedAt: Date.now() - 1000000,
              },
            ]
            mergedCart = [...defaultCart, ...sharedCart]
            
            // 标记已经初始化
            localStorage.setItem("cartInitialized", "true")
          }
          
          mergedCart.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0))
          
          setCartItems(mergedCart)
          console.log("[useCart] Cart updated immediately:", mergedCart)
        }, 0)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", handleCartUpdated as EventListener)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdated as EventListener)
    }
  }, [loadCartFromStorage])

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getItemsBySource,
    loadCartFromStorage,
  }
}
