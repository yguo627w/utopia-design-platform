'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, CheckCircle, XCircle } from 'lucide-react'

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imageUrl?: string
    originalFileName?: string
    fileSize?: number
    fileType?: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null) // 清除之前的结果
    }
  }

  const handleUpload = async () => {
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
          message: data.message || '上传成功',
          imageUrl: data.imageUrl,
          originalFileName: data.originalFileName,
          fileSize: data.fileSize,
          fileType: data.fileType
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
        message: '网络错误，请稍后重试'
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
            图片上传测试
          </CardTitle>
          <CardDescription>
            测试图片上传到云端服务的功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">选择图片文件</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && (
              <div className="text-sm text-gray-600">
                已选择: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <Button 
            onClick={handleUpload} 
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
                上传图片
              </>
            )}
          </Button>

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
            </Alert>
          )}

          {result?.success && result.imageUrl && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>上传结果</Label>
                <div className="text-sm space-y-1">
                  <div><strong>文件名:</strong> {result.originalFileName}</div>
                  <div><strong>文件大小:</strong> {result.fileSize ? (result.fileSize / 1024 / 1024).toFixed(2) + ' MB' : '未知'}</div>
                  <div><strong>文件类型:</strong> {result.fileType}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>云端URL</Label>
                <div className="p-3 bg-gray-100 rounded-md text-sm break-all">
                  {result.imageUrl}
                </div>
              </div>

              <div className="space-y-2">
                <Label>图片预览</Label>
                <div className="border rounded-md p-4 bg-gray-50">
                  <img 
                    src={result.imageUrl} 
                    alt="上传的图片" 
                    className="max-w-full h-auto max-h-96 mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden text-center text-gray-500">
                    图片加载失败，请检查URL是否有效
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
