"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save, ArrowLeft, ImageIcon, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// Mock data for offers
const mockOffers = [
  {
    id: "1",
    title: "Summer Beach Vacation",
    description: "Enjoy a luxurious beach vacation with 30% discount",
    price: 499,
    discountedPrice: 349,
    category: "Hotels",
    status: "active",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    image: "/tropical-beach-resort.png",
    views: 1245,
    bookings: 87,
    details:
      "Experience the ultimate beach getaway with our summer special offer. This package includes luxury accommodation, daily breakfast, access to private beach, and complimentary spa treatment. Perfect for couples and families looking for a relaxing vacation.",
    terms: "Booking must be made at least 7 days in advance. Cancellation policy applies. Subject to availability.",
    featured: true,
    tags: ["summer", "beach", "luxury", "family"],
  },
  {
    id: "2",
    title: "Historical Damascus Tour",
    description: "Explore the ancient city of Damascus with a guided tour",
    price: 299,
    discountedPrice: 249,
    category: "Tours",
    status: "active",
    startDate: "2023-05-15",
    endDate: "2023-09-30",
    image: "/placeholder.svg?key=6m1kr",
    views: 876,
    bookings: 42,
    details:
      "Discover the rich history of Damascus with our expert guides. Visit the Umayyad Mosque, the ancient souks, and historical landmarks. This tour includes transportation, lunch at a traditional restaurant, and all entrance fees.",
    terms:
      "Minimum 4 participants required. Tour operates daily except Fridays. Please wear comfortable shoes and modest clothing.",
    featured: false,
    tags: ["history", "culture", "guided tour", "damascus"],
  },
  {
    id: "3",
    title: "Luxury Car Weekend",
    description: "Rent a luxury car for the weekend at a special price",
    price: 399,
    discountedPrice: 299,
    category: "Cars",
    status: "inactive",
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    image: "/luxury-car-sleek-design.png",
    views: 654,
    bookings: 18,
    details:
      "Treat yourself to a weekend of luxury with our premium car rental offer. Choose from a selection of high-end vehicles including Mercedes, BMW, and Audi models. Package includes unlimited mileage and comprehensive insurance.",
    terms: "Valid driver's license required. Security deposit applies. Minimum rental period is 48 hours.",
    featured: true,
    tags: ["luxury", "car rental", "weekend", "special"],
  },
  {
    id: "4",
    title: "Family Flight Package",
    description: "Special family discount on international flights",
    price: 1299,
    discountedPrice: 999,
    category: "Flights",
    status: "active",
    startDate: "2023-06-15",
    endDate: "2023-12-31",
    image: "/placeholder.svg?key=38qmi",
    views: 987,
    bookings: 65,
    details:
      "Travel with your family and save with our special family flight package. This offer includes discounted rates for children under 12, extra baggage allowance, and priority boarding. Available for selected international destinations.",
    terms:
      "Family must travel together on the same flights. Minimum 3 family members required. Subject to seat availability.",
    featured: true,
    tags: ["family", "flights", "international", "discount"],
  },
  {
    id: "5",
    title: "Palmyra Exploration",
    description: "Visit the ancient ruins of Palmyra with expert guides",
    price: 199,
    discountedPrice: 149,
    category: "Tours",
    status: "active",
    startDate: "2023-08-01",
    endDate: "2023-10-31",
    image: "/placeholder.svg?key=kf9tj",
    views: 543,
    bookings: 31,
    details:
      "Explore the magnificent ruins of Palmyra, one of Syria's most significant archaeological sites. Our expert guides will take you through the ancient city, explaining its rich history and cultural significance. Package includes transportation from Damascus, lunch, and all entrance fees.",
    terms:
      "Tour operates twice weekly. Minimum 6 participants required. Please bring sun protection and comfortable walking shoes.",
    featured: false,
    tags: ["archaeology", "history", "palmyra", "guided tour"],
  },
]

export default function EditOffer() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const offerId = params.id as string

  const [offer, setOffer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [details, setDetails] = useState("")
  const [terms, setTerms] = useState("")
  const [price, setPrice] = useState("")
  const [discountedPrice, setDiscountedPrice] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [featured, setFeatured] = useState(false)
  const [tags, setTags] = useState("")

  useEffect(() => {
    // Simulate API call to get offer details
    const foundOffer = mockOffers.find((o) => o.id === offerId)
    if (foundOffer) {
      setOffer(foundOffer)
      setTitle(foundOffer.title)
      setDescription(foundOffer.description)
      setDetails(foundOffer.details)
      setTerms(foundOffer.terms)
      setPrice(foundOffer.price.toString())
      setDiscountedPrice(foundOffer.discountedPrice.toString())
      setCategory(foundOffer.category)
      setStatus(foundOffer.status)
      setStartDate(new Date(foundOffer.startDate))
      setEndDate(new Date(foundOffer.endDate))
      setFeatured(foundOffer.featured)
      setTags(foundOffer.tags.join(", "))
    }
    setLoading(false)
  }, [offerId])

  const handleSave = () => {
    setSaving(true)
    // Simulate API call to save offer
    setTimeout(() => {
      setSaving(false)
      router.push("/control-panel/content/offers")
    }, 1000)
  }

  const categories = ["Hotels", "Tours", "Cars", "Flights"]

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-gold"></div>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="p-6">
        <div className="text-center py-10">
          <p className="text-gray-500">Offer not found.</p>
          <Button className="mt-4" onClick={() => router.push("/control-panel/content/offers")}>
            Back to Offers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/control-panel/content/offers")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Offer</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Offer title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the offer"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="details">Detailed Description</Label>
                  <Textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Detailed information about the offer"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Terms and conditions for this offer"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Regular Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Regular price"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountedPrice">Discounted Price ($)</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      placeholder="Discounted price"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="summer, beach, family, etc."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="featured">Featured Offer</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label>Offer Image</Label>
                  <div className="mt-2 border rounded-md p-4">
                    <div className="aspect-video relative overflow-hidden rounded-md mb-4">
                      <img src={offer.image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        <ImageIcon className="h-4 w-4 mr-2" /> Change Image
                      </Button>
                      <Button variant="outline" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Offer Statistics</Label>
                  <div className="mt-2 border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Views:</span>
                      <span className="font-semibold">{offer.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bookings:</span>
                      <span className="font-semibold">{offer.bookings}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-syria-gold hover:bg-syria-dark-gold text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
