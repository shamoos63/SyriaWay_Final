'use client'

import { useState, useEffect } from 'react'
import { X, Heart, ThumbsDown, Calendar, User, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { Blog, User as UserType } from '@prisma/client'
import { useLanguage } from "@/lib/i18n/language-context"

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

  // Get the correct translation for the current language
  const getTranslatedContent = (field: 'title' | 'excerpt' | 'content') => {
    if (!blog) return ''
    
    // If blog has translations, use the one for current language
    if (blog.translations && blog.translations.length > 0) {
      const translation = blog.translations.find(t => t.language === language)
      if (translation && translation[field]) {
        return translation[field]
      }
    }
    
    // Fallback to main blog fields (English)
    return blog[field] || ''
  }

  const translatedTitle = getTranslatedContent('title')
  const translatedExcerpt = getTranslatedContent('excerpt')
  const translatedContent = getTranslatedContent('content')

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-all duration-300 transform ${
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
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight pr-12">{translatedTitle}</h1>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <div 
                className="prose"
                dangerouslySetInnerHTML={{ __html: translatedContent }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
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
                    <span className="text-sm">{blog.likes || 0}</span>
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
                    <span className="text-sm">{blog.dislikes || 0}</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Views: {blog.views || 0}</span>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="bg-syria-gold hover:bg-syria-dark-gold text-white w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 