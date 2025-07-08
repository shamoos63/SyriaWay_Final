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

export default function SignUp() {
  const { language, dir } = useLanguage()
  const { signUp } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const success = await signUp(formData.name, formData.email, formData.password)
      if (success) {
        toast.success("Account created successfully!")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      // Redirect to Google OAuth
      window.location.href = "/api/auth/signin/google"
    } catch (error) {
      console.error("Google sign up error:", error)
      toast.error("Failed to sign up with Google.")
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
            {language === "ar" ? "إنشاء حساب جديد" : language === "fr" ? "Créer un compte" : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {language === "ar" ? "أو" : language === "fr" ? "Ou" : "Or"}{" "}
            <a
              href="/auth/sign-in"
              className="font-medium text-syria-gold hover:text-syria-dark-gold"
            >
              {language === "ar" ? "تسجيل الدخول إلى حساب موجود" : language === "fr" ? "se connecter à un compte existant" : "sign in to existing account"}
            </a>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "إنشاء حساب" : language === "fr" ? "Créer un compte" : "Sign Up"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "أدخل بياناتك لإنشاء حساب جديد" : language === "fr" ? "Entrez vos informations pour créer un nouveau compte" : "Enter your information to create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign Up Button */}
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              {language === "ar" ? "إنشاء حساب باستخدام جوجل" : language === "fr" ? "Créer un compte avec Google" : "Sign up with Google"}
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
                <Label htmlFor="name">
                  {language === "ar" ? "الاسم الكامل" : language === "fr" ? "Nom complet" : "Full Name"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder={
                    language === "ar"
                      ? "أدخل اسمك الكامل"
                      : language === "fr"
                      ? "Entrez votre nom complet"
                      : "Enter your full name"
                  }
                />
              </div>

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

              <div>
                <Label htmlFor="confirmPassword">
                  {language === "ar" ? "تأكيد كلمة المرور" : language === "fr" ? "Confirmer le mot de passe" : "Confirm Password"}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  placeholder={
                    language === "ar"
                      ? "أعد إدخال كلمة المرور"
                      : language === "fr"
                      ? "Répétez votre mot de passe"
                      : "Re-enter your password"
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? language === "ar"
                    ? "جاري إنشاء الحساب..."
                    : language === "fr"
                    ? "Création du compte en cours..."
                    : "Creating account..."
                  : language === "ar"
                  ? "إنشاء الحساب"
                  : language === "fr"
                  ? "Créer le compte"
                  : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
