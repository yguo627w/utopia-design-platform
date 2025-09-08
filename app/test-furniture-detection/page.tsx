'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, CheckCircle, XCircle } from 'lucide-react'

export default function TestFurnitureDetectionPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testFurnitureDetection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const testImageUrl = "https://b.bdstatic.com/searchbox/image/gcp/20250823/806565301.png"
      
      console.log("[Test] Testing furniture detection with:", testImageUrl)
      
      const response = await fetch('/api/detect-furniture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: testImageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("[Test] API response:", data)
      
      setResult(data)
    } catch (err) {
      console.error("[Test] Error:", err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>家具识别功能测试</CardTitle>
          <CardDescription>
            测试家具识别API接口是否正常工作
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testFurnitureDetection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                测试中...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                测试家具识别API
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                错误: {error}
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div><strong>成功:</strong> {result.success ? '是' : '否'}</div>
                  <div><strong>识别到的家具:</strong> {result.furnitureNames?.join(', ') || '无'}</div>
                  <div><strong>原始内容:</strong> {result.rawContent || '无'}</div>
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">完整响应</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">测试说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• 点击按钮测试家具识别API接口</div>
              <div>• 使用固定的测试图片URL</div>
              <div>• 查看控制台日志了解详细过程</div>
              <div>• 检查返回的家具名称和原始内容</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
