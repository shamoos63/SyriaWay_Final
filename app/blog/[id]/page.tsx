'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/language-context'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  ArrowLeft,
  Clock,
  Tag
} from 'lucide-react'

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
  createdAt: Date
  publishedAt?: Date
  author: {
    id: string
    name?: string
    email: string
    image?: string
  }
  reactions?: {
    userId: string
    reaction: string
  }[]
}

export default function BlogDetails() {
  const { language, dir } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reacting, setReacting] = useState<string | null>(null)
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}`)
        if (response.ok) {
          const data = await response.json()
          setBlog(data.blog)
        } else {
          setError('Blog not found')
        }
      } catch (error) {
        setError('Failed to load blog')
      } finally {
        setLoading(false)
      }
    }

    if (blogId) {
      fetchBlog()
    }
  }, [blogId])

  useEffect(() => {
    const fetchUserReactions = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/blogs/${blogId}/reactions`)
        if (response.ok) {
          const data = await response.json()
          setUserReactions(data.reactions || {})
        }
      } catch (error) {
        console.error('Error fetching user reactions:', error)
      }
    }

    if (blogId && user) {
      fetchUserReactions()
    }
  }, [blogId, user])

  const handleReaction = async (reaction: 'LIKE' | 'DISLIKE') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to react to this blog",
        variant: "destructive"
      })
      return
    }

    setReacting(blogId)
    try {
      const response = await fetch(`/api/blogs/${blogId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ reaction })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state
        setUserReactions(prev => ({
          ...prev,
          [blogId]: reaction
        }))

        // Update blog reactions count
        if (blog) {
          setBlog(prev => {
            if (!prev) return prev
            const newBlog = { ...prev }
            
            if (userReactions[blogId] === 'LIKE') {
              newBlog.likes = Math.max(0, newBlog.likes - 1)
            } else if (userReactions[blogId] === 'DISLIKE') {
              newBlog.dislikes = Math.max(0, newBlog.dislikes - 1)
            }
            
            if (reaction === 'LIKE') {
              newBlog.likes += 1
            } else if (reaction === 'DISLIKE') {
              newBlog.dislikes += 1
            }
            
            return newBlog
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reaction",
        variant: "destructive"
      })
    } finally {
      setReacting(null)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <main className="min-h-screen" dir={dir}>
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-gold"></div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen" dir={dir}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Blog not found'}
          </h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />

      <section className="py-12 pt-32">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "ar" ? "العودة" : language === "fr" ? "Retour" : "Go Back"}
          </Button>

          {/* Blog Header */}
          <Card className="mb-8">
            <div className="relative h-64 md:h-96 overflow-hidden rounded-t-lg">
              <img 
                src={blog.featuredImage || "/placeholder.svg"} 
                alt={blog.title} 
                className="object-cover w-full h-full" 
              />
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.category && (
                  <Badge variant="secondary">{blog.category}</Badge>
                )}
                {blog.isFeatured && (
                  <Badge className="bg-syria-gold text-white">Featured</Badge>
                )}
              </div>
              <CardTitle className="text-3xl md:text-4xl text-syria-gold mb-4">
                {blog.title}
              </CardTitle>
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
            </CardHeader>
          </Card>

          {/* Blog Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  {/* Excerpt */}
                  {blog.excerpt && (
                    <div className="mb-6">
                      <p className="text-lg text-gray-600 dark:text-gray-300 italic">
                        {blog.excerpt}
                      </p>
                      <Separator className="my-6" />
                    </div>
                  )}

                  {/* Content */}
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-syria-gold" />
                        <span className="font-semibold">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Reactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Reaction Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReaction('LIKE')}
                      disabled={reacting === blogId}
                      className={`flex-1 ${
                        userReactions[blogId] === 'LIKE' 
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
                      disabled={reacting === blogId}
                      className={`flex-1 ${
                        userReactions[blogId] === 'DISLIKE' 
                          ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-400 dark:text-red-300' 
                          : ''
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {blog.dislikes || 0}
                    </Button>
                  </div>

                  {/* Author Info */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">About the Author</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-syria-gold rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{blog.author?.name || "Unknown Author"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {blog.author?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 