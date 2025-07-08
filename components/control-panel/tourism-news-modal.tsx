"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, X } from "lucide-react"

interface TourismNewsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news?: TourismNews | null
  onSave: (news: TourismNewsFormData) => void
  loading?: boolean
}

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

export function TourismNewsModal({ open, onOpenChange, news, onSave, loading = false }: TourismNewsModalProps) {
  const [formData, setFormData] = useState<TourismNewsFormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    featuredImage: "",
    images: "",
    isPublished: false,
    isFeatured: false
  })

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        excerpt: news.excerpt || "",
        content: news.content || "",
        category: news.category || "",
        tags: news.tags?.join(", ") || "",
        featuredImage: news.featuredImage || "",
        images: news.images?.join(", ") || "",
        isPublished: news.isPublished || false,
        isFeatured: news.isFeatured || false
      })
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        featuredImage: "",
        images: "",
        isPublished: false,
        isFeatured: false
      })
    }
  }, [news, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: keyof TourismNewsFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{news ? "Edit Tourism News" : "Create New Tourism News"}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter news title..."
              required
              disabled={loading}
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              placeholder="Brief summary of the news article..."
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Tags and Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="tourism, syria, travel (comma separated)"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Additional Images URLs</Label>
              <Input
                id="images"
                value={formData.images}
                onChange={(e) => handleInputChange("images", e.target.value)}
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                disabled={loading}
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Write the full news content here..."
              rows={12}
              required
              disabled={loading}
            />
          </div>

          {/* Status Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                disabled={loading}
              />
              <Label htmlFor="isPublished">Published</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                disabled={loading}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {news ? "Update News" : "Create News"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 