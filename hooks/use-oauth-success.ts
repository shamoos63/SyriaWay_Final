"use client"

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/language-context'

export function useOAuthSuccess() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  useEffect(() => {
    // Check if user just signed up through OAuth
    const isNewUser = searchParams.get('newUser')
    const oauthProvider = searchParams.get('provider')
    
    if (isNewUser === 'true' && oauthProvider === 'google') {
      toast.success(
        language === "ar"
          ? "تم إنشاء الحساب بنجاح! مرحباً بك في سوريا وايز 🎉"
          : language === "fr"
          ? "Compte créé avec succès! Bienvenue chez Syria Ways 🎉"
          : "Account created successfully! Welcome to Syria Ways 🎉",
        {
          description: language === "ar"
            ? "تم تسجيل بياناتك في قاعدة البيانات عبر جوجل. يمكنك الآن استكشاف خدماتنا السياحية."
            : language === "fr"
            ? "Vos données ont été enregistrées dans la base de données via Google. Vous pouvez maintenant explorer nos services touristiques."
            : "Your data has been registered in our database via Google. You can now explore our tourism services.",
          duration: 6000,
          action: {
            label: language === "ar" ? "استكشف" : language === "fr" ? "Explorer" : "Explore",
            onClick: () => window.location.href = "/dashboard"
          }
        }
      )
    } else if (oauthProvider === 'google') {
      // Existing user signed in
      toast.success(
        language === "ar"
          ? "تم تسجيل الدخول بنجاح! مرحباً بعودتك 🎉"
          : language === "fr"
          ? "Connexion réussie! Bon retour 🎉"
          : "Signed in successfully! Welcome back 🎉",
        {
          description: language === "ar"
            ? "يمكنك الآن الوصول إلى لوحة التحكم الخاصة بك."
            : language === "fr"
            ? "Vous pouvez maintenant accéder à votre tableau de bord."
            : "You can now access your dashboard.",
          duration: 4000,
          action: {
            label: language === "ar" ? "لوحة التحكم" : language === "fr" ? "Tableau de bord" : "Dashboard",
            onClick: () => window.location.href = "/dashboard"
          }
        }
      )
    }
  }, [searchParams, language])
} 