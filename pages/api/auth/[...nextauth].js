// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(profile);
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified || false,
          image: user.image,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          lastLoginAt: new Date(),
        });
      } else {
        existingUser.lastLoginAt = new Date();
        await existingUser.save();
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
