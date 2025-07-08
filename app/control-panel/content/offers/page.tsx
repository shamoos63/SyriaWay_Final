"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
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
    image: "/placeholder.svg?key=rb84o",
    views: 876,
    bookings: 42,
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
    image: "/placeholder.svg?key=mmcdd",
    views: 987,
    bookings: 65,
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
    image: "/placeholder.svg?key=balfs",
    views: 543,
    bookings: 31,
  },
]

export default function OffersManagement() {
  const { t, dir } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort offers
  const filteredOffers = mockOffers
    .filter(
      (offer) =>
        (searchTerm === "" ||
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === "All" || offer.category === selectedCategory) &&
        (selectedStatus === "All" || offer.status === selectedStatus),
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      } else if (sortBy === "price-high") {
        return b.discountedPrice - a.discountedPrice
      } else if (sortBy === "price-low") {
        return a.discountedPrice - b.discountedPrice
      } else if (sortBy === "popular") {
        return b.bookings - a.bookings
      }
      return 0
    })

  const categories = ["All", "Hotels", "Tours", "Cars", "Flights"]
  const statuses = ["All", "active", "inactive"]
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "popular", label: "Most Popular" },
  ]

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Offers Management</h1>
        <Link href="/control-panel/content/offers/new">
          <Button className="bg-syria-gold hover:bg-syria-dark-gold text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New Offer
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <CheckCircle size={18} className="text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Statuses" : status === "active" ? "Active" : "Inactive"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <ArrowUpDown size={18} className="text-gray-400" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 p-2 border rounded-md">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No offers found matching your criteria.</p>
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 md:h-auto relative">
                    <img
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        offer.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {offer.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h2 className="text-xl font-bold mb-2">{offer.title}</h2>
                        <p className="text-gray-600 mb-4 dark:text-gray-300">{offer.description}</p>

                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">{offer.category}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">
                              {new Date(offer.startDate).toLocaleDateString()} -{" "}
                              {new Date(offer.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">
                              <span className="line-through mr-1">${offer.price}</span>
                              <span className="font-bold text-green-600">${offer.discountedPrice}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="text-sm text-gray-500">
                            <span className="font-semibold">{offer.views}</span> views
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-semibold">{offer.bookings}</span> bookings
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                        <Link href={`/control-panel/content/offers/${offer.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                        <Link href={`/offers#${offer.id}`} target="_blank">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" /> Preview
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full ${
                            offer.status === "active"
                              ? "text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                              : "text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
                          }`}
                        >
                          {offer.status === "active" ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" /> Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" /> Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
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
