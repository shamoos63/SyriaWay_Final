"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, BookOpen, MapPin, GraduationCap } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { toast } from "@/hooks/use-toast"

interface EducationalApplicationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProgram?: EducationalProgram | null
  loading?: boolean
}

interface EducationalProgram {
  id: number
  title: string
  description: string
  location: string
  duration: string
  image: string
}

interface ApplicationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  programId: number
  programTitle: string
  startDate: string
  duration: string
  message: string
  language: string
}

export function EducationalApplicationModal({ 
  open, 
  onOpenChange, 
  selectedProgram, 
  loading = false 
}: EducationalApplicationModalProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    programId: 0,
    programTitle: "",
    startDate: "",
    duration: "",
    message: "",
    language: language
  })

  useEffect(() => {
    if (selectedProgram) {
      setFormData(prev => ({
        ...prev,
        programId: selectedProgram.id,
        programTitle: selectedProgram.title,
        duration: selectedProgram.duration
      }))
    }
  }, [selectedProgram])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          subject: "Educational inquiry",
          message: `
Program: ${formData.programTitle}
Nationality: ${formData.nationality}
Start Date: ${formData.startDate}
Duration: ${formData.duration}
Language: ${formData.language}

Message:
${formData.message}
          `.trim(),
          type: "EDUCATIONAL_INQUIRY"
        }),
      })

      if (response.ok) {
        toast({
          title: language === "ar" ? "تم إرسال الطلب بنجاح" : language === "fr" ? "Demande envoyée avec succès" : "Application submitted successfully",
          description: language === "ar" ? "سنقوم بالرد عليك قريباً" : language === "fr" ? "Nous vous répondrons bientôt" : "We will get back to you soon",
        })
        onOpenChange(false)
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          nationality: "",
          programId: 0,
          programTitle: "",
          startDate: "",
          duration: "",
          message: "",
          language: language
        })
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      toast({
        title: language === "ar" ? "خطأ في إرسال الطلب" : language === "fr" ? "Erreur lors de l'envoi" : "Error submitting application",
        description: language === "ar" ? "يرجى المحاولة مرة أخرى" : language === "fr" ? "Veuillez réessayer" : "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const translations = {
    title: {
      en: "Apply for Educational Program",
      ar: "التقدم لبرنامج تعليمي",
      fr: "Postuler pour un programme éducatif"
    },
    firstName: {
      en: "First Name",
      ar: "الاسم الأول",
      fr: "Prénom"
    },
    lastName: {
      en: "Last Name", 
      ar: "اسم العائلة",
      fr: "Nom de famille"
    },
    email: {
      en: "Email",
      ar: "البريد الإلكتروني",
      fr: "Email"
    },
    phone: {
      en: "Phone Number",
      ar: "رقم الهاتف",
      fr: "Numéro de téléphone"
    },
    nationality: {
      en: "Nationality",
      ar: "الجنسية",
      fr: "Nationalité"
    },
    startDate: {
      en: "Preferred Start Date",
      ar: "تاريخ البدء المفضل",
      fr: "Date de début préférée"
    },
    message: {
      en: "Additional Message",
      ar: "رسالة إضافية",
      fr: "Message supplémentaire"
    },
    submit: {
      en: "Submit Application",
      ar: "إرسال الطلب",
      fr: "Soumettre la demande"
    },
    cancel: {
      en: "Cancel",
      ar: "إلغاء",
      fr: "Annuler"
    },
    required: {
      en: "This field is required",
      ar: "هذا الحقل مطلوب",
      fr: "Ce champ est requis"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-syria-gold" />
              {translations.title[language as keyof typeof translations.title]}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {selectedProgram && (
          <div className="bg-syria-cream/50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-syria-gold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {selectedProgram.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedProgram.location}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {selectedProgram.duration}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {translations.firstName[language as keyof typeof translations.firstName]} *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {translations.lastName[language as keyof typeof translations.lastName]} *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {translations.email[language as keyof typeof translations.email]} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {translations.phone[language as keyof typeof translations.phone]} *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">
                {translations.nationality[language as keyof typeof translations.nationality]} *
              </Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">
                {translations.startDate[language as keyof typeof translations.startDate]} *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              {translations.message[language as keyof typeof translations.message]}
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder={language === "ar" ? "أخبرنا المزيد عن اهتماماتك وأهدافك التعليمية..." : language === "fr" ? "Parlez-nous de vos intérêts et objectifs éducatifs..." : "Tell us more about your interests and educational goals..."}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {translations.cancel[language as keyof typeof translations.cancel]}
            </Button>
            <Button type="submit" disabled={loading} className="bg-syria-gold hover:bg-syria-dark-gold">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {translations.submit[language as keyof typeof translations.submit]}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 