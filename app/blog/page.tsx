"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Plus, ThumbsUp, ThumbsDown } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import BlogViewModal from '@/components/blog-view-modal'
import { BlogModal as CreateBlogModal } from "@/components/user-dashboard/blog-modal"

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

export default function Blog() {
  const { t, dir, language } = useLanguage()
  const { user } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})
  const [reacting, setReacting] = useState<string | null>(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [loadingBlogId, setLoadingBlogId] = useState<string | null>(null)

  const readMore = t.blog?.readMore || "Read More"
  const pageTitle =
    language === "ar" ? "مدونة سيريا وايز" : language === "fr" ? "Blog de Syria Ways" : "Syria Ways Blog"
  const pageDescription =
    language === "ar"
      ? "استكشف مقالاتنا حول السفر والسياحة في سوريا"
      : language === "fr"
        ? "Explorez nos articles sur les voyages et le tourisme en Syrie"
        : "Explore our articles about travel and tourism in Syria"
  
  const addNewPost = language === "ar" ? "إضافة مقال جديد" : language === "fr" ? "Ajouter un nouvel article" : "Add New Post"

  // Check if user can create blog posts (admin or customer)
  const canCreateBlog = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'CUSTOMER')

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '50',
          language: language
        })
        
        const response = await fetch(`/api/blogs?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blogs')
        }
        
        const data = await response.json()
        setBlogs(data.blogs || [])
      } catch (err: any) {
        console.error('Error fetching blogs:', err)
        setError(err.message || 'Failed to fetch blogs')
        // Set empty array to prevent undefined errors
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [language])

  // Fetch user reactions for all blogs
  useEffect(() => {
    if (!user?.id || blogs.length === 0) return

    const fetchUserReactions = async () => {
      try {
        const reactions: Record<string, string> = {}
        
        // Fetch reactions for each blog
        for (const blog of blogs) {
          try {
            const response = await fetch(`/api/blogs/${blog.id}/reactions`, {
              headers: {
                Authorization: `Bearer ${user.id}`,
              },
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.reaction) {
                reactions[blog.id] = data.reaction
              }
            }
          } catch (error) {
            console.error(`Error fetching reactions for blog ${blog.id}:`, error)
            // Continue with other blogs even if one fails
          }
        }
        
        setUserReactions(reactions)
      } catch (error) {
        console.error('Error fetching user reactions:', error)
      }
    }

    fetchUserReactions()
  }, [user?.id, blogs])

  const handleCreateBlog = async (formData: any) => {
    try {
      setSaving(true)
      
      const blogData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        images: formData.images ? formData.images.split(',').map((img: string) => img.trim()) : []
      }

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(blogData)
      })

      if (response.ok) {
        const result = await response.json()
        // Don't add pending blogs to the public list
        // setBlogs([result.blog, ...blogs])
        setModalOpen(false)
        toast({
          title: "Success",
          description: result.message || "Blog post submitted successfully! Your post will be reviewed by an admin before being published."
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create blog post",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReaction = async (blogId: string, reaction: 'LIKE' | 'DISLIKE') => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to react to posts",
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
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ reaction }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update blog counts
        setBlogs(blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, likes: data.blog.likes, dislikes: data.blog.dislikes }
            : blog
        ))

        // Update user reaction
        if (userReactions[blogId] === reaction) {
          // Remove reaction
          const newReactions = { ...userReactions }
          delete newReactions[blogId]
          setUserReactions(newReactions)
        } else {
          // Add/change reaction
          setUserReactions({ ...userReactions, [blogId]: reaction })
        }

        toast({
          title: "Success",
          description: data.message
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || 'Failed to process reaction',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to process reaction',
        variant: "destructive"
      })
    } finally {
      setReacting(null)
    }
  }



  const openBlogModal = async (blog: Blog) => {
    setLoadingBlogId(blog.id)
    try {
      // Fetch fresh blog data to get updated view count
      const response = await fetch(`/api/blogs/${blog.id}?language=${language}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedBlog(data.blog)
        setShowBlogModal(true)
        
        // Update the blog in the list with fresh data
        setBlogs(blogs.map(b => b.id === blog.id ? data.blog : b))
      } else {
        // Fallback to original blog data if API call fails
        setSelectedBlog(blog)
        setShowBlogModal(true)
      }
    } catch (error) {
      console.error('Error fetching blog details:', error)
      // Fallback to original blog data if API call fails
      setSelectedBlog(blog)
      setShowBlogModal(true)
    } finally {
      setLoadingBlogId(null)
    }
  }

  const closeBlogModal = () => {
    setShowBlogModal(false)
    setSelectedBlog(null)
    setLoadingBlogId(null)
  }

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />

      <section className="py-12 pt-32">
        <div className="max-w-6xl mx-auto px-4">
          {/* Modern Hero Section */}
          <div className="relative overflow-hidden rounded-3xl mb-12">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-syria-gold/10 via-yellow-50 to-syria-dark-gold/5 dark:from-syria-gold/20 dark:via-[#2a2a2a] dark:to-syria-dark-gold/15"></div>
            <div className="absolute inset-0 bg-pattern opacity-5 dark:opacity-10"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-24 h-24 border-2 border-syria-gold/20 dark:border-syria-gold/40 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-syria-gold/20 dark:border-syria-gold/40 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-syria-gold/20 dark:bg-syria-gold/30 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 border border-syria-gold/20 dark:border-syria-gold/40 rounded-full"></div>
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-syria-gold/10 dark:bg-syria-gold/20 border border-syria-gold/30 dark:border-syria-gold/50 rounded-full mb-6">
                  <span className="text-syria-gold dark:text-syria-gold font-semibold text-sm">
                    {language === "ar" ? "مدونة السفر" : language === "fr" ? "Blog de Voyage" : "Travel Blog"}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-syria-gold mb-6 leading-tight">
                  {pageTitle}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 dark:from-syria-gold dark:to-syria-dark-gold mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {pageDescription}
                </p>
                
                {/* Action Button */}
                {canCreateBlog && (
                  <Button 
                    onClick={() => setModalOpen(true)}
                    className="bg-syria-gold hover:bg-syria-dark-gold text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {addNewPost}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              {error ? `Error: ${error}` : "No blog posts found."}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.filter(post => post && post.id).map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden blog-card bg-syria-cream border-syria-gold dark:bg-gray-800"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.featuredImage || "/placeholder.svg"} alt={post.title} className="object-cover w-full h-full" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-syria-gold">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-syria-gold" />
                      {post.publishedAt 
                        ? new Date(post.publishedAt).toLocaleDateString() 
                        : new Date(post.createdAt).toLocaleDateString()
                      }
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4 text-syria-gold" />
                      {post.author?.name || "Unknown"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    {/* Like/Dislike Buttons */}
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReaction(post.id, 'LIKE')}
                        disabled={reacting === post.id}
                        className={`flex-1 ${
                          userReactions[post.id] === 'LIKE' 
                            ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-400 dark:text-green-300' 
                            : ''
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.likes || 0}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReaction(post.id, 'DISLIKE')}
                        disabled={reacting === post.id}
                        className={`flex-1 ${
                          userReactions[post.id] === 'DISLIKE' 
                            ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-400 dark:text-red-300' 
                            : ''
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {post.dislikes || 0}
                      </Button>
                    </div>
                    
                    {/* Read More Button */}
                    <Button 
                      className="w-full bg-syria-gold hover:bg-syria-dark-gold" 
                      onClick={() => openBlogModal(post)}
                      disabled={loadingBlogId === post.id}
                    >
                      {loadingBlogId === post.id ? 'Loading...' : readMore}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Creation Modal */}
      {canCreateBlog && (
        <CreateBlogModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={handleCreateBlog}
          loading={saving}
        />
      )}

      {showBlogModal && selectedBlog && (
        <BlogViewModal
          blog={selectedBlog}
          isOpen={showBlogModal}
          onClose={closeBlogModal}
          userReactions={userReactions}
          onReaction={handleReaction}
          reacting={reacting}
        />
      )}

      <Footer />
    </main>
  )
}
