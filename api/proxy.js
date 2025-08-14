// Vercel 跨域代理服务
// 核心功能：通过 ?url=目标地址 接收前端传入的 URL，转发 GET 请求并返回结果

export default async function handler(req, res) {
  // 设置 CORS 头，允许所有域名访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    res.status(405).json({ error: '只支持 GET 请求' });
    return;
  }
  
  try {
    // 获取目标 URL
    const { url } = req.query;
    
    if (!url) {
      res.status(400).json({ error: '缺少 url 参数' });
      return;
    }
    
    // 安全校验：验证目标地址格式
    let targetUrl;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      res.status(400).json({ error: '无效的 URL 格式' });
      return;
    }
    
    // 安全限制：只允许 http 和 https 协议
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      res.status(400).json({ error: '只支持 HTTP 和 HTTPS 协议' });
      return;
    }
    
    // 转发请求到目标地址
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-Proxy-Service/1.0',
        'Accept': '*/*'
      },
      // 设置超时时间（10秒）
      signal: AbortSignal.timeout(10000)
    });
    
    // 检查响应状态
    if (!response.ok) {
      res.status(response.status).json({ 
        error: `目标服务器返回错误: ${response.status} ${response.statusText}` 
      });
      return;
    }
    
    // 获取响应内容类型
    const contentType = response.headers.get('content-type') || 'text/plain';
    
    // 设置响应头
    res.setHeader('Content-Type', contentType);
    
    // 根据内容类型处理响应
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(200).json(data);
    } else if (contentType.includes('text/')) {
      const text = await response.text();
      res.status(200).send(text);
    } else {
      // 对于其他类型（如图片、文件等），直接转发
      const buffer = await response.arrayBuffer();
      res.status(200).send(Buffer.from(buffer));
    }
    
  } catch (error) {
    console.error('代理请求失败:', error);
    
    if (error.name === 'TimeoutError') {
      res.status(408).json({ error: '请求超时' });
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      res.status(502).json({ error: '无法连接到目标服务器' });
    } else {
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
}