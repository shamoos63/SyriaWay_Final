'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

// Define types without Prisma dependency
interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  metaTitle: string | null
  metaDescription: string | null
  keywords: string | null
  featuredImage: string | null
  images: string | null
  category: string | null
  tags: string | null
  status: string
  isPublished: boolean
  isFeatured: boolean
  likes: number
  dislikes: number
  views: number
  submittedAt: string | null
  approvedAt: string | null
  approvedBy: string | null
  rejectedAt: string | null
  rejectedBy: string | null
  rejectionReason: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  authorId: string
  author?: User
  translations?: BlogTranslation[]
}

interface BlogTranslation {
  id: string
  blogId: string
  language: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  metaTitle: string | null
  metaDescription: string | null
}

interface BlogModalProps {
  blog: Blog | null
  isOpen: boolean
  onClose: () => void
  onSave: (blog: Partial<Blog>) => void
  isEditing?: boolean
}

export function BlogModal({ blog, isOpen, onClose, onSave, isEditing = false }: BlogModalProps) {
  const [formData, setFormData] = useState({
    title: {
      en: '',
      ar: '',
      fr: ''
    },
    excerpt: {
      en: '',
      ar: '',
      fr: ''
    },
    content: {
      en: '',
      ar: '',
      fr: ''
    },
    category: '',
    status: 'DRAFT',
    isPublished: false,
    isFeatured: false,
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  })

  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'fr'>('en')

  useEffect(() => {
    if (blog) {
      // Map language codes to enum values
      const languageMap = {
        'en': 'ENGLISH',
        'ar': 'ARABIC', 
        'fr': 'FRENCH'
      } as const

      setFormData({
        title: {
          en: blog.title || '',
          ar: blog.translations?.find(t => t.language === languageMap.ar)?.title || '',
          fr: blog.translations?.find(t => t.language === languageMap.fr)?.title || ''
        },
        excerpt: {
          en: blog.excerpt || '',
          ar: blog.translations?.find(t => t.language === languageMap.ar)?.excerpt || '',
          fr: blog.translations?.find(t => t.language === languageMap.fr)?.excerpt || ''
        },
        content: {
          en: blog.content || '',
          ar: blog.translations?.find(t => t.language === languageMap.ar)?.content || '',
          fr: blog.translations?.find(t => t.language === languageMap.fr)?.content || ''
        },
        category: blog.category || '',
        status: blog.status,
        isPublished: blog.isPublished,
        isFeatured: blog.isFeatured,
        featuredImage: blog.featuredImage || '',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        keywords: blog.keywords || ''
      })
    } else {
      // Reset form for new blog
      setFormData({
        title: { en: '', ar: '', fr: '' },
        excerpt: { en: '', ar: '', fr: '' },
        content: { en: '', ar: '', fr: '' },
        category: '',
        status: 'DRAFT',
        isPublished: false,
        isFeatured: false,
        featuredImage: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
      })
    }
  }, [blog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const blogData = {
        title: formData.title.en,
        excerpt: formData.excerpt.en,
        content: formData.content.en,
        category: formData.category,
        status: formData.status,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
        featuredImage: formData.featuredImage,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        keywords: formData.keywords,
        translations: [
          {
            language: 'ARABIC',
            title: formData.title.ar,
            excerpt: formData.excerpt.ar,
            content: formData.content.ar,
          },
          {
            language: 'FRENCH',
            title: formData.title.fr,
            excerpt: formData.excerpt.fr,
            content: formData.content.fr,
          }
        ].filter(t => t.title && t.content) // Only include translations with content
      }

      onSave(blogData)
      onClose()
      toast({
        title: isEditing ? "Blog updated successfully" : "Blog created successfully",
        description: "Your blog has been saved.",
      })
    } catch (error) {
      console.error('Error saving blog:', error)
      toast({
        title: "Error",
        description: "Failed to save blog. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Tabs */}
          <div className="flex space-x-2 border-b">
            {(['en', 'ar', 'fr'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setCurrentLanguage(lang)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  currentLanguage === lang
                    ? 'border-syria-gold text-syria-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'Français'}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title[currentLanguage]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                title: { ...prev.title, [currentLanguage]: e.target.value }
              }))}
              placeholder="Enter blog title..."
              required={currentLanguage === 'en'}
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt[currentLanguage]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                excerpt: { ...prev.excerpt, [currentLanguage]: e.target.value }
              }))}
              placeholder="Enter blog excerpt..."
              rows={3}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content[currentLanguage]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, [currentLanguage]: e.target.value }
              }))}
              placeholder="Enter blog content..."
              rows={10}
              required={currentLanguage === 'en'}
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRAVEL">Travel</SelectItem>
                  <SelectItem value="CULTURE">Culture</SelectItem>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="HISTORY">History</SelectItem>
                  <SelectItem value="NATURE">Nature</SelectItem>
                  <SelectItem value="ADVENTURE">Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
              placeholder="Enter image URL..."
            />
          </div>

          {/* SEO Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="Enter meta title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Enter meta description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="Enter keywords (comma separated)..."
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isPublished">Published</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-syria-gold hover:bg-syria-dark-gold">
              {isEditing ? 'Update Blog' : 'Create Blog'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add default export
export default BlogModal 