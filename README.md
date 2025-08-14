# Vercel 跨域代理服务

一个基于 Vercel 的跨域代理服务，用于解决前端跨域问题。

## 功能特性

- 🚀 **简单易用**：通过 `?url=目标地址` 参数即可转发请求
- 🌐 **跨域支持**：设置 `Access-Control-Allow-Origin: *` 允许所有域名访问
- 🔒 **安全校验**：使用 `new URL()` 验证目标地址格式，防止无效请求
- ⚡ **高性能**：基于 Vercel Edge Functions，全球 CDN 加速
- 🛡️ **协议限制**：只允许 HTTP 和 HTTPS 协议，提高安全性
- ⏱️ **超时控制**：10秒请求超时，避免长时间等待

## 部署步骤

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署项目

```bash
# 在项目根目录执行
vercel --prod
```

### 4. 本地开发

```bash
# 本地测试
vercel dev
```

## 使用方法

部署成功后，你会得到一个 Vercel 域名，例如：`https://your-project.vercel.app`

### API 端点

```
GET /api/proxy?url=目标地址
```

### 使用示例

#### 1. 基本用法

```javascript
// 前端 JavaScript 代码
const proxyUrl = 'https://your-project.vercel.app/api/proxy';
const targetUrl = 'https://api.example.com/data';

fetch(`${proxyUrl}?url=${encodeURIComponent(targetUrl)}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### 2. jQuery 示例

```javascript
$.ajax({
  url: 'https://your-project.vercel.app/api/proxy',
  data: {
    url: 'https://api.example.com/data'
  },
  success: function(data) {
    console.log(data);
  },
  error: function(xhr, status, error) {
    console.error('Error:', error);
  }
});
```

#### 3. Axios 示例

```javascript
import axios from 'axios';

const proxyUrl = 'https://your-project.vercel.app/api/proxy';
const targetUrl = 'https://api.example.com/data';

axios.get(proxyUrl, {
  params: {
    url: targetUrl
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error);
});
```

## 错误处理

服务会返回以下错误状态码：

- `400`: 缺少 url 参数或 URL 格式无效
- `405`: 不支持的请求方法（只支持 GET）
- `408`: 请求超时
- `502`: 无法连接到目标服务器
- `500`: 服务器内部错误

## 安全注意事项

1. **协议限制**：只允许 HTTP 和 HTTPS 协议
2. **URL 验证**：使用 `new URL()` 验证目标地址格式
3. **超时控制**：设置 10 秒超时时间
4. **错误处理**：完善的错误处理机制

## 项目结构

```
.
├── api/
│   └── proxy.js          # 主要的代理服务文件
├── package.json          # 项目配置
├── vercel.json          # Vercel 部署配置
└── README.md            # 项目说明
```

## 技术栈

- **运行时**：Node.js 18+
- **部署平台**：Vercel
- **API 类型**：Serverless Functions

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！