import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

// Custom Drizzle adapter for NextAuth
const drizzleAdapter = {
  async createUser(data: any) {
    const [user] = await db.insert(users).values({
      email: data.email,
      name: data.name,
      emailVerified: data.emailVerified,
    }).returning()
    return user
  },
  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)))
    return user || null
  },
  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user || null
  },
  async getUserByAccount({ provider, providerAccountId }: { provider: string, providerAccountId: string }) {
    const [account] = await db.select().from(accounts).where(eq(accounts.provider, provider)).where(eq(accounts.providerAccountId, providerAccountId))
    if (!account) return null
    const [user] = await db.select().from(users).where(eq(users.id, account.userId))
    return user || null
  },
  async updateUser(data: any) {
    const [user] = await db.update(users).set(data).where(eq(users.id, parseInt(data.id))).returning()
    return user
  },
  async deleteUser(userId: string) {
    await db.delete(users).where(eq(users.id, parseInt(userId)))
  },
  async linkAccount(data: any) {
    await db.insert(accounts).values(data)
  },
  async unlinkAccount({ provider, providerAccountId }: { provider: string, providerAccountId: string }) {
    await db.delete(accounts).where(eq(accounts.provider, provider)).where(eq(accounts.providerAccountId, providerAccountId))
  },
  async createSession(data: any) {
    const [session] = await db.insert(sessions).values(data).returning()
    return session
  },
  async getSessionAndUser(sessionToken: string) {
    const [session] = await db.select().from(sessions).where(eq(sessions.sessionToken, sessionToken))
    if (!session) return null
    const [user] = await db.select().from(users).where(eq(users.id, session.userId))
    return { session, user: user || null }
  },
  async updateSession(data: any) {
    const [session] = await db.update(sessions).set(data).where(eq(sessions.sessionToken, data.sessionToken)).returning()
    return session
  },
  async deleteSession(sessionToken: string) {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
  },
  async createVerificationToken(data: any) {
    const [token] = await db.insert(verificationTokens).values(data).returning()
    return token
  },
  async useVerificationToken({ identifier, token }: { identifier: string, token: string }) {
    const [verificationToken] = await db.select().from(verificationTokens).where(eq(verificationTokens.identifier, identifier)).where(eq(verificationTokens.token, token))
    if (!verificationToken) return null
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier)).where(eq(verificationTokens.token, token))
    return verificationToken
  },
}

export const authOptions: NextAuthOptions = {
  adapter: drizzleAdapter as any,
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

        const [user] = await db.select().from(users).where(eq(users.email, credentials.email))

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'CUSTOMER'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string || 'CUSTOMER'
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
} 