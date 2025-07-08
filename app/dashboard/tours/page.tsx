"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  Star, 
  TrendingUp, 
  Plus,
  Compass,
  User,
  CheckCircle,
  AlertCircle,
  Settings,
  Edit,
  Trash2,
  Eye,
  MessageSquare
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function TourGuideDashboard() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [tours, setTours] = useState<any[]>([])
  const [toursLoading, setToursLoading] = useState(false)
  const [toursError, setToursError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsError, setBookingsError] = useState<string | null>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [requestsError, setRequestsError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [customersError, setCustomersError] = useState<string | null>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [revenueLoading, setRevenueLoading] = useState(false)
  const [revenueError, setRevenueError] = useState<string | null>(null)
  const [showTourModal, setShowTourModal] = useState(false)
  const [editingTour, setEditingTour] = useState<any | null>(null)
  const [tourForm, setTourForm] = useState<any>({
    name: "",
    description: "",
    category: "HISTORICAL",
    duration: 1,
    capacity: 12,
    startDate: "",
    endDate: "",
    maxGroupSize: 12,
    minGroupSize: 2,
    price: 0,
    currency: "USD",
    availableDays: [],
    startTime: "",
    endTime: "",
    startLocation: "",
    endLocation: "",
    itinerary: "",
    includedSites: [],
    includes: [],
    excludes: [],
    images: [],
    isActive: true,
    isFeatured: false,
  })
  const [savingTour, setSavingTour] = useState(false)
  const [deletingTourId, setDeletingTourId] = useState<string | null>(null)
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null)
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [bookingAction, setBookingAction] = useState<'confirm' | 'cancel' | 'complete' | null>(null)
  const [requestAction, setRequestAction] = useState<'accept' | 'decline' | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactInfo, setContactInfo] = useState<any | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<any | null>(null)
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  })
  const [submittingRating, setSubmittingRating] = useState(false)

  // Sync tab state with query string
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && tabParam !== tab) setTab(tabParam)
  }, [searchParams, tab])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/tours/guide/stats", {
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  // Fetch tours for Tours tab
  useEffect(() => {
    if (tab !== "tours" || !user || user.role !== "TOUR_GUIDE" || !user.id) return
    setToursLoading(true)
    fetch("/api/tours/guide", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch tours")
        const data = await res.json()
        setTours(data.tours)
        setToursError(null)
      })
      .catch((err) => {
        setToursError("Failed to fetch tours. Please check your connection or try again later.")
        setTours([])
      })
      .finally(() => setToursLoading(false))
  }, [tab, user])

  // Fetch bookings for Bookings tab
  useEffect(() => {
    if (tab !== "bookings" || !user || user.role !== "TOUR_GUIDE" || !user.id) return
    setBookingsLoading(true)
    fetch("/api/tours/guide/bookings", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings")
        const data = await res.json()
        setBookings(data.bookings)
        setBookingsError(null)
      })
      .catch((err) => {
        setBookingsError("Failed to fetch bookings. Please check your connection or try again later.")
        setBookings([])
      })
      .finally(() => setBookingsLoading(false))
  }, [tab, user])

  // Fetch special requests for Requests tab
  useEffect(() => {
    if (tab !== "requests" || !user || user.role !== "TOUR_GUIDE" || !user.id) return
    setRequestsLoading(true)
    fetch("/api/tours/guide/requests", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch requests")
        const data = await res.json()
        setRequests(data.requests)
        setRequestsError(null)
      })
      .catch((err) => {
        setRequestsError("Failed to fetch requests. Please check your connection or try again later.")
        setRequests([])
      })
      .finally(() => setRequestsLoading(false))
  }, [tab, user])

  // Fetch customers for Customers tab
  useEffect(() => {
    if (tab !== "customers" || !user || user.role !== "TOUR_GUIDE" || !user.id) return
    setCustomersLoading(true)
    fetch("/api/tours/guide/customers", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch customers")
        const data = await res.json()
        setCustomers(data.customers)
        setCustomersError(null)
      })
      .catch((err) => {
        setCustomersError("Failed to fetch customers. Please check your connection or try again later.")
        setCustomers([])
      })
      .finally(() => setCustomersLoading(false))
  }, [tab, user])

  // Fetch revenue data for Earnings tab
  useEffect(() => {
    if (tab !== "earnings" || !user || user.role !== "TOUR_GUIDE" || !user.id) return
    setRevenueLoading(true)
    fetch("/api/tours/guide/revenue", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch revenue data")
        const data = await res.json()
        setRevenueData(data.revenue)
      })
      .catch((err) => {
        console.error("Error fetching revenue data:", err)
        setRevenueData(null)
      })
      .finally(() => setRevenueLoading(false))
  }, [tab, user])

  // Handlers for add/edit
  const openAddTourModal = () => {
    setEditingTour(null)
    setTourForm({
      name: "",
      description: "",
      category: "HISTORICAL",
      duration: 1,
      capacity: 12,
      startDate: "",
      endDate: "",
      maxGroupSize: 12,
      minGroupSize: 2,
      price: 0,
      currency: "USD",
      availableDays: [],
      startTime: "",
      endTime: "",
      startLocation: "",
      endLocation: "",
      itinerary: "",
      includedSites: [],
      includes: [],
      excludes: [],
      images: [],
      isActive: true,
      isFeatured: false,
    })
    setShowTourModal(true)
  }
  const openEditTourModal = (tour: any) => {
    setEditingTour(tour)
    setTourForm({ ...tour })
    setShowTourModal(true)
  }
  const closeTourModal = () => {
    setShowTourModal(false)
    setEditingTour(null)
  }
  const handleTourFormChange = (field: string, value: any) => {
    setTourForm((prev: any) => ({ ...prev, [field]: value }))
  }
  const handleSaveTour = async () => {
    setSavingTour(true)
    try {
      const method = editingTour ? "PUT" : "POST"
      const url = editingTour ? `/api/tours/guide/tours/${editingTour.id}` : "/api/tours/guide/tours"
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify(tourForm),
      })
      if (!res.ok) throw new Error("Failed to save tour")
      toast.success(editingTour ? "Tour updated!" : "Tour created!")
      closeTourModal()
      // Refresh tours
      setToursLoading(true)
      const toursRes = await fetch("/api/tours/guide", { headers: { Authorization: `Bearer ${user.id}` } })
      const data = await toursRes.json()
      setTours(data.tours)
    } catch (err) {
      toast.error("Failed to save tour. Please try again.")
    } finally {
      setSavingTour(false)
    }
  }
  const handleDeleteTour = async (id: string) => {
    setDeletingTourId(id)
    try {
      const response = await fetch(`/api/tours/guide/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      })
      if (response.ok) {
        setTours(tours.filter(tour => tour.id !== id))
        toast.success('Tour deleted successfully')
      } else {
        toast.error('Failed to delete tour')
      }
    } catch (error) {
      toast.error('Failed to delete tour')
    } finally {
      setDeletingTourId(null)
    }
  }

  // Booking action handlers
  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'cancel' | 'complete') => {
    setUpdatingBookingId(bookingId)
    try {
      const status = action === 'confirm' ? 'CONFIRMED' : action === 'cancel' ? 'CANCELLED' : 'COMPLETED'
      const response = await fetch('/api/tours/guide/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          bookingId,
          status,
          notes: `Booking ${action}ed by guide`
        }),
      })
      
      if (response.ok) {
        const updatedBooking = await response.json()
        setBookings(bookings.map(b => b.id === bookingId ? updatedBooking.booking : b))
        toast.success(`Booking ${action}ed successfully`)
      } else {
        toast.error(`Failed to ${action} booking`)
      }
    } catch (error) {
      toast.error(`Failed to ${action} booking`)
    } finally {
      setUpdatingBookingId(null)
    }
  }

  // Request action handlers
  const handleRequestAction = async (requestId: string, action: 'accept' | 'decline') => {
    setUpdatingRequestId(requestId)
    try {
      const status = action === 'accept' ? 'ACCEPTED' : 'DECLINED'
      const response = await fetch('/api/tours/guide/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          requestId,
          status,
          response: `Request ${action}ed by guide`
        }),
      })
      
      if (response.ok) {
        const updatedRequest = await response.json()
        setRequests(requests.map(r => r.id === requestId ? updatedRequest.request : r))
        toast.success(`Request ${action}ed successfully`)
      } else {
        toast.error(`Failed to ${action} request`)
      }
    } catch (error) {
      toast.error(`Failed to ${action} request`)
    } finally {
      setUpdatingRequestId(null)
    }
  }

  const openBookingModal = (booking: any, action: 'confirm' | 'cancel' | 'complete') => {
    setSelectedBooking(booking)
    setBookingAction(action)
    setShowBookingModal(true)
  }

  const openRequestModal = (request: any, action: 'accept' | 'decline') => {
    setSelectedRequest(request)
    setRequestAction(action)
    setShowRequestModal(true)
  }

  const handleContactCustomer = (booking: any) => {
    setContactInfo({
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone,
      tourName: booking.tourName,
      bookingId: booking.id
    })
    setShowContactModal(true)
  }

  const handleContactRequest = (request: any) => {
    setContactInfo({
      name: request.customerName,
      email: request.customerEmail,
      phone: request.customerPhone,
      tourName: request.tourType,
      bookingId: request.id
    })
    setShowContactModal(true)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const openRatingModal = (booking: any) => {
    setSelectedBookingForRating(booking)
    setRatingForm({
      rating: 5,
      title: '',
      comment: ''
    })
    setShowRatingModal(true)
  }

  const handleSubmitRating = async () => {
    if (!selectedBookingForRating) return

    setSubmittingRating(true)
    try {
      const response = await fetch(`/api/bookings/${selectedBookingForRating.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify(ratingForm),
      })

      if (response.ok) {
        toast.success('Rating submitted successfully!')
        setShowRatingModal(false)
        setSelectedBookingForRating(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit rating')
      }
    } catch (error) {
      toast.error('Failed to submit rating')
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-600">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      {tab === "dashboard" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || "Tour Guide"}!
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Tours
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.totalTours || 0}
                    </p>
                  </div>
                  <Compass className="h-8 w-8 text-syria-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.activeBookings || 0}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Customers
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.totalCustomers || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Monthly Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stats?.monthlyRevenue || 0}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentBookings?.length > 0 ? (
                    stats.recentBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.tourName} - {new Date(booking.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent bookings</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentReviews?.length > 0 ? (
                    stats.recentReviews.map((review: any) => (
                      <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {review.tourName} - {review.rating}/5 stars
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent reviews</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tours Management */}
      {tab === "tours" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Tours
            </h1>
            <Button onClick={openAddTourModal} variant="default" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Tour
            </Button>
          </div>

          {toursLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : toursError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {toursError}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <Card key={tour.id} className="relative">
                  <CardHeader>
                    <CardTitle>{tour.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-muted-foreground">{tour.description}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge>{tour.category}</Badge>
                      <Badge variant="outline">${tour.price}</Badge>
                      <Badge variant="secondary">Capacity: {tour.capacity}</Badge>
                      <Badge variant={tour.isActive ? "success" : "destructive"}>{tour.isActive ? "Active" : "Inactive"}</Badge>
                      <Badge variant="outline">
                        {tour.startDate && tour.endDate 
                          ? `${new Date(tour.startDate).toLocaleDateString()} - ${new Date(tour.endDate).toLocaleDateString()}`
                          : 'No dates set'
                        }
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div>Duration: {tour.duration} hours</div>
                      <div>Group: {tour.minGroupSize}-{tour.maxGroupSize} people</div>
                      <div>Location: {tour.startLocation} → {tour.endLocation}</div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="icon" variant="outline" onClick={() => openEditTourModal(tour)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDeleteTour(tour.id)} disabled={deletingTourId === tour.id}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Add/Edit Tour Modal */}
          <Dialog open={showTourModal} onOpenChange={closeTourModal}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-2">
              <DialogHeader>
                <DialogTitle>{editingTour ? "Edit Tour" : "Add New Tour"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tour Name *</label>
                      <Input placeholder="Enter tour name" value={tourForm.name} onChange={(e) => handleTourFormChange("name", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold" value={tourForm.category} onChange={(e) => handleTourFormChange("category", e.target.value)}>
                        <option value="HISTORICAL">Historical</option>
                        <option value="CULTURAL">Cultural</option>
                        <option value="NATURE">Nature</option>
                        <option value="ADVENTURE">Adventure</option>
                        <option value="CULINARY">Culinary</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <Textarea placeholder="Describe your tour" value={tourForm.description} onChange={(e) => handleTourFormChange("description", e.target.value)} />
                  </div>
                </div>
                {/* Group & Capacity */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Group & Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity *</label>
                      <Input type="number" placeholder="Max people" value={tourForm.capacity} onChange={(e) => handleTourFormChange("capacity", parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Group Size</label>
                      <Input type="number" placeholder="Min people" value={tourForm.minGroupSize} onChange={(e) => handleTourFormChange("minGroupSize", parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Group Size</label>
                      <Input type="number" placeholder="Max group" value={tourForm.maxGroupSize} onChange={(e) => handleTourFormChange("maxGroupSize", parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
                {/* Schedule */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (hours) *</label>
                      <Input type="number" placeholder="Duration in hours" value={tourForm.duration} onChange={(e) => handleTourFormChange("duration", parseInt(e.target.value))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                        <Input type="time" value={tourForm.startTime} onChange={(e) => handleTourFormChange("startTime", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                        <Input type="time" value={tourForm.endTime} onChange={(e) => handleTourFormChange("endTime", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pricing */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
                      <Input type="number" placeholder="Price per person" value={tourForm.price} onChange={(e) => handleTourFormChange("price", parseFloat(e.target.value))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold" value={tourForm.currency} onChange={(e) => handleTourFormChange("currency", e.target.value)}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="SYP">SYP</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Locations */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Locations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Location *</label>
                      <Input placeholder="Starting point" value={tourForm.startLocation} onChange={(e) => handleTourFormChange("startLocation", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Location *</label>
                      <Input placeholder="Ending point" value={tourForm.endLocation} onChange={(e) => handleTourFormChange("endLocation", e.target.value)} />
                    </div>
                  </div>
                </div>
                {/* Itinerary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Itinerary</label>
                  <Textarea placeholder="Describe the tour itinerary" value={tourForm.itinerary} onChange={(e) => handleTourFormChange("itinerary", e.target.value)} />
                </div>
                
                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tour Images</h3>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URLs (comma-separated)</label>
                  <Input 
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
                    value={Array.isArray(tourForm.images) ? tourForm.images.join(', ') : tourForm.images} 
                    onChange={(e) => handleTourFormChange("images", e.target.value.split(',').map(url => url.trim()).filter(url => url))} 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter image URLs separated by commas. Images will be fetched from these links.
                  </p>
                  
                  {/* Image Preview */}
                  {tourForm.images && tourForm.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {tourForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Tour image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = tourForm.images.filter((_, i) => i !== index)
                              handleTourFormChange("images", newImages)
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Tour Date */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tour Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                      <Input
                        type="date"
                        value={tourForm.startDate ? new Date(tourForm.startDate).toISOString().split('T')[0] : ''}
                        onChange={e => handleTourFormChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                      <Input
                        type="date"
                        value={tourForm.endDate ? new Date(tourForm.endDate).toISOString().split('T')[0] : ''}
                        onChange={e => handleTourFormChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveTour} disabled={savingTour}>
                  {savingTour ? "Saving..." : editingTour ? "Update Tour" : "Create Tour"}
                </Button>
                <Button variant="outline" onClick={closeTourModal}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Bookings Management */}
      {tab === "bookings" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tour Bookings
          </h1>

          {bookingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : bookingsError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {bookingsError}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  All Bookings ({bookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {booking.tourName}
                              </h3>
                              <Badge variant={
                                booking.status === 'CONFIRMED' ? 'default' :
                                booking.status === 'PENDING' ? 'secondary' :
                                booking.status === 'CANCELLED' ? 'destructive' : 'outline'
                              }>
                                {booking.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</p>
                                <p className="text-gray-900 dark:text-white">{booking.customerName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{booking.customerEmail}</p>
                                {booking.customerPhone && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{booking.customerPhone}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tour Details</p>
                                <p className="text-gray-900 dark:text-white">{booking.guests} guests</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                </p>
                                {booking.specialRequests && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {booking.notes && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</p>
                                <p className="text-sm text-gray-900 dark:text-white">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-3 ml-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-syria-gold">${booking.totalPrice}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Created {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              {booking.status === 'PENDING' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => openBookingModal(booking, 'confirm')}
                                    disabled={updatingBookingId === booking.id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {updatingBookingId === booking.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => openBookingModal(booking, 'cancel')}
                                    disabled={updatingBookingId === booking.id}
                                  >
                                    {updatingBookingId === booking.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <AlertCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                </>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => openBookingModal(booking, 'complete')}
                                  disabled={updatingBookingId === booking.id}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {updatingBookingId === booking.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                              {booking.status === 'COMPLETED' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => openRatingModal(booking)}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => handleContactCustomer(booking)}>
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No bookings found. Bookings will appear here when customers book your tours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Special Requests */}
      {tab === "requests" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Special Tour Requests
          </h1>

          {requestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : requestsError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {requestsError}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Custom Tour Requests ({requests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {request.customerName}
                              </h3>
                              <Badge variant={
                                request.status === 'PENDING' ? 'secondary' :
                                request.status === 'ACCEPTED' ? 'default' :
                                request.status === 'DECLINED' ? 'destructive' : 'outline'
                              }>
                                {request.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</p>
                                <p className="text-gray-900 dark:text-white">{request.customerName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{request.customerEmail}</p>
                                {request.customerPhone && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{request.customerPhone}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tour Details</p>
                                <p className="text-gray-900 dark:text-white">{request.tourType}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {request.groupSize} guests
                                </p>
                                {request.preferredDates && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Preferred: {request.preferredDates}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {request.specialRequirements && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Special Requirements</p>
                                <p className="text-sm text-gray-900 dark:text-white">{request.specialRequirements}</p>
                              </div>
                            )}
                            
                            {request.message && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Message</p>
                                <p className="text-sm text-gray-900 dark:text-white">{request.message}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-3 ml-4">
                            <div className="text-right">
                              {request.budget && (
                                <p className="text-2xl font-bold text-syria-gold">${request.budget}</p>
                              )}
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Created {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              {request.status === 'PENDING' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => openRequestModal(request, 'accept')}
                                    disabled={updatingRequestId === request.id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {updatingRequestId === request.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => openRequestModal(request, 'decline')}
                                    disabled={updatingRequestId === request.id}
                                  >
                                    {updatingRequestId === request.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <AlertCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline" onClick={() => handleContactRequest(request)}>
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No special requests found. Custom tour requests will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Customers */}
      {tab === "customers" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          
          {customersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : customersError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {customersError}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Customers
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {customers?.length || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-syria-gold" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Repeat Customers
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {customers?.filter(c => c.totalBookings > 1).length || 0}
                        </p>
                      </div>
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Average Rating
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats?.averageRating || 0}/5
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customers List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customers && customers.length > 0 ? (
                    <div className="space-y-4">
                      {customers.map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-syria-gold rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{customer.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                              {customer.phone && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{customer.phone}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tours</p>
                                <p className="text-lg font-semibold">{customer.totalBookings}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                                <p className="text-lg font-semibold text-syria-gold">${customer.totalSpent.toFixed(2)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-lg font-semibold">{customer.averageRating || 0}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                Last tour: {customer.lastBookingDate ? new Date(customer.lastBookingDate).toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No customers found. Customers will appear here once they book your tours.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Earnings */}
      {tab === "earnings" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Earnings & Revenue
          </h1>

          {revenueLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : revenueError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {revenueError}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${revenueData?.totalRevenue || 0}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-syria-gold" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Monthly Revenue
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${revenueData?.monthlyRevenue || 0}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Average per Tour
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${revenueData?.averagePerTour || 0}
                        </p>
                      </div>
                      <MapPin className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Tours
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {revenueData?.totalTours || 0}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Revenue chart will be displayed here
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {revenueData?.recentTransactions?.length > 0 ? (
                    <div className="space-y-4">
                      {revenueData.recentTransactions.map((transaction: any) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{transaction.customerName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {transaction.tourName} - {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-syria-gold">${transaction.amount}</p>
                            <Badge variant={transaction.status === 'PAID' ? 'default' : 'secondary'}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No transactions found. Transactions will appear here when customers book your tours.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={user?.phone || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold"
                    />
                  </div>
                  <Button className="w-full">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold"
                    />
                  </div>
                  <Button className="w-full">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Booking Action Confirmation Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bookingAction === 'confirm' ? 'Confirm Booking' : 
               bookingAction === 'cancel' ? 'Cancel Booking' : 'Complete Booking'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedBooking && (
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to {bookingAction} this booking?
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-medium">{selectedBooking.tourName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedBooking.customerName} • {selectedBooking.guests} guests
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedBooking.startDate).toLocaleDateString()} - {new Date(selectedBooking.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                if (selectedBooking && bookingAction) {
                  handleBookingAction(selectedBooking.id, bookingAction)
                }
                setShowBookingModal(false)
              }}
              disabled={updatingBookingId === selectedBooking?.id}
              className={
                bookingAction === 'confirm' ? 'bg-green-600 hover:bg-green-700' :
                bookingAction === 'cancel' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }
            >
              {updatingBookingId === selectedBooking?.id ? 'Processing...' : 
               bookingAction === 'confirm' ? 'Confirm' : 
               bookingAction === 'cancel' ? 'Cancel' : 'Complete'}
            </Button>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Action Confirmation Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {requestAction === 'accept' ? 'Accept Request' : 'Decline Request'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedRequest && (
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to {requestAction} this special tour request?
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-medium">{selectedRequest.customerName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRequest.tourType} • {selectedRequest.groupSize} guests
                  </p>
                  {selectedRequest.budget && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Budget: ${selectedRequest.budget}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                if (selectedRequest && requestAction) {
                  handleRequestAction(selectedRequest.id, requestAction)
                }
                setShowRequestModal(false)
              }}
              disabled={updatingRequestId === selectedRequest?.id}
              className={
                requestAction === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }
            >
              {updatingRequestId === selectedRequest?.id ? 'Processing...' : 
               requestAction === 'accept' ? 'Accept' : 'Decline'}
            </Button>
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Customer Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Customer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {contactInfo && (
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400">
                  Name: {contactInfo.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Email: {contactInfo.email}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Phone: {contactInfo.phone}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Tour: {contactInfo.tourName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Booking ID: {contactInfo.bookingId}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => {
              if (contactInfo) {
                copyToClipboard(contactInfo.email)
              }
              setShowContactModal(false)
            }}>
              Copy Email
            </Button>
            <Button onClick={() => {
              if (contactInfo) {
                copyToClipboard(contactInfo.phone)
              }
              setShowContactModal(false)
            }}>
              Copy Phone
            </Button>
            <Button variant="outline" onClick={() => setShowContactModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedBookingForRating && (
              <>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    How would you rate your experience with {selectedBookingForRating.tourName}?
                  </p>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                        className={`text-2xl transition-colors ${
                          star <= ratingForm.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ratingForm.rating === 1 && 'Poor'}
                    {ratingForm.rating === 2 && 'Fair'}
                    {ratingForm.rating === 3 && 'Good'}
                    {ratingForm.rating === 4 && 'Very Good'}
                    {ratingForm.rating === 5 && 'Excellent'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Review Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Brief summary of your experience"
                      value={ratingForm.title}
                      onChange={(e) => setRatingForm({ ...ratingForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Review Comment (Optional)
                    </label>
                    <textarea
                      placeholder="Share your experience in detail..."
                      value={ratingForm.comment}
                      onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmitRating}
              disabled={submittingRating}
              className="bg-syria-gold hover:bg-syria-dark-gold text-white"
            >
              {submittingRating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Rating'
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowRatingModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 