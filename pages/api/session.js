import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // 设置 CORS 头，允许来自 Framer 的跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');  // 如果需要传递 cookies 或身份信息
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();  // 对预检请求返回 200 OK
    return;
  }

  // 获取会话信息
  const session = await getSession({ req });
  if (session) {
    res.status(200).json({ session });
  } else {
    res.status(200).json({ session: null });
  }
}