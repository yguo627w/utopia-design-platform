# 增强错误处理

## 问题描述

在 `handleSendMessage` 函数中，当 `convertImageToUrl` 函数返回 `null` 时，会抛出通用的错误信息，不够用户友好：

```javascript
if (!imageUrl) {
  throw new Error("无法获取有效的图片URL。请确保：\n• 已上传房间照片\n• 图片格式为PNG、JPEG、JPG或WebP\n• 图片大小不超过10MB")
}
```

## 修复方案

### 1. 智能错误信息

根据不同的失败原因提供针对性的错误信息：

```javascript
if (!imageUrl) {
  // 提供更友好的错误信息
  let errorMessage = "无法获取有效的图片URL。"
  
  if (!roomImage) {
    errorMessage = "请先上传房间照片，然后再进行对话修改。"
  } else if (roomImage.startsWith("blob:") || roomImage.startsWith("data:")) {
    errorMessage = "图片上传到云端失败，请检查网络连接后重试。"
  } else {
    errorMessage = "图片格式不支持或图片过大，请确保：\n• 图片格式为PNG、JPEG、JPG或WebP\n• 图片大小不超过10MB"
  }
  
  throw new Error(errorMessage)
}
```

### 2. 增强错误日志

在 `convertImageToUrl` 函数中添加更详细的错误日志：

```javascript
} catch (error) {
  console.error("[v0] Failed to upload image:", error)
  // 记录具体的错误信息以便调试
  if (error instanceof Error) {
    console.error("[v0] Upload error details:", error.message)
  }
  return null
}
```

## 错误处理分类

### 1. 未上传图片
**情况**: `!roomImage`
**错误信息**: "请先上传房间照片，然后再进行对话修改。"
**用户指导**: 引导用户先上传图片

### 2. 上传失败
**情况**: `roomImage.startsWith("blob:") || roomImage.startsWith("data:")`
**错误信息**: "图片上传到云端失败，请检查网络连接后重试。"
**用户指导**: 建议检查网络连接

### 3. 格式或大小问题
**情况**: 其他情况
**错误信息**: "图片格式不支持或图片过大，请确保：\n• 图片格式为PNG、JPEG、JPG或WebP\n• 图片大小不超过10MB"
**用户指导**: 提供具体的格式和大小要求

## 测试验证

### 1. 创建测试页面
- 文件: `/app/test-error-handling/page.tsx`
- 功能: 测试各种错误情况
- 包括: 正常上传、无效数据、网络错误

### 2. 测试场景
- ✅ 正常图片上传
- ✅ 无效数据格式
- ✅ 网络连接错误
- ✅ 文件格式不支持
- ✅ 文件过大

## 用户体验改进

### 1. 更清晰的错误信息
- 根据具体失败原因提供针对性指导
- 避免技术术语，使用用户友好的语言
- 提供具体的解决建议

### 2. 更好的错误恢复
- 引导用户采取正确的操作
- 提供重试建议
- 避免用户困惑

### 3. 增强的调试能力
- 详细的错误日志记录
- 便于开发人员定位问题
- 支持问题排查和修复

## 相关文件

### 修改的文件
1. `/app/design/page.tsx` - 优化错误处理逻辑
2. `/app/test-error-handling/page.tsx` - 新增测试页面

### 测试页面功能
- 正常上传测试
- 无效数据测试
- 网络错误测试
- 实时错误信息显示

## 错误处理流程

```
用户操作 → 检测错误类型 → 提供针对性错误信息 → 用户指导 → 错误恢复
```

### 错误类型检测
1. **未上传图片**: 引导用户上传
2. **上传失败**: 建议检查网络
3. **格式问题**: 提供格式要求
4. **其他错误**: 通用错误处理

## 总结

✅ **错误处理已增强**
- 提供智能化的错误信息
- 根据失败原因给出针对性指导
- 增强错误日志记录
- 创建了完整的测试页面
- 提升了用户体验和调试能力

现在用户在遇到问题时能够获得更清晰、更有用的错误信息，并且能够根据提示采取正确的操作来解决问题。
