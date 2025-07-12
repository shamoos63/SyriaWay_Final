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

export default function SignIn() {
  const { language, dir } = useLanguage()
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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(
          language === "ar"
            ? "فشل في تسجيل الدخول. يرجى التحقق من بياناتك."
            : language === "fr"
            ? "Échec de la connexion. Veuillez vérifier vos informations."
            : "Failed to sign in. Please check your credentials.",
          {
            description: language === "ar"
              ? "تأكد من صحة البريد الإلكتروني وكلمة المرور."
              : language === "fr"
              ? "Assurez-vous que l'email et le mot de passe sont corrects."
              : "Please ensure your email and password are correct."
          }
        )
      } else {
        // Successful sign in
        toast.success(
          language === "ar"
            ? "تم تسجيل الدخول بنجاح!"
            : language === "fr"
            ? "Connexion réussie !"
            : "Successfully signed in!",
          {
            description: language === "ar"
              ? "سيتم توجيهك إلى الصفحة الرئيسية."
              : language === "fr"
              ? "Vous serez redirigé vers la page d'accueil."
              : "You will be redirected to the home page."
          }
        )
        router.push('/')
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error(
        language === "ar"
          ? "فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى."
          : language === "fr"
          ? "Échec de la connexion. Veuillez réessayer."
          : "Failed to sign in. Please try again.",
        {
          description: language === "ar"
            ? "حدث خطأ غير متوقع."
            : language === "fr"
            ? "Une erreur inattendue s'est produite."
            : "An unexpected error occurred."
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
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
      // Redirect to Google OAuth using NextAuth
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error("Google sign in error:", error)
      toast.error(
        language === "ar"
          ? "فشل في تسجيل الدخول باستخدام جوجل."
          : language === "fr"
          ? "Échec de la connexion avec Google."
          : "Failed to sign in with Google.",
        {
          description: language === "ar"
            ? "يرجى المحاولة مرة أخرى أو استخدام تسجيل الدخول العادي."
            : language === "fr"
            ? "Veuillez réessayer ou utiliser la connexion normale."
            : "Please try again or use regular sign in."
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
            {language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Se connecter" : "Sign In"}
          </CardTitle>
          <CardDescription>
            {language === "ar" 
              ? "أدخل بياناتك للوصول إلى حسابك" 
              : language === "fr" 
              ? "Entrez vos informations pour accéder à votre compte"
              : "Enter your details to access your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google Sign In Button */}
            <Button
              type="button"
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
                <span className="bg-syria-cream px-2 text-muted-foreground">
                  {language === "ar" ? "أو" : language === "fr" ? "Ou" : "Or"}
                </span>
              </div>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (language === "ar" ? "جاري تسجيل الدخول..." : language === "fr" ? "Connexion en cours..." : "Signing in...")
                : (language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Se connecter" : "Sign In")
              }
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {language === "ar" ? "ليس لديك حساب؟" : language === "fr" ? "Vous n'avez pas de compte ?" : "Don't have an account?"}
            </span>{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-syria-gold hover:text-syria-gold/80"
              onClick={() => router.push("/auth/sign-up")}
            >
              {language === "ar" ? "إنشاء حساب" : language === "fr" ? "Créer un compte" : "Create account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
