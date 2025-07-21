"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Edit, Trash2, Eye, MessageSquare, Settings, Plus, Calendar, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { BlogModal } from "@/components/user-dashboard/blog-modal"
import { DeleteConfirmationDialog } from "@/components/user-dashboard/delete-confirmation-dialog"
import { useToast } from "@/hooks/use-toast"

interface Blog {
  id: string
  title: string
  excerpt?: string
  content: string
  category?: string
  tags?: string[]
  featuredImage?: string
  status: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
}

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string
  featuredImage: string
}

export default function UserPosts() {
  const { t, language, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user is admin or super admin
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  // Redirect admin and super admin users to settings
  useEffect(() => {
    if (mounted && isAdmin) {
      router.push("/user-dashboard/settings")
    }
  }, [mounted, isAdmin, router])

  // Fetch user's blogs
  const fetchBlogs = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/blogs?authorId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
      } else {
        console.error('Failed to fetch blogs')
        toast({
          title: "Error",
          description: "Failed to fetch your blog posts",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch your blog posts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted && user?.id && !isAdmin) {
      fetchBlogs()
    }
  }, [mounted, user?.id, isAdmin])

  const handleCreateBlog = () => {
    setEditingBlog(null)
    setModalOpen(true)
  }

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog)
    setModalOpen(true)
  }

  const handleDeleteBlog = (id: string) => {
    setBlogToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!blogToDelete) return

    try {
      const response = await fetch(`/api/blogs/${blogToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete))
        toast({
          title: "Success",
          description: "Blog post deleted successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete blog post",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      })
    } finally {
      setBlogToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveBlog = async (formData: BlogFormData) => {
    try {
      setSaving(true)
      
      const blogData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      }

      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs'
      const method = editingBlog ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(blogData)
      })

      if (response.ok) {
        const result = await response.json()
        
        if (editingBlog) {
          setBlogs(blogs.map(blog => 
            blog.id === editingBlog.id ? result.blog : blog
          ))
          toast({
            title: "Success",
            description: "Blog post updated successfully"
          })
        } else {
          setBlogs([result.blog, ...blogs])
          toast({
            title: "Success",
            description: "Blog post created successfully"
          })
        }
        
        setModalOpen(false)
        setEditingBlog(null)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save blog post",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Published</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending Review</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Rejected</Badge>
      case 'DRAFT':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!mounted) {
    return null
  }

  // Show message for admin users while redirecting
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-md">
          <div className="text-center space-y-4">
            <Settings className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Redirecting to Settings...</h1>
            <p className="text-muted-foreground">
              Admin users can only access account settings in the user dashboard.
            </p>
            <Button onClick={() => router.push("/user-dashboard/settings")}>
              Go to Settings
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/90 p-6 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">{t.userDashboard?.myPosts || "My Blog Posts"}</h1>
          <Button onClick={handleCreateBlog}>
            <Plus className="mr-2 h-4 w-4" />
            {t.userDashboard?.newPost || "New Post"}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Start sharing your travel experiences and stories with the community.
            </p>
            <Button onClick={handleCreateBlog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="h-48 w-full md:h-auto md:w-1/4">
                      <img
                        src={blog.featuredImage || "/placeholder.svg"}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-bold">{blog.title}</h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(blog.status)}
                          <p className="text-sm text-muted-foreground">
                            {formatDate(blog.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {blog.excerpt && (
                        <p className="mb-4 text-sm text-muted-foreground">{blog.excerpt}</p>
                      )}
                      
                      <div className="mb-4 flex flex-wrap gap-2">
                        {blog.category && (
                          <Badge variant="outline" className="text-xs">
                            {blog.category}
                          </Badge>
                        )}
                        {Array.isArray(blog.tags) && blog.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatDate(blog.updatedAt)}
                          </div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex items-center">
                              <Tag className="mr-1 h-4 w-4" />
                              {blog.tags.length} tags
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditBlog(blog)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t.userDashboard?.edit || "Edit"}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t.userDashboard?.delete || "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <BlogModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        blog={editingBlog}
        onSave={handleSaveBlog}
        loading={saving}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        entityType="blog"
      />
    </div>
  )
}
