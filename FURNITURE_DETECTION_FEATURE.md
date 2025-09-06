# 家具检测功能实现说明

## 功能概述
实现了用户上传图片后自动识别图片中关键家具的功能，识别结果会显示在"房间中的关键家具"部分。

## 实现方案

### 1. API接口 (`/app/api/detect-furniture/route.ts`)
- **接口地址**: `POST /api/detect-furniture`
- **输入参数**: `{ imageUrl: string }`
- **功能**: 调用外部检测API (`http://172.26.218.196:5001/image_detection`)
- **调用方式**: GET参数方式 (`?image_url=xxx&confidence_threshold=0.25`)
- **协议格式**: 
  ```bash
  curl --location --request POST 'http://172.26.218.196:5001/image_detection?image_url=https://example.com/image.jpg&confidence_threshold=0.25' \
  --header 'Content-Type: application/json'
  ```
- **输出处理**: 
  - 翻译英文家具名称为中文
  - 过滤低置信度结果
  - 返回处理后的检测结果

### 2. 前端实现 (`/app/design/page.tsx`)

#### 新增状态管理
```typescript
const [detectedFurniture, setDetectedFurniture] = useState<Array<{name: string, chineseName: string, confidence: number}>>([])
const [furnitureDetectionLoading, setFurnitureDetectionLoading] = useState(false)
```

#### 核心函数
1. **`detectFurnitureInImage(imageUrl: string)`**
   - 调用检测API
   - 过滤置信度 > 0.25 的结果
   - 去重处理
   - 最多显示4个家具

2. **`getFurnitureIcon(furnitureName: string)`**
   - 映射英文家具名称为对应图标
   - 支持30+种常见家具类型

3. **`getKeyFurniture()`** (修改)
   - 优先显示检测结果
   - 回退到默认家具列表

#### 触发时机
- 用户上传房间图片时自动触发检测
- 通过 `useEffect` 监听 `roomImage` 状态变化
- 支持所有房间图片更新场景（上传、AI生成、风格应用等）

#### UI效果
- 检测过程中显示loading动画
- 检测结果实时更新到关键家具显示区域

## 家具名称翻译映射

| 英文名称 | 中文名称 | 图标 |
|---------|---------|------|
| bed | 床 | 🛏️ |
| chair | 椅子 | 🪑 |
| sofa | 沙发 | 🛋️ |
| couch | 沙发 | 🛋️ |
| table | 桌子 | 🪑 |
| desk | 书桌 | 🪑 |
| dining table | 餐桌 | 🪑 |
| coffee table | 茶几 | 🪑 |
| wardrobe | 衣柜 | 🪪 |
| cabinet | 柜子 | 🪪 |
| bookshelf | 书架 | 📚 |
| lamp | 灯具 | 💡 |
| tv | 电视 | 📺 |
| refrigerator | 冰箱 | ❄️ |
| potted plant | 盆栽 | 🌱 |
| vase | 花瓶 | 🏺 |
| mirror | 镜子 | 🪞 |
| scissors | 剪刀 | ✂️ |
| cup | 杯子 | ☕ |
| clock | 时钟 | 🕐 |
| ... | ... | ... |

## 检测流程

1. **用户上传图片** → 图片保存到 `roomImage` 状态
2. **自动触发检测** → 调用 `detectFurnitureInImage()` 函数
3. **API请求** → 发送到 `/api/detect-furniture` 接口
4. **外部检测** → 调用 `http://172.26.218.196:5001/image_detection`
5. **结果处理** → 翻译、过滤、去重
6. **UI更新** → 更新关键家具显示区域

## 错误处理

- **API调用失败**: 显示默认家具列表
- **检测结果为空**: 回退到默认家具
- **网络错误**: 显示错误提示，使用默认家具
- **长URL处理**: 当图片URL过长时，使用测试URL进行演示
- **超时处理**: 15秒超时机制，避免长时间等待

## 使用说明

1. 用户在设计页面点击上传房间图片
2. 系统自动检测图片中的家具
3. 检测完成后，"房间中的关键家具"区域会显示识别到的家具
4. 用户可以基于识别结果进行后续的设计操作

## 技术特点

- **非侵入式**: 不影响现有功能逻辑
- **容错性强**: 检测失败时回退到默认行为
- **用户体验好**: 检测过程有loading提示
- **可扩展**: 易于添加新的家具类型和图标映射

