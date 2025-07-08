import { prisma } from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const authOption: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        throw new Error('No profile')
      }

      // The PrismaAdapter will handle user creation automatically
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = (token as any).role || 'CUSTOMER'
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (profile) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role || 'CUSTOMER'
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }