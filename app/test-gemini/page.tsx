'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, CheckCircle, XCircle, Wand2 } from 'lucide-react'

export default function TestGeminiPage() {
  const [image1Url, setImage1Url] = useState('')
  const [image2Url, setImage2Url] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imageUrl?: string
    logs?: string[]
  } | null>(null)

  const testGeminiMerge = async () => {
    if (!image1Url || !image2Url || !prompt) {
      setResult({
        success: false,
        message: '请填写所有必需字段'
      })
      return
    }

    setLoading(true)
    setResult(null)
    const logs: string[] = []

    try {
      logs.push('开始测试Gemini多图合并...')
      logs.push(`图片1 URL: ${image1Url}`)
      logs.push(`图片2 URL: ${image2Url}`)
      logs.push(`Prompt: ${prompt}`)

      logs.push('调用Gemini API...')
      const response = await fetch('/api/gemini-merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image1_url: image1Url,
          image2_url: image2Url,
          prompt
        }),
      })

      logs.push(`响应状态: ${response.status}`)
      logs.push(`响应OK: ${response.ok}`)

      const data = await response.json()
      logs.push(`响应数据: ${JSON.stringify(data)}`)

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: 'Gemini多图合并成功',
          imageUrl: data.imageUrl,
          logs
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Gemini API调用失败',
          logs
        })
      }
    } catch (error) {
      console.error('Gemini测试失败:', error)
      logs.push(`测试失败: ${error instanceof Error ? error.message : '未知错误'}`)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '测试失败',
        logs
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    setImage1Url('https://mespd-competitor.bj.bcebos.com/uploaded-image-1757256481251.jpg')
    setImage2Url('https://mespd-competitor.bj.bcebos.com/1.我的客厅.jpg')
    setPrompt('在其他家具不变的情况把，把【image1_url】中的【沙发】，换成【image2_url】中的【沙发】')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Gemini多图合并测试
          </CardTitle>
          <CardDescription>
            测试Gemini接口的多图合并功能，用于家具更换
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 输入字段 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image1">图片1 URL (房间图片)</Label>
              <Input
                id="image1"
                placeholder="https://example.com/room.jpg"
                value={image1Url}
                onChange={(e) => setImage1Url(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image2">图片2 URL (家具图片)</Label>
              <Input
                id="image2"
                placeholder="https://example.com/furniture.jpg"
                value={image2Url}
                onChange={(e) => setImage2Url(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt (合并指令)</Label>
            <Input
              id="prompt"
              placeholder="在其他家具不变的情况把，把【image1_url】中的【沙发】，换成【image2_url】中的【沙发】"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <Button 
              onClick={testGeminiMerge} 
              disabled={loading || !image1Url || !image2Url || !prompt}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  测试Gemini合并
                </>
              )}
            </Button>
            
            <Button 
              onClick={loadSampleData} 
              variant="outline"
              disabled={loading}
            >
              加载示例数据
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
                  <div className="text-sm text-green-700 mb-2">
                    <strong>合并后的图片URL:</strong>
                  </div>
                  <div className="text-xs bg-green-100 p-2 rounded break-all">
                    {result.imageUrl}
                  </div>
                  <div className="mt-2">
                    <img 
                      src={result.imageUrl} 
                      alt="合并后的图片" 
                      className="max-w-full h-auto rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
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

          {/* 使用说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">使用说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>图片1 URL:</strong> 当前房间的图片URL（需要替换家具的房间）</div>
              <div><strong>图片2 URL:</strong> 新家具的图片URL（要替换成的家具）</div>
              <div><strong>Prompt格式:</strong> "在其他家具不变的情况把，把【image1_url】中的【家具类型】，换成【image2_url】中的【家具类型】"</div>
              <div><strong>家具类型:</strong> 沙发、茶几、床、衣柜、椅子、桌子、灯具、装饰品等</div>
              <div><strong>测试流程:</strong> 点击"加载示例数据" → 点击"测试Gemini合并" → 查看结果</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

