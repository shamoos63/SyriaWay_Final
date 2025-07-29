"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter as DialogFooterUI } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Loader2, User, Calendar } from "lucide-react"
import dayjs from 'dayjs'

interface Blog {
  id: string
  title: string
  excerpt?: string
  content: string
  status: string
  rejectionReason?: string
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  featuredImage?: string
  author: {
    name: string
  }
}

export default function UserBlogsPage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: ""
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.id) fetchBlogs()
  }, [user?.id])

  const fetchBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        authorId: user?.id || '',
        language: language
      })
      
      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      
      const data = await response.json()
      setBlogs(data.blogs)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingBlog(null)
    setForm({ title: "", excerpt: "", content: "", featuredImage: "", category: "", tags: "" })
    setShowModal(true)
  }

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      excerpt: blog.excerpt || "",
      content: blog.content,
      featuredImage: blog.featuredImage || "",
      category: (blog as any).category || "",
      tags: (blog as any).tags ? (Array.isArray((blog as any).tags) ? (blog as any).tags.join(", ") : (blog as any).tags) : ""
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBlog(null)
    setForm({ title: "", excerpt: "", content: "", featuredImage: "", category: "", tags: "" })
  }

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast({ 
        title: "Validation Error", 
        description: "Title and content are required", 
        variant: "destructive" 
      })
      return
    }
    setSaving(true)
    try {
      const blogData = {
        title: {
          en: form.title,
          ar: form.title, // For now, use the same content for all languages
          fr: form.title
        },
        excerpt: {
          en: form.excerpt,
          ar: form.excerpt,
          fr: form.excerpt
        },
        content: {
          en: form.content,
          ar: form.content,
          fr: form.content
        },
        category: form.category,
        tags: form.tags ? form.tags.split(',').map((tag: string) => tag.trim()) : [],
        featuredImage: form.featuredImage
      }

      const res = await fetch(`/api/blogs${editingBlog ? `/${editingBlog.id}` : ''}`, {
        method: editingBlog ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`
        },
        body: JSON.stringify(blogData)
      })
      if (!res.ok) throw new Error("Failed to save blog")
      
      toast({ 
        title: "Success", 
        description: `Blog ${editingBlog ? 'updated' : 'created'} successfully` 
      })
      closeModal()
      fetchBlogs()
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || `Failed to ${editingBlog ? 'update' : 'create'} blog`, 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (blog: Blog) => {
    if (!confirm("Are you sure you want to delete this blog?")) return
    setSaving(true)
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.id || "demo-user-id"}` }
      })
      if (!res.ok) throw new Error("Failed to delete blog")
      toast({ title: "Blog deleted" })
      fetchBlogs()
    } catch (err: any) {
      toast({ title: err.message || "Failed to delete blog", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Rejected
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Pending
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Approved
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : 'N/A';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Blogs</h1>
        <Button onClick={openCreateModal} className="bg-syria-gold hover:bg-syria-dark-gold flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Blog
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-syria-gold" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No blogs found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden border-syria-gold">
              <CardHeader>
                <CardTitle className="text-lg font-semibold truncate" title={blog.title}>
                  {blog.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(blog.status)}
                    {blog.isPublished && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        Live
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    {blog.author.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(blog.createdAt)}
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                {blog.featuredImage && (
                  <div className="mb-3">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                
                {blog.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>
                )}

                {blog.status === "REJECTED" && blog.rejectionReason && (
                  <div className="text-xs text-red-600">Reason: {blog.rejectionReason}</div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditModal(blog)} disabled={blog.isPublished}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(blog)} disabled={blog.isPublished}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Blog Modal */}
      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Edit Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              disabled={saving}
            />
            <Input
              placeholder="Featured Image URL (optional)"
              value={form.featuredImage}
              onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))}
              disabled={saving}
            />
            <Input
              placeholder="Category (optional)"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              disabled={saving}
            />
            <Input
              placeholder="Tags (comma separated, optional)"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              disabled={saving}
            />
            <Textarea
              placeholder="Excerpt (optional)"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              disabled={saving}
            />
            <Textarea
              placeholder="Content"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={8}
              disabled={saving}
            />
          </div>
          <DialogFooterUI>
            <Button onClick={handleSave} disabled={saving} className="bg-syria-gold hover:bg-syria-dark-gold w-full">
              {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {editingBlog ? "Save Changes" : "Create Blog"}
            </Button>
          </DialogFooterUI>
        </DialogContent>
      </Dialog>
    </div>
  )
} 