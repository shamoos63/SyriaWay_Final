"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"

export default function SignUp() {
  const { language, dir } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error(
        language === "ar"
          ? "كلمات المرور غير متطابقة"
          : language === "fr"
          ? "Les mots de passe ne correspondent pas"
          : "Passwords do not match",
        {
          description: language === "ar"
            ? "تأكد من أن كلمة المرور وتأكيدها متطابقان."
            : language === "fr"
            ? "Assurez-vous que le mot de passe et sa confirmation correspondent."
            : "Please ensure the password and confirmation match."
        }
      )
      setIsLoading(false)
      return
    }

    try {
      // For NextAuth, we'll redirect to Google OAuth
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error("Sign up error:", error)
      toast.error(
        language === "ar"
          ? "فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى."
          : language === "fr"
          ? "Échec de la création du compte. Veuillez réessayer."
          : "Failed to create account. Please try again.",
        {
          description: language === "ar"
            ? "تأكد من صحة البيانات المدخلة وأن البريد الإلكتروني غير مستخدم مسبقاً."
            : language === "fr"
            ? "Assurez-vous que les données saisies sont correctes et que l'email n'est pas déjà utilisé."
            : "Please ensure your data is correct and the email is not already in use."
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      // Show loading toast
      toast.loading(
        language === "ar"
          ? "جاري التوجيه إلى جوجل..."
          : language === "fr"
          ? "Redirection vers Google..."
          : "Redirecting to Google...",
        {
          duration: 2000
        }
      )
      // Redirect to Google OAuth
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error("Google sign up error:", error)
      toast.error(
        language === "ar"
          ? "فشل في تسجيل الدخول باستخدام جوجل."
          : language === "fr"
          ? "Échec de la connexion avec Google."
          : "Failed to sign up with Google.",
        {
          description: language === "ar"
            ? "يرجى المحاولة مرة أخرى أو استخدام التسجيل العادي."
            : language === "fr"
            ? "Veuillez réessayer ou utiliser l'inscription normale."
            : "Please try again or use regular sign up."
        }
      )
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-syria-cream border-syria-gold">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-syria-gold">
            {language === "ar" ? "إنشاء حساب" : language === "fr" ? "Créer un compte" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {language === "ar" 
              ? "أدخل بياناتك لإنشاء حساب جديد" 
              : language === "fr" 
              ? "Entrez vos informations pour créer un nouveau compte"
              : "Enter your details to create a new account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google Sign Up Button */}
            <Button
              type="button"
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
                <span className="bg-syria-cream px-2 text-muted-foreground">
                  {language === "ar" ? "أو" : language === "fr" ? "Ou" : "Or"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                {language === "ar" ? "الاسم الكامل" : language === "fr" ? "Nom complet" : "Full Name"}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={language === "ar" ? "أدخل اسمك الكامل" : language === "fr" ? "Entrez votre nom complet" : "Enter your full name"}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "ar" ? "البريد الإلكتروني" : language === "fr" ? "Email" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : language === "fr" ? "Entrez votre email" : "Enter your email"}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === "ar" ? "رقم الهاتف" : language === "fr" ? "Numéro de téléphone" : "Phone Number"}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={language === "ar" ? "أدخل رقم هاتفك" : language === "fr" ? "Entrez votre numéro de téléphone" : "Enter your phone number"}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {language === "ar" ? "كلمة المرور" : language === "fr" ? "Mot de passe" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={language === "ar" ? "أدخل كلمة المرور" : language === "fr" ? "Entrez votre mot de passe" : "Enter your password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === "ar" ? "تأكيد كلمة المرور" : language === "fr" ? "Confirmer le mot de passe" : "Confirm Password"}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={language === "ar" ? "أعد إدخال كلمة المرور" : language === "fr" ? "Répétez votre mot de passe" : "Re-enter your password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (language === "ar" ? "جاري إنشاء الحساب..." : language === "fr" ? "Création du compte..." : "Creating account...")
                : (language === "ar" ? "إنشاء الحساب" : language === "fr" ? "Créer le compte" : "Create Account")
              }
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {language === "ar" ? "لديك حساب بالفعل؟" : language === "fr" ? "Vous avez déjà un compte ?" : "Already have an account?"}
            </span>{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-syria-gold hover:text-syria-gold/80"
              onClick={() => router.push("/auth/sign-in")}
            >
              {language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Se connecter" : "Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
