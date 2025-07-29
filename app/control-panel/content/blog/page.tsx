"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter as DialogFooterUI } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { 
  Loader2, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Filter, 
  Search, 
  Eye, 
  Calendar,
  User,
  Tag,
  Plus,
  RefreshCw,
  Globe
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"
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
  category?: string
  tags?: string[]
  author: { id: string; name: string; email: string }
  translations?: BlogTranslation[]
}

interface BlogTranslation {
  id?: number
  blogId: number
  language: string
  title: string
  content: string
  excerpt?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
}

const statusOptions = [
  { value: "ALL", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING", label: "Pending Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "REJECTED", label: "Rejected" },
]

const categoryOptions = [
  { value: "ALL", label: "All Categories" },
  { value: "Travel", label: "Travel" },
  { value: "Culture", label: "Culture" },
  { value: "History", label: "History" },
  { value: "Food", label: "Food" },
  { value: "Adventure", label: "Adventure" },
  { value: "Photography", label: "Photography" },
  { value: "Tips", label: "Tips" },
  { value: "Reviews", label: "Reviews" },
  { value: "Other", label: "Other" },
]

const languages = [
  { code: 'en', name: 'English', dbCode: 'ENGLISH' },
  { code: 'ar', name: 'العربية', dbCode: 'ARABIC' },
  { code: 'fr', name: 'Français', dbCode: 'FRENCH' }
]

// Helper to normalize tags to string[]
function getTagArray(tags: string[] | string | undefined | null): string[] {
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  return [];
}

