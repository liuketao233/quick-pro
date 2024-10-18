// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // 允许跨域访问，设置允许的域名
  res.setHeader('Access-Control-Allow-Origin', 'https://freefiresimulator.framer.website'); 
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',  // 使用 JWT 作为 session 管理
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        console.log(user, account, profile)
        const client = await clientPromise;
        const db = client.db('sample_mflix');
        const usersCollection = db.collection('users');
  
        // 检查用户是否已存在
        const existingUser = await usersCollection.findOne({ email: user.email });
  
        if (!existingUser) {
          // 如果用户不存在，则创建新用户
          await usersCollection.insertOne({
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified || false,
            image: user.image,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // 如果用户已存在，更新 lastLoginAt 和 updatedAt
          await usersCollection.updateOne(
            { email: user.email },
            {
              $set: {
                lastLoginAt: new Date(),
                updatedAt: new Date(),
              },
            }
          );
        }
        return true;
      },
      async session({ session, token  }) {
        session.accessToken = token.accessToken; // 将 JWT 传递到 session 中
        return session;
      },
      async jwt({ token, account }) {
        if (account) {
          // 当用户首次登录时，生成 JWT
          token.accessToken = jwt.sign(
            { email: token.email, name: token.name },
            process.env.JWT_SECRET,
            { expiresIn: '30 days' }
          );
        }
        return token;
      },
      async redirect({ url, baseUrl }) {
        console.log(url)
        return baseUrl;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
}
