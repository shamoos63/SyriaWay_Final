"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { FcGoogle } from "react-icons/fc"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  type: "signin" | "signup"
  onSwitchMode: () => void
}

export function AuthModal({ isOpen, onClose, type, onSwitchMode }: AuthModalProps) {
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Translations
  const translations = {
    en: {
      signIn: "Sign In",
      createAccount: "Create Account",
      signInWithGoogle: "Sign in with Google",
      signUpWithGoogle: "Sign up with Google",
      orContinueWith: "Or continue with",
      email: "Email",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone (Optional)",
      confirmPassword: "Confirm Password",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      createPassword: "Create a password",
      confirmYourPassword: "Confirm your password",
      john: "John",
      doe: "Doe",
      johnExample: "john@example.com",
      phoneExample: "+1234567890",
      signingIn: "Signing in...",
      creatingAccount: "Creating account...",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      createAccountLink: "Create account",
      signInLink: "Sign in",
      fillAllFields: "Please fill in all fields",
      fillRequiredFields: "Please fill in all required fields",
      passwordsDontMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters long",
      signInFailed: "Sign in failed",
      signUpFailed: "Sign up failed",
      accountCreatedSuccess: "Account created successfully!",
      accountCreatedDescription: "You will be signed in automatically.",
      signInSuccess: "Successfully signed in!",
      signInDescription: "You will be redirected to the home page.",
      failedToCreateAccount: "Failed to create account. Please try again.",
      failedToSignIn: "Failed to sign in. Please try again.",
      unexpectedError: "An unexpected error occurred.",
      googleAuthFailed: "Failed to authenticate with Google."
    },
    ar: {
      signIn: "تسجيل الدخول",
      createAccount: "إنشاء حساب",
      signInWithGoogle: "تسجيل الدخول باستخدام جوجل",
      signUpWithGoogle: "إنشاء حساب باستخدام جوجل",
      orContinueWith: "أو المتابعة باستخدام",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      phone: "رقم الهاتف (اختياري)",
      confirmPassword: "تأكيد كلمة المرور",
      enterEmail: "أدخل بريدك الإلكتروني",
      enterPassword: "أدخل كلمة المرور",
      createPassword: "إنشاء كلمة مرور",
      confirmYourPassword: "تأكيد كلمة المرور",
      john: "أحمد",
      doe: "محمد",
      johnExample: "ahmed@example.com",
      phoneExample: "+963123456789",
      signingIn: "جاري تسجيل الدخول...",
      creatingAccount: "جاري إنشاء الحساب...",
      dontHaveAccount: "ليس لديك حساب؟",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      createAccountLink: "إنشاء حساب",
      signInLink: "تسجيل الدخول",
      fillAllFields: "يرجى ملء جميع الحقول",
      fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
      passwordsDontMatch: "كلمات المرور غير متطابقة",
      passwordTooShort: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      signInFailed: "فشل تسجيل الدخول",
      signUpFailed: "فشل إنشاء الحساب",
      accountCreatedSuccess: "تم إنشاء الحساب بنجاح!",
      accountCreatedDescription: "سيتم تسجيل دخولك تلقائياً.",
      signInSuccess: "تم تسجيل الدخول بنجاح!",
      signInDescription: "سيتم توجيهك إلى الصفحة الرئيسية.",
      failedToCreateAccount: "فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.",
      failedToSignIn: "فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.",
      unexpectedError: "حدث خطأ غير متوقع.",
      googleAuthFailed: "فشل في المصادقة مع جوجل."
    },
    fr: {
      signIn: "Se connecter",
      createAccount: "Créer un compte",
      signInWithGoogle: "Se connecter avec Google",
      signUpWithGoogle: "Créer un compte avec Google",
      orContinueWith: "Ou continuer avec",
      email: "Email",
      password: "Mot de passe",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phone: "Téléphone (Optionnel)",
      confirmPassword: "Confirmer le mot de passe",
      enterEmail: "Entrez votre email",
      enterPassword: "Entrez votre mot de passe",
      createPassword: "Créer un mot de passe",
      confirmYourPassword: "Confirmez votre mot de passe",
      john: "Jean",
      doe: "Dupont",
      johnExample: "jean@exemple.com",
      phoneExample: "+33123456789",
      signingIn: "Connexion en cours...",
      creatingAccount: "Création du compte...",
      dontHaveAccount: "Vous n'avez pas de compte ?",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      createAccountLink: "Créer un compte",
      signInLink: "Se connecter",
      fillAllFields: "Veuillez remplir tous les champs",
      fillRequiredFields: "Veuillez remplir tous les champs requis",
      passwordsDontMatch: "Les mots de passe ne correspondent pas",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
      signInFailed: "Échec de la connexion",
      signUpFailed: "Échec de la création du compte",
      accountCreatedSuccess: "Compte créé avec succès !",
      accountCreatedDescription: "Vous serez connecté automatiquement.",
      signInSuccess: "Connexion réussie !",
      signInDescription: "Vous serez redirigé vers la page d'accueil.",
      failedToCreateAccount: "Échec de la création du compte. Veuillez réessayer.",
      failedToSignIn: "Échec de la connexion. Veuillez réessayer.",
      unexpectedError: "Une erreur inattendue s'est produite.",
      googleAuthFailed: "Échec de l'authentification avec Google."
    }
  }

  const tr = translations[language as keyof typeof translations]

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  })

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!signInData.email || !signInData.password) {
      setError(tr.fillAllFields)
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email: signInData.email,
        password: signInData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(tr.signInFailed)
      } else {
        // Successful sign in
        toast.success(tr.signInSuccess, {
          description: tr.signInDescription
        })
        onClose()
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError(tr.failedToSignIn)
    }
    
    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validation
    if (!signUpData.firstName || !signUpData.lastName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setError(tr.fillRequiredFields)
      setIsLoading(false)
      return
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError(tr.passwordsDontMatch)
      setIsLoading(false)
      return
    }

    if (signUpData.password.length < 6) {
      setError(tr.passwordTooShort)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${signUpData.firstName} ${signUpData.lastName}`,
          email: signUpData.email,
          password: signUpData.password,
          phone: signUpData.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || tr.failedToCreateAccount)
      }

      // Account created successfully, now sign in
      toast.success(tr.accountCreatedSuccess, {
        description: tr.accountCreatedDescription
      })

      // Sign in the user automatically
      const signInResult = await signIn('credentials', {
        email: signUpData.email,
        password: signUpData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // If auto sign-in fails, just close the modal
        onClose()
      } else {
        // Successful sign-in, close modal
        onClose()
      }

    } catch (error) {
      console.error("Sign up error:", error)
      setError(tr.failedToCreateAccount)
    }
    
    setIsLoading(false)
  }

  const handleClose = () => {
    setError("")
    setSignInData({ email: "", password: "" })
    setSignUpData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    })
    onClose()
  }

  const handleGoogleAuth = async () => {
    try {
      // Redirect to Google OAuth
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error("Google auth error:", error)
      toast.error(tr.googleAuthFailed)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-syria-cream dark:bg-[#4a4a4a] border-syria-gold">
        <DialogHeader>
          <DialogTitle className="text-2xl text-syria-gold text-center">
            {type === "signin" ? (
              <>
                <LogIn className="inline-block mr-2 h-6 w-6" />
                {tr.signIn}
              </>
            ) : (
              <>
                <UserPlus className="inline-block mr-2 h-6 w-6" />
                {tr.createAccount}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {type === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign In Button */}
            <Button
              type="button"
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              {tr.signInWithGoogle}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-syria-cream dark:bg-[#4a4a4a] px-2 text-muted-foreground">
                  {tr.orContinueWith}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{tr.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={tr.enterEmail}
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{tr.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={tr.enterPassword}
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? tr.signingIn : tr.signIn}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{tr.dontHaveAccount}</span>{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-syria-gold hover:text-syria-gold/80"
                onClick={onSwitchMode}
              >
                {tr.createAccountLink}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign Up Button */}
            <Button
              type="button"
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              {tr.signUpWithGoogle}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-syria-cream dark:bg-[#4a4a4a] px-2 text-muted-foreground">
                  {tr.orContinueWith}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{tr.firstName}</Label>
                <Input
                  id="firstName"
                  placeholder={tr.john}
                  value={signUpData.firstName}
                  onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{tr.lastName}</Label>
                <Input
                  id="lastName"
                  placeholder={tr.doe}
                  value={signUpData.lastName}
                  onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">{tr.email}</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder={tr.johnExample}
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{tr.phone}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={tr.phoneExample}
                value={signUpData.phone}
                onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">{tr.password}</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={tr.createPassword}
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{tr.confirmPassword}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={tr.confirmYourPassword}
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? tr.creatingAccount : tr.createAccount}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{tr.alreadyHaveAccount}</span>{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-syria-gold hover:text-syria-gold/80"
                onClick={onSwitchMode}
              >
                {tr.signInLink}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
