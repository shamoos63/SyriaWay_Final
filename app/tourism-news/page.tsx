"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"
import { ChatButton } from "@/components/chat-button"
import { Loader2, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { TourismNewsModal } from "@/components/control-panel/tourism-news-modal"
import TourismNewsViewModal from "@/components/tourism-news-view-modal"
import { toast } from "@/hooks/use-toast"

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

export default function TourismNewsPage() {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [news, setNews] = useState<TourismNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [selectedNews, setSelectedNews] = useState<TourismNews | null>(null)
  const [loadingNewsId, setLoadingNewsId] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [language])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        published: 'true',
        featured: 'false',
        language: language
      })
      const response = await fetch(`/api/tourism-news?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tourism news')
      }
      const data = await response.json()
      setNews(data.news || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load tourism news')
      console.error('Error fetching tourism news:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNews = async (formData: any) => {
    try {
      setSaving(true)
      
      const newsData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        images: formData.images ? formData.images.split(',').map((img: string) => img.trim()) : []
      }

      const response = await fetch('/api/tourism-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(newsData)
      })

      if (response.ok) {
        const result = await response.json()
        setNews([result.news, ...news])
        setModalOpen(false)
        toast({
          title: "Success",
          description: "Tourism news article created successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create tourism news article",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating tourism news:', error)
      toast({
        title: "Error",
        description: "Failed to create tourism news article",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  // Get unique categories from fetched news
  const categories = Array.from(
    new Set(news.map((newsItem) => newsItem.category).filter(Boolean))
  )

  // Filter news by category if selected
  const filteredNews = selectedCategory
    ? news.filter((newsItem) => newsItem.category === selectedCategory)
    : news

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "ar" ? "ar-SY" : language === "fr" ? "fr-FR" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    )
  }

  // Check if user can create tourism news (admin only)
  const canCreateNews = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
  
  const addNewArticle = language === "ar" ? "إضافة مقال إخباري جديد" : language === "fr" ? "Ajouter un nouvel article" : "Add News Article"

  const openNewsModal = async (newsItem: TourismNews) => {
    setLoadingNewsId(newsItem.id)
    try {
      // Fetch full news details
      const response = await fetch(`/api/tourism-news/${newsItem.id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedNews(data.news)
        setShowNewsModal(true)
      } else {
        toast({
          title: "Error",
          description: "Failed to load news details",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load news details",
        variant: "destructive"
      })
    } finally {
      setLoadingNewsId(null)
    }
  }

  const closeNewsModal = () => {
    setShowNewsModal(false)
    setSelectedNews(null)
    setLoadingNewsId(null)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-syria-gold mx-auto mb-4" />
              <p className="text-gray-600">
                {language === "ar" ? "جاري تحميل الأخبار..." : language === "fr" ? "Chargement des actualités..." : "Loading news..."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
        <ChatButton />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              {language === "ar" ? "حدث خطأ في تحميل الأخبار" : language === "fr" ? "Erreur lors du chargement des actualités" : "Error loading news"}
            </div>
            <Button onClick={fetchNews} variant="outline">
              {language === "ar" ? "حاول مرة أخرى" : language === "fr" ? "Réessayer" : "Try Again"}
            </Button>
          </div>
        </div>
        <Footer />
        <ChatButton />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-pattern">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          {/* Background with gradient and pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-syria-gold/10 via-yellow-50 to-syria-dark-gold/5 dark:from-syria-gold/20 dark:via-[#2a2a2a] dark:to-syria-dark-gold/15"></div>
          <div className="absolute inset-0 bg-pattern opacity-5 dark:opacity-10"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-24 h-24 border-2 border-syria-gold/20 dark:border-syria-gold/40 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-syria-gold/20 dark:border-syria-gold/40 transform rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-syria-gold/20 dark:bg-syria-gold/30 rounded-full"></div>
          
          {/* Content */}
          <div className="relative z-10 p-12 md:p-16">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-syria-gold/10 dark:bg-syria-gold/20 border border-syria-gold/30 dark:border-syria-gold/50 rounded-full mb-6">
                <span className="text-syria-gold dark:text-syria-gold font-semibold text-sm">
                  {language === "ar" ? "أخبار حية" : language === "fr" ? "Actualités en Direct" : "Live News"}
                </span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-syria-gold mb-6 leading-tight">
                {language === "ar" ? "أخبار السياحة" : language === "fr" ? "Actualités Touristiques" : "Tourism News"}
              </h1>
              
              {/* Decorative line */}
              <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 dark:from-syria-gold dark:to-syria-dark-gold mx-auto mb-8 rounded-full"></div>
              
              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
                {language === "ar"
                  ? "آخر الأخبار والتطورات في قطاع السياحة السوري. اكتشف الأحداث الجديدة والمشاريع والمبادرات التي تشكل مستقبل السياحة في سوريا."
                  : language === "fr"
                    ? "Dernières nouvelles et développements dans le secteur du tourisme syrien. Découvrez les nouveaux événements, projets et initiatives qui façonnent l'avenir du tourisme en Syrie."
                    : "Latest news and developments in the Syrian tourism sector. Discover new events, projects, and initiatives shaping the future of tourism in Syria."}
              </p>
              
              {/* Action Button */}
              {canCreateNews && (
                <Button 
                  onClick={() => setModalOpen(true)}
                  className="bg-syria-gold hover:bg-syria-dark-gold text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {addNewArticle}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-syria-gold hover:bg-syria-dark-gold" : ""}
            >
              {language === "ar" ? "الكل" : language === "fr" ? "Tous" : "All"}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-syria-gold hover:bg-syria-dark-gold" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* News grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {selectedCategory 
                ? (language === "ar" ? "لا توجد أخبار في هذه الفئة" : language === "fr" ? "Aucune actualité dans cette catégorie" : "No news in this category")
                : (language === "ar" ? "لا توجد أخبار متاحة حالياً" : language === "fr" ? "Aucune actualité disponible pour le moment" : "No news available at the moment")
              }
            </div>
            {selectedCategory && (
              <Button 
                onClick={() => setSelectedCategory(null)} 
                variant="outline"
                className="bg-syria-gold hover:bg-syria-dark-gold text-white"
              >
                {language === "ar" ? "عرض جميع الأخبار" : language === "fr" ? "Voir toutes les actualités" : "View All News"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((newsItem) => (
              <Card key={newsItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={newsItem.featuredImage || "/placeholder.svg"}
                    alt={newsItem.title}
                    fill
                    className="object-cover"
                  />
                  {newsItem.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-syria-gold text-white">
                        {language === "ar" ? "مميز" : language === "fr" ? "En vedette" : "Featured"}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    {newsItem.category && (
                      <Badge variant="outline" className="bg-syria-gold text-white">
                        {newsItem.category}
                      </Badge>
                    )}
                    <CardDescription>
                      {formatDate(newsItem.publishedAt || newsItem.createdAt)}
                    </CardDescription>
                  </div>
                  <CardTitle className="text-xl mt-2">
                    {newsItem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{newsItem.excerpt || newsItem.content.substring(0, 150) + "..."}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex flex-wrap gap-1">
                    {newsItem.tags?.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="text-syria-gold border-syria-gold hover:bg-syria-gold hover:text-white"
                    onClick={() => openNewsModal(newsItem)}
                    disabled={loadingNewsId === newsItem.id}
                  >
                    {loadingNewsId === newsItem.id ? 
                      (language === "ar" ? "جاري التحميل..." : language === "fr" ? "Chargement..." : "Loading...") : 
                      (language === "ar" ? "اقرأ المزيد" : language === "fr" ? "Lire plus" : "Read More")
                    }
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tourism News Creation Modal */}
      {canCreateNews && (
        <TourismNewsModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={handleCreateNews}
          loading={saving}
        />
      )}

      {/* Tourism News View Modal */}
      {showNewsModal && selectedNews && (
        <TourismNewsViewModal
          news={selectedNews}
          isOpen={showNewsModal}
          onClose={closeNewsModal}
        />
      )}

      <Footer />
      <ChatButton />
    </main>
  )
}
