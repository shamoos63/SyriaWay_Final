"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"

export default function SignIn() {
  const { language, dir } = useLanguage()
  const { signIn } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await signIn(formData.email, formData.password)
      if (success) {
        toast.success("Signed in successfully!")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Redirect to Google OAuth
      window.location.href = "/api/auth/signin/google"
    } catch (error) {
      console.error("Google sign in error:", error)
      toast.error("Failed to sign in with Google.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Se connecter" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {language === "ar" ? "أو" : language === "fr" ? "Ou" : "Or"}{" "}
            <a
              href="/auth/sign-up"
              className="font-medium text-syria-gold hover:text-syria-dark-gold"
            >
              {language === "ar" ? "إنشاء حساب جديد" : language === "fr" ? "créer un nouveau compte" : "create a new account"}
            </a>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Se connecter" : "Sign In"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "أدخل بياناتك للدخول إلى حسابك" : language === "fr" ? "Entrez vos informations pour vous connecter" : "Enter your information to sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              {language === "ar" ? "تسجيل الدخول باستخدام جوجل" : language === "fr" ? "Se connecter avec Google" : "Sign in with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {language === "ar" ? "أو" : language === "fr" ? "Ou" : "Or continue with"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">
                  {language === "ar" ? "البريد الإلكتروني" : language === "fr" ? "Email" : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder={
                    language === "ar"
                      ? "أدخل بريدك الإلكتروني"
                      : language === "fr"
                      ? "Entrez votre email"
                      : "Enter your email"
                  }
                />
              </div>

              <div>
                <Label htmlFor="password">
                  {language === "ar" ? "كلمة المرور" : language === "fr" ? "Mot de passe" : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  placeholder={
                    language === "ar"
                      ? "أدخل كلمة المرور"
                      : language === "fr"
                      ? "Entrez votre mot de passe"
                      : "Enter your password"
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? language === "ar"
                    ? "جاري تسجيل الدخول..."
                    : language === "fr"
                    ? "Connexion en cours..."
                    : "Signing in..."
                  : language === "ar"
                  ? "تسجيل الدخول"
                  : language === "fr"
                  ? "Se connecter"
                  : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
