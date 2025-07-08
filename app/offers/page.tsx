"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"
import { ChatButton } from "@/components/chat-button"
import { Search, MapPin, Star, Calendar, Car, Hotel, Compass } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface SpecialOffer {
  id: string
  type: 'HOTEL' | 'CAR' | 'TOUR'
  name: string
  description: string
  price: number
  originalPrice: number
  discount: string
  image: string
  location: string
  rating?: number
  duration?: number
  provider?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

export default function SpecialOffersPage() {
  const { t, dir } = useLanguage()
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    fetchSpecialOffers()
  }, [])

  useEffect(() => {
    filterOffers()
  }, [specialOffers, searchTerm, selectedType])

  const fetchSpecialOffers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/special-offers')
      if (response.ok) {
        const data = await response.json()
        setSpecialOffers(data.specialOffers)
      } else {
        setError('Failed to fetch special offers')
      }
    } catch (error) {
      console.error('Error fetching special offers:', error)
      setError('Error loading special offers')
    } finally {
      setLoading(false)
    }
  }

  const filterOffers = () => {
    let filtered = specialOffers

    if (selectedType !== "all") {
      filtered = filtered.filter(offer => offer.type.toLowerCase() === selectedType)
    }

    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOffers(filtered)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HOTEL': return <Hotel className="h-4 w-4" />
      case 'CAR': return <Car className="h-4 w-4" />
      case 'TOUR': return <Compass className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'HOTEL': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'CAR': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'TOUR': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getOfferLink = (offer: SpecialOffer) => {
    switch (offer.type) {
      case 'HOTEL': return `/hotels/${offer.id}`
      case 'CAR': return `/cars-rental`
      case 'TOUR': return `/tours`
      default: return '#'
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-pattern" dir={dir}>
        <Navbar />
        <div className="pt-32 pb-12">
          <div className="max-w-6xl mx-auto px-4 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-gold mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading special offers...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-pattern" dir={dir}>
      <Navbar />

      <section className="pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Modern Hero Section */}
          <div className="relative overflow-hidden rounded-3xl mb-12">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-syria-gold/10 via-yellow-50 to-syria-dark-gold/5"></div>
            <div className="absolute inset-0 bg-pattern opacity-5"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-24 h-24 border-2 border-syria-gold/20 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-syria-gold/20 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-syria-gold/20 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 border border-syria-gold/20 rounded-full"></div>
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-syria-gold/10 border border-syria-gold/30 rounded-full mb-6">
                  <span className="text-syria-gold font-semibold text-sm">
                    {t.home.specialOffers}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {t.home.specialOffers}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {t.home.specialOffersDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-section rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hotels">Hotels</SelectItem>
                  <SelectItem value="cars">Cars</SelectItem>
                  <SelectItem value="tours">Tours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchSpecialOffers} className="bg-syria-gold hover:bg-syria-dark-gold">
                Try Again
              </Button>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No special offers found</p>
              <Button onClick={() => {
                setSearchTerm("")
                setSelectedType("all")
              }} className="bg-syria-gold hover:bg-syria-dark-gold">
                Clear Filters
              </Button>
                  </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getTypeColor(offer.type)} flex items-center gap-1`}>
                        {getTypeIcon(offer.type)}
                        {offer.type}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-500 text-white">
                        {offer.discount} OFF
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{offer.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {offer.description}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{offer.location}</span>
                    </div>

                    {offer.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{offer.rating}/5</span>
                      </div>
                    )}

                    {offer.duration && (
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{offer.duration} days</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-2xl font-bold text-syria-gold">${offer.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${offer.originalPrice}</span>
                      </div>
                    </div>
                </CardContent>

                  <CardFooter>
                    <Button asChild className="w-full bg-syria-gold hover:bg-syria-dark-gold">
                      <Link href={getOfferLink(offer)}>
                        View Details
                      </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      <ChatButton />
      <Footer />
    </main>
  )
}
