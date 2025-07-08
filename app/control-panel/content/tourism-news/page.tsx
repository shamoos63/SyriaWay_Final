"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Tag,
  RefreshCw,
  Loader2,
  Filter
} from "lucide-react"
import { TourismNewsModal } from "@/components/control-panel/tourism-news-modal"
import { DeleteConfirmationDialog } from "@/components/user-dashboard/delete-confirmation-dialog"

interface TourismNews {
  id: string
  title: string
  excerpt?: string
  content: string
  category?: string
  tags?: string[]
  featuredImage?: string
  images?: string[]
  isPublished: boolean
  isFeatured: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface TourismNewsFormData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string
  featuredImage: string
  images: string
  isPublished: boolean
  isFeatured: boolean
}

const CATEGORIES = [
  "All Categories",
  "General",
  "Events",
  "Announcements",
  "Travel",
  "Culture",
  "Heritage",
  "Economy",
  "Infrastructure",
  "Security",
  "Other"
]

export default function TourismNewsPage() {
  const { user } = useAuth()
  const [news, setNews] = useState<TourismNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [statusFilter, setStatusFilter] = useState("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<TourismNews | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [categoryFilter, statusFilter])

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      let url = "/api/tourism-news?published=false" // Fetch all news for admin
      const params = new URLSearchParams()
      
      if (categoryFilter !== "All Categories") {
        params.append("category", categoryFilter)
      }
      if (statusFilter === "Published") {
        params.append("published", "true")
      } else if (statusFilter === "Draft") {
        params.append("published", "false")
      }
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      
      if (params.toString()) {
        url += `&${params.toString()}`
      }

      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch tourism news")
      const data = await res.json()
      setNews(data.news || [])
    } catch (err: any) {
      setError(err.message || "Failed to load tourism news")
      toast({
        title: "Error",
        description: "Failed to fetch tourism news",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNews = () => {
    setEditingNews(null)
    setModalOpen(true)
  }

  const handleEditNews = (newsItem: TourismNews) => {
    setEditingNews(newsItem)
    setModalOpen(true)
  }

  const handleDeleteNews = (id: string) => {
    setNewsToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!newsToDelete) return

    try {
      const response = await fetch(`/api/tourism-news/${newsToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })

      if (response.ok) {
        setNews(news.filter(newsItem => newsItem.id !== newsToDelete))
        toast({
          title: "Success",
          description: "Tourism news deleted successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete tourism news",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting tourism news:', error)
      toast({
        title: "Error",
        description: "Failed to delete tourism news",
        variant: "destructive"
      })
    } finally {
      setNewsToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveNews = async (formData: TourismNewsFormData) => {
    try {
      setSaving(true)
      
      const newsData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        images: formData.images ? formData.images.split(',').map(img => img.trim()) : []
      }

      const url = editingNews ? `/api/tourism-news/${editingNews.id}` : '/api/tourism-news'
      const method = editingNews ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(newsData)
      })

      if (response.ok) {
        const result = await response.json()
        
        if (editingNews) {
          setNews(news.map(newsItem => 
            newsItem.id === editingNews.id ? result.news : newsItem
          ))
          toast({
            title: "Success",
            description: "Tourism news updated successfully"
          })
        } else {
          setNews([result.news, ...news])
          toast({
            title: "Success",
            description: "Tourism news created successfully"
          })
        }
        
        setModalOpen(false)
        setEditingNews(null)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save tourism news",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving tourism news:', error)
      toast({
        title: "Error",
        description: "Failed to save tourism news",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Published</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Draft</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredNews = news.filter(newsItem => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        newsItem.title.toLowerCase().includes(query) ||
        newsItem.excerpt?.toLowerCase().includes(query) ||
        newsItem.content.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tourism News Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage tourism news articles
          </p>
        </div>
        <Button onClick={fetchNews} variant="outline" disabled={loading}>
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
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Results Count */}
          <div className="flex items-center justify-end text-sm text-gray-500">
            {filteredNews.length} of {news.length} articles
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreateNews} className="bg-syria-gold hover:bg-syria-dark-gold text-white">
          <Plus className="h-4 w-4 mr-2" /> Add New Article
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading tourism news...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchNews} variant="outline">
            Try Again
          </Button>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchQuery || categoryFilter !== "All Categories" || statusFilter !== "All" 
              ? "No news articles match your filters" 
              : "No tourism news articles found"}
          </div>
          {(searchQuery || categoryFilter !== "All Categories" || statusFilter !== "All") && (
            <Button onClick={() => {
              setSearchQuery("")
              setCategoryFilter("All Categories")
              setStatusFilter("All")
            }} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredNews.map((newsItem) => (
            <Card key={newsItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {newsItem.featuredImage && (
                    <div className="h-48 w-full md:h-auto md:w-1/4">
                      <img
                        src={newsItem.featuredImage}
                        alt={newsItem.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold">{newsItem.title}</h2>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(newsItem.isPublished)}
                          {newsItem.isFeatured && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {newsItem.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{newsItem.excerpt}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {newsItem.category && (
                          <Badge variant="outline" className="text-xs">
                            {newsItem.category}
                          </Badge>
                        )}
                        {newsItem.tags?.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {newsItem.publishedAt ? formatDate(newsItem.publishedAt) : formatDate(newsItem.createdAt)}
                        </div>
                        {newsItem.tags && newsItem.tags.length > 0 && (
                          <div className="flex items-center">
                            <Tag className="mr-1 h-4 w-4" />
                            {newsItem.tags.length} tags
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-auto flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditNews(newsItem)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteNews(newsItem.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tourism News Modal */}
      <TourismNewsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        news={editingNews}
        onSave={handleSaveNews}
        loading={saving}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Tourism News"
        description="Are you sure you want to delete this tourism news article? This action cannot be undone."
        entityType="blog"
      />
    </div>
  )
}
