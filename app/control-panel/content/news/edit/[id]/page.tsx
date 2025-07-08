"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock news data
const newsData = [
  {
    id: 1,
    title: "New Direct Flights Between Damascus and Cairo",
    excerpt:
      "Starting next month, new direct flights will connect Damascus and Cairo, strengthening tourism ties between Syria and Egypt.",
    content:
      "Syria Airways has announced new direct flights between Damascus and Cairo starting from next month. This development is expected to boost tourism and business travel between Syria and Egypt. The flights will operate three times a week, offering convenient options for travelers. Officials from both countries have welcomed this step as part of ongoing efforts to strengthen bilateral relations and promote regional tourism.",
    category: "Travel",
    status: "published",
    date: "2023-05-15",
    author: "Ahmed Khalid",
  },
  {
    id: 2,
    title: "Syria's Tourism Sector Shows Signs of Recovery",
    excerpt:
      "Recent statistics indicate a gradual recovery in Syria's tourism sector, with increasing numbers of international visitors.",
    content:
      "According to recent data from the Ministry of Tourism, Syria's tourism sector is showing promising signs of recovery. The number of international visitors has increased by 25% compared to the previous year, with tourists primarily coming from neighboring countries and expatriate Syrians returning to visit their homeland. The ministry has implemented several initiatives to promote tourism, including infrastructure improvements and marketing campaigns highlighting Syria's rich cultural heritage and historical sites.",
    category: "Economy",
    status: "published",
    date: "2023-06-02",
    author: "Layla Haddad",
  },
  {
    id: 3,
    title: "Restoration Project Begins at Aleppo Citadel",
    excerpt:
      "A major restoration project has begun at the historic Aleppo Citadel, aiming to repair damage and preserve this UNESCO World Heritage site.",
    content:
      "A comprehensive restoration project has commenced at the Aleppo Citadel, one of Syria's most iconic historical monuments and a UNESCO World Heritage site. The project, funded by international organizations and the Syrian government, aims to repair damage sustained during recent conflicts and ensure the long-term preservation of this architectural treasure.",
    category: "Heritage",
    status: "published",
    date: "2023-06-20",
    author: "Omar Nasser",
  },
  {
    id: 4,
    title: "New Luxury Resort to Open on Syrian Coast",
    excerpt:
      "A new five-star resort is set to open on Syria's Mediterranean coast next summer, offering premium accommodations and amenities.",
    content:
      "A new luxury resort is under construction on Syria's picturesque Mediterranean coast, scheduled to open its doors to guests next summer. The development, which represents a significant investment in the country's tourism infrastructure, will feature 200 premium rooms and suites, multiple restaurants, spa facilities, and private beach access.",
    category: "Hospitality",
    status: "draft",
    date: "2023-07-10",
    author: "Rima Abboud",
  },
]

export default function EditNewsPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [article, setArticle] = useState({
    id: 0,
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "",
    date: "",
    author: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Find the article with the matching ID
    const foundArticle = newsData.find((item) => item.id === id)
    if (foundArticle) {
      setArticle(foundArticle)
    } else {
      // Redirect to the news list if article not found
      router.push("/control-panel/content/news")
    }
  }, [id, router])

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }, 1000)
  }

  const categories = ["Travel", "Economy", "Heritage", "Hospitality", "Events", "Culture"]

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

        <Button onClick={handleSave} disabled={isLoading} className="bg-syria-gold hover:bg-syria-dark-gold text-white">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={article.excerpt}
                  onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={article.content}
                  onChange={(e) => setArticle({ ...article, content: e.target.value })}
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="date">Publish Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={article.date}
                  onChange={(e) => setArticle({ ...article, date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={article.author}
                  onChange={(e) => setArticle({ ...article, author: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
