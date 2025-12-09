# 新闻备用系统文档

## 概述
新闻服务实现了双重数据源机制，确保在远程API不可用时仍能提供新闻内容。

## 工作流程

### 1. 主要流程（API优先）
```
用户请求 → 尝试远程API → 成功 → 保存到数据库缓存 → 返回新闻
                      ↓ 失败
                   从数据库读取备用新闻 → 返回新闻
```

### 2. 自动缓存机制
- 每次成功从远程API获取新闻后，自动保存到数据库
- 根据URL进行去重，避免重复保存
- 保存时包含完整的新闻内容、来源、发布时间等信息

### 3. 数据库备用新闻
数据库表：`news_backup`

字段说明：
```sql
CREATE TABLE news_backup (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,           -- 新闻标题
    summary VARCHAR(1000),                 -- 摘要
    content TEXT NOT NULL,                 -- 正文内容
    source VARCHAR(200),                   -- 来源
    url VARCHAR(1000) UNIQUE,              -- 原文链接（用于去重）
    category VARCHAR(50),                  -- 分类
    published_at TIMESTAMP,                -- 发布时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 初始化机制

### 自动初始化
应用启动时，`NewsDataInitializer` 会自动检查数据库：
- 如果数据库为空，自动添加20条备用新闻
- 如果已有数据，跳过初始化

### 备用新闻内容
涵盖多个领域：
- 科技新闻（AI、量子计算、5G、芯片等）
- 社会新闻（教育、城市建设、电商等）
- 热点新闻（气候、能源、金融等）

## API端点

### 获取新闻
```
GET /api/news/{channel}
```

**参数**：
- `channel`: 频道名称（hot/tech/video/society/headline）

**返回**：
- 优先返回远程API的最新新闻
- API失败时返回数据库缓存的新闻

**示例**：
```bash
# 获取热点新闻
curl http://localhost:8081/api/news/hot

# 获取科技新闻
curl http://localhost:8081/api/news/tech
```

## 日志监控

系统会记录详细的日志信息：

### 成功获取远程新闻
```
INFO  成功从远程 API 获取 10 条新闻
INFO  已缓存 8 条新闻到数据库
```

### API失败切换到备用
```
WARN  远程新闻 API 失败，切换到数据库缓存: Connection timeout
INFO  从数据库缓存读取 20 条新闻
```

### 数据库为空
```
WARN  数据库缓存为空，返回空列表
```

## 配置说明

### application.yml
```yaml
news:
  api-key: ${NEWS_API_KEY:}           # 远程API密钥（可选）
  base-url: https://api.mediastack.com/v1
  country: cn
  language: zh
  page-size: 10
```

**说明**：
- 如果未配置 `api-key`，系统会直接使用数据库备用新闻
- 配置了 `api-key` 后会优先使用远程API

## 测试脚本

运行测试脚本验证备用机制：
```powershell
.\test-news-backup.ps1
```

测试内容：
1. 测试各个频道的新闻获取
2. 验证备用机制是否正常工作
3. 查看日志输出

## 维护建议

### 1. 定期更新备用新闻
可以通过以下方式更新数据库中的备用新闻：
- 让系统在API可用时自动积累更多缓存
- 手动向数据库插入高质量的新闻内容

### 2. 监控缓存数量
```sql
-- 查看备用新闻总数
SELECT COUNT(*) FROM news_backup;

-- 查看最新的备用新闻
SELECT title, published_at FROM news_backup 
ORDER BY published_at DESC LIMIT 10;

-- 按分类统计
SELECT category, COUNT(*) FROM news_backup 
GROUP BY category;
```

### 3. 清理旧数据
可以定期清理过期的备用新闻：
```sql
-- 删除30天前的新闻
DELETE FROM news_backup 
WHERE published_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## 优势

1. **高可用性**：即使远程API不可用，系统仍能正常提供新闻服务
2. **自动缓存**：成功获取的新闻自动保存，逐步积累更多备用内容
3. **无缝切换**：API失败时自动切换到备用数据，用户无感知
4. **零配置**：首次启动自动初始化，无需手动干预

## 故障排查

### 问题1：总是使用备用新闻
**原因**：API Key未配置或无效

**解决**：
```bash
# 检查配置
echo $env:NEWS_API_KEY

# 设置API Key
$env:NEWS_API_KEY="your_api_key_here"
```

### 问题2：备用新闻数量不足
**原因**：数据库中的缓存被清空

**解决**：
- 重启应用，自动初始化会添加20条备用新闻
- 或手动运行 `NewsDataInitializer`

### 问题3：新闻内容重复
**原因**：URL去重机制失效

**解决**：
- 检查新闻URL是否为空
- 清理数据库中的重复记录
```sql
DELETE n1 FROM news_backup n1
INNER JOIN news_backup n2 
WHERE n1.id > n2.id AND n1.url = n2.url;
```

## 扩展建议

1. **增加更多备用新闻**：在 `NewsDataInitializer` 中添加更多初始数据
2. **定时刷新**：实现定时任务，定期从API获取最新新闻并缓存
3. **多API源**：配置多个新闻API作为备份源
4. **智能切换**：根据API响应速度和成功率动态选择数据源
