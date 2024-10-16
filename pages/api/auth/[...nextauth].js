// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// import clientPromise from '../../../lib/mongodb';  // 导入 MongoDB 连接

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   console.log(user,account,profile)
    //   console.log("User signed in:", user);
    //   return true; // 返回 true 以允许登录
    // },
    // async redirect({ url, baseUrl }) {
    //   console.log(url)
    //   // 登录成功后的重定向
    //   return baseUrl; // 登录后重定向回首页
    // },
    async session({ session, token, user }) {
      // 自定义会话数据
      console.log(session, token, user)
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // 自定义 JWT 令牌
      console.log(account, profile, isNewUser)
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // async signIn({ user, account, profile }) {
    //   try {
    //     console.log(user,account,profile);  // 添加对 account 的引用以避免警告
    //     // const client = await clientPromise;
    //     // const db = client.db(); // 连接到默认数据库

    //     // // 检查用户是否已存在
    //     // const existingUser = await db.collection('users').findOne({ email: user.email });

    //     // if (!existingUser) {
    //     //   // 如果用户不存在，插入新的用户记录
    //     //   await db.collection('users').insertOne({
    //     //     name: user.name,
    //     //     email: user.email,
    //     //     image: user.image,
    //     //     createdAt: new Date(),
    //     //   });
    //     // }

    //     return true; // 登录成功
    //   } catch (error) {
    //     console.error('Error saving user to MongoDB', error);
    //     return false; // 登录失败
    //   }
    // },
    // async session({ session, token, user }) {
    //   console.log( token, user);  // 添加对 account 的引用以避免警告
    //   const client = await clientPromise;
    //   const db = client.db();
      
    //   // 从数据库获取用户信息并附加到会话
    //   const dbUser = await db.collection('users').findOne({ email: session.user.email });

    //   if (dbUser) {
    //     session.user.id = dbUser._id;
    //   }

    //   return session;
    // },
  },
  timeout:10000
});
