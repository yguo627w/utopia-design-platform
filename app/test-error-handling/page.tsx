'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TestErrorHandlingPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imageUrl?: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const testUpload = async () => {
    if (!file) {
      setResult({
        success: false,
        message: '请先选择一个文件'
      })
      return
    }

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: '上传成功',
          imageUrl: data.imageUrl
        })
      } else {
        setResult({
          success: false,
          message: data.error || '上传失败'
        })
      }
    } catch (error) {
      console.error('上传错误:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '网络错误'
      })
    } finally {
      setUploading(false)
    }
  }

  const testInvalidData = async () => {
    setUploading(true)
    setResult(null)

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: 'invalid-data' }),
      })

      const data = await response.json()

      setResult({
        success: false,
        message: data.error || '测试完成'
      })
    } catch (error) {
      console.error('测试错误:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '测试失败'
      })
    } finally {
      setUploading(false)
    }
  }

  const testNetworkError = async () => {
    setUploading(true)
    setResult(null)

    try {
      // 模拟网络错误
      const response = await fetch('/api/nonexistent-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' }),
      })

      setResult({
        success: false,
        message: `网络错误: ${response.status}`
      })
    } catch (error) {
      console.error('网络错误:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '网络连接失败'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            错误处理测试
          </CardTitle>
          <CardDescription>
            测试各种错误情况的处理
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 正常上传测试 */}
          <div className="space-y-4">
            <h3 className="font-semibold">1. 正常上传测试</h3>
            <div className="space-y-2">
              <Label htmlFor="file">选择图片文件</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            <Button 
              onClick={testUpload} 
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  测试上传
                </>
              )}
            </Button>
          </div>

          {/* 错误情况测试 */}
          <div className="space-y-4">
            <h3 className="font-semibold">2. 错误情况测试</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={testInvalidData} 
                disabled={uploading}
                variant="outline"
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="mr-2 h-4 w-4" />
                )}
                测试无效数据
              </Button>
              
              <Button 
                onClick={testNetworkError} 
                disabled={uploading}
                variant="outline"
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="mr-2 h-4 w-4" />
                )}
                测试网络错误
              </Button>
            </div>
          </div>

          {/* 结果显示 */}
          {result && (
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </AlertDescription>
              </div>
              {result.imageUrl && (
                <div className="mt-2">
                  <div className="text-sm text-green-700">
                    <strong>图片URL:</strong> {result.imageUrl}
                  </div>
                </div>
              )}
            </Alert>
          )}

          {/* 测试说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">测试说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>正常上传测试:</strong> 上传有效图片文件，验证成功流程</div>
              <div><strong>无效数据测试:</strong> 发送无效的图片数据，验证错误处理</div>
              <div><strong>网络错误测试:</strong> 模拟网络连接问题，验证异常处理</div>
              <div><strong>预期结果:</strong> 所有情况都应该返回清晰的错误信息，不会导致页面崩溃</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
