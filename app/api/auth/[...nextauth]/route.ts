import { prisma } from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'

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
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      // Handle credentials authentication
      if (account?.provider === 'credentials') {
        return true // Allow credentials sign in
      }

      // Handle OAuth authentication
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
      if (user) {
        // Handle both credentials and OAuth users
        token.id = user.id
        token.role = user.role || 'CUSTOMER'
        
        if (profile) {
          // This is an OAuth user, check if they're new
          const dbUser = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
          })
          if (dbUser) {
            // Check if this is a new user (created within the last few seconds)
            const isNewUser = dbUser.createdAt && 
              (new Date().getTime() - dbUser.createdAt.getTime()) < 10000 // Within 10 seconds
            token.isNewUser = isNewUser
          }
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