export default function AdminBlogPage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null)
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: "",
    status: ""
  })
  const [translations, setTranslations] = useState<Record<string, BlogTranslation>>({})
  const [rejectionReason, setRejectionReason] = useState("")
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchBlogs()
  }, [statusFilter, categoryFilter])

  const fetchBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        authorId: 'all',
        language: language
      })
      
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter)
      }
      
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

  const fetchBlogWithTranslations = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog details')
      }
      
      const data = await response.json()
      return data.blog
    } catch (err: any) {
      console.error('Error fetching blog with translations:', err)
      return null
    }
  }

  const openEditModal = async (blog: Blog) => {
    setEditingBlog(blog)
    
    // Fetch blog with translations
    const blogWithTranslations = await fetchBlogWithTranslations(blog.id)
    
    if (blogWithTranslations) {
      // Initialize form with English content (main content)
      setForm({
        title: blogWithTranslations.title || blog.title,
        excerpt: blogWithTranslations.excerpt || blog.excerpt || "",
        content: blogWithTranslations.content || blog.content,
        featuredImage: blogWithTranslations.featuredImage || blog.featuredImage || "",
        category: blogWithTranslations.category || blog.category || "",
        tags: blogWithTranslations.tags?.join(", ") || blog.tags?.join(", ") || "",
        status: blogWithTranslations.status || blog.status
      })

      // Initialize translations
      const translationsMap: Record<string, BlogTranslation> = {}
      
      // Add English as main content
      translationsMap['ENGLISH'] = {
        blogId: parseInt(blog.id),
        language: 'ENGLISH',
        title: blogWithTranslations.title || blog.title,
        content: blogWithTranslations.content || blog.content,
        excerpt: blogWithTranslations.excerpt || blog.excerpt || "",
        seoTitle: blogWithTranslations.seoTitle || "",
        seoDescription: blogWithTranslations.seoDescription || "",
        seoKeywords: blogWithTranslations.seoKeywords || ""
      }

      // Add existing translations
      if (blogWithTranslations.translations) {
        blogWithTranslations.translations.forEach((translation: BlogTranslation) => {
          translationsMap[translation.language] = translation
        })
      }

      // Initialize empty translations for missing languages
      languages.forEach(lang => {
        if (!translationsMap[lang.dbCode]) {
          translationsMap[lang.dbCode] = {
            blogId: parseInt(blog.id),
            language: lang.dbCode,
            title: "",
            content: "",
            excerpt: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: ""
          }
        }
      })

      setTranslations(translationsMap)
    } else {
      // Fallback to original blog data
      setForm({
        title: blog.title,
        excerpt: blog.excerpt || "",
        content: blog.content,
        featuredImage: blog.featuredImage || "",
        category: blog.category || "",
        tags: blog.tags?.join(", ") || "",
        status: blog.status
      })
      
      // Initialize empty translations
      const translationsMap: Record<string, BlogTranslation> = {}
      languages.forEach(lang => {
        translationsMap[lang.dbCode] = {
          blogId: parseInt(blog.id),
          language: lang.dbCode,
          title: lang.dbCode === 'ENGLISH' ? blog.title : "",
          content: lang.dbCode === 'ENGLISH' ? blog.content : "",
          excerpt: lang.dbCode === 'ENGLISH' ? (blog.excerpt || "") : "",
          seoTitle: "",
          seoDescription: "",
          seoKeywords: ""
        }
      })
      setTranslations(translationsMap)
    }
    
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingBlog(null)
    setForm({ title: "", excerpt: "", content: "", featuredImage: "", category: "", tags: "", status: "" })
    setTranslations({})
  }

  const updateTranslation = (language: string, field: keyof BlogTranslation, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value
      }
    }))
  }

  const openViewModal = async (blog: Blog) => {
    // Fetch blog with translations for viewing
    const blogWithTranslations = await fetchBlogWithTranslations(blog.id)
    setViewingBlog(blogWithTranslations || blog)
    setShowViewModal(true)
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setViewingBlog(null)
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
      // Update English translation with form data
      const updatedTranslations = {
        ...translations,
        ENGLISH: {
          ...translations.ENGLISH,
          title: form.title,
          content: form.content,
          excerpt: form.excerpt
        }
      }

      const blogData = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : [],
        isPublished: form.status === 'PUBLISHED',
        publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : null,
        translations: Object.values(updatedTranslations).filter(t => t.title && t.content) // Only save translations with content
      }

      const res = await fetch(`/api/blogs/${editingBlog?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`
        },
        body: JSON.stringify(blogData)
      })
      if (!res.ok) throw new Error("Failed to update blog")
      
      toast({ 
        title: "Success", 
        description: "Blog updated successfully" 
      })
      closeEditModal()
      fetchBlogs()
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to update blog", 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (blog: Blog) => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return
    setSaving(true)
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.id}` }
      })
      if (!res.ok) throw new Error("Failed to delete blog")
      
      toast({ 
        title: "Success", 
        description: "Blog deleted successfully" 
      })
      fetchBlogs()
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to delete blog", 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  const openApproveModal = (blog: Blog) => {
    setEditingBlog(blog)
    setShowApproveModal(true)
  }

  const closeApproveModal = () => {
    setShowApproveModal(false)
    setEditingBlog(null)
  }

  const handleApprove = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/blogs/${editingBlog?.id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.id}` }
      })
      if (!res.ok) throw new Error("Failed to approve blog")
      
      toast({ 
        title: "Success", 
        description: "Blog approved and published successfully" 
      })
      closeApproveModal()
      fetchBlogs()
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to approve blog", 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  const openRejectModal = (blog: Blog) => {
    setEditingBlog(blog)
    setRejectionReason("")
    setShowRejectModal(true)
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setEditingBlog(null)
    setRejectionReason("")
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Rejection reason is required", 
        variant: "destructive" 
      })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/blogs/${editingBlog?.id}/reject`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${user?.id}` 
        },
        body: JSON.stringify({ reason: rejectionReason })
      })
      if (!res.ok) throw new Error("Failed to reject blog")
      
      toast({ 
        title: "Success", 
        description: "Blog rejected successfully" 
      })
      closeRejectModal()
      fetchBlogs()
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to reject blog", 
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
    if (!dateString) return 'N/A';
    const d = dayjs(dateString)
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : 'N/A';
  }

  const filteredBlogs = blogs.filter(blog => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        blog.author?.name?.toLowerCase().includes(query) ||
        blog.author?.email?.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and moderate user blog posts
          </p>
        </div>
        <Button onClick={fetchBlogs} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Results Count */}
          <div className="flex items-center justify-end text-sm text-gray-500">
            {filteredBlogs.length} of {blogs.length} blogs
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchBlogs} variant="outline">
            Try Again
          </Button>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL" 
              ? "No blogs match your filters" 
              : "No blogs found"}
          </div>
          {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
            <Button onClick={() => {
              setSearchQuery("")
              setStatusFilter("ALL")
              setCategoryFilter("ALL")
            }} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate" title={blog.title}>
                      {blog.title}
                    </CardTitle>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(blog.status)}
                        {blog.isPublished && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            Live
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        {blog.author?.name || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(blog.createdAt)}
                      </div>
                      {blog.translations && blog.translations.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Globe className="h-3 w-3" />
                          <span>Languages: {blog.translations.map(t => t.language).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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

                <div className="flex flex-wrap gap-1 mb-3">
                  {blog.category && (
                    <Badge variant="outline" className="text-xs">
                      {blog.category}
                    </Badge>
                  )}
                  {getTagArray(blog.tags).slice(0, 3).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {Array.isArray(blog.tags) && blog.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{blog.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {blog.status === "REJECTED" && blog.rejectionReason && (
                  <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    <strong>Rejection Reason:</strong> {blog.rejectionReason}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2 flex-wrap pt-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => openViewModal(blog)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => openEditModal(blog)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDelete(blog)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
                
                {blog.status === "PENDING" && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white" 
                      onClick={() => openApproveModal(blog)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white" 
                      onClick={() => openRejectModal(blog)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Blog Modal */}
      <Dialog open={showEditModal} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
                     <Tabs defaultValue="ENGLISH" className="w-full">
             <TabsList className="grid w-full grid-cols-3">
               {languages.map(lang => (
                 <TabsTrigger key={lang.dbCode} value={lang.dbCode}>
                   <Globe className="h-4 w-4 mr-2" /> 
                   {lang.name}
                   {translations[lang.dbCode]?.title && translations[lang.dbCode]?.content && (
                     <Badge variant="secondary" className="ml-2 text-xs">✓</Badge>
                   )}
                 </TabsTrigger>
               ))}
             </TabsList>
            <TabsContent value="ENGLISH">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Blog title"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={form.category} onValueChange={(value) => setForm(f => ({ ...f, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.slice(1).map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    placeholder="https://example.com/image.jpg"
                    value={form.featuredImage}
                    onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of the blog post..."
                    value={form.excerpt}
                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    rows={3}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="travel, syria, culture (comma separated)"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm(f => ({ ...f, status: value }))} disabled={saving}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Blog content..."
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={12}
                    disabled={saving}
                  />
                </div>
              </div>
            </TabsContent>
                         {languages.slice(1).map(lang => (
               <TabsContent key={lang.dbCode} value={lang.dbCode}>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor={`title-${lang.dbCode}`}>Title</Label>
                     <Input
                       id={`title-${lang.dbCode}`}
                       placeholder="Blog title"
                       value={translations[lang.dbCode]?.title || ""}
                       onChange={e => updateTranslation(lang.dbCode, 'title', e.target.value)}
                       disabled={saving}
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`excerpt-${lang.dbCode}`}>Excerpt</Label>
                     <Textarea
                       id={`excerpt-${lang.dbCode}`}
                       placeholder="Brief description of the blog post..."
                       value={translations[lang.dbCode]?.excerpt || ""}
                       onChange={e => updateTranslation(lang.dbCode, 'excerpt', e.target.value)}
                       rows={3}
                       disabled={saving}
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`content-${lang.dbCode}`}>Content</Label>
                     <Textarea
                       id={`content-${lang.dbCode}`}
                       placeholder="Blog content..."
                       value={translations[lang.dbCode]?.content || ""}
                       onChange={e => updateTranslation(lang.dbCode, 'content', e.target.value)}
                       rows={12}
                       disabled={saving}
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`seoTitle-${lang.dbCode}`}>SEO Title</Label>
                     <Input
                       id={`seoTitle-${lang.dbCode}`}
                       placeholder="SEO optimized title"
                       value={translations[lang.dbCode]?.seoTitle || ""}
                       onChange={e => updateTranslation(lang.dbCode, 'seoTitle', e.target.value)}
                       disabled={saving}
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`seoDescription-${lang.dbCode}`}>SEO Description</Label>
                     <Textarea
                       id={`seoDescription-${lang.dbCode}`}
                       placeholder="SEO meta description"
                       value={translations[lang.dbCode]?.seoDescription || ""}
                       onChange={e => updateTranslation(lang.dbCode, 'seoDescription', e.target.value)}
                       rows={2}
                       disabled={saving}
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`seoKeywords-${lang.dbCode}`}>SEO Keywords</Label>
                     <Input
                       id={`seoKeywords-${lang.dbCode}`}
                       placeholder="keyword1, keyword2, keyword3"
                       value={translations[lang.dbCode]?.seoKeywords || ""}
                       onChange={e => updateTranslation(lang.dbCode, 'seoKeywords', e.target.value)}
                       disabled={saving}
                     />
                   </div>
                 </div>
               </TabsContent>
             ))}
          </Tabs>
          <DialogFooterUI>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooterUI>
        </DialogContent>
      </Dialog>

      {/* View Blog Modal */}
      <Dialog open={showViewModal} onOpenChange={closeViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
          <DialogHeader>
            <DialogTitle>View Blog Post</DialogTitle>
          </DialogHeader>
          {viewingBlog && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusBadge(viewingBlog.status)}
                {viewingBlog.isPublished && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    Published
                  </Badge>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-4">
                  <p>By: {viewingBlog.author?.name || 'Unknown'} ({viewingBlog.author?.email || 'No email'})</p>
                  <p>Created: {formatDate(viewingBlog.createdAt)}</p>
                  <p>Updated: {formatDate(viewingBlog.updatedAt)}</p>
                </div>
              </div>

              {viewingBlog.featuredImage && (
                <div>
                  <img
                    src={viewingBlog.featuredImage}
                    alt={viewingBlog.title}
                    className="w-full max-h-64 object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {viewingBlog.category && (
                  <Badge variant="outline">{viewingBlog.category}</Badge>
                )}
                {getTagArray(viewingBlog.tags).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>

              {/* Language Tabs for Viewing */}
              <Tabs defaultValue="ENGLISH" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {languages.map(lang => (
                    <TabsTrigger key={lang.dbCode} value={lang.dbCode}>
                      <Globe className="h-4 w-4 mr-2" /> 
                      {lang.name}
                      {viewingBlog.translations?.find(t => t.language === lang.dbCode) && (
                        <Badge variant="secondary" className="ml-2 text-xs">✓</Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {/* English Content */}
                <TabsContent value="ENGLISH">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{viewingBlog.title}</h2>
                      {viewingBlog.excerpt && (
                        <div>
                          <h3 className="font-semibold mb-2">Excerpt</h3>
                          <p className="text-gray-600">{viewingBlog.excerpt}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Content</h3>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">{viewingBlog.content}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Translation Content */}
                {languages.slice(1).map(lang => {
                  const translation = viewingBlog.translations?.find(t => t.language === lang.dbCode)
                  return (
                    <TabsContent key={lang.dbCode} value={lang.dbCode}>
                      {translation ? (
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-xl font-semibold mb-2">{translation.title}</h2>
                            {translation.excerpt && (
                              <div>
                                <h3 className="font-semibold mb-2">Excerpt</h3>
                                <p className="text-gray-600">{translation.excerpt}</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Content</h3>
                            <div className="prose max-w-none">
                              <p className="whitespace-pre-wrap">{translation.content}</p>
                            </div>
                          </div>

                          {(translation.seoTitle || translation.seoDescription || translation.seoKeywords) && (
                            <div>
                              <h3 className="font-semibold mb-2">SEO Information</h3>
                              {translation.seoTitle && (
                                <div className="mb-2">
                                  <strong>SEO Title:</strong> {translation.seoTitle}
                                </div>
                              )}
                              {translation.seoDescription && (
                                <div className="mb-2">
                                  <strong>SEO Description:</strong> {translation.seoDescription}
                                </div>
                              )}
                              {translation.seoKeywords && (
                                <div>
                                  <strong>SEO Keywords:</strong> {translation.seoKeywords}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No {lang.name} translation available</p>
                        </div>
                      )}
                    </TabsContent>
                  )
                })}
              </Tabs>

              {viewingBlog.status === "REJECTED" && viewingBlog.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Rejection Reason</h3>
                  <p className="text-red-700 dark:text-red-300">{viewingBlog.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={closeApproveModal}>
        <DialogContent className="max-w-md z-[9999]">
          <DialogHeader>
            <DialogTitle>Approve Blog Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to approve and publish this blog post?</p>
            <p className="text-sm text-gray-600 mt-2">
              This will make the blog visible to all users on the public blog page.
            </p>
          </div>
          <DialogFooterUI>
            <Button onClick={handleApprove} disabled={saving} className="bg-green-600 hover:bg-green-700 w-full text-white">
              {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Approve & Publish
            </Button>
          </DialogFooterUI>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={closeRejectModal}>
        <DialogContent className="max-w-md z-[9999]">
          <DialogHeader>
            <DialogTitle>Reject Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Please provide a reason for rejecting this blog post:</p>
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={3}
              disabled={saving}
            />
          </div>
          <DialogFooterUI>
            <Button onClick={handleReject} disabled={saving} className="bg-red-600 hover:bg-red-700 w-full text-white">
              {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Reject
            </Button>
          </DialogFooterUI>
        </DialogContent>
      </Dialog>
    </div>
  )
}
