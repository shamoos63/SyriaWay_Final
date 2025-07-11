"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  name: string
  role: string
  status: string
  preferredLang: string
  phone?: string
  image?: string
  createdAt: string
  lastLoginAt?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (userData: { email: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (session?.user) {
      // Convert NextAuth session to our User format
      const userData: User = {
        id: (session.user as any).id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as any).role || 'CUSTOMER',
        status: 'ACTIVE',
        preferredLang: 'ENGLISH',
        phone: (session.user as any).phone || '',
        image: session.user.image || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }
      setUser(userData)
    } else {
      setUser(null)
    }
    
    setLoading(false)
  }, [session, status])

  const handleSignIn = async (email: string, password: string) => {
    try {
      // For NextAuth, we'll redirect to the sign-in page
      // The actual sign-in will be handled by NextAuth
      await signIn('google', { callbackUrl: '/dashboard' })
      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const handleSignUp = async (userData: { email: string; password: string; name: string; phone?: string }) => {
    try {
      // For NextAuth, we'll redirect to the sign-in page
      // The actual sign-up will be handled by NextAuth
      await signIn('google', { callbackUrl: '/dashboard' })
      return { success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'An error occurred during sign up' }
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn: handleSignIn, 
      signUp: handleSignUp, 
      signOut: handleSignOut, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
} 