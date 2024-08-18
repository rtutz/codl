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
  
  callbacks: {
    session({ session, token, user }) {
    session.user.id = user.id; //  Add role value to user object so it is passed along with session            
    return session;
   }
 }
}

export default NextAuth(authOptions);