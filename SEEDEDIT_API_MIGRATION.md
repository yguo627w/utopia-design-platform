# Seededit 接口迁移文档

## 概述

已成功将豆包AI接口从原有的模型调用迁移到新的seededit接口，实现了上传图片+传入文案，修改图片的功能。

## 接口变更

### 原接口
- **模型**: `doubao-seededit-3-0-i2i-250628`
- **端点**: `https://ark.cn-beijing.volces.com/api/v3/images/generations`
- **认证**: Bearer Token (需要API Key)
- **参数格式**: 复杂的模型参数配置

### 新接口
- **接口名称**: Seededit 接口
- **端点**: `http://competitor-cy.bcc-szth.baidu.com:80/doubao/edit-image`
- **认证**: 无需API Key（已内置）
- **参数格式**: 简化的JSON格式

## 新接口协议

### 请求格式
```bash
curl --location 'http://competitor-cy.bcc-szth.baidu.com:80/doubao/edit-image' \
--header 'Content-Type: application/json' \
--data '{"image_url": "https://example.com/image.jpg", "prompt": "将图中的沙发改成绿色"}'
```

### 请求参数
- **image_url**: 图片的云端URL（必需）
- **prompt**: 修改指令（必需）

### 响应格式
支持多种可能的响应格式：
- `{ image_url: "..." }`
- `{ url: "..." }`
- `{ data: { url: "..." } }`
- `{ data: { image_url: "..." } }`

## 功能特性

### 1. 自动图片上传
- 检测本地图片（blob:、data:、localhost）
- 自动调用上传接口将图片上传到云端
- 获取云端URL后调用seededit接口

### 2. 保持原有调用逻辑
- 所有调用豆包的地方调用逻辑不变
- prompt格式保持不变（自动添加前缀）
- 传入图片的方式不变

### 3. 错误处理和回退机制
- 图片上传失败时使用fallback图片
- API调用失败时自动重试
- 详细的错误日志记录

## 修改的文件

### 1. `/app/api/generate-image/route.ts`
- 更新为使用新的seededit接口
- 集成图片上传功能
- 移除API Key依赖
- 更新错误处理逻辑

### 2. `/app/test-seededit/page.tsx` (新增)
- 创建测试页面验证新接口功能
- 可视化测试上传和生成流程
- 显示详细的处理结果

## 调用流程

1. **用户上传图片** → 前端接收文件
2. **图片上传到云端** → 调用 `/api/upload-image` 获取云端URL
3. **调用seededit接口** → 使用云端URL和用户指令
4. **返回修改结果** → 返回修改后的图片URL

## 兼容性

### 前端调用无需修改
- `/app/design/page.tsx` - 对话式修图功能
- `/app/preview/page.tsx` - 预览功能
- 所有现有的调用方式保持不变

### API接口保持兼容
- 请求参数格式不变：`{ prompt, image }`
- 响应格式不变：`{ imageUrl }`
- 错误处理机制保持不变

## 测试验证

### 测试页面
访问 `/test-seededit` 进行功能测试：
- 上传本地图片
- 输入修改指令
- 查看生成结果
- 验证完整流程

### 测试用例
1. **正常流程测试**
   - 上传有效图片
   - 输入修改指令
   - 验证生成结果

2. **错误处理测试**
   - 无效图片格式
   - 网络错误
   - API调用失败

3. **回退机制测试**
   - 图片上传失败
   - 使用fallback图片

## 部署说明

1. **无需环境变量配置**
   - 移除了 `AI_IMAGE_GENERATION_API_KEY` 依赖
   - 新接口已内置认证

2. **依赖包**
   - 继续使用 `form-data` 包（用于图片上传）

3. **服务依赖**
   - 依赖上传服务：`http://competitor-cy.bcc-szth.baidu.com:80/upload`
   - 依赖seededit服务：`http://competitor-cy.bcc-szth.baidu.com:80/doubao/edit-image`

## 注意事项

1. **图片URL要求**
   - seededit接口需要云端可访问的图片URL
   - 本地图片会自动上传到云端

2. **网络依赖**
   - 需要访问外部云端服务
   - 建议添加超时和重试机制

3. **响应格式**
   - 新接口的响应格式可能需要根据实际情况调整
   - 当前支持多种可能的响应格式

## 后续优化建议

1. **性能优化**
   - 添加图片缓存机制
   - 优化上传和生成流程

2. **错误处理**
   - 添加更详细的错误分类
   - 实现更智能的重试策略

3. **监控和日志**
   - 添加接口调用监控
   - 完善错误日志记录

4. **安全性**
   - 添加图片格式验证
   - 实现文件大小限制
