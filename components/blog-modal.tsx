'use client'

import { useState, useEffect } from 'react'
import { X, Heart, ThumbsDown, Calendar, User, Eye, Globe, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { Blog, User as UserType } from '@prisma/client'
import { useLanguage } from "@/lib/i18n/language-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface BlogModalProps {
  blog: Blog & {
    author: UserType
  } | null
  isOpen: boolean
  onClose: () => void
  userReactions: Record<string, string>
  onReaction: (blogId: string, reaction: 'LIKE' | 'DISLIKE') => Promise<void>
  reacting: string | null
}

export default function BlogModal({
  blog,
  isOpen,
  onClose,
  userReactions,
  onReaction,
  reacting
}: BlogModalProps) {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [localUserReactions, setLocalUserReactions] = useState<Record<string, string>>({})
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
      
      // Initialize user reactions from blog data
      if (blog?.reactions) {
        const reactions: Record<string, string> = {}
        blog.reactions.forEach(reaction => {
          reactions[reaction.userId] = reaction.reaction
        })
        setLocalUserReactions(reactions)
      }
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
      setExpandedImage(null)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, blog])

  if (!blog || !isOpen) return null

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const userReaction = localUserReactions[blog.author.id] || userReactions[blog.id]

  const handleReaction = async (reaction: 'LIKE' | 'DISLIKE') => {
    await onReaction(blog.id, reaction)
    
    // Update local reactions
    if (localUserReactions[blog.author.id] === reaction) {
      const newReactions = { ...localUserReactions }
      delete newReactions[blog.author.id]
      setLocalUserReactions(newReactions)
    } else {
      setLocalUserReactions({ ...localUserReactions, [blog.author.id]: reaction })
    }
  }

  // Get the correct translation for the selected language
  const getTranslatedContent = (field: 'title' | 'excerpt' | 'content', lang: string) => {
    if (!blog) return ''
    
    // Map language codes to Prisma enum values
    const languageMap = {
      'en': 'ENGLISH',
      'ar': 'ARABIC',
      'fr': 'FRENCH'
    } as const
    
    const languageEnum = languageMap[lang as keyof typeof languageMap]
    
    // If blog has translations, use the one for selected language
    if (blog.translations && blog.translations.length > 0) {
      const translation = blog.translations.find(t => t.language === languageEnum)
      if (translation && translation[field]) {
        return translation[field]
      }
    }
    
    // Fallback to main blog fields (English)
    return blog[field] || ''
  }

  // Get available translations
  const getAvailableTranslations = () => {
    if (!blog?.translations) return []
    
    const translations = blog.translations.map(t => t.language)
    const available = []
    
    if (translations.includes('ENGLISH') || blog.title) available.push('en')
    if (translations.includes('ARABIC')) available.push('ar')
    if (translations.includes('FRENCH')) available.push('fr')
    
    return available
  }

  const availableTranslations = getAvailableTranslations()
  const currentTranslation = getTranslatedContent('title', selectedLanguage)
  const currentExcerpt = getTranslatedContent('excerpt', selectedLanguage)
  const currentContent = getTranslatedContent('content', selectedLanguage)

  const handleImageClick = (imageUrl: string) => {
    setExpandedImage(imageUrl)
  }

  const closeExpandedImage = () => {
    setExpandedImage(null)
  }

  return (
    <>
      <div className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-all duration-300 transform ${
            isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-syria-gold to-syria-dark-gold p-4 sm:p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(blog.createdAt)}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  <User className="w-3 h-3 mr-1" />
                  {blog.author.name || 'Anonymous'}
                </Badge>
                {blog.category && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    {blog.category}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight pr-12">{currentTranslation}</h1>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="relative h-32 sm:h-40 w-full cursor-pointer group" onClick={() => handleImageClick(blog.featuredImage!)}>
                <img
                  src={blog.featuredImage}
                  alt={currentTranslation}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            )}

            {/* Language Tabs */}
            {availableTranslations.length > 1 && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
                    {availableTranslations.includes('en') && (
                      <TabsTrigger value="en" className="text-xs sm:text-sm">English</TabsTrigger>
                    )}
                    {availableTranslations.includes('ar') && (
                      <TabsTrigger value="ar" className="text-xs sm:text-sm">العربية</TabsTrigger>
                    )}
                    {availableTranslations.includes('fr') && (
                      <TabsTrigger value="fr" className="text-xs sm:text-sm">Français</TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
              {currentExcerpt && (
                <div className="mb-6">
                  <p className="text-lg text-gray-600 dark:text-gray-300 italic border-l-4 border-syria-gold pl-4">
                    {currentExcerpt}
                  </p>
                </div>
              )}
              
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
                <div 
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: currentContent }}
                />
              </div>

              {/* Additional Images */}
              {blog.images && blog.images.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === "ar" ? "صور إضافية" : language === "fr" ? "Images supplémentaires" : "Additional Images"}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {blog.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative h-24 sm:h-32 w-full cursor-pointer group rounded-lg overflow-hidden"
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image}
                          alt={`${blog.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                          <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "ar" ? "العلامات" : language === "fr" ? "Tags" : "Tags"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction('LIKE')}
                      disabled={reacting === blog.id}
                      className={`flex items-center gap-2 ${
                        userReaction === 'LIKE' 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${userReaction === 'LIKE' ? 'fill-current' : ''}`} />
                      <span className="text-sm">
                        {blog.reactions?.filter(r => r.reaction === 'LIKE').length || 0}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction('DISLIKE')}
                      disabled={reacting === blog.id}
                      className={`flex items-center gap-2 ${
                        userReaction === 'DISLIKE' 
                          ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsDown className={`w-4 h-4 ${userReaction === 'DISLIKE' ? 'fill-current' : ''}`} />
                      <span className="text-sm">
                        {blog.reactions?.filter(r => r.reaction === 'DISLIKE').length || 0}
                      </span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">
                      {language === "ar" ? "تم النشر في" : language === "fr" ? "Publié le" : "Published on"} {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={onClose}
                  className="bg-syria-gold hover:bg-syria-dark-gold text-white w-full sm:w-auto"
                >
                  {language === "ar" ? "إغلاق" : language === "fr" ? "Fermer" : "Close"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4" onClick={closeExpandedImage}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={closeExpandedImage}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
} 