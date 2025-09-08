# Gemini多图合并接口实现

## 📋 功能概述

新增了Gemini多图合并接口，用于在design页面的家具推荐功能中实现AI更换功能。

## 🔧 技术实现

### 1. API接口

**文件**: `app/api/gemini-merge/route.ts`

**接口协议**:
```bash
curl --location 'http://competitor-cy.bcc-szth.baidu.com:80/gemini/multi-image-merge' \
--header 'Content-Type: application/json' \
--data '{
    "image1_url": "https://malexa.bj.bcebos.com/335d0684d8de409461cadb078bf6028c.jpg",
    "image2_url": "https://malexa.bj.bcebos.com/shafa.jpg",
    "prompt": "Replace the sofa in the living room in Picture 1 with the sample shown in Picture 2"
}'
```

**本地接口**: `POST /api/gemini-merge`

**请求参数**:
- `image1_url`: 房间图片URL（需要替换家具的房间）
- `image2_url`: 家具图片URL（要替换成的家具）
- `prompt`: 合并指令

**响应格式**:
```json
{
  "success": true,
  "imageUrl": "https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com/...",
  "message": "图片合并成功"
}
```

### 2. 前端集成

**文件**: `app/design/page.tsx`

**修改的函数**: `handleQuickReplace`

**功能流程**:
1. **图片URL处理**: 
   - 检查当前房间图片是否为blob/data URL
   - 如果是，调用`convertImageToUrl`转换为云端URL
   - 如果不是，直接使用现有URL

2. **家具分类识别**:
   - 根据产品名称自动识别家具类型
   - 支持：沙发、衣柜、茶几、花瓶、床单、床头柜、装饰品、床、椅子、桌子、灯具

3. **Prompt生成**:
   - 格式：`在其他家具不变的情况把，把【image1_url】中的【家具类型】，换成【image2_url】中的【家具类型】`
   - 自动填充家具分类名称

4. **API调用**:
   - 调用本地`/api/gemini-merge`接口
   - 传递处理后的图片URL和生成的prompt

5. **结果处理**:
   - 成功：更新房间图片，显示成功消息
   - 失败：显示错误消息

## 🎯 使用场景

### 在design页面-家具推荐-AI更换点击时：

1. **用户操作**: 点击家具推荐中的"🔄 AI更换"按钮
2. **系统处理**:
   - 获取当前房间图片（image1_url）
   - 获取选中的家具图片（image2_url）
   - 生成合并指令（prompt）
   - 调用Gemini接口进行图片合并
3. **结果展示**: 显示合并后的新房间图片

## 📱 测试页面

**访问地址**: `http://localhost:3002/test-gemini`

**功能**:
- 手动输入图片URL和prompt
- 测试Gemini接口调用
- 查看详细的测试日志
- 预览合并后的图片

**示例数据**:
- 图片1: `https://mespd-competitor.bj.bcebos.com/uploaded-image-1757256481251.jpg`
- 图片2: `https://mespd-competitor.bj.bcebos.com/1.我的客厅.jpg`
- Prompt: `在其他家具不变的情况把，把【image1_url】中的【沙发】，换成【image2_url】中的【沙发】`

## 🔍 支持的家具类型

| 产品名称关键词 | 家具分类 | 示例 |
|-------------|---------|------|
| 沙发 | 沙发 | 北欧风沙发、现代沙发 |
| 衣柜 | 衣柜 | 推拉门衣柜、实木衣柜 |
| 茶几 | 茶几 | 玻璃茶几、实木茶几 |
| 花瓶 | 花瓶 | 陶瓷花瓶、玻璃花瓶 |
| 床单 | 床单 | 纯棉床单、丝绸床单 |
| 床头柜 | 床头柜 | 现代床头柜、实木床头柜 |
| 装饰品/挂画 | 装饰品 | 现代装饰画、抽象画 |
| 床 | 床 | 实木床、铁艺床 |
| 椅子 | 椅子 | 办公椅、餐椅 |
| 桌子 | 桌子 | 餐桌、书桌 |
| 灯具 | 灯具 | 台灯、吊灯 |

## 🚀 部署说明

1. **API接口**: 已部署在`/api/gemini-merge`
2. **前端集成**: 已集成到design页面的家具推荐功能
3. **测试页面**: 可访问`/test-gemini`进行功能测试

## 🔧 错误处理

- **图片URL无效**: 显示"产品图片不可用，无法进行AI更换"
- **房间图片缺失**: 显示"请先上传房间照片，然后再进行AI更换"
- **上传失败**: 显示"房间图片上传到云端失败"
- **API调用失败**: 显示具体的错误信息
- **结果无效**: 显示"Gemini API返回无效结果"

## 📊 性能优化

- **异步处理**: 使用async/await避免阻塞UI
- **Loading状态**: 显示加载状态提升用户体验
- **错误恢复**: 失败时自动恢复loading状态
- **日志记录**: 详细的控制台日志便于调试

## 🎉 功能特点

1. **智能识别**: 自动识别家具类型，无需手动输入
2. **URL处理**: 自动处理blob/data URL转换为云端URL
3. **错误友好**: 提供详细的错误信息和解决建议
4. **实时反馈**: 显示处理进度和结果状态
5. **测试支持**: 提供独立的测试页面验证功能

Gemini多图合并接口已成功集成到家具推荐功能中，用户现在可以通过AI更换功能实现智能家具替换！

