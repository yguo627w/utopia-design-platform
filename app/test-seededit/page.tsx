'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, CheckCircle, XCircle, Wand2 } from 'lucide-react'

export default function TestSeededitPage() {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
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

  const handleGenerate = async () => {
    if (!file || !prompt.trim()) {
      setResult({
        success: false,
        message: '请选择图片文件并输入修改指令'
      })
      return
    }

    setGenerating(true)
    setResult(null)

    try {
      // 先上传图片到云端
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(`图片上传失败: ${errorData.error || '未知错误'}`)
      }

      const uploadData = await uploadResponse.json()
      const cloudImageUrl = uploadData.imageUrl
      setUploading(false)

      console.log('图片上传成功，云端URL:', cloudImageUrl)

      // 调用seededit接口
      const generateResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          image: cloudImageUrl,
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(`图片生成失败: ${errorData.error || '未知错误'}`)
      }

      const generateData = await generateResponse.json()
      console.log('生成结果:', generateData)

      setResult({
        success: true,
        message: '图片修改成功！',
        imageUrl: generateData.imageUrl,
        originalFileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })

    } catch (error) {
      console.error('处理错误:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '处理失败，请稍后重试'
      })
    } finally {
      setUploading(false)
      setGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Seededit 接口测试
          </CardTitle>
          <CardDescription>
            测试新的豆包AI seededit接口 - 上传图片+传入文案，修改图片
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧：输入区域 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">选择要修改的图片</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading || generating}
                />
                {file && (
                  <div className="text-sm text-gray-600">
                    已选择: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">修改指令</Label>
                <Textarea
                  id="prompt"
                  placeholder="例如：将图中的沙发改成绿色"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={uploading || generating}
                  rows={4}
                />
                <div className="text-sm text-gray-500">
                  提示：系统会自动在指令前添加"在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下："
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!file || !prompt.trim() || uploading || generating}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    上传图片中...
                  </>
                ) : generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    开始修改图片
                  </>
                )}
              </Button>
            </div>

            {/* 右侧：结果展示 */}
            <div className="space-y-4">
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
                    <Label>修改结果</Label>
                    <div className="text-sm space-y-1">
                      <div><strong>原文件名:</strong> {result.originalFileName}</div>
                      <div><strong>文件大小:</strong> {result.fileSize ? (result.fileSize / 1024 / 1024).toFixed(2) + ' MB' : '未知'}</div>
                      <div><strong>文件类型:</strong> {result.fileType}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>生成图片预览</Label>
                    <div className="border rounded-md p-4 bg-gray-50">
                      <img 
                        src={result.imageUrl} 
                        alt="修改后的图片" 
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

                  <div className="space-y-2">
                    <Label>生成图片URL</Label>
                    <div className="p-3 bg-gray-100 rounded-md text-sm break-all">
                      {result.imageUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 接口信息 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">接口信息</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>接口名称:</strong> Seededit 接口</div>
              <div><strong>接口能力:</strong> 上传图片+传入文案，修改图片</div>
              <div><strong>调用流程:</strong></div>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>用户上传本地图片</li>
                <li>图片自动上传到云端获取URL</li>
                <li>调用seededit接口进行图片修改</li>
                <li>返回修改后的图片URL</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
