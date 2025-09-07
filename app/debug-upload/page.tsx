'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, Bug, CheckCircle, XCircle } from 'lucide-react'

export default function DebugUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imageUrl?: string
  } | null>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setLogs([])
      addLog(`选择文件: ${selectedFile.name} (${selectedFile.size} bytes, ${selectedFile.type})`)
    }
  }

  const testDirectUpload = async () => {
    if (!file) {
      addLog('错误: 没有选择文件')
      return
    }

    setUploading(true)
    setResult(null)
    addLog('开始直接上传测试...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      addLog('创建FormData完成')

      addLog('发送上传请求...')
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      addLog(`响应状态: ${response.status}`)
      addLog(`响应OK: ${response.ok}`)

      const data = await response.json()
      addLog(`响应数据: ${JSON.stringify(data)}`)

      if (response.ok) {
        setResult({
          success: true,
          message: '直接上传成功',
          imageUrl: data.imageUrl
        })
        addLog('✅ 直接上传成功')
      } else {
        setResult({
          success: false,
          message: data.error || '上传失败'
        })
        addLog(`❌ 上传失败: ${data.error}`)
      }
    } catch (error) {
      console.error('上传错误:', error)
      addLog(`❌ 网络错误: ${error instanceof Error ? error.message : '未知错误'}`)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '网络错误'
      })
    } finally {
      setUploading(false)
    }
  }

  const testConvertImageToUrl = async () => {
    if (!file) {
      addLog('错误: 没有选择文件')
      return
    }

    setUploading(true)
    setResult(null)
    addLog('开始convertImageToUrl测试...')

    try {
      // 模拟convertImageToUrl函数的逻辑
      addLog('将文件转换为data URL...')
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      
      addLog(`Data URL长度: ${dataUrl.length}`)
      addLog(`Data URL前缀: ${dataUrl.substring(0, 50)}...`)

      addLog('调用上传接口...')
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData: dataUrl }),
      })

      addLog(`上传响应状态: ${uploadResponse.status}`)
      addLog(`上传响应OK: ${uploadResponse.ok}`)

      if (!uploadResponse.ok) {
        let errorMessage = `图片上传失败: ${uploadResponse.status}`
        try {
          const errorData = await uploadResponse.json()
          addLog(`错误数据: ${JSON.stringify(errorData)}`)
          errorMessage = `图片上传失败: ${errorData.error || errorMessage}`
        } catch (parseError) {
          addLog(`解析错误响应失败: ${parseError}`)
        }
        throw new Error(errorMessage)
      }

      const uploadData = await uploadResponse.json()
      addLog(`上传响应数据: ${JSON.stringify(uploadData)}`)
      
      setResult({
        success: true,
        message: 'convertImageToUrl测试成功',
        imageUrl: uploadData.imageUrl
      })
      addLog('✅ convertImageToUrl测试成功')

    } catch (error) {
      console.error('convertImageToUrl错误:', error)
      addLog(`❌ convertImageToUrl错误: ${error instanceof Error ? error.message : '未知错误'}`)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '测试失败'
      })
    } finally {
      setUploading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            上传调试工具
          </CardTitle>
          <CardDescription>
            调试图片上传问题，查看详细的日志信息
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
              onClick={testDirectUpload} 
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
                  <Upload className="mr-2 h-4 w-4" />
                  测试直接上传
                </>
              )}
            </Button>
            
            <Button 
              onClick={testConvertImageToUrl} 
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
                  <Bug className="mr-2 h-4 w-4" />
                  测试convertImageToUrl
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>调试日志</Label>
              <Button onClick={clearLogs} variant="outline" size="sm">
                清除日志
              </Button>
            </div>
            <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-sm">暂无日志</div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">使用说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>直接上传测试:</strong> 模拟新的上传流程，直接上传文件到云端</div>
              <div><strong>convertImageToUrl测试:</strong> 模拟旧的上传流程，先转换为data URL再上传</div>
              <div><strong>调试日志:</strong> 显示详细的上传过程，帮助定位问题</div>
              <div><strong>问题排查:</strong> 如果直接上传成功但convertImageToUrl失败，说明问题在转换过程中</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
