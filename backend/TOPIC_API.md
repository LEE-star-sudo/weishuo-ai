# 话题(Topics)功能 API 文档

## 概述
话题系统为探索页面提供热门话题展示和搜索功能。

## 数据库表结构

### topics 表
```sql
CREATE TABLE topics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    post_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    like_count INT NOT NULL DEFAULT 0,
    is_hot BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

## API 端点

### 1. 获取热门话题
**端点**: `GET /api/topics/hot`

**描述**: 获取按综合热度排序的前10个热门话题

**响应示例**:
```json
[
  {
    "id": 1,
    "title": "AI技术革命",
    "category": "科技",
    "postCount": 125,
    "commentCount": 4,
    "likeCount": 32,
    "isHot": true
  }
]
```

---

### 2. 按分类获取话题
**端点**: `GET /api/topics/category/{category}`

**描述**: 获取指定分类的话题列表

**路径参数**:
- `category`: 分类名称（热门、新闻、体育、娱乐、科技、财经）

**响应示例**:
```json
[
  {
    "id": 2,
    "title": "量子计算突破",
    "category": "科技",
    "postCount": 89,
    "commentCount": 2,
    "likeCount": 15,
    "isHot": false
  }
]
```

---

### 3. 搜索话题
**端点**: `GET /api/topics/search`

**描述**: 根据关键词搜索话题标题

**查询参数**:
- `keyword`: 搜索关键词（可选，为空时返回热门话题）

**请求示例**:
```
GET /api/topics/search?keyword=AI
```

**响应示例**:
```json
[
  {
    "id": 1,
    "title": "AI技术革命",
    "category": "科技",
    "postCount": 125,
    "commentCount": 4,
    "likeCount": 32,
    "isHot": true
  }
]
```

---

### 4. 初始化话题数据
**端点**: `POST /api/topics/initialize`

**描述**: 初始化测试用的热门话题数据（开发环境使用）

**响应示例**:
```
Topics initialized successfully
```

---

## 前端集成

### 探索页面功能

1. **分类标签切换**
   - 点击不同分类标签（热门、新闻、体育、娱乐、科技、财经）
   - 自动调用对应的API获取该分类的话题

2. **搜索功能**
   - 在搜索框输入关键词
   - 按回车或点击"标签搜索"按钮
   - 实时搜索并显示匹配的话题

3. **话题展示**
   - 显示话题标题、分类、排名
   - 显示推文数、评论数、点赞数
   - 热门话题标记

### 数据格式化

前端会将API返回的数值进行格式化：
- `postCount`: 直接显示（如：125 推文）
- `commentCount`: 乘以1000后格式化（如：4 → 4.0K）
- `likeCount`: 乘以1000后格式化（如：32 → 32.0K）

---

## 测试

运行测试脚本初始化数据并验证API：

```powershell
.\test-topics.ps1
```

测试脚本会：
1. 初始化16个测试话题
2. 获取热门话题列表
3. 测试搜索功能

---

## 实现文件

### 后端
- `Topic.java` - 实体类
- `TopicRepository.java` - 数据访问层
- `TopicService.java` - 业务逻辑层
- `TopicController.java` - REST控制器
- `TopicResponse.java` - 响应DTO

### 前端
- `frontend/src/pages/Explore.tsx` - 探索页面组件
- `frontend/src/pages/Explore.css` - 样式文件

---

## 使用说明

1. **首次使用**：后端启动后，调用初始化接口创建测试数据
   ```bash
   curl -X POST http://localhost:8081/api/topics/initialize
   ```

2. **访问页面**：打开浏览器访问 http://localhost:5173/explore

3. **测试搜索**：
   - 搜索 "AI" 会找到 "AI技术革命"
   - 搜索 "世界杯" 会找到 "世界杯决赛"
   - 搜索 "股市" 会找到 "股市创新高"

---

## 扩展建议

1. **用户交互**：点击话题进入话题详情页
2. **实时更新**：通过WebSocket实时更新话题热度
3. **个性化推荐**：根据用户兴趣推荐话题
4. **话题创建**：允许用户创建新话题
5. **话题订阅**：用户可以订阅感兴趣的话题
