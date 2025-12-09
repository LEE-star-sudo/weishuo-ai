# 关注/粉丝系统 API 文档

## 概述
完整的用户关注和粉丝管理系统,支持关注、取消关注、查看关注列表和粉丝列表等功能。

---

## API 接口

### 1. 关注用户
**POST** `/api/follow`

关注指定用户。

**请求参数:**
- Query: `followerId` (必需) - 当前用户ID
- Body:
```json
{
  "followingId": 2
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "关注成功",
  "followersCount": 10
}
```

**错误响应:**
```json
{
  "success": false,
  "message": "不能关注自己"
}
```

---

### 2. 取消关注
**DELETE** `/api/follow`

取消关注指定用户。

**请求参数:**
- Query: 
  - `followerId` (必需) - 当前用户ID
  - `followingId` (必需) - 要取消关注的用户ID

**响应示例:**
```json
{
  "success": true,
  "message": "取消关注成功",
  "followersCount": 9
}
```

---

### 3. 检查关注状态
**GET** `/api/follow/check`

检查是否已关注某用户。

**请求参数:**
- Query:
  - `followerId` (必需) - 当前用户ID
  - `followingId` (必需) - 目标用户ID

**响应示例:**
```json
{
  "isFollowing": true
}
```

---

### 4. 获取关注列表
**GET** `/api/follow/following/{userId}`

获取指定用户的关注列表。

**路径参数:**
- `userId` - 用户ID

**查询参数:**
- `currentUserId` (可选) - 当前登录用户ID,用于显示关注状态

**响应示例:**
```json
[
  {
    "id": 2,
    "username": "user2",
    "displayName": "用户2",
    "avatarUrl": "https://example.com/avatar2.jpg",
    "followersCount": 100,
    "followingCount": 50,
    "isFollowing": false
  },
  {
    "id": 3,
    "username": "user3",
    "displayName": "用户3",
    "avatarUrl": "https://example.com/avatar3.jpg",
    "followersCount": 200,
    "followingCount": 80,
    "isFollowing": true
  }
]
```

---

### 5. 获取粉丝列表
**GET** `/api/follow/followers/{userId}`

获取指定用户的粉丝列表。

**路径参数:**
- `userId` - 用户ID

**查询参数:**
- `currentUserId` (可选) - 当前登录用户ID,用于显示关注状态

**响应示例:**
```json
[
  {
    "id": 4,
    "username": "user4",
    "displayName": "用户4",
    "avatarUrl": "https://example.com/avatar4.jpg",
    "followersCount": 50,
    "followingCount": 30,
    "isFollowing": true
  }
]
```

---

### 6. 获取关注统计
**GET** `/api/follow/stats/{userId}`

获取指定用户的关注数和粉丝数统计。

**路径参数:**
- `userId` - 用户ID

**响应示例:**
```json
{
  "followersCount": 150,
  "followingCount": 80
}
```

---

## 数据模型

### Follow 实体
```java
{
  "id": 1,
  "follower": {
    "id": 1,
    "username": "user1"
  },
  "following": {
    "id": 2,
    "username": "user2"
  },
  "createdAt": "2025-12-09T13:30:00Z"
}
```

### UserSummary DTO
```java
{
  "id": 2,
  "username": "user2",
  "displayName": "用户2",
  "avatarUrl": "https://example.com/avatar.jpg",
  "followersCount": 100,
  "followingCount": 50,
  "isFollowing": false
}
```

---

## 业务规则

1. **不能自己关注自己**: 如果 followerId 等于 followingId,返回错误
2. **唯一性约束**: 同一个关注关系只能存在一次
3. **级联查询**: 获取列表时自动计算每个用户的关注统计
4. **延迟加载**: User 实体使用 LAZY 加载策略,提高性能

---

## 使用示例

### 示例1: 用户关注流程
```javascript
// 1. 用户1关注用户2
POST /api/follow?followerId=1
Body: { "followingId": 2 }

// 2. 检查关注状态
GET /api/follow/check?followerId=1&followingId=2
// 返回: { "isFollowing": true }

// 3. 查看用户1的关注列表
GET /api/follow/following/1
// 返回: [{ "id": 2, ... }]

// 4. 查看用户2的粉丝列表
GET /api/follow/followers/2
// 返回: [{ "id": 1, ... }]
```

### 示例2: 取消关注
```javascript
// 用户1取消关注用户2
DELETE /api/follow?followerId=1&followingId=2
// 返回: { "success": true, "message": "取消关注成功" }
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误(如自己关注自己) |
| 404 | 用户不存在 |
| 500 | 服务器内部错误 |

---

## 数据库表结构

```sql
CREATE TABLE follows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    UNIQUE KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
);
```

---

**版本**: v1.0  
**最后更新**: 2025-12-09
