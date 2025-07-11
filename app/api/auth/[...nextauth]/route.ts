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
    async signIn({ account, profile, user }) {
      if (!profile?.email) {
        throw new Error('No profile')
      }

      // Check if this is a new user
      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
        include: { accounts: true }
      })

      if (existingUser) {
        // User exists, check if they have a Google account linked
        const hasGoogleAccount = existingUser.accounts.some(
          acc => acc.provider === 'google'
        )

        if (!hasGoogleAccount && account?.provider === 'google') {
          // Link the Google account to the existing user
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          })
        }
        return true
      } else {
        // This is a completely new user
        return true
      }
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token as any).role || 'CUSTOMER';
        (session.user as any).isNewUser = (token as any).isNewUser || false;
      }
      return session;
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
          // Check if this is a new user (created within the last few seconds)
          const isNewUser = dbUser.createdAt && 
            (new Date().getTime() - dbUser.createdAt.getTime()) < 10000 // Within 10 seconds
          token.isNewUser = isNewUser
        }
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to home after sign in/up
      return baseUrl + '/'
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }