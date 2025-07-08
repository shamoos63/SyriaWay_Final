"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  CreditCard,
  MapPin,
  Car,
  Hotel,
  Compass,
  Heart,
  GraduationCap,
  Landmark,
  Package,
  RefreshCw,
  Loader2,
  Filter,
  Eye,
  DollarSign,
  Users
} from "lucide-react"
import { BookingModal } from "@/components/control-panel/booking-modal"
import { DeleteConfirmationDialog } from "@/components/user-dashboard/delete-confirmation-dialog"

interface Booking {
  id: string
  userId: string
  serviceType: string
  hotelId?: string
  roomId?: string
  carId?: string
  guideId?: string
  tourId?: string
  healthServiceId?: string
  educationalProgramId?: string
  umrahPackageId?: string
  bundleId?: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: number
  currency: string
  status: string
  paymentStatus: string
  specialRequests?: string
  notes?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    role: string
  }
  hotel?: {
    id: string
    name: string
    city: string
  }
  room?: {
    id: string
    name: string
    roomNumber: string
  }
  car?: {
    id: string
    brand: string
    model: string
    year: number
  }
  tour?: {
    id: string
    title: string
    category: string
  }
  guide?: {
    id: string
    bio?: string
    specialties?: any
    user: {
      id: string
      name: string
      email: string
    }
  }
  healthService?: {
    id: string
    name: string
    category: string
  }
  educationalProgram?: {
    id: string
    name: string
    category: string
  }
  umrahPackage?: {
    id: string
    name: string
    duration: number
  }
  bundle?: {
    id: string
    name: string
    description: string
  }
}

interface SpecialTourRequest {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  tourType: string
  preferredDates?: string
  groupSize?: number
  specialRequirements?: string
  budget?: number
  message?: string
  status: string
  createdAt: string
  updatedAt: string
  guide?: {
    id: string
    name: string
    email: string
    bio?: string
    experience?: number
    specialties?: any
    dailyRate?: number
    currency: string
  } | null
  needsGuideAssignment: boolean
}

const SERVICE_TYPES = [
  { value: "HOTEL", label: "Hotel", icon: Hotel },
  { value: "CAR", label: "Car Rental", icon: Car },
  { value: "TOUR", label: "Tour", icon: Compass },
  { value: "HEALTH", label: "Health Service", icon: Heart },
  { value: "EDUCATIONAL", label: "Educational", icon: GraduationCap },
  { value: "UMRAH", label: "Umrah Package", icon: Landmark },
  { value: "BUNDLE", label: "Bundle", icon: Package }
]

const BOOKING_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "COMPLETED", label: "Completed", color: "bg-blue-100 text-blue-800" }
]

const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "PAID", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "FAILED", label: "Failed", color: "bg-red-100 text-red-800" },
  { value: "REFUNDED", label: "Refunded", color: "bg-gray-100 text-gray-800" }
]

export default function AdminBookingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'bookings' | 'special-requests'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [specialRequests, setSpecialRequests] = useState<SpecialTourRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [specialRequestsLoading, setSpecialRequestsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings()
    } else {
      fetchSpecialRequests()
    }
  }, [activeTab, serviceTypeFilter, statusFilter, paymentStatusFilter])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      let url = "/api/admin/bookings"
      const params = new URLSearchParams()
      
      if (serviceTypeFilter !== "All") {
        params.append("serviceType", serviceTypeFilter)
      }
      if (statusFilter !== "All") {
        params.append("status", statusFilter)
      }
      if (paymentStatusFilter !== "All") {
        params.append("paymentStatus", paymentStatusFilter)
      }
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })
      if (!res.ok) throw new Error("Failed to fetch bookings")
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (err: any) {
      setError(err.message || "Failed to load bookings")
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecialRequests = async () => {
    setSpecialRequestsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/special-tour-requests", {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })
      if (!res.ok) throw new Error("Failed to fetch special tour requests")
      const data = await res.json()
      setSpecialRequests(data.requests || [])
    } catch (err: any) {
      setError(err.message || "Failed to load special tour requests")
      toast({
        title: "Error",
        description: err.message || "Failed to load special tour requests",
        variant: "destructive",
      })
    } finally {
      setSpecialRequestsLoading(false)
    }
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setModalOpen(true)
  }

  const handleDeleteBooking = (id: string) => {
    setBookingToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!bookingToDelete) return

    try {
      const response = await fetch(`/api/admin/bookings/${bookingToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingToDelete))
        toast({
          title: "Success",
          description: "Booking deleted successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive"
      })
    } finally {
      setBookingToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveBooking = async (formData: any) => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/admin/bookings/${editingBooking?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setBookings(bookings.map(booking => 
          booking.id === editingBooking?.id ? result.booking : booking
        ))
        setModalOpen(false)
        setEditingBooking(null)
        toast({
          title: "Success",
          description: "Booking updated successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'HOTEL':
        return <Hotel className="h-4 w-4" />
      case 'CAR':
        return <Car className="h-4 w-4" />
      case 'TOUR':
        return <Compass className="h-4 w-4" />
      case 'HEALTH':
        return <Heart className="h-4 w-4" />
      case 'EDUCATIONAL':
        return <GraduationCap className="h-4 w-4" />
      case 'UMRAH':
        return <Landmark className="h-4 w-4" />
      case 'BUNDLE':
        return <Package className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getServiceName = (booking: Booking) => {
    if (booking.hotel && booking.room) {
      return `${booking.hotel.name} - ${booking.room.name} (${booking.room.roomNumber})`
    }
    if (booking.car) {
      return `${booking.car.brand} ${booking.car.model} (${booking.car.year})`
    }
    if (booking.tour) {
      return `${booking.tour.title} (${booking.tour.category})`
    }
    if (booking.healthService) {
      return `${booking.healthService.name} (${booking.healthService.category})`
    }
    if (booking.educationalProgram) {
      return `${booking.educationalProgram.name} (${booking.educationalProgram.category})`
    }
    if (booking.umrahPackage) {
      return `${booking.umrahPackage.name} (${booking.umrahPackage.duration} days)`
    }
    if (booking.bundle) {
      return booking.bundle.name
    }
    return booking.serviceType
  }

  const getStatusBadge = (status: string, type: 'booking' | 'payment') => {
    const statuses = type === 'booking' ? BOOKING_STATUSES : PAYMENT_STATUSES
    const statusInfo = statuses.find(s => s.value === status)
    return statusInfo ? (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const filteredBookings = bookings.filter(booking => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        booking.user.name.toLowerCase().includes(query) ||
        booking.user.email.toLowerCase().includes(query) ||
        booking.contactName?.toLowerCase().includes(query) ||
        booking.contactEmail?.toLowerCase().includes(query) ||
        getServiceName(booking).toLowerCase().includes(query)
      )
    }
    return true
  })

  // Calculate statistics
  const totalBookings = bookings.length
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bookings Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all customer bookings across all services
          </p>
        </div>
        <Button onClick={fetchBookings} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue, 'USD')}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingBookings}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{confirmedBookings}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Service Type Filter */}
          <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Services</SelectItem>
              {SERVICE_TYPES.map(service => (
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Booking status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              {BOOKING_STATUSES.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Payment Status Filter */}
          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Payments</SelectItem>
              {PAYMENT_STATUSES.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Results Count */}
          <div className="flex items-center justify-end text-sm text-gray-500">
            {activeTab === 'bookings' ? `${filteredBookings.length} of ${bookings.length} bookings` : `${specialRequests.length} special requests`}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <Button
          variant={activeTab === 'bookings' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('bookings')}
          className="flex-1"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Bookings ({bookings.length})
        </Button>
        <Button
          variant={activeTab === 'special-requests' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('special-requests')}
          className="flex-1"
        >
          <Compass className="h-4 w-4 mr-2" />
          Special Tour Requests ({specialRequests.length})
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchBookings} variant="outline">
            Try Again
          </Button>
        </div>
      ) : activeTab === 'bookings' && filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchQuery || serviceTypeFilter !== "All" || statusFilter !== "All" || paymentStatusFilter !== "All"
              ? "No bookings match your filters" 
              : "No bookings found"}
          </div>
          {(searchQuery || serviceTypeFilter !== "All" || statusFilter !== "All" || paymentStatusFilter !== "All") && (
            <Button onClick={() => {
              setSearchQuery("")
              setServiceTypeFilter("All")
              setStatusFilter("All")
              setPaymentStatusFilter("All")
            }} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {activeTab === 'bookings' && filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(booking.serviceType)}
                          <h2 className="text-xl font-bold">{getServiceName(booking)}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(booking.status, 'booking')}
                          {getStatusBadge(booking.paymentStatus, 'payment')}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span><strong>Customer:</strong> {booking.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span><strong>Dates:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span><strong>Guests:</strong> {booking.guests}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span><strong>Price:</strong> {formatCurrency(booking.totalPrice, booking.currency)}</span>
                        </div>
                      </div>
                      
                      {booking.contactName && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Contact:</strong> {booking.contactName} 
                          {booking.contactPhone && ` | ${booking.contactPhone}`}
                          {booking.contactEmail && ` | ${booking.contactEmail}`}
                        </div>
                      )}
                      
                      {booking.specialRequests && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Special Requests:</strong> {booking.specialRequests}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          Created: {formatDate(booking.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {booking.user.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditBooking(booking)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Special Tour Requests Section */}
          {activeTab === 'special-requests' && (
            <>
              {specialRequestsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading special tour requests...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-600 mb-4">{error}</div>
                  <Button onClick={fetchSpecialRequests} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : specialRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">No special tour requests found</div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {specialRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex flex-1 flex-col p-6">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Compass className="h-4 w-4 text-gray-500" />
                                  <h2 className="text-xl font-bold">{request.tourType} Tour Request</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={request.status === 'PENDING' ? 'secondary' : request.status === 'ACCEPTED' ? 'default' : 'destructive'}>
                                    {request.status}
                                  </Badge>
                                  {request.needsGuideAssignment && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                                      Needs Guide
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span><strong>Customer:</strong> {request.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span><strong>Dates:</strong> {request.preferredDates || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span><strong>Group Size:</strong> {request.groupSize || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span><strong>Budget:</strong> {request.budget ? formatCurrency(request.budget, 'USD') : 'Not specified'}</span>
                                </div>
                              </div>
                              
                              {request.guide && (
                                <div className="text-sm text-gray-600 mb-2">
                                  <strong>Assigned Guide:</strong> {request.guide.name} ({request.guide.email})
                                </div>
                              )}
                              
                              {request.message && (
                                <div className="text-sm text-gray-600 mb-2">
                                  <strong>Message:</strong> {request.message}
                                </div>
                              )}
                              
                              {request.specialRequirements && (
                                <div className="text-sm text-gray-600 mb-2">
                                  <strong>Special Requirements:</strong> {request.specialRequirements}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  Created: {formatDate(request.createdAt)}
                                </div>
                                <div className="flex items-center">
                                  <User className="mr-1 h-4 w-4" />
                                  {request.customerEmail}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-auto flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Implement edit functionality
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => {
                                  // Implement delete functionality
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Booking Edit Modal */}
      <BookingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        booking={editingBooking}
        onSave={handleSaveBooking}
        loading={saving}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone."
        entityType="booking"
      />
    </div>
  )
} 