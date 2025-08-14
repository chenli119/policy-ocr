# CORS 代理服务

一个简单高效的 CORS 代理服务，基于 Vercel Serverless Functions，用于解决前端跨域问题。

## 项目结构

```
├── api/
│   └── index.js          # Serverless Function 代理服务
├── package.json           # 项目配置和依赖
├── vercel.json           # Vercel 部署配置
└── README.md             # 项目说明
```

## 功能特点

- 🚀 支持所有 HTTP 方法 (GET, POST, PUT, DELETE, OPTIONS, PATCH)
- 🔒 自动处理 CORS 头部，解决跨域问题
- ⚡ 基于 Vercel Serverless Functions，无服务器部署
- 📦 支持 JSON 和各种数据格式
- 🛡️ 基本的错误处理和超时控制
- 🎯 轻量级设计，只保留核心功能

## 使用方法

### 基本用法

```
https://your-vercel-domain.vercel.app/api?url=目标URL
```

### 示例

```javascript
// 原本跨域的请求
fetch('https://api.example.com/data') // ❌ 跨域错误

// 使用代理服务
fetch('https://your-proxy.vercel.app/api?url=https://api.example.com/data') // ✅ 成功
```

### 支持的请求类型

#### GET 请求
```javascript
fetch('https://your-proxy.vercel.app/api?url=https://api.example.com/users')
```

#### POST 请求
```javascript
fetch('https://your-proxy.vercel.app/api?url=https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})
```

#### 其他 HTTP 方法
```javascript
// PUT 请求
fetch('https://your-proxy.vercel.app/api?url=https://api.example.com/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated Name' })
})

// DELETE 请求
fetch('https://your-proxy.vercel.app/api?url=https://api.example.com/users/1', {
  method: 'DELETE'
})
```

## 部署到 Vercel

### 方法一：通过 GitHub 集成（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 中导入项目
3. 选择你的 GitHub 仓库
4. 点击部署

### 方法二：通过 Vercel CLI

1. 安装 Vercel CLI
```bash
npm i -g vercel
```

2. 在项目目录中运行
```bash
vercel
```

3. 按照提示完成部署

## 技术实现

### 核心依赖
- **axios**: HTTP 客户端，用于发送代理请求
- **Node.js 20.x**: 运行时环境

### 配置说明

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

#### package.json
```json
{
  "engines": {
    "node": "20.x"
  },
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

## 错误处理

服务会返回以下错误信息：

- `400`: 缺少 url 参数
  ```json
  {
    "error": "URL parameter is required",
    "usage": "Add ?url=<target_url> to your request"
  }
  ```

- `500`: 代理请求失败
  ```json
  {
    "error": "代理请求失败",
    "message": "具体错误信息",
    "timestamp": "2025-01-15T07:31:45.000Z"
  }
  ```

## 安全注意事项

⚠️ **重要提醒**：此代理服务允许访问任何 URL，在生产环境中使用时请考虑：

1. **域名白名单**：限制可访问的目标域名
2. **请求频率限制**：防止滥用
3. **身份验证**：添加 API 密钥或其他认证机制
4. **监控和日志**：记录请求日志用于分析
5. **超时控制**：当前设置为 10 秒超时

## 许可证

MIT License

---

**快速开始**：点击 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo) 一键部署到 Vercel！