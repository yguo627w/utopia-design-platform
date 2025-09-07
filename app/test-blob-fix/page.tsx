'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, CheckCircle, XCircle, Bug } from 'lucide-react'

export default function TestBlobFixPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imageUrl?: string
    logs?: string[]
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const testBlobConversion = async () => {
    if (!file) {
      setResult({
        success: false,
        message: '请先选择文件'
      })
      return
    }

    setUploading(true)
    setResult(null)
    const logs: string[] = []

    try {
      logs.push('开始测试blob URL转换...')
      
      // 创建blob URL
      const blobUrl = URL.createObjectURL(file)
      logs.push(`创建blob URL: ${blobUrl}`)
      
      // 模拟convertImageToUrl函数的逻辑
      logs.push('开始转换blob URL...')
      
      // 先获取blob数据
      const response = await fetch(blobUrl)
      const blob = await response.blob()
      logs.push(`获取blob数据成功: ${blob.size} bytes, ${blob.type}`)
      
      // 转换为data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      logs.push(`转换为data URL成功，长度: ${dataUrl.length}`)
      
      // 使用data URL上传
      logs.push('开始上传到云端...')
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData: dataUrl }),
      })

      logs.push(`上传响应状态: ${uploadResponse.status}`)
      logs.push(`上传响应OK: ${uploadResponse.ok}`)

      if (!uploadResponse.ok) {
        let errorMessage = `图片上传失败: ${uploadResponse.status}`
        try {
          const errorData = await uploadResponse.json()
          logs.push(`错误数据: ${JSON.stringify(errorData)}`)
          errorMessage = `图片上传失败: ${errorData.error || errorMessage}`
        } catch (parseError) {
          logs.push(`解析错误响应失败: ${parseError}`)
        }
        throw new Error(errorMessage)
      }

      const uploadData = await uploadResponse.json()
      logs.push(`上传成功，响应数据: ${JSON.stringify(uploadData)}`)
      
      setResult({
        success: true,
        message: 'blob URL转换和上传成功',
        imageUrl: uploadData.imageUrl,
        logs
      })

    } catch (error) {
      console.error('测试失败:', error)
      logs.push(`测试失败: ${error instanceof Error ? error.message : '未知错误'}`)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '测试失败',
        logs
      })
    } finally {
      setUploading(false)
    }
  }

  const testDirectUpload = async () => {
    if (!file) {
      setResult({
        success: false,
        message: '请先选择文件'
      })
      return
    }

    setUploading(true)
    setResult(null)
    const logs: string[] = []

    try {
      logs.push('开始测试直接上传...')
      
      const formData = new FormData()
      formData.append('file', file)
      logs.push('创建FormData完成')
      
      logs.push('发送上传请求...')
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      logs.push(`响应状态: ${response.status}`)
      logs.push(`响应OK: ${response.ok}`)

      const data = await response.json()
      logs.push(`响应数据: ${JSON.stringify(data)}`)

      if (response.ok) {
        setResult({
          success: true,
          message: '直接上传成功',
          imageUrl: data.imageUrl,
          logs
        })
      } else {
        setResult({
          success: false,
          message: data.error || '上传失败',
          logs
        })
      }
    } catch (error) {
      console.error('上传错误:', error)
      logs.push(`网络错误: ${error instanceof Error ? error.message : '未知错误'}`)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '网络错误',
        logs
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Blob URL修复测试
          </CardTitle>
          <CardDescription>
            测试blob URL转换和上传功能的修复效果
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 文件选择 */}
          <div className="space-y-2">
            <Label htmlFor="file">选择测试图片</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && (
              <div className="text-sm text-gray-600">
                已选择: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB, {file.type})
              </div>
            )}
          </div>

          {/* 测试按钮 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={testBlobConversion} 
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Bug className="mr-2 h-4 w-4" />
                  测试blob转换
                </>
              )}
            </Button>
            
            <Button 
              onClick={testDirectUpload} 
              disabled={!file || uploading}
              variant="outline"
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  测试直接上传
                </>
              )}
            </Button>
          </div>

          {/* 结果显示 */}
          {result && (
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
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

          {/* 日志显示 */}
          {result?.logs && (
            <div className="space-y-2">
              <Label>测试日志</Label>
              <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  {result.logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 修复说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">修复说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>问题:</strong> 服务器端无法直接fetch blob URL</div>
              <div><strong>修复:</strong> 前端先将blob URL转换为data URL，再上传到服务器</div>
              <div><strong>流程:</strong> blob URL → fetch blob → FileReader → data URL → 上传接口</div>
              <div><strong>测试:</strong> 使用此页面验证修复效果</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
