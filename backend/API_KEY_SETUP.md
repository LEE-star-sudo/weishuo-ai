# 安全配置说明

## API Key 配置

本项目的 `application.properties` 文件已从 Git 仓库中移除，以保护 API Key 等敏感信息。

### 本地开发配置

1. 复制示例配置文件：
   ```bash
   cp backend/src/main/resources/application-example.properties \
      backend/src/main/resources/application.properties
   ```

2. 编辑 `application.properties`，将 `YOUR_API_KEY_HERE` 替换为你的真实 API Key

3. 获取免费 API Key：访问 https://mediastack.com/ 注册账号

### 生产环境配置

使用环境变量设置 API Key：

```bash
export MEDIASTACK_API_KEY=your_real_api_key_here
```

或在启动命令中指定：

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments=--news.api.api-key=your_key
```

### 重要提示

⚠️ 请勿将 `application.properties` 文件提交到 Git 仓库！
