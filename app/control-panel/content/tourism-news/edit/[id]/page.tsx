"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock news data - in a real app, you would fetch this from an API
const newsData = {
  1: {
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
  2: {
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
  3: {
    id: 3,
    title: "Restoration Project Begins at Aleppo Citadel",
    excerpt:
      "A major restoration project has begun at the historic Aleppo Citadel, aiming to repair damage and preserve this UNESCO World Heritage site.",
    content:
      "A comprehensive restoration project has commenced at the Aleppo Citadel, one of Syria's most iconic historical monuments and a UNESCO World Heritage site. The project, funded by international organizations and the Syrian government, aims to repair damage sustained during recent conflicts and ensure the long-term preservation of this architectural treasure. Experts from various countries are collaborating with local archaeologists and restoration specialists on this ambitious undertaking.",
    category: "Heritage",
    status: "published",
    date: "2023-06-20",
    author: "Omar Nasser",
  },
  4: {
    id: 4,
    title: "New Luxury Resort to Open on Syrian Coast",
    excerpt:
      "A new five-star resort is set to open on Syria's Mediterranean coast next summer, offering premium accommodations and amenities.",
    content:
      "A new luxury resort is under construction on Syria's picturesque Mediterranean coast, scheduled to open its doors to guests next summer. The development, which represents a significant investment in the country's tourism infrastructure, will feature 200 premium rooms and suites, multiple restaurants, spa facilities, and private beach access. The project is expected to create hundreds of jobs and attract high-end tourists to the region.",
    category: "Hospitality",
    status: "draft",
    date: "2023-07-10",
    author: "Rima Abboud",
  },
}

export default function EditNewsPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  // Get the news article data
  const newsArticle = newsData[id as keyof typeof newsData]

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize formData with default values to avoid conditional hook call
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Travel",
    status: "published",
    date: new Date().toISOString().slice(0, 10),
    author: "",
  })

  // Update formData only if newsArticle exists
  useState(() => {
    if (newsArticle) {
      setFormData({
        title: newsArticle.title,
        excerpt: newsArticle.excerpt,
        content: newsArticle.content,
        category: newsArticle.category,
        status: newsArticle.status,
        date: newsArticle.date,
        author: newsArticle.author,
      })
    }
  }, [newsArticle])

  // If article doesn't exist, show error
  if (!newsArticle) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/control-panel/content/tourism-news">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Article Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>The news article you are looking for does not exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/control-panel/content/tourism-news">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit News Article</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="Travel">Travel</option>
                  <option value="Economy">Economy</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Events">Events</option>
                  <option value="Culture">Culture</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          {saveSuccess && <p className="text-green-600 mr-4 self-center">Article saved successfully!</p>}
          <Button type="submit" className="bg-syria-gold hover:bg-syria-dark-gold text-white" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
