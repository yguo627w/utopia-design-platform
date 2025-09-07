# 图片上传服务接口文档

## 概述

已成功创建图片上传服务接口，支持将用户上传的本地图片上传至云端并返回URL格式。

## 接口信息

### 上传接口
- **URL**: `/api/upload-image`
- **方法**: `POST`
- **Content-Type**: `multipart/form-data`

### 请求参数
- **file**: 图片文件 (必需)
  - 支持格式: 所有图片格式 (image/*)
  - 文件大小限制: 10MB
  - 参数名: `file`

### 响应格式

#### 成功响应
```json
{
  "success": true,
  "imageUrl": "云端返回的图片URL",
  "message": "图片上传成功",
  "originalFileName": "原始文件名",
  "fileSize": 文件大小(字节),
  "fileType": "文件MIME类型"
}
```

#### 错误响应
```json
{
  "error": "错误信息"
}
```

## 云端服务配置

接口调用以下云端服务：
- **服务地址**: `http://competitor-cy.bcc-szth.baidu.com:80/upload`
- **协议**: 与您提供的curl命令完全一致
- **请求格式**: `multipart/form-data`，字段名为 `file`

## 使用示例

### 1. 使用curl命令测试
```bash
curl --location --request POST 'http://localhost:3000/api/upload-image' \
--form 'file=@"/path/to/your/image.png"'
```

### 2. 使用JavaScript/Fetch
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])

const response = await fetch('/api/upload-image', {
  method: 'POST',
  body: formData
})

const result = await response.json()
console.log(result.imageUrl) // 云端返回的图片URL
```

### 3. 使用测试页面
访问 `/test-upload` 页面进行可视化测试：
- 选择图片文件
- 点击上传按钮
- 查看上传结果和图片预览

## 功能特性

1. **文件验证**
   - 只接受图片文件格式
   - 文件大小限制为10MB
   - 自动检测文件类型

2. **错误处理**
   - 文件为空检查
   - 文件类型验证
   - 文件大小限制
   - 云端服务错误处理
   - 网络错误处理

3. **日志记录**
   - 详细的上传过程日志
   - 性能监控（上传耗时）
   - 错误日志记录

4. **响应信息**
   - 返回原始文件信息
   - 云端服务返回的URL
   - 详细的状态信息

## 部署说明

1. 确保安装了 `form-data` 依赖包
2. 云端服务地址可根据需要修改
3. 建议在生产环境中添加更多的安全验证
4. 可以考虑添加文件类型白名单和更严格的大小限制

## 注意事项

1. 云端服务返回的URL格式需要确认，当前代码支持多种可能的响应格式
2. 如果云端服务返回格式有变化，需要相应调整解析逻辑
3. 建议添加重试机制和超时处理
4. 生产环境建议添加用户认证和权限控制
