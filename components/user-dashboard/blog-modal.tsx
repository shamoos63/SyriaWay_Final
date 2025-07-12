"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Loader2, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface BlogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog?: Blog | null
  onSave: (blog: BlogFormData) => void
  loading?: boolean
}

interface Blog {
  id: string
  title: { en: string; ar: string; fr: string }
  excerpt: { en: string; ar: string; fr: string }
  content: { en: string; ar: string; fr: string }
  category?: string
  tags?: string[]
  featuredImage?: string
  status: string
}

interface BlogFormData {
  title: { en: string; ar: string; fr: string }
  excerpt: { en: string; ar: string; fr: string }
  content: { en: string; ar: string; fr: string }
  category: string
  tags: string
  featuredImage: string
}

const CATEGORIES = [
  "Travel",
  "Culture",
  "History",
  "Food",
  "Adventure",
  "Photography",
  "Tips",
  "Reviews",
  "Other"
]

export function BlogModal({ open, onOpenChange, blog, onSave, loading = false }: BlogModalProps) {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [activeLang, setActiveLang] = useState<"en" | "ar" | "fr">(language)
  const [formData, setFormData] = useState<BlogFormData>({
    title: { en: "", ar: "", fr: "" },
    excerpt: { en: "", ar: "", fr: "" },
    content: { en: "", ar: "", fr: "" },
    category: "",
    tags: "",
    featuredImage: ""
  })

  useEffect(() => {
    if (blog) {
      setFormData({
        title: { en: blog.title.en || "", ar: blog.title.ar || "", fr: blog.title.fr || "" },
        excerpt: { en: blog.excerpt.en || "", ar: blog.excerpt.ar || "", fr: blog.excerpt.fr || "" },
        content: { en: blog.content.en || "", ar: blog.content.ar || "", fr: blog.content.fr || "" },
        category: blog.category || "",
        tags: blog.tags?.join(", ") || "",
        featuredImage: blog.featuredImage || ""
      })
    } else {
      setFormData({
        title: { en: "", ar: "", fr: "" },
        excerpt: { en: "", ar: "", fr: "" },
        content: { en: "", ar: "", fr: "" },
        category: "",
        tags: "",
        featuredImage: ""
      })
    }
  }, [blog, open])

  const handleLangInputChange = (field: "title" | "excerpt" | "content", lang: "en" | "ar" | "fr", value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }))
  }

  const handleInputChange = (field: keyof BlogFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{blog ? t.blog.editPost : t.blog.createPost}</span>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeLang} onValueChange={setActiveLang} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="fr">Français</TabsTrigger>
            </TabsList>
            {(["en", "ar", "fr"] as const).map(lang => (
              <TabsContent value={lang} key={lang} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${lang}`}>{t.blog.postTitle} ({lang.toUpperCase()}) *</Label>
                  <Input
                    id={`title-${lang}`}
                    value={formData.title[lang]}
                    onChange={e => handleLangInputChange("title", lang, e.target.value)}
                    placeholder={t.blog.postTitle}
                    required={lang === "en"}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`excerpt-${lang}`}>{t.blog.postExcerpt} ({lang.toUpperCase()})</Label>
                  <Textarea
                    id={`excerpt-${lang}`}
                    value={formData.excerpt[lang]}
                    onChange={e => handleLangInputChange("excerpt", lang, e.target.value)}
                    placeholder={t.blog.postExcerpt}
                    rows={3}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`content-${lang}`}>{t.blog.postContent} ({lang.toUpperCase()}) *</Label>
                  <Textarea
                    id={`content-${lang}`}
                    value={formData.content[lang]}
                    onChange={e => handleLangInputChange("content", lang, e.target.value)}
                    placeholder={t.blog.postContent}
                    rows={10}
                    required={lang === "en"}
                    disabled={loading}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
          {/* Category, Featured Image, Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">{t.blog.postCategory}</Label>
              <Select
                value={formData.category}
                onValueChange={value => handleInputChange("category", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.blog.postCategory} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredImage">{t.blog.postImage}</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={e => handleInputChange("featuredImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">{t.blog.postTags}</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={e => handleInputChange("tags", e.target.value)}
              placeholder="travel, syria, culture (comma separated)"
              disabled={loading}
            />
          </div>
          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {blog ? t.common.save : t.common.create}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 