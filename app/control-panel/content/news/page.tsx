"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

// Mock news data
const newsData = [
  {
    id: 1,
    title: "New Direct Flights Between Damascus and Cairo",
    excerpt:
      "Starting next month, new direct flights will connect Damascus and Cairo, strengthening tourism ties between Syria and Egypt.",
    content:
      "Syria Airways has announced new direct flights between Damascus and Cairo starting from next month. This development is expected to boost tourism and business travel between Syria and Egypt.",
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
      "According to recent data from the Ministry of Tourism, Syria's tourism sector is showing promising signs of recovery. The number of international visitors has increased by 25% compared to the previous year.",
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
      "A comprehensive restoration project has commenced at the Aleppo Citadel, one of Syria's most iconic historical monuments and a UNESCO World Heritage site.",
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
      "A new luxury resort is under construction on Syria's picturesque Mediterranean coast, scheduled to open its doors to guests next summer.",
    category: "Hospitality",
    status: "draft",
    date: "2023-07-10",
    author: "Rima Abboud",
  },
]

export default function TourismNewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [news, setNews] = useState(newsData)

  // Filter news based on search term
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle delete news
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      setNews(news.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tourism News Management</h1>
        <Button className="bg-syria-gold hover:bg-syria-dark-gold text-white">
          <Plus className="h-4 w-4 mr-2" /> Add New Article
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by title, content or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredNews.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No news articles found matching your search.</p>
        ) : (
          filteredNews.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{item.excerpt}</p>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-semibold">Category:</span> {item.category}
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>{" "}
                        <span className={item.status === "published" ? "text-green-600" : "text-amber-600"}>
                          {item.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span> {item.date}
                      </div>
                      <div>
                        <span className="font-semibold">Author:</span> {item.author}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
