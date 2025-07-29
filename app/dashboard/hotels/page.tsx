"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Hotel,
  Users,
  Settings,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Bed,
  Clock,
  Shield,
  User,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Building,
  Filter,
  BarChart3
} from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HotelOwnerBookings } from "@/components/hotel-owner-bookings"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import ChangePasswordForm from "@/components/change-password-form"

export default function HotelOwnerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState("overview")
  const [hotels, setHotels] = useState<any[]>([])
  const [hotelsLoading, setHotelsLoading] = useState(false)
  const [hotelsError, setHotelsError] = useState<string | null>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [revenueLoading, setRevenueLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [customersError, setCustomersError] = useState<string | null>(null)
  const [settingsData, setSettingsData] = useState<any>(null)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showHotelDetailsDialog, setShowHotelDetailsDialog] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    starRating: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    amenities: "",
    images: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [editingHotel, setEditingHotel] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState<any>(null)
  const [updatingHotel, setUpdatingHotel] = useState(false)
  const [rooms, setRooms] = useState<any[]>([])
  const [showRoomsDialog, setShowRoomsDialog] = useState(false)
  const [selectedHotelRooms, setSelectedHotelRooms] = useState<any[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [showRoomDialog, setShowRoomDialog] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [roomForm, setRoomForm] = useState({
    hotelId: '',
    roomId: '',
    name: '',
    roomNumber: '',
    roomType: '',
    capacity: '',
    pricePerNight: '',
    amenities: '',
    bedType: '',
    size: '',
    images: '',
    description: '',
  })
  const [roomSubmitting, setRoomSubmitting] = useState(false)
  const [roomError, setRoomError] = useState<string | null>(null)
  const [showDeleteRoomDialog, setShowDeleteRoomDialog] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<{ hotel: any, room: any } | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [roomFilter, setRoomFilter] = useState<'all' | 'available' | 'occupied'>('all')
  const { toast } = useToast()

  // Update tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab") || "overview"
    setTab(tabParam)
  }, [searchParams])

  // Fetch stats for overview
  useEffect(() => {
    if (tab !== "overview" || !user || user.role !== "HOTEL_OWNER" || !user.id) return
    
    setLoading(true)
    fetch("/api/hotels/owner/stats", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch stats")
        const data = await res.json()
        setStats(data.stats)
        setError(null)
      })
      .catch((err) => {
        setError("Failed to fetch stats. Please check your connection or try again later.")
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [tab, user])

  // Fetch hotels for overview and rooms tabs
  useEffect(() => {
    if ((tab !== "overview" && tab !== "rooms") || !user || user.role !== "HOTEL_OWNER" || !user.id) return
    setHotelsLoading(true)
    fetch("/api/hotels/owner", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch hotel")
        const data = await res.json()
        // For single hotel management, we expect one hotel or empty array
        setHotels(data.hotels || [])
        setHotelsError(null)
      })
      .catch((err) => {
        setHotelsError("Failed to fetch hotel. Please check your connection or try again later.")
        setHotels([])
      })
      .finally(() => setHotelsLoading(false))
  }, [tab, user])

  // Fetch revenue data for Earnings tab
  useEffect(() => {
    if (tab !== "earnings" || !user || user.role !== "HOTEL_OWNER" || !user.id) return
    setRevenueLoading(true)
    fetch("/api/hotels/owner/revenue", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch revenue data")
        const data = await res.json()
        setRevenueData(data)
      })
      .catch((err) => {
        console.error("Error fetching revenue data:", err)
        setRevenueData(null)
      })
      .finally(() => setRevenueLoading(false))
  }, [tab, user])

  // Fetch customers data
  useEffect(() => {
    if (tab !== "customers" || !user || user.role !== "HOTEL_OWNER" || !user.id) return
    setCustomersLoading(true)
    fetch("/api/hotels/owner/customers", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch customers")
        const data = await res.json()
        setCustomers(data.customers || [])
        setCustomersError(null)
      })
      .catch((err) => {
        setCustomersError("Failed to fetch customers. Please check your connection or try again later.")
        setCustomers([])
      })
      .finally(() => setCustomersLoading(false))
  }, [tab, user])

  // Fetch settings data
  useEffect(() => {
    if (tab !== "settings" || !user || user.role !== "HOTEL_OWNER" || !user.id) return
    setSettingsLoading(true)
    fetch("/api/hotels/owner/settings", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch settings")
        const data = await res.json()
        setSettingsData(data)
        // Update local state with fetched settings
        if (data.settings) {
          setSettingsForm(data.settings)
        }
        if (data.profile) {
          setProfileForm({
            name: data.profile.name || "",
            phone: data.profile.phone || "",
            preferredLang: data.profile.preferredLang || "ENGLISH"
          })
        }
        setSettingsError(null)
      })
      .catch((err) => {
        setSettingsError("Failed to fetch settings. Please check your connection or try again later.")
        setSettingsData(null)
      })
      .finally(() => setSettingsLoading(false))
  }, [tab, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const amenities = formData.amenities.split(",").map(a => a.trim()).filter(a => a)
      const images = formData.images.split(",").map(i => i.trim()).filter(i => i)

      const hotelData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        starRating: parseInt(formData.starRating),
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        description: formData.description,
        amenities: amenities.length > 0 ? amenities : undefined,
        images: images.length > 0 ? images : undefined,
      }

      const response = await fetch("/api/hotels/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify(hotelData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add hotel")
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        address: "",
        city: "",
        starRating: "",
        phone: "",
        email: "",
        website: "",
        description: "",
        amenities: "",
        images: "",
      })
      setShowAddDialog(false)

      // Refresh hotels list
      setHotelsLoading(true)
      fetch("/api/hotels/owner", {
        headers: { Authorization: `Bearer ${user?.id}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch hotels")
          const data = await res.json()
          setHotels(data.hotels)
        })
        .catch((err) => {
          console.error("Error refreshing hotels:", err)
        })
        .finally(() => setHotelsLoading(false))

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to add hotel")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditHotel = (hotel: any) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      starRating: hotel.starRating.toString(),
      phone: hotel.phone,
      email: hotel.email,
      website: hotel.website || "",
      description: hotel.description || "",
      amenities: hotel.amenities ? hotel.amenities.join(", ") : "",
      images: hotel.images ? hotel.images.join(", ") : "",
    })
    setShowEditDialog(true)
  }

  const handleUpdateHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHotel) return

    setUpdatingHotel(true)
    setSubmitError(null)
    try {
      const amenities = formData.amenities.split(",").map(a => a.trim()).filter(a => a)
      const images = formData.images.split(",").map(i => i.trim()).filter(i => i)

      const hotelData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        starRating: parseInt(formData.starRating),
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        description: formData.description,
        amenities: amenities.length > 0 ? amenities : undefined,
        images: images.length > 0 ? images : undefined,
      }

      const response = await fetch(`/api/hotels/owner/${editingHotel.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify(hotelData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update hotel")
      }

      // Refresh hotels list
      setHotelsLoading(true)
      fetch("/api/hotels/owner", {
        headers: { Authorization: `Bearer ${user?.id}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch hotels")
          const data = await res.json()
          setHotels(data.hotels)
        })
        .catch((err) => {
          console.error("Error refreshing hotels:", err)
        })
        .finally(() => setHotelsLoading(false))

      setShowEditDialog(false)
      setEditingHotel(null)
      toast({
        title: "Success",
        description: "Hotel updated successfully",
      })

    } catch (error) {
      console.error("Error updating hotel:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to update hotel")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update hotel",
        variant: "destructive",
      })
    } finally {
      setUpdatingHotel(false)
    }
  }

  const handleDeleteHotel = async () => {
    if (!hotelToDelete) return

    try {
      const response = await fetch(`/api/hotels/owner/${hotelToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.id}` },
      })

      if (!response.ok) {
        throw new Error("Failed to delete hotel")
      }

      // Refresh hotels list
      setHotels(hotels.filter(hotel => hotel.id !== hotelToDelete.id))
      setShowDeleteDialog(false)
      setHotelToDelete(null)

    } catch (error) {
      console.error("Error deleting hotel:", error)
    }
  }

  const showHotelDetails = (hotel: any) => {
    setSelectedHotel(hotel)
    setShowHotelDetailsDialog(true)
  }

  const showHotelRooms = async (hotel: any) => {
    setRoomsLoading(true)
    setShowRoomsDialog(true)
    try {
      const response = await fetch(`/api/hotels/owner/${hotel.id}/rooms`, {
        headers: { Authorization: `Bearer ${user?.id}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSelectedHotelRooms(data.rooms || [])
      } else {
        setSelectedHotelRooms([])
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      setSelectedHotelRooms([])
    } finally {
      setRoomsLoading(false)
    }
  }

  const handleAddRoom = (hotel: any) => {
    setEditingRoom(null)
    setRoomForm({
      hotelId: hotel.id,
      roomId: '',
      name: '',
      roomNumber: '',
      roomType: '',
      capacity: '',
      pricePerNight: '',
      amenities: '',
      bedType: '',
      size: '',
      images: '',
      description: '',
    })
    setShowRoomDialog(true)
  }

  const handleEditRoom = (hotel: any, room: any) => {
    setEditingRoom(room)
    setRoomForm({
      hotelId: hotel.id,
      roomId: room.id,
      name: room.name,
      roomNumber: room.roomNumber || '',
      roomType: room.roomType,
      capacity: room.capacity?.toString() || '',
      pricePerNight: room.pricePerNight?.toString() || '',
      amenities: room.amenities ? room.amenities.join(', ') : '',
      bedType: room.bedType || '',
      size: room.size?.toString() || '',
      images: room.images ? room.images.join(', ') : '',
      description: room.description || '',
    })
    setShowRoomDialog(true)
  }

  const handleDeleteRoom = (hotel: any, room: any) => {
    setRoomToDelete({ hotel, room })
    setShowDeleteRoomDialog(true)
  }

  const handleRoomFormChange = (field: string, value: string) => {
    setRoomForm(prev => ({ ...prev, [field]: value }))
  }

  const handleRoomFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRoomSubmitting(true)
    setRoomError(null)
    const { hotelId, roomId, name, roomNumber, roomType, capacity, pricePerNight, amenities, bedType, size, images, description } = roomForm
    const payload = {
      name,
      roomNumber,
      roomType,
      capacity: parseInt(capacity),
      pricePerNight: parseFloat(pricePerNight),
      amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
      bedType: bedType || undefined,
      size: size ? parseFloat(size) : undefined,
      images: images.split(',').map(i => i.trim()).filter(i => i),
      description,
    }
    try {
      let response
      if (editingRoom) {
        // Edit
        response = await fetch(`/api/hotels/owner/${hotelId}/rooms/${roomId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.id}` },
          body: JSON.stringify(payload),
        })
      } else {
        // Add
        response = await fetch(`/api/hotels/owner/${hotelId}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.id}` },
          body: JSON.stringify(payload),
        })
      }
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save room')
      }
      setShowRoomDialog(false)
      // Refresh hotels list
      setHotelsLoading(true)
      fetch('/api/hotels/owner', {
        headers: { Authorization: `Bearer ${user?.id}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch hotels')
          const data = await res.json()
          setHotels(data.hotels)
        })
        .catch((err) => {
          console.error('Error refreshing hotels:', err)
        })
        .finally(() => setHotelsLoading(false))
    } catch (error) {
      setRoomError(error instanceof Error ? error.message : 'Failed to save room')
    } finally {
      setRoomSubmitting(false)
    }
  }

  const handleConfirmDeleteRoom = async () => {
    if (!roomToDelete) return
    setRoomSubmitting(true)
    setRoomError(null)
    try {
      const response = await fetch(`/api/hotels/owner/${roomToDelete.hotel.id}/rooms/${roomToDelete.room.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.id}` },
      })
      if (!response.ok) {
        throw new Error("Failed to delete room")
      }
      setShowDeleteRoomDialog(false)
      setRoomToDelete(null)
      // Refresh hotels list
      setHotelsLoading(true)
      fetch("/api/hotels/owner", {
        headers: { Authorization: `Bearer ${user?.id}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch hotels")
          const data = await res.json()
          setHotels(data.hotels)
        })
        .catch((err) => {
          console.error("Error refreshing hotels:", err)
        })
        .finally(() => setHotelsLoading(false))
    } catch (error) {
      setRoomError(error instanceof Error ? error.message : "Failed to delete room")
    } finally {
      setRoomSubmitting(false)
    }
  }

  // Settings management functions
  const [settingsForm, setSettingsForm] = useState({
    autoApproveBookings: false,
    maintenanceMode: false,
    requirePasswordChange: false,
    sessionTimeout: 30
  })
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    preferredLang: user?.preferredLang || "ENGLISH"
  })
  const [hotelForm, setHotelForm] = useState({
    hotelId: "",
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    starRating: "",
    amenities: "",
    images: "",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    googleMapLink: "",
  })
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingHotelSettings, setUpdatingHotelSettings] = useState(false)
  const [updatingSettings, setUpdatingSettings] = useState(false)
  const [showHotelEditDialog, setShowHotelEditDialog] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingProfile(true)
    try {
      const response = await fetch("/api/hotels/owner/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          type: "profile",
          ...profileForm
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const result = await response.json()
      // Update local user data
      if (result.profile) {
        // You might want to update the auth context here
        console.log("Profile updated:", result.profile)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleHotelUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingHotelSettings(true)
    try {
      const amenities = hotelForm.amenities.split(",").map(a => a.trim()).filter(a => a)
      const images = hotelForm.images.split(",").map(i => i.trim()).filter(i => i)

      const response = await fetch("/api/hotels/owner/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          type: "hotel",
          ...hotelForm,
          amenities: amenities.length > 0 ? amenities : [],
          images: images.length > 0 ? images : [],
          googleMapLink: hotelForm.googleMapLink,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update hotel")
      }

      const result = await response.json()
      console.log("Hotel updated:", result.hotel)
      setShowHotelEditDialog(false)
    } catch (error) {
      console.error("Error updating hotel:", error)
    } finally {
      setUpdatingHotelSettings(false)
    }
  }

  const handleSettingsUpdate = async (field: string, value: boolean) => {
    setUpdatingSettings(true)
    try {
      const updatedSettings = { ...settingsForm, [field]: value }
      setSettingsForm(updatedSettings)

      const response = await fetch("/api/hotels/owner/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          type: "settings",
          hotelId: hotels[0]?.id,
          ...updatedSettings
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update settings")
      }

      console.log("Settings updated:", updatedSettings)
    } catch (error) {
      console.error("Error updating settings:", error)
      // Revert the change on error
      setSettingsForm(prev => ({ ...prev, [field]: !value }))
    } finally {
      setUpdatingSettings(false)
    }
  }

  const handleEditHotelSettings = (hotel: any) => {
    setHotelForm({
      hotelId: hotel.id,
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      phone: hotel.phone || "",
      email: hotel.email || "",
      website: hotel.website || "",
      description: hotel.description || "",
      starRating: hotel.starRating?.toString() || "",
      amenities: hotel.amenities ? hotel.amenities.join(", ") : "",
      images: hotel.images ? hotel.images.join(", ") : "",
      checkInTime: hotel.checkInTime || "14:00",
      checkOutTime: hotel.checkOutTime || "12:00",
      googleMapLink: hotel.googleMapLink || "",
    })
    setShowHotelEditDialog(true)
  }

  const filteredRooms = (hotel: any) => {
    const roomsWithAvailability = hotel.rooms.map((room: any) => {
      // Check if room has active bookings (CONFIRMED status and within current date range)
      const now = new Date()
      const activeBookings = room.bookings?.filter((booking: any) => 
        booking.status === 'CONFIRMED' && 
        new Date(booking.startDate) <= now && 
        new Date(booking.endDate) >= now
      ) || []
      
      const hasActiveBooking = activeBookings.length > 0
      const isActuallyAvailable = !hasActiveBooking
      
      return {
        ...room,
        isActuallyAvailable,
        currentBooking: hasActiveBooking ? activeBookings[0] : null,
        activeBookings
      }
    })

    switch (roomFilter) {
      case 'available':
        return roomsWithAvailability.filter((room: any) => room.isActuallyAvailable)
      case 'occupied':
        return roomsWithAvailability.filter((room: any) => !room.isActuallyAvailable)
      default:
        return roomsWithAvailability
    }
  }

  const refreshData = async () => {
    if (!user || user.role !== "HOTEL_OWNER" || !user.id) return

    setHotelsLoading(true)
    setCustomersLoading(true)
    
    try {
      const [hotelsRes, customersRes] = await Promise.all([
        fetch("/api/hotels/owner", {
          headers: { Authorization: `Bearer ${user.id}` },
        }),
        fetch("/api/hotels/owner/customers", {
          headers: { Authorization: `Bearer ${user.id}` },
        })
      ])

      if (hotelsRes.ok) {
        const hotelsData = await hotelsRes.json()
        setHotels(hotelsData.hotels || [])
        setHotelsError(null)
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json()
        setCustomers(customersData.customers || [])
        setCustomersError(null)
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setHotelsLoading(false)
      setCustomersLoading(false)
    }
  }

  if (!user || user.role !== "HOTEL_OWNER") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access the hotel owner dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : hotels.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No hotels found. Please add a hotel first.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview Content */}
          {(tab === 'overview' || tab === 'dashboard') && (
            <>
              {/* Stats Overview */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Occupied Rooms</p>
                          <p className="text-2xl font-bold">{stats.occupiedRooms}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Bed className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Rooms</p>
                          <p className="text-2xl font-bold">{stats.totalRooms}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Active Bookings</p>
                          <p className="text-2xl font-bold">{stats.activeBookings}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-8 w-8 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-600">Monthly Revenue</p>
                          <p className="text-2xl font-bold">${stats.monthlyRevenue}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Booking Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Booking Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hotelsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : hotelsError ? (
                    <p className="text-center text-red-500">{hotelsError}</p>
                  ) : hotels.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No hotel data available. Add your hotel to see analytics.</p>
                      <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your Hotel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Recent Bookings */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                        <div className="space-y-3">
                          {hotels[0]?.rooms?.flatMap((room: any) => 
                            room.bookings?.slice(0, 5).map((booking: any) => (
                              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{booking.user.name}</p>
                                    <p className="text-sm text-gray-600">Room {room.roomNumber} - {room.name}</p>
                                    <p className="text-xs text-gray-500">{booking.user.email}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${booking.totalPrice}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                  </p>
                                  <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'} className="text-xs">
                                    {booking.status}
                                  </Badge>
                                </div>
                              </div>
                            ))
                          ) || (
                            <p className="text-center text-gray-500 py-4">No recent bookings</p>
                          )}
                        </div>
                      </div>

                      {/* Room Occupancy Chart */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Room Occupancy</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {hotels[0]?.rooms?.map((room: any) => {
                            const now = new Date();
                            const activeBookings = room.bookings?.filter(
                              (booking: any) =>
                                booking.status === 'CONFIRMED' &&
                                new Date(booking.startDate) <= now &&
                                new Date(booking.endDate) >= now
                            ) || [];
                            const isActuallyAvailable = activeBookings.length === 0;
                            
                            return (
                              <div key={room.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">Room {room.roomNumber}</h4>
                                  <Badge variant={isActuallyAvailable ? "default" : "destructive"}>
                                    {isActuallyAvailable ? "Available" : "Occupied"}
                                  </Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                  <div 
                                    className={`h-2 rounded-full ${isActuallyAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${isActuallyAvailable ? 0 : 100}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {isActuallyAvailable ? 'Available' : '100% occupied'}
                                </p>
                                {!isActuallyAvailable && room.currentBooking && (
                                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                      <p className="text-sm font-medium text-red-800">Currently Occupied</p>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      <p><strong>Guest:</strong> {room.currentBooking.user.name}</p>
                                      <p><strong>Email:</strong> {room.currentBooking.user.email}</p>
                                      <p><strong>Check-in:</strong> {new Date(room.currentBooking.startDate).toLocaleDateString()}</p>
                                      <p><strong>Check-out:</strong> {new Date(room.currentBooking.endDate).toLocaleDateString()}</p>
                                      <p><strong>Total:</strong> ${room.currentBooking.totalPrice}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Room Management Content */}
          {tab === 'rooms' && (
            <div className="space-y-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {hotel.name} - Room Management
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleAddRoom(hotel)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Room
                        </Button>
                        <Filter className="h-4 w-4" />
                        <Select value={roomFilter} onValueChange={(value: 'all' | 'available' | 'occupied') => setRoomFilter(value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter rooms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Rooms</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredRooms(hotel).map((room: any) => (
                        <Card key={room.id} className={`${!room.isActuallyAvailable ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">Room {room.roomNumber}</h3>
                                <p className="text-sm text-gray-600">{room.name}</p>
                              </div>
                              <Badge variant={room.isActuallyAvailable ? "default" : "destructive"}>
                                {room.isActuallyAvailable ? "Available" : "Occupied"}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p><strong>Floor:</strong> {room.floor}</p>
                              <p><strong>Capacity:</strong> {room.capacity} guests</p>
                              <p><strong>Price:</strong> ${room.price}/night</p>
                              {room.description && (
                                <p className="text-gray-600 truncate">{room.description}</p>
                              )}
                            </div>
                            {!room.isActuallyAvailable && room.currentBooking && (
                              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <p className="text-sm font-medium text-red-800">Currently Occupied</p>
                                </div>
                                <div className="space-y-1 text-xs">
                                  <p><strong>Guest:</strong> {room.currentBooking.user.name}</p>
                                  <p><strong>Email:</strong> {room.currentBooking.user.email}</p>
                                  <p><strong>Check-in:</strong> {new Date(room.currentBooking.startDate).toLocaleDateString()}</p>
                                  <p><strong>Check-out:</strong> {new Date(room.currentBooking.endDate).toLocaleDateString()}</p>
                                  <p><strong>Total:</strong> ${room.currentBooking.totalPrice}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex gap-2 mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRoom(hotel, room)}
                                className="flex-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setRoomToDelete({ hotel, room })
                                  setShowDeleteRoomDialog(true)
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Earnings Content */}
          {tab === 'earnings' && (
            <div className="space-y-6">
              {/* Revenue Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">${stats?.totalRevenue || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold">${stats?.monthlyRevenue || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Avg. per Booking</p>
                        <p className="text-2xl font-bold">${stats?.averageBookingValue || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hotelsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : hotels.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No revenue data available. Add your hotel to see earnings.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Monthly Revenue Breakdown */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Monthly Revenue Breakdown</h3>
                        <div className="space-y-3">
                          {hotels[0]?.rooms?.flatMap((room: any) => 
                            room.bookings?.map((booking: any) => ({
                              ...booking,
                              roomNumber: room.roomNumber,
                              roomName: room.name
                            }))
                          ).filter((booking: any) => booking)?.slice(0, 10).map((booking: any) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium">Room {booking.roomNumber}</p>
                                  <p className="text-sm text-gray-600">{booking.user.name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">${booking.totalPrice}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(booking.startDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )) || (
                            <p className="text-center text-gray-500 py-4">No revenue data available</p>
                          )}
                        </div>
                      </div>

                      {/* Room Performance */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Room Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {hotels[0]?.rooms?.map((room: any) => {
                            const now = new Date();
                            const activeBookings = room.bookings?.filter(
                              (booking: any) =>
                                booking.status === 'CONFIRMED' &&
                                new Date(booking.startDate) <= now &&
                                new Date(booking.endDate) >= now
                            ) || [];
                            const isActuallyAvailable = activeBookings.length === 0;
                            const roomBookings = room.bookings || [];
                            const totalRevenue = roomBookings.reduce((sum: number, booking: any) => sum + (booking.totalPrice || 0), 0);
                            const bookingCount = roomBookings.length;
                            
                            return (
                              <div key={room.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">Room {room.roomNumber}</h4>
                                  <Badge variant="outline">${totalRevenue}</Badge>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Bookings:</strong> {bookingCount}</p>
                                  <p><strong>Avg. Revenue:</strong> ${bookingCount > 0 ? (totalRevenue / bookingCount).toFixed(2) : 0}</p>
                                  <p><strong>Status:</strong> {isActuallyAvailable ? 'Available' : 'Occupied'}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bookings Content */}
          {tab === 'bookings' && (
            <HotelOwnerBookings refreshData={refreshData} />
          )}

          {/* Customers Content */}
          {tab === 'customers' && (
            <div className="space-y-6">
              {customersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
              ) : customersError ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-red-500">{customersError}</p>
                  </CardContent>
                </Card>
              ) : customers.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">No customers found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customers.map((customer) => (
                    <Card key={customer.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{customer.name}</h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                          <p><strong>Total Bookings:</strong> {customer.totalBookings || 0}</p>
                          <p><strong>Total Spent:</strong> ${customer.totalSpent?.toFixed(2) || '0.00'}</p>
                          <p><strong>Member Since:</strong> {new Date(customer.lastBookingDate || customer.createdAt).toLocaleDateString()}</p>
                          {customer.currentRoom && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-sm font-medium text-blue-800">Currently Staying</p>
                              </div>
                              <div className="space-y-1 text-xs">
                                <p><strong>Hotel:</strong> {customer.currentRoom.hotelName}</p>
                                <p><strong>Room:</strong> {customer.currentRoom.roomName} (#{customer.currentRoom.roomNumber})</p>
                                <p><strong>Type:</strong> {customer.currentRoom.roomType}</p>
                                <p><strong>Check-in:</strong> {new Date(customer.currentRoom.checkInDate).toLocaleDateString()}</p>
                                <p><strong>Check-out:</strong> {new Date(customer.currentRoom.checkOutDate).toLocaleDateString()}</p>
                                {customer.currentRoom.guests && (
                                  <p><strong>Guests:</strong> {customer.currentRoom.guests}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {!customer.currentRoom && customer.totalBookings > 0 && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                              <p>No active bookings</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Content */}
          {tab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="Your phone number"
                    />
                  </div>
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={updatingProfile}
                    className="w-full"
                  >
                    {updatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Profile'}
                  </Button>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ChangePasswordForm />
                </CardContent>
              </Card>

              {/* Hotel Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Hotel Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Auto-approve Bookings</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Automatically approve new booking requests
                      </span>
                      <Switch
                        checked={settingsForm.autoApproveBookings}
                        onCheckedChange={(checked) => handleSettingsUpdate('autoApproveBookings', checked)}
                        disabled={updatingSettings}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance Mode</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Temporarily disable bookings for maintenance
                      </span>
                      <Switch
                        checked={settingsForm.maintenanceMode}
                        onCheckedChange={(checked) => handleSettingsUpdate('maintenanceMode', checked)}
                        disabled={updatingSettings}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hotel Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Hotel Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{hotel.name}</h4>
                        <p className="text-sm text-gray-600">{hotel.city}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditHotelSettings(hotel)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* All the dialogs remain the same */}
      {/* Add Hotel Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter hotel name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="Enter website URL"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starRating">Star Rating</Label>
                <Select value={formData.starRating} onValueChange={(value) => handleInputChange('starRating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select star rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter hotel description"
                  rows={3}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  placeholder="Enter amenities separated by commas (e.g., WiFi, Pool, Gym)"
                />
                <p className="text-xs text-gray-500">Enter amenities separated by commas</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  value={formData.images}
                  onChange={(e) => handleInputChange('images', e.target.value)}
                  placeholder="Enter image URLs separated by commas"
                />
                <p className="text-xs text-gray-500">Enter image URLs separated by commas</p>
              </div>
            </div>
            {submitError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                {submitError}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Hotel'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateHotel} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Hotel Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter hotel name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="Enter website URL"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-starRating">Star Rating</Label>
                <Select value={formData.starRating} onValueChange={(value) => handleInputChange('starRating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select star rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter hotel description"
                  rows={3}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amenities">Amenities</Label>
                <Input
                  id="edit-amenities"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  placeholder="Enter amenities separated by commas (e.g., WiFi, Pool, Gym)"
                />
                <p className="text-xs text-gray-500">Enter amenities separated by commas</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-images">Images</Label>
                <Input
                  id="edit-images"
                  value={formData.images}
                  onChange={(e) => handleInputChange('images', e.target.value)}
                  placeholder="Enter image URLs separated by commas"
                />
                <p className="text-xs text-gray-500">Enter image URLs separated by commas</p>
              </div>
            </div>
            {submitError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                {submitError}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatingHotel}>
                {updatingHotel ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Hotel'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hotel Details Dialog */}
      <Dialog open={showHotelDetailsDialog} onOpenChange={setShowHotelDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Hotel Details</DialogTitle>
          </DialogHeader>
          {selectedHotel && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{selectedHotel.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedHotel.address}, {selectedHotel.city}</span>
                    </div>
                    {selectedHotel.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedHotel.phone}</span>
                      </div>
                    )}
                    {selectedHotel.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedHotel.email}</span>
                      </div>
                    )}
                    {selectedHotel.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a href={selectedHotel.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedHotel.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{selectedHotel.starRating || 0} Star Rating</span>
                    </div>
                  </div>
                  {selectedHotel.description && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-600">{selectedHotel.description}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-4">Rooms</h4>
                  <div className="space-y-2">
                    {selectedHotel.rooms?.map((room: any) => (
                      <div key={room.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Room {room.roomNumber}</p>
                            <p className="text-sm text-gray-600">{room.name}</p>
                          </div>
                          <Badge variant={room.isAvailable ? "default" : "secondary"}>
                            {room.isAvailable ? "Available" : "Occupied"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Capacity: {room.capacity} guests</p>
                          <p>Price: ${room.pricePerNight}/night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hotel
              "{hotelToDelete?.name}" and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHotel} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Room Management Dialogs */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{roomForm.roomId ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRoomFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name *</Label>
                <Input
                  id="room-name"
                  value={roomForm.name}
                  onChange={(e) => handleRoomFormChange('name', e.target.value)}
                  placeholder="Enter room name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-number">Room Number *</Label>
                <Input
                  id="room-number"
                  value={roomForm.roomNumber}
                  onChange={(e) => handleRoomFormChange('roomNumber', e.target.value)}
                  placeholder="Enter room number"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type *</Label>
                <Select value={roomForm.roomType} onValueChange={(value) => handleRoomFormChange('roomType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="DOUBLE">Double</SelectItem>
                    <SelectItem value="TRIPLE">Triple</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bed-type">Bed Type</Label>
                <Select value={roomForm.bedType} onValueChange={(value) => handleRoomFormChange('bedType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed type" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Queen">Queen</SelectItem>
                    <SelectItem value="King">King</SelectItem>
                    <SelectItem value="Twin">Twin</SelectItem>
                    <SelectItem value="Bunk">Bunk</SelectItem>
                    <SelectItem value="Sofa">Sofa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-capacity">Capacity *</Label>
                <Input
                  id="room-capacity"
                  type="number"
                  min="1"
                  value={roomForm.capacity}
                  onChange={(e) => handleRoomFormChange('capacity', e.target.value)}
                  placeholder="Enter capacity"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-size">Room Size (m²)</Label>
                <Input
                  id="room-size"
                  type="number"
                  min="1"
                  value={roomForm.size}
                  onChange={(e) => handleRoomFormChange('size', e.target.value)}
                  placeholder="Enter room size in square meters"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-price">Price per Night *</Label>
                <Input
                  id="room-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={roomForm.pricePerNight}
                  onChange={(e) => handleRoomFormChange('pricePerNight', e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-amenities">Amenities</Label>
                <Input
                  id="room-amenities"
                  value={roomForm.amenities}
                  onChange={(e) => handleRoomFormChange('amenities', e.target.value)}
                  placeholder="Enter amenities separated by commas (e.g., WiFi, TV, Mini Bar)"
                />
                <p className="text-xs text-gray-500">Enter amenities separated by commas</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-description">Description</Label>
              <Textarea
                id="room-description"
                value={roomForm.description}
                onChange={(e) => handleRoomFormChange('description', e.target.value)}
                placeholder="Enter room description"
                rows={3}
              />
            </div>
            
            {/* Room Photos Section */}
            <div className="space-y-4">
              <Label>Room Photos (Image URLs)</Label>
              <div className="space-y-2">
                <Input
                  id="room-images"
                  value={roomForm.images}
                  onChange={(e) => handleRoomFormChange('images', e.target.value)}
                  placeholder="Enter image URLs separated by commas (e.g., https://example.com/image1.jpg, https://example.com/image2.jpg)"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Enter image URLs separated by commas. Images will be fetched from these links.
                </p>
              </div>
              
              {/* Image Preview */}
              {roomForm.images && roomForm.images.split(',').filter(img => img.trim()).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {roomForm.images.split(',').filter(img => img.trim()).map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.trim()}
                        alt={`Room photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const images = roomForm.images.split(',').filter((_, i) => i !== index).join(',')
                          handleRoomFormChange('images', images)
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
            {submitError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                {submitError}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowRoomDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={roomSubmitting}>
                {roomSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (roomForm.roomId ? 'Update Room' : 'Add Room')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Room Confirmation Dialog */}
      <AlertDialog open={showDeleteRoomDialog} onOpenChange={setShowDeleteRoomDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the room
              "{roomToDelete?.room?.name}" and all its associated bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteRoom} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hotel Edit Dialog */}
      <Dialog open={showHotelEditDialog} onOpenChange={setShowHotelEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel Settings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleHotelUpdate} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hotel-name">Hotel Name *</Label>
                <Input
                  id="hotel-name"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  placeholder="Enter hotel name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-city">City *</Label>
                <Input
                  id="hotel-city"
                  value={hotelForm.city}
                  onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-starRating">Star Rating</Label>
                <Select value={hotelForm.starRating} onValueChange={(value) => setHotelForm({ ...hotelForm, starRating: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select star rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hotel-address">Address *</Label>
              <Input
                id="hotel-address"
                value={hotelForm.address}
                onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                placeholder="Enter full address"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hotel-phone">Phone</Label>
                <Input
                  id="hotel-phone"
                  value={hotelForm.phone}
                  onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-email">Email</Label>
                <Input
                  id="hotel-email"
                  type="email"
                  value={hotelForm.email}
                  onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-website">Website</Label>
                <Input
                  id="hotel-website"
                  value={hotelForm.website}
                  onChange={(e) => setHotelForm({ ...hotelForm, website: e.target.value })}
                  placeholder="Enter website URL"
                />
              </div>
            </div>

            {/* Check-in/Check-out Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hotel-checkInTime">Check-in Time</Label>
                <Input
                  id="hotel-checkInTime"
                  type="time"
                  value={hotelForm.checkInTime}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-checkOutTime">Check-out Time</Label>
                <Input
                  id="hotel-checkOutTime"
                  type="time"
                  value={hotelForm.checkOutTime}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="hotel-description">Description</Label>
              <Textarea
                id="hotel-description"
                value={hotelForm.description}
                onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                placeholder="Enter hotel description"
                rows={2}
              />
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hotel-amenities">Amenities</Label>
                <Input
                  id="hotel-amenities"
                  value={hotelForm.amenities}
                  onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  placeholder="WiFi, Pool, Gym, Restaurant"
                />
                <p className="text-xs text-gray-500">Separate with commas</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-googleMapLink">Google Maps Link</Label>
                <Input
                  id="hotel-googleMapLink"
                  value={hotelForm.googleMapLink}
                  onChange={(e) => setHotelForm({ ...hotelForm, googleMapLink: e.target.value })}
                  placeholder="Google Maps embed URL"
                />
                <p className="text-xs text-gray-500">For location display</p>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label htmlFor="hotel-images">Images</Label>
              <Input
                id="hotel-images"
                value={hotelForm.images}
                onChange={(e) => setHotelForm({ ...hotelForm, images: e.target.value })}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <p className="text-xs text-gray-500">Enter image URLs separated by commas</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowHotelEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatingHotelSettings}>
                {updatingHotelSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Hotel'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}