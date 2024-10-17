// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '../../../lib/mongodb';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(profile)
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('user');

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
    async session({ session, token, user }) {
      session.userId = user.id;
      session.provider = token?.provider || null; // 将登录提供商信息存入 session
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;  // 将提供商信息存入 JWT token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
