# AI风格设计功能说明

## 功能概述

在design页面新增了AI风格设计功能，支持用户上传房间图片后根据推荐设计风格进行整体装修风格替换。

## 功能路径

### 1. 入口
- 在【设计灵感】标签页顶部显示banner条
- 文案：「没有喜欢的风格？上传参考图AI帮你设计」
- 点击banner条可进入AI风格设计流程

### 2. 交互流程

#### A. 图片上传
- 点击banner条，拉起本地相册
- 支持用户上传本地照片（PNG、JPEG、WebP格式，最大10MB）
- 上传完成后自动进入AI理解阶段

#### B. AI智能理解
- 设计图中心显示「AI智能理解中，正在为您生成设计方案，请稍候」
- 模拟AI分析图片风格特征（实际项目中应调用真实AI理解API）
- 理解完成后显示风格关键词，如「复古、黑胡桃木、美拉德色系、巧克力色」

#### C. 风格确认
- 中间显示确认浮窗，显示图片理解文字结果
- 文案：「已经根据你上传的图片，理解家装风格关键词为"复古、黑胡桃木、美拉德色系、巧克力色"，请确认是否依据此风格进行设计」
- 浮窗确认按钮为【确认设计】

#### D. 设计生成
- 确认设计后，左侧设计中心显示自定义设计风格选中态
- 副标题为风格关键词，如『复古、黑胡桃木、美拉德色系、巧克力色』
- 中间设计页面显示「AI智能设计中，正在为您生成设计方案，请稍后」
- 同时请求豆包API使用「根据"复古、黑胡桃木、美拉德色系、巧克力色"进行风格设计」+用户图片
- 走图生图设计路径生成最终设计方案

## 技术实现

### 新增状态管理
```typescript
// AI风格设计相关状态
const [showStyleDesignDialog, setShowStyleDesignDialog] = useState(false)
const [styleDesignLoading, setStyleDesignLoading] = useState(false)
const [styleUnderstandingLoading, setStyleUnderstandingLoading] = useState(false)
const [styleConfirmationDialog, setStyleConfirmationDialog] = useState(false)
const [styleKeywords, setStyleKeywords] = useState("")
const [referenceImage, setReferenceImage] = useState<string | null>(null)
const [customStyleSelected, setCustomStyleSelected] = useState(false)
```

### 新增功能函数
- `handleStyleDesignBannerClick()`: 处理banner点击事件
- `handleReferenceImageUpload()`: 处理参考图片上传
- `handleStyleUnderstanding()`: 处理AI风格理解
- `handleConfirmStyleDesign()`: 处理风格设计确认

### 新增UI组件
- AI风格设计Banner条
- 图片上传对话框（支持整个区域点击上传）
- 风格确认对话框（详细展示风格信息）
- 自定义设计风格显示卡片
- 多种loading状态显示

### 集成现有API
- 复用现有的豆包API接口 (`/api/generate-image`)
- 支持图生图设计路径
- 使用简洁的prompt格式：
  ```
  在其他家具不变的情况，请按照我的输入进行图片修改，修改指令如下：把房间修改为+：[风格关键词]
  ```
- **API参数优化**：`seed: 10`、`watermark: false`，确保生成质量

### API调用流程
1. **图片传入**：将当前页面显示的房间图片（`roomImage`）作为`image`参数传入API，这是要被修改的目标图片
2. **Prompt构造**：按照指定格式构造专业的设计师prompt，包含风格关键词
3. **模型调用**：调用豆包的i2i模型进行图片到图片的风格转换
4. **结果返回**：返回生成的新设计方案图片

### 重要说明
- **目标图片**：传入的是当前页面显示的房间图片（`roomImage`），不是用户上传的参考图片
- **参考图片**：用户上传的参考图片仅用于AI理解风格特征，生成风格关键词
- **设计逻辑**：AI基于当前房间图片，按照识别出的风格关键词进行重新设计
- **图片URL处理**：自动检测并处理blob URL，确保传入豆包API的是有效的HTTP URL

### 完整的数据流
1. **用户上传参考图片** → 存储为 `referenceImage`
2. **AI理解风格特征** → 生成简洁的 `styleKeywords`（如"温馨复古风、主色调暖棕色家具，辅助米白色墙面，点缀墨绿色装饰"）
3. **用户确认风格** → 调用豆包API
4. **图片URL转换**：
   - 使用 `convertImageToUrl(roomImage)` 转换当前房间图片
   - 支持多种格式：HTTP/HTTPS、blob、data URL、本地路径
   - 确保豆包API能正确识别和处理
5. **API调用参数**：
   - `prompt`: 简洁的修改指令 + 风格关键词
   - `image`: 转换后的有效图片URL
   - `seed: 10`、`watermark: false`（优化参数）
6. **返回结果** → 更新 `roomImage`，显示新设计方案

### 图片URL处理逻辑
- **复用现有函数**：使用`convertImageToUrl`函数，与对话式设计保持一致
- **智能URL转换**：自动将各种格式的图片URL转换为豆包API可识别的格式
- **支持多种格式**：HTTP/HTTPS URL、blob URL、data URL、本地文件路径
- **错误处理**：如果转换失败，提供清晰的错误提示
- **日志记录**：记录图片URL转换过程，便于调试和监控

### 风格信息处理逻辑
- **具体风格描述**：AI理解图片后生成具体的风格关键词，包含家具、墙面、装饰等具体元素
- **信息一致性**：弹窗显示的风格信息与传入API的prompt完全一致
- **清晰展示**：风格信息以具体明确的方式展示，便于用户理解
- **用户确认**：用户可以在确认前查看完整的风格理解结果

## 用户体验优化

### 视觉设计
- **渐变背景和图标**：增强视觉吸引力和品牌一致性
- **统一的loading状态设计**：多种状态的统一视觉表现
- **清晰的状态反馈和进度提示**：用户随时了解当前进度
- **优化的弹窗布局**：合理的空间分配和视觉层次

### 交互设计
- **智能上传区域**：整个虚线框区域都可点击，无需额外按钮
- **拖拽上传支持**：支持拖拽文件到上传区域
- **文件格式和大小验证**：PNG、JPEG、WebP格式，最大10MB
- **错误处理和用户提示**：完善的异常处理机制
- **流畅的状态转换**：清晰的状态反馈和进度提示

### 响应式设计
- 支持移动端和桌面端
- 自适应布局和组件大小

## 注意事项

1. **API集成**: 当前使用模拟的AI理解结果，实际项目中需要集成真实的AI风格识别API
2. **性能优化**: 图片上传和AI处理可能需要较长时间，已添加loading状态和用户提示
3. **错误处理**: 完善的错误处理机制，包括文件格式、大小、网络错误等
4. **用户体验**: 清晰的状态反馈，让用户了解当前进度和下一步操作

## 未来扩展

1. **多风格支持**: 支持多种设计风格的组合和混合
2. **历史记录**: 保存用户的风格设计历史
3. **风格推荐**: 基于用户偏好推荐相似风格
4. **批量处理**: 支持多张图片的批量风格转换
5. **实时预览**: 实时预览风格转换效果
