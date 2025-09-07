'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, CheckCircle, XCircle } from 'lucide-react'

export default function TestErrorFixPage() {
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
        message: '请先选择文件'
      })
      return
    }

    setUploading(true)
    setResult(null)

    try {
      // 模拟convertImageToUrl函数的逻辑
      console.log('开始测试上传...')
      
      // 将文件转换为data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      
      console.log('Data URL转换完成，长度:', dataUrl.length)

      // 调用上传接口
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData: dataUrl }),
      })

      console.log('上传响应状态:', uploadResponse.status)
      console.log('上传响应OK:', uploadResponse.ok)

      if (!uploadResponse.ok) {
        let errorMessage = `图片上传失败: ${uploadResponse.status}`
        try {
          const errorData = await uploadResponse.json()
          console.log('错误数据:', errorData)
          errorMessage = `图片上传失败: ${errorData.error || errorMessage}`
        } catch (parseError) {
          console.error('解析错误响应失败:', parseError)
        }
        console.error('上传失败:', errorMessage)
        setResult({
          success: false,
          message: errorMessage
        })
        return
      }

      const uploadData = await uploadResponse.json()
      console.log('上传成功，响应数据:', uploadData)
      
      setResult({
        success: true,
        message: '上传成功',
        imageUrl: uploadData.imageUrl
      })

    } catch (error) {
      console.error('测试失败:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '测试失败'
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
            <Upload className="h-5 w-5" />
            错误修复测试
          </CardTitle>
          <CardDescription>
            测试修复后的上传错误处理逻辑
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
          <Button 
            onClick={testUpload} 
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
                测试上传
              </>
            )}
          </Button>

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

          {/* 说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">修复说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>问题:</strong> convertImageToUrl函数在上传失败时抛出错误，导致双重错误</div>
              <div><strong>修复:</strong> 改为返回null而不是抛出错误，让上层函数处理</div>
              <div><strong>改进:</strong> 提供更详细的错误信息和解决建议</div>
              <div><strong>测试:</strong> 使用此页面验证修复是否有效</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
