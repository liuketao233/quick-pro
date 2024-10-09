// pages/api/check-mongo.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // 尝试连接 MongoDB
    const client = await clientPromise;
    const db = client.db('sample_mflix');  // 访问默认数据库

    // 如果连接成功，返回状态 200 和信息
    res.status(200).json({ message: 'MongoDB connection successful', dbName: db.databaseName });
  } catch (error) {
    // 如果连接失败，返回状态 500 和错误信息
    res.status(500).json({ message: 'MongoDB connection failed', error: error.message });
  }
}
