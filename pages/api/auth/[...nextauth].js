import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../prisma/client'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token
      //   token.id = profile.id
      // }
      console.log("token in jwt func is", token);
      return token
    },
    session({ session, token, user, isNewUser }) {
      console.log("isNewUser is", isNewUser);
      session.user.id = user.id; //  Add role value to user object so it is passed along with session
      session.user.role = user.role;
      return session;
    }
  }
}

export default NextAuth(authOptions);