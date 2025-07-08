"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Trash2, CheckCircle, Upload } from "lucide-react"
import Link from "next/link"

// Mock data for news articles
const mockNews = [
  {
    id: "1",
    title: "New Direct Flights Between Damascus and Cairo",
    excerpt:
      "Starting next month, new direct flights will connect Damascus and Cairo, strengthening tourism ties between Syria and Egypt.",
    content:
      "Syria Airways has announced new direct flights between Damascus and Cairo starting from next month. This development is expected to boost tourism and business travel between Syria and Egypt. The flights will operate three times a week, offering convenient options for travelers. Officials from both countries have welcomed this step as part of ongoing efforts to strengthen bilateral relations and promote regional tourism.",
    category: "Travel",
    status: "published",
    publishDate: "2023-05-15",
    image: "/airplane-in-flight.png",
    author: "Ahmed Khalid",
    tags: ["flights", "egypt", "travel"],
  },
  {
    id: "2",
    title: "Syria's Tourism Sector Shows Signs of Recovery",
    excerpt:
      "Recent statistics indicate a gradual recovery in Syria's tourism sector, with increasing numbers of international visitors.",
    content:
      "According to recent data from the Ministry of Tourism, Syria's tourism sector is showing promising signs of recovery. The number of international visitors has increased by 25% compared to the previous year, with tourists primarily coming from neighboring countries and expatriate Syrians returning to visit their homeland.",
    category: "Economy",
    status: "published",
    publishDate: "2023-06-02",
    image: "/placeholder.svg?key=0zub0",
    author: "Layla Haddad",
    tags: ["tourism", "economy", "recovery"],
  },
]

export default function NewsArticleEdit() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [article, setArticle] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "",
    publishDate: "",
    image: "",
    author: "",
    tags: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Fetch article data
    const foundArticle = mockNews.find((news) => news.id === id)
    if (foundArticle) {
      setArticle({
        id: foundArticle.id,
        title: foundArticle.title,
        excerpt: foundArticle.excerpt,
        content: foundArticle.content,
        category: foundArticle.category,
        status: foundArticle.status,
        publishDate: foundArticle.publishDate || "",
        image: foundArticle.image,
        author: foundArticle.author,
        tags: [...foundArticle.tags],
      })
    }
  }, [id])

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }, 1000)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle({
        ...article,
        tags: [...article.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle({
      ...article,
      tags: article.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const categories = ["Travel", "Economy", "Heritage", "Hospitality", "Events", "Culture", "Adventure"]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/control-panel/content/news">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit News Article</h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-syria-gold hover:bg-syria-dark-gold text-white"
          >
            {isLoading ? (
              "Saving..."
            ) : isSaved ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" /> Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={article.title}
                  onChange={(e) => setArticle({ ...article, title: e.target.value })}
                  placeholder="Enter article title"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={article.excerpt}
                  onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                  placeholder="Brief summary of the article"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={article.content}
                  onChange={(e) => setArticle({ ...article, content: e.target.value })}
                  placeholder="Full article content"
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={article.status}
                  onChange={(e) => setArticle({ ...article, status: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={article.category}
                  onChange={(e) => setArticle({ ...article, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={article.author}
                  onChange={(e) => setArticle({ ...article, author: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={article.publishDate}
                  onChange={(e) => setArticle({ ...article, publishDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {article.image && (
                  <div className="relative mb-4 rounded-md overflow-hidden">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" /> Upload New Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
