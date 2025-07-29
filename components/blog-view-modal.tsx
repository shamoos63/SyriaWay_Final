'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Clock,
  Tag,
  X
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface Blog {
  id: string
  title: string
  excerpt?: string
  content: string
  category?: string
  tags?: string[]
  featuredImage?: string
  images?: string[]
  status: string
  isPublished: boolean
  isFeatured: boolean
  likes: number
  dislikes: number
  views: number
  createdAt: string
  publishedAt?: string
  author?: User
}

interface BlogViewModalProps {
  blog: Blog | null
  isOpen: boolean
  onClose: () => void
  userReactions: Record<string, string>
  onReaction: (blogId: string, reaction: 'LIKE' | 'DISLIKE') => void
  reacting: string | null
}

export function BlogViewModal({ 
  blog, 
  isOpen, 
  onClose, 
  userReactions, 
  onReaction, 
  reacting 
}: BlogViewModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  if (!blog) return null

  // Helper function to safely parse tags
  const parseTags = (tags: any): string[] => {
    if (!tags) return []
    if (Array.isArray(tags)) return tags
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        // If it's not valid JSON, treat it as a comma-separated string
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      }
    }
    return []
  }

  const parsedTags = parseTags(blog.tags)

  const handleReaction = (reaction: 'LIKE' | 'DISLIKE') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to react to this blog",
        variant: "destructive"
      })
      return
    }
    onReaction(blog.id, reaction)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-syria-gold">
              {blog.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.author?.name || "Unknown Author"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {blog.publishedAt 
                  ? new Date(blog.publishedAt).toLocaleDateString()
                  : new Date(blog.createdAt).toLocaleDateString()
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{blog.views || 0} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>5 min read</span>
            </div>
          </div>

          {/* Tags and Categories */}
          <div className="flex flex-wrap gap-2">
            {blog.category && (
              <Badge variant="secondary">{blog.category}</Badge>
            )}
            {blog.isFeatured && (
              <Badge className="bg-syria-gold text-white">Featured</Badge>
            )}
            {parsedTags.length > 0 && parsedTags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-lg text-gray-600 dark:text-gray-300 italic">
                {blog.excerpt}
              </p>
            </div>
          )}

          <Separator />

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Reaction Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleReaction('LIKE')}
              disabled={reacting === blog.id}
              className={`flex-1 ${
                userReactions[blog.id] === 'LIKE' 
                  ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-400 dark:text-green-300' 
                  : ''
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {blog.likes || 0}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleReaction('DISLIKE')}
              disabled={reacting === blog.id}
              className={`flex-1 ${
                userReactions[blog.id] === 'DISLIKE' 
                  ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-400 dark:text-red-300' 
                  : ''
              }`}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {blog.dislikes || 0}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BlogViewModal